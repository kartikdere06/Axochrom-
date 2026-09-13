import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <p className="font-mono text-xs text-chrome-500">CHECKOUT CANCELLED</p>
      <h1 className="mt-4 text-2xl font-bold text-chrome-200">No charge was made.</h1>
      <p className="mt-3 text-chrome-400">Your cart is still saved if you want to try again.</p>
      <Link
        href="/cart"
        className="mt-8 inline-block rounded bg-signal-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring"
      >
        Return to cart
      </Link>
    </div>
  );
}
