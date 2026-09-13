"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    if (res.ok) {
      router.push("/account");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold text-chrome-200">Create an account</h1>
      <p className="mt-2 text-sm text-chrome-500">Track orders and save your details for next time.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-chrome-400">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-chrome-200 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-chrome-400">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-chrome-200 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-chrome-400">Phone (optional)</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-chrome-200 focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-chrome-400">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-chrome-200 focus-ring"
          />
          <p className="mt-1 text-xs text-chrome-500">At least 8 characters.</p>
        </div>
        {error && <p className="text-sm text-signal-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-signal-500 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-chrome-500">
        Already have an account?{" "}
        <Link href="/account/login" className="text-signal-500 hover:text-signal-400 focus-ring">
          Sign in
        </Link>
      </p>
    </div>
  );
}
