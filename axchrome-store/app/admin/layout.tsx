import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <aside className="w-48 shrink-0">
        <p className="font-mono text-xs text-signal-500">ADMIN</p>
        <nav className="mt-4 flex flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded px-2 py-1.5 text-chrome-300 hover:bg-graphite-800 focus-ring">
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="rounded px-2 py-1.5 text-chrome-300 hover:bg-graphite-800 focus-ring"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="rounded px-2 py-1.5 text-chrome-300 hover:bg-graphite-800 focus-ring"
          >
            Orders
          </Link>
        </nav>
        <div className="mt-8">
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
