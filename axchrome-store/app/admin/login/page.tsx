"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@axochrome.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <p className="font-mono text-xs text-signal-500">AXCHROME ADMIN</p>
      <h1 className="mt-2 text-2xl font-bold text-chrome-200">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          <label className="block text-sm text-chrome-400">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-graphite-600 bg-graphite-800 px-3 py-2 text-sm text-chrome-200 focus-ring"
          />
        </div>
        {error && <p className="text-sm text-signal-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-signal-500 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-xs text-chrome-500">
        Demo credentials: admin@axochrome.com / axochrome-admin (from seed data — change after first login).
      </p>
    </div>
  );
}
