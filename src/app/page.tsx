import Image from "next/image";

/* -------------------------------------------------------
  Types
-------------------------------------------------------- */
type Item = {
  name: string;
  price: number;
  image: string;
  buyUrl: string;
  qty?: number;
  description?: string;
  boughtQty: number;
};

type ItemWithId = Item & { id: string };

/* -------------------------------------------------------
  Items
-------------------------------------------------------- */
const rawItems: Item[] = [
  {
    name: "Seagate Exos X18 (SATA, Standard model), 18TB",
    price: 399,
    image: "/products/2003883974.avif",
    buyUrl:
      "https://www.alternate.nl/Seagate/Exos-X18-18-TB-harde-schijf/html/product/1682940",
    qty: 16,
    boughtQty: 8,
    description:
      "High durability enterprise HDD — ideal for NAS, servers and bulk storage.",
  },
  {
    name: "10Gtek 12G Internal PCI-E SAS/SATA HBA Controller Card",
    price: 85.99,
    image: "/products/61gRBwUoU2L._AC_SL1500_.jpg",
    buyUrl: "https://www.amazon.nl/-/en/dp/B07VV91L61",
    qty: 2,
    boughtQty: 2,
    description: "SAS/SATA HBA controller card for connecting multiple drives.",
  },
  {
    name: "YIWENTEC Internal HD Mini SAS SFF-8643 Host to 4 SATA Target Hard Drive Cable (1M, 8643 SATA 90 degree)",
    price: 15.99,
    image: "/products/61MCLoAoYDL._SL1500_.jpg",
    buyUrl: "https://www.amazon.nl/-/en/dp/B07YYX1X15",
    qty: 4,
    boughtQty: 4,
    description:
      "Mini SAS to 4x SATA breakout cable (90°) for drive connectivity.",
  },
  {
    name: "Fractal Design Define 7 XL Big Tower Case",
    price: 224.9,
    image:
      "/products/Fractal_Design_Define_7_XL_big_tower_behuizing@@tqxhf071.webp",
    buyUrl:
      "https://www.alternate.nl/Fractal-Design/Define-7-XL-big-tower-behuizing/html/product/1576641",
    qty: 1,
    boughtQty: 1,
    description:
      "Extra-large, modular PC case with excellent airflow, sound dampening and extensive drive/radiator support — ideal for workstation and server builds.",
  },
  {
    name: "MSI PRO B760-P DDR4 II",
    price: 99,
    image: "/products/81eq6v+5ihL._AC_SL1500_.jpg",
    buyUrl: "https://www.amazon.nl/dp/B0CFY6HW85",
    qty: 1,
    boughtQty: 1,
    description:
      "ATX motherboard (B760) supporting DDR4 memory, multiple M.2 slots and modern I/O — suitable for mainstream Intel builds.",
  },
  {
    name: "Intel Core i7-12700K",
    price: 310.49,
    image: "/products/410WDCjPNHL._AC_SX679_.jpg",
    buyUrl: "https://www.amazon.nl/dp/B0BGY2K2X3",
    qty: 1,
    boughtQty: 1,
    description:
      "12-core Alder Lake CPU with excellent performance for both single-threaded and multi-threaded workloads.",
  },
  {
    name: "Corsair Vengeance LPX 32GB (2x16GB) DDR4-3200MHz C16",
    price: 141.99,
    image: "/products/9elYem.9a2a90aa62f22cdbc8650a755ce9a28f-9b9084d8_1.webp",
    buyUrl: "https://azerty.nl/product/corsair-vengeance-lpx-geheugen/4058781",
    qty: 4,
    boughtQty: 4,
    description:
      "Reliable and fast 32GB DDR4 memory kit, ideal for multitasking and memory-intensive applications.",
  },
  {
    name: "Corsair RM750x, 750 Watt PSU",
    price: 149.0,
    image: "/products/Corsair_RM750x__750_Watt_voeding_@@100069065.webp",
    buyUrl:
      "https://www.alternate.nl/Corsair/RM750x-750-Watt-voeding/html/product/100069065",
    qty: 1,
    boughtQty: 1,
    description:
      "High-quality 750W power supply with modular cables and 80 PLUS Gold efficiency rating.",
  },
];

/* -------------------------------------------------------
  Formatting
-------------------------------------------------------- */
const currency = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});
const fmt = (n: number) => currency.format(n);

/* -------------------------------------------------------
  Item state
-------------------------------------------------------- */
function computeItemState(item: Item) {
  const qty = item.qty ?? 1;
  const bought = Math.max(0, Math.min(qty, item.boughtQty));
  const remaining = Math.max(0, qty - bought);

  return {
    qty,
    bought,
    remaining,
    fullyBought: bought === qty,
    lineTotal: item.price * qty,
    boughtTotal: bought * item.price,
    remainingTotal: remaining * item.price,
  };
}

/* -------------------------------------------------------
  Filters
-------------------------------------------------------- */
const isNeeded = (item: Item) => computeItemState(item).remaining > 0;
const isBought = (item: Item) => computeItemState(item).remaining === 0;

/* -------------------------------------------------------
  Price Badge
-------------------------------------------------------- */
function PriceBadge({
  price,
  total,
  highlight,
}: {
  price: number;
  total: number;
  highlight?: boolean;
}) {
  return (
    <div className="inline-flex items-center justify-between bg-slate-700/60 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-sm w-full">
      <span>
        {fmt(price)} each /{" "}
        {highlight ? fmt(total) + " remaining" : fmt(total) + " total"}
      </span>
    </div>
  );
}

/* -------------------------------------------------------
  Progress Bar
-------------------------------------------------------- */
function ProgressBar({
  bought,
  qty,
  highlightRemaining = false,
}: {
  bought: number;
  qty: number;
  highlightRemaining?: boolean;
}) {
  const pct = Math.round((bought / Math.max(1, qty)) * 100);
  const fillColor = highlightRemaining
    ? "bg-amber-500"
    : pct === 100
    ? "bg-emerald-500"
    : bought > 0
    ? "bg-amber-500"
    : "bg-slate-600";

  return (
    <div className="mt-2 w-full">
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`${fillColor} h-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-slate-400 flex justify-between">
        <span>{pct}%</span>
        <span>
          {bought}/{qty}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
  CartItem
-------------------------------------------------------- */
function CartItem({
  item,
  highlight = false,
}: {
  item: ItemWithId;
  highlight?: boolean;
}) {
  const s = computeItemState(item);
  const displayTotal = highlight ? s.remainingTotal : s.lineTotal;

  const liClass = [
    "flex items-start bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-3 rounded-xl w-full transition-transform duration-150",
    s.fullyBought
      ? "opacity-80 pointer-events-none shadow-sm ring-1 ring-slate-700/30"
      : "shadow-lg ring-1 ring-slate-700/40 hover:scale-[1.01]",
    highlight ? "ring-2 ring-amber-400/40 shadow-xl" : "",
  ].join(" ");

  return (
    <li className={liClass}>
      <div className="relative flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 rounded-md object-cover shadow-sm border-2 border-white/90"
          unoptimized
        />
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow">
          {highlight ? s.bought : item.qty ?? 1}x
        </div>
      </div>

      <div className="ml-3 flex-1 text-left">
        <h3 className="text-sm sm:text-base font-semibold text-white leading-tight">
          <a
            href={item.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.name}
          </a>
        </h3>

        <p className="mt-1 text-sm text-slate-300 line-clamp-2">
          {item.description ?? "No description provided."}
        </p>

        <div className="mt-2 flex flex-col items-end gap-1 w-full">
          <PriceBadge
            price={item.price}
            total={displayTotal}
            highlight={highlight}
          />

          {highlight && s.remaining > 0 && (
            <ProgressBar bought={s.bought} qty={s.qty} highlightRemaining />
          )}
          {!highlight && s.bought > 0 && (
            <ProgressBar bought={s.bought} qty={s.qty} />
          )}
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------
  Main Page
-------------------------------------------------------- */
export default function Page() {
  const items: ItemWithId[] = [...rawItems]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((it, i) => ({ ...it, id: String(i + 1) }));

  const neededItems = items.filter(isNeeded);
  const otherItems = items.filter(isBought);

  const totals = items.reduce(
    (acc, it) => {
      const s = computeItemState(it);
      acc.totalQty += s.qty;
      acc.boughtQty += s.bought;
      acc.remainingQty += s.remaining;
      acc.total += s.lineTotal;
      acc.boughtTotal += s.boughtTotal;
      acc.remainingTotal += s.remainingTotal;
      return acc;
    },
    {
      totalQty: 0,
      boughtQty: 0,
      remainingQty: 0,
      total: 0,
      boughtTotal: 0,
      remainingTotal: 0,
    }
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6">
      <Image
        src="/logo.png"
        alt="Rudylicio.us"
        width={350}
        height={350}
        unoptimized
      />

      {/* Donate Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center mt-2 mb-8 gap-3">
        {/* ING */}
        <a
          href="https://www.ing.nl/payreq/m/?trxid=mpN6zpB0Zzn0ffMefogH1P7rcy0c3J78" // replace with your ING link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white rounded-lg shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.8" />
          </svg>
          <span className="font-medium">Donate via ING</span>
        </a>
      </div>

      {/* Items List */}
      <div className="w-full max-w-4xl mt-10 space-y-6">
        {/* Requested Items */}
        <section>
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-300">
              Requested items ({neededItems.length})
            </h2>
            <p className="text-sm text-amber-300">
              {fmt(totals.remainingTotal)} remaining to upgrade
            </p>
          </header>

          {neededItems.length === 0 ? (
            <div className="p-4 bg-slate-800/50 rounded-lg text-slate-300">
              All items are bought.
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {neededItems.map((item) => (
                <CartItem key={item.id} item={item} highlight />
              ))}
            </ul>
          )}
        </section>

        {/* Bought Items */}
        <section>
          <header className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-500">
              Bought items ({otherItems.length})
            </h2>
            <p className="text-sm text-emerald-500">
              {totals.boughtQty} bought — {fmt(totals.boughtTotal)}
            </p>
          </header>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        </section>

        {/* Totals Footer */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/40 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-300 gap-4 sm:gap-0">
          <span className="text-slate-200 text-center sm:text-left w-full sm:w-auto">
            {totals.totalQty} items — {totals.boughtQty} bought,{" "}
            {totals.remainingQty} remaining
          </span>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center justify-center gap-2 bg-emerald-600/10 text-emerald-200 px-3 py-1 rounded-full w-full sm:w-auto">
              <span className="text-emerald-300 font-semibold">✓</span>
              <span className="font-medium">Bought</span>
              <span className="ml-2">{fmt(totals.boughtTotal)}</span>
            </div>

            <div className="flex items-center justify-center gap-2 bg-yellow-600/10 text-yellow-200 px-3 py-1 rounded-full w-full sm:w-auto">
              <span className="text-warning-300 font-semibold">⚠</span>
              <span className="font-medium">Required</span>
              <span className="ml-2">{fmt(totals.remainingTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
