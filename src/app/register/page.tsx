"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Could not create account with those details.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { ...payload, redirect: false });
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 pt-20">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-[0_18px_60px_rgba(77,12,18,0.08)]">
        <Image src="/rodina-logo.jpeg" alt="Rodina Naturals" width={190} height={100} className="mb-8 h-16 w-auto" />
        <h1 className="text-4xl">Create Account</h1>
        <div className="mt-7 grid gap-4">
          <input className="field" name="name" placeholder="Full name" required />
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field" name="password" type="password" placeholder="Password" minLength={8} required />
        </div>
        {error ? <p className="mt-4 text-sm text-maroon">{error}</p> : null}
        <button className="btn-primary mt-7 w-full" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="mt-5 text-center text-sm text-ink/70">
          Already registered? <Link className="text-maroon" href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
