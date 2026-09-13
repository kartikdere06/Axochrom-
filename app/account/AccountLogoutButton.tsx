"use client";

import { useRouter } from "next/navigation";

export default function AccountLogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={handleLogout} className="text-sm text-chrome-500 hover:text-signal-500 focus-ring">
      Sign out
    </button>
  );
}
