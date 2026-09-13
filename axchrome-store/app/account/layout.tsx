import Link from "next/link";
import { getCustomerSession } from "@/lib/auth";
import AccountLogoutButton from "./AccountLogoutButton";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {session && (
        <div className="mb-8 flex items-center justify-between border-b border-graphite-700 pb-4">
          <nav className="flex gap-6 text-sm">
            <Link href="/account" className="text-chrome-300 hover:text-chrome-200 focus-ring">
              Overview
            </Link>
            <Link href="/account/orders" className="text-chrome-300 hover:text-chrome-200 focus-ring">
              Orders
            </Link>
          </nav>
          <AccountLogoutButton />
        </div>
      )}
      {children}
    </div>
  );
}
