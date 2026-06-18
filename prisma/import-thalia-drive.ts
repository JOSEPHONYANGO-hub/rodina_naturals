import { PrismaClient, StockStatus } from "@prisma/client";
import { access, mkdir, rm, writeFile } from "fs/promises";
import path from "path";

const DRIVE_FOLDER_ID = "1kY1pyxBkL0dGJrneQt-A3-8VPhmoDck6";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "thalia");
const PUBLIC_PREFIX = "/uploads/thalia";

type DriveEntry = {
  id: string;
  mime: string;
  name: string;
};

type ImageAsset = DriveEntry & {
  folders: string[];
};

const prisma = new PrismaClient();
const shouldReset = process.argv.includes("--reset");

function cleanFolderName(name: string) {
  return titleCase(
    decodeDriveName(name)
      .replace(/-\d{8}T\d{6}Z-\d-\d{3}$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function cleanProductName(fileName: string) {
  const base = decodeDriveName(fileName)
    .replace(/\.[^.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^thalia\s+/i, "")
    .replace(/\s+-\s+/g, " - ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+\d{1,2}$/g, "")
    .replace(/(?<=[A-Za-z])\d{1,2}$/g, "")
    .replace(/-\d{1,2}$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return titleCase(base);
}

function decodeDriveName(value: string) {
  return value
    .replace(/\\u0026/g, "&")
    .replace(/u0026/g, "&")
    .replace(/\\u0130/g, "I")
    .replace(/\\u0131/g, "i");
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^(spf\d+|\d+d)$/i.test(word)) return word.toUpperCase();
      if (word.length <= 3 && /^[a-z]+$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toLocaleUpperCase("en-US") + word.slice(1);
    })
    .join(" ")
    .replace(/\bThalia\b/gi, "Thalia")
    .replace(/\bAloe Vera\b/gi, "Aloe Vera")
    .replace(/\bSos\b/g, "SOS")
    .replace(/\bSpf(\d+)/g, "SPF$1");
}

function extensionFor(entry: DriveEntry) {
  const extension = path.extname(entry.name).toLowerCase();
  if (extension) return extension;
  if (entry.mime === "image/png") return ".png";
  if (entry.mime === "image/webp") return ".webp";
  return ".jpg";
}

function meaningfulCategory(folders: string[]) {
  const cleaned = folders.map(cleanFolderName).filter(Boolean);
  const category = cleaned
    .slice()
    .reverse()
    .find((folder) => folder.toLowerCase() !== "3d");
  return category || "Thalia";
}

async function readFolder(folderId: string): Promise<DriveEntry[]> {
  const url = `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not read Drive folder ${folderId}: ${response.status}`);
  const html = await response.text();

  const entryPattern =
    /\[\[null,"([A-Za-z0-9_-]{20,})"\][\s\S]{0,1400}?"(application\/vnd\.google-apps\.folder|image\/[^"]+|application\/[^"]+)"[\s\S]{0,1400}?\[\[\["([^"]+)"/g;

  const entries = new Map<string, DriveEntry>();
  let match: RegExpExecArray | null;
  while ((match = entryPattern.exec(html))) {
    const [, id, mime, name] = match;
    if (name === "Name") continue;
    entries.set(id, { id, mime, name });
  }
  return Array.from(entries.values());
}

async function collectImages(folderId: string, folders: string[] = []): Promise<ImageAsset[]> {
  const entries = await readFolder(folderId);
  const assets: ImageAsset[] = [];

  for (const entry of entries) {
    if (entry.mime === "application/vnd.google-apps.folder") {
      assets.push(...(await collectImages(entry.id, [...folders, entry.name])));
      continue;
    }

    if (entry.mime.startsWith("image/")) {
      assets.push({ ...entry, folders });
    }
  }

  return assets;
}

async function downloadImage(entry: DriveEntry, productSlug: string, index: number) {
  const extension = extensionFor(entry);
  const fileName = `${productSlug}-${String(index + 1).padStart(2, "0")}${extension}`;
  const diskPath = path.join(UPLOAD_DIR, fileName);
  const publicPath = `${PUBLIC_PREFIX}/${fileName}`;

  try {
    await access(diskPath);
    return publicPath;
  } catch {
    // Download below when the file is not already present.
  }

  const url = `https://drive.google.com/uc?export=download&id=${entry.id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${entry.name}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Expected image for ${entry.name}, received ${contentType}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(diskPath, bytes);
  return publicPath;
}

async function main() {
  await mkdir(UPLOAD_DIR, { recursive: true });

  console.log("Reading Thalia Drive folder...");
  const assets = await collectImages(DRIVE_FOLDER_ID);
  console.log(`Found ${assets.length} image assets.`);

  const grouped = new Map<
    string,
    {
      productName: string;
      categoryName: string;
      assets: ImageAsset[];
    }
  >();

  for (const asset of assets) {
    const categoryName = meaningfulCategory(asset.folders);
    const productName = cleanProductName(asset.name);
    const key = `${slugify(categoryName)}::${slugify(productName)}`;

    const group = grouped.get(key) ?? { productName, categoryName, assets: [] };
    group.assets.push(asset);
    grouped.set(key, group);
  }

  const brand = await prisma.brand.upsert({
    where: { slug: "thalia" },
    create: { name: "Thalia", slug: "thalia" },
    update: { name: "Thalia" },
  });

  if (shouldReset) {
    const deleted = await prisma.product.deleteMany({
      where: {
        brandId: brand.id,
        description: { contains: "Full product details and pricing will be updated soon." },
      },
    });

    await rm(UPLOAD_DIR, { recursive: true, force: true });
    await mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Reset ${deleted.count} placeholder Thalia products.`);
  }

  const groups = Array.from(grouped.values());
  let productCount = 0;
  for (const group of groups) {
    const categorySlug = slugify(group.categoryName);
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      create: { name: group.categoryName, slug: categorySlug },
      update: { name: group.categoryName },
    });

    const productSlugBase = slugify(`thalia ${group.productName}`);
    const productSlug =
      (await prisma.product.findFirst({
        where: {
          slug: productSlugBase,
          NOT: { brandId: brand.id },
        },
        select: { id: true },
      }))
        ? slugify(`thalia ${group.categoryName} ${group.productName}`)
        : productSlugBase;

    const images = [];
    for (let index = 0; index < group.assets.length; index += 1) {
      images.push(await downloadImage(group.assets[index], productSlug, index));
    }

    await prisma.product.upsert({
      where: { slug: productSlug },
      create: {
        name: group.productName,
        slug: productSlug,
        shortDescription: `${group.productName} by Thalia.`,
        description: `${group.productName} from Thalia. Full product details and pricing will be updated soon.`,
        ingredients: "Details coming soon.",
        price: 1,
        currency: "KES",
        images,
        categoryId: category.id,
        brandId: brand.id,
        stockStatus: StockStatus.OUT_OF_STOCK,
        stock: 0,
        tags: ["Thalia", group.categoryName],
        metaTitle: `${group.productName} | Thalia`,
        metaDescription: `${group.productName} by Thalia.`,
        isFeatured: false,
        isBestSeller: false,
      },
      update: {
        name: group.productName,
        shortDescription: `${group.productName} by Thalia.`,
        description: `${group.productName} from Thalia. Full product details and pricing will be updated soon.`,
        ingredients: "Details coming soon.",
        price: 1,
        currency: "KES",
        images,
        categoryId: category.id,
        brandId: brand.id,
        stockStatus: StockStatus.OUT_OF_STOCK,
        stock: 0,
        tags: ["Thalia", group.categoryName],
        metaTitle: `${group.productName} | Thalia`,
        metaDescription: `${group.productName} by Thalia.`,
      },
    });

    productCount += 1;
    console.log(
      `Imported ${productCount}/${grouped.size}: ${group.productName} (${group.assets.length} image(s))`,
    );
  }

  console.log(`Done. Imported ${productCount} Thalia products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
