import { PrismaClient, StockStatus } from "@prisma/client";
import { execFileSync } from "child_process";
import { createHash } from "crypto";
import { access, mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

const DRIVE_FOLDER_ID = "1njfEj4RZEPNQXgcDl0q2yDdpODWtB9wF";
const BRAND_NAME = "Bioxcin";
const BRAND_SLUG = "bioxcin";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", BRAND_SLUG);
const PUBLIC_PREFIX = `/uploads/${BRAND_SLUG}`;

type DriveEntry = {
  id: string;
  mime: string;
  name: string;
};

type ImageAsset = DriveEntry & {
  folder: string;
};

type GdownEntry = {
  url: string;
  path: string;
};

const prisma = new PrismaClient();
const shouldReset = process.argv.includes("--reset");

const productLineCategories: Record<string, string> = {
  acnium: "Acne & Blemishes",
  "anti-wrinkle": "Anti-Aging",
  atopicare: "Sensitive Skin",
  "beauty-booster": "Hair Care",
  "black-garlic": "Hair Care",
  "collagen-andbiotine": "Hair Growth Products",
  "eyelash-serum": "Eye Care",
  forte: "Hair Growth Products",
  "gold-on-skin": "Body Care",
  "keratin-argan": "Hair Care",
  menandsport: "Men's Grooming",
  quantum: "Hair Care",
  "skin-vitami-c": "Skincare",
};

const productLineNames: Record<string, string> = {
  acnium: "Bioxcin Acnium",
  "anti-wrinkle": "Bioxcin Anti-Wrinkle",
  atopicare: "Bioxcin Atopicare",
  "beauty-booster": "Bioxcin Beauty Booster",
  "black-garlic": "Bioxcin Black Garlic",
  "collagen-andbiotine": "Bioxcin Collagen & Biotin",
  "eyelash-serum": "Bioxcin Eyelash Serum",
  forte: "Bioxcin Forte",
  "gold-on-skin": "Bioxcin Gold On Skin",
  "keratin-argan": "Bioxcin Keratin & Argan",
  menandsport: "Bioxcin Men & Sport",
  quantum: "Bioxcin Quantum",
  "skin-vitami-c": "Bioxcin Skin Vitamin C",
};

function decodeDriveName(value: string) {
  return value
    .replace(/\\u0026/g, "&")
    .replace(/u0026/g, "&")
    .replace(/\\u0130/g, "I")
    .replace(/\\u0131/g, "i")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i");
}

function slugify(value: string) {
  return decodeDriveName(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string) {
  return decodeDriveName(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en-US")
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (word === "&") return word;
      if (/^[a-z]$/.test(word)) return word.toUpperCase();
      return word.charAt(0).toLocaleUpperCase("en-US") + word.slice(1);
    })
    .join(" ")
    .replace(/\bAcnium\b/gi, "Acnium")
    .replace(/\bAtopicare\b/gi, "Atopicare")
    .replace(/\bBioxcin\b/gi, "Bioxcin")
    .replace(/\bBiotine\b/gi, "Biotin");
}

function productNameForFolder(folderName: string) {
  return productLineNames[slugify(folderName)] ?? `${BRAND_NAME} ${titleCase(folderName)}`;
}

function extensionFor(entry: DriveEntry) {
  const extension = path.extname(entry.name).toLowerCase();
  if (extension) return extension === ".jpeg" ? ".jpg" : extension;
  if (entry.mime === "image/png") return ".png";
  if (entry.mime === "image/webp") return ".webp";
  return ".jpg";
}

function hashBuffer(buffer: Buffer) {
  return createHash("sha1").update(buffer).digest("hex");
}

async function pathExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function indexExistingImages() {
  const hashes = new Map<string, string>();

  if (!(await pathExists(UPLOAD_DIR))) return hashes;

  const entries = await readdir(UPLOAD_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.(jpe?g|png|webp)$/i.test(entry.name)) continue;

    const diskPath = path.join(UPLOAD_DIR, entry.name);
    const hash = hashBuffer(await readFile(diskPath));
    hashes.set(hash, `${PUBLIC_PREFIX}/${entry.name}`);
  }

  return hashes;
}

function driveIdFromUrl(url: string) {
  const id = new URL(url).searchParams.get("id");
  if (!id) throw new Error(`Could not read Drive file id from ${url}`);
  return id;
}

function isImagePath(value: string) {
  return /\.(jpe?g|png|webp)$/i.test(value);
}

function mimeForPath(value: string) {
  const extension = path.extname(value).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return "image/jpeg";
}

function collectImages(): ImageAsset[] {
  const stdout = execFileSync(
    "python",
    [
      "-m",
      "gdown",
      "--folder",
      `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}?usp=sharing`,
      "--json",
    ],
    {
      encoding: "utf8",
      env: { ...process.env, PYTHONUTF8: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const entries = JSON.parse(stdout) as GdownEntry[];
  return entries.filter((entry) => isImagePath(entry.path)).map((entry) => {
    const normalizedPath = decodeDriveName(entry.path).replace(/\\/g, "/");
    const [folder, ...nameParts] = normalizedPath.split("/");
    const name = nameParts.join("/");
    if (!folder || !name) throw new Error(`Unexpected Drive path: ${entry.path}`);

    return {
      id: driveIdFromUrl(entry.url),
      mime: mimeForPath(name),
      name: path.basename(name),
      folder,
    };
  });
}

async function fetchImageBytes(entry: DriveEntry) {
  const urls = [
    `https://drive.google.com/uc?export=download&id=${entry.id}`,
    `https://drive.usercontent.google.com/download?id=${entry.id}&export=download&confirm=t`,
  ];

  for (const url of urls) {
    const response = await fetch(url);
    if (!response.ok) continue;

    const contentType = response.headers.get("content-type") || "";
    if (contentType.startsWith("image/")) {
      return Buffer.from(await response.arrayBuffer());
    }
  }

  throw new Error(`Failed to download image bytes for ${entry.name}`);
}

async function downloadImage(
  entry: DriveEntry,
  productSlug: string,
  index: number,
  knownHashes: Map<string, string>,
) {
  const extension = extensionFor(entry);
  const fileName = `${productSlug}-${String(index + 1).padStart(2, "0")}${extension}`;
  const diskPath = path.join(UPLOAD_DIR, fileName);
  const publicPath = `${PUBLIC_PREFIX}/${fileName}`;

  if (await pathExists(diskPath)) {
    const hash = hashBuffer(await readFile(diskPath));
    knownHashes.set(hash, publicPath);
    return publicPath;
  }

  const bytes = await fetchImageBytes(entry);
  const hash = hashBuffer(bytes);
  const existingPath = knownHashes.get(hash);
  if (existingPath) return existingPath;

  await writeFile(diskPath, bytes);
  knownHashes.set(hash, publicPath);
  return publicPath;
}

async function main() {
  await mkdir(UPLOAD_DIR, { recursive: true });

  console.log("Reading Bioxcin Drive folder...");
  const assets = collectImages();
  console.log(`Found ${assets.length} image assets.`);

  const grouped = new Map<string, ImageAsset[]>();
  for (const asset of assets) {
    const key = slugify(asset.folder);
    const group = grouped.get(key) ?? [];
    group.push(asset);
    grouped.set(key, group);
  }

  const brand = await prisma.brand.upsert({
    where: { slug: BRAND_SLUG },
    update: { name: BRAND_NAME },
    create: { name: BRAND_NAME, slug: BRAND_SLUG },
  });

  if (shouldReset) {
    const deleted = await prisma.product.deleteMany({ where: { brandId: brand.id } });
    await rm(UPLOAD_DIR, { recursive: true, force: true });
    await mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Reset ${deleted.count} Bioxcin products and regenerated upload folder.`);
  }

  const knownHashes = await indexExistingImages();
  let imported = 0;

  for (const [lineSlug, lineAssets] of Array.from(grouped.entries()).sort()) {
    const folderName = lineAssets[0].folder;
    const productName = productNameForFolder(folderName);
    const productSlug = slugify(productName);
    const categoryName = productLineCategories[lineSlug] ?? "Skincare";

    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: { name: categoryName },
      create: { name: categoryName, slug: slugify(categoryName) },
    });

    const images: string[] = [];
    for (let index = 0; index < lineAssets.length; index += 1) {
      const publicPath = await downloadImage(lineAssets[index], productSlug, index, knownHashes);
      if (!images.includes(publicPath)) images.push(publicPath);
    }

    await prisma.product.upsert({
      where: { slug: productSlug },
      create: {
        name: productName,
        slug: productSlug,
        shortDescription: `${productName} by ${BRAND_NAME}.`,
        description: `${productName} from ${BRAND_NAME}. Full product details and pricing will be updated soon.`,
        ingredients: "Details coming soon.",
        price: 1,
        currency: "KES",
        images,
        categoryId: category.id,
        brandId: brand.id,
        stockStatus: StockStatus.IN_STOCK,
        tags: Array.from(new Set([BRAND_NAME, categoryName, titleCase(folderName)])),
        metaTitle: `${productName} | ${BRAND_NAME}`,
        metaDescription: `${productName} by ${BRAND_NAME}.`,
        isFeatured: false,
        isBestSeller: false,
      },
      update: {
        name: productName,
        shortDescription: `${productName} by ${BRAND_NAME}.`,
        description: `${productName} from ${BRAND_NAME}. Full product details and pricing will be updated soon.`,
        ingredients: "Details coming soon.",
        price: 1,
        currency: "KES",
        images,
        categoryId: category.id,
        brandId: brand.id,
        stockStatus: StockStatus.IN_STOCK,
        tags: Array.from(new Set([BRAND_NAME, categoryName, titleCase(folderName)])),
        metaTitle: `${productName} | ${BRAND_NAME}`,
        metaDescription: `${productName} by ${BRAND_NAME}.`,
      },
    });

    imported += 1;
    console.log(`Imported ${imported}/${grouped.size}: ${productName} (${images.length} image(s))`);
  }

  console.log(`Done. Imported ${imported} Bioxcin products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
