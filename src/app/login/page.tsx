"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) setError("Invalid email or password.");
    else router.push("/");
  }

  return (
    <div className="grid min-h-screen bg-cream pt-20 lg:grid-cols-2">
      <div className="hidden bg-maroon lg:block">
        <div className="relative h-full min-h-screen">
          <Image
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85"
            alt=""
            fill
            className="object-cover opacity-60"
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-16">
        <form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-[0_18px_60px_rgba(77,12,18,0.08)]">
          <Image src="/rodina-logo.jpeg" alt="Rodina Naturals" width={190} height={100} className="mb-8 h-16 w-auto" />
          <h1 className="text-4xl">Welcome Back</h1>
          <div className="mt-7 grid gap-4">
            <input className="field" name="email" type="email" placeholder="Email" required />
            <input className="field" name="password" type="password" placeholder="Password" required />
          </div>
          {error ? <p className="mt-4 text-sm text-maroon">{error}</p> : null}
          <button className="btn-primary mt-7 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="mt-5 text-center text-sm text-ink/70">
            New to Rodina? <Link className="text-maroon" href="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
