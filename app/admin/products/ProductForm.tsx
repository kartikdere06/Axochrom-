"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

type VariantForm = { id?: string; label: string; sku: string; stock: number; priceDelta: number };

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  categoryId: string;
  active: boolean;
};

export default function ProductForm({
  categories,
  initialValues,
  initialVariants,
  productId,
}: {
  categories: Category[];
  initialValues?: ProductFormValues;
  initialVariants?: VariantForm[];
  productId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      slug: "",
      description: "",
      priceCents: 0,
      imageUrl: "",
      categoryId: categories[0]?.id ?? "",
      active: true,
    }
  );
  const [variants, setVariants] = useState<VariantForm[]>(
    initialVariants ?? [{ label: "", sku: "", stock: 0, priceDelta: 0 }]
  );
  const [priceInput, setPriceInput] = useState(String((initialValues?.priceCents ?? 0) / 100));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(productId);

  function updateVariant(index: number, patch: Partial<VariantForm>) {
    setVariants((v) => v.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addVariant() {
    setVariants((v) => [...v, { label: "", sku: "", stock: 0, priceDelta: 0 }]);
  }

  function removeVariant(index: number) {
    setVariants((v) => v.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const priceCents = Math.round(parseFloat(priceInput || "0") * 100);
    const payload = {
      ...values,
      priceCents,
      categoryId: values.categoryId || null,
      ...(isEdit ? {} : { variants: variants.filter((v) => v.label && v.sku) }),
    };

    const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Please check the form for errors.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
      <Field label="Name">
        <input
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label="Slug (URL)">
        <input
          required
          value={values.slug}
          onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
          placeholder="e.g. andheri-premium-tote"
          className="input"
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label="Price (INR)">
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Image URL">
        <input
          required
          type="url"
          value={values.imageUrl}
          onChange={(e) => setValues((v) => ({ ...v, imageUrl: e.target.value }))}
          className="input"
        />
      </Field>

      <Field label="Category">
        <select
          value={values.categoryId}
          onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
          className="input"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-chrome-300">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => setValues((v) => ({ ...v, active: e.target.checked }))}
          className="h-4 w-4 rounded border-graphite-600 bg-graphite-800 text-signal-500 focus-ring"
        />
        Visible in store
      </label>

      {!isEdit && (
        <div>
          <p className="mb-2 text-sm text-chrome-400">Options / variants</p>
          <div className="space-y-3">
            {variants.map((variant, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_80px_90px_auto] gap-2">
                <input
                  placeholder="Label (e.g. Black)"
                  value={variant.label}
                  onChange={(e) => updateVariant(i, { label: e.target.value })}
                  className="input"
                />
                <input
                  placeholder="SKU"
                  value={variant.sku}
                  onChange={(e) => updateVariant(i, { sku: e.target.value })}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, { stock: parseInt(e.target.value) || 0 })}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="+/- price"
                  value={variant.priceDelta}
                  onChange={(e) => updateVariant(i, { priceDelta: parseInt(e.target.value) || 0 })}
                  className="input"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-xs text-chrome-500 hover:text-red-400 focus-ring"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="mt-2 text-sm text-signal-500 hover:text-signal-400 focus-ring"
          >
            + Add option
          </button>
        </div>
      )}

      {error && <p className="text-sm text-signal-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-signal-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-signal-400 focus-ring disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 4px;
          border: 1px solid #24272e;
          background-color: #1b1e23;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #e7eaee;
        }
        .input:focus-visible {
          outline: 2px solid #22c55e;
          outline-offset: 2px;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-chrome-400">{label}</label>
      {children}
    </div>
  );
}
