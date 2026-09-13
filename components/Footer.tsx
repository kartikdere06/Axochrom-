export default function Footer() {
  return (
    <footer className="border-t border-graphite-700 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-chrome-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Axochrome. Premium totes, made for carry.</p>
        <p className="font-mono text-xs text-graphite-600">SHIPPING ACROSS INDIA · ANDHERI–GHATKOPAR ROAD, MUMBAI</p>
      </div>
    </footer>
  );
}
