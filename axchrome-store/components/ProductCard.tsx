import Image from "next/image";
import Link from "next/link";
import { formatCents } from "@/lib/money";

type Props = {
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  categoryName?: string;
};

export default function ProductCard({ slug, name, priceCents, imageUrl, categoryName }: Props) {
  return (
    <Link href={`/products/${slug}`} className="group focus-ring">
      <div className="relative aspect-[4/5] overflow-hidden bg-graphite-800">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          {categoryName && (
            <p className="font-mono text-xs text-chrome-500">{categoryName}</p>
          )}
          <h3 className="mt-0.5 text-sm text-chrome-200">{name}</h3>
        </div>
        <p className="whitespace-nowrap text-sm text-chrome-400">{formatCents(priceCents)}</p>
      </div>
    </Link>
  );
}
