import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="border-b border-graphite-700">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs text-signal-500">PREMIUM TOTE BAGS, MADE FOR CARRY</p>
            <h1 className="mt-4 max-w-lg text-4xl font-bold leading-[1.05] tracking-tight text-chrome-200 sm:text-5xl">
              A tote that holds its shape, your style, and your day.
            </h1>
            <p className="mt-5 max-w-md text-chrome-400">
              Axochrome totes are cut from heavyweight canvas with a deep
              matte finish — structured enough for the office, easy enough
              for everywhere else. Custom printing and bulk orders available.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="rounded bg-signal-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring"
              >
                Shop the collection
              </Link>
              <Link
                href="/products?category=bags"
                className="rounded border border-graphite-600 px-5 py-2.5 text-sm text-chrome-200 hover:border-signal-500 focus-ring"
              >
                Shop totes
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-graphite-800">
            <Image
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200"
              alt="Vector Crossbody bag in graphite canvas"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-graphite-700 bg-graphite-800/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3">
          <Feature
            title="Heavyweight canvas"
            body="Structured base, reinforced handles, a finish that resists creasing in daily use."
          />
          <Feature
            title="Custom printing"
            body="Send your logo or design and we'll print it on any tote in the collection."
          />
          <Feature
            title="Bulk ordering"
            body="Outfitting a team or an event? Volume pricing is available on request."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-xl font-medium text-chrome-200">New arrivals</h2>
          <Link href="/products" className="text-sm text-chrome-400 hover:text-signal-500 focus-ring">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              priceCents={p.priceCents}
              imageUrl={p.imageUrl}
              categoryName={p.category?.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-chrome-200">{title}</h3>
      <p className="mt-1.5 text-sm text-chrome-500">{body}</p>
    </div>
  );
}
