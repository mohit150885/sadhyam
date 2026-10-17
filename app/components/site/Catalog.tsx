"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { cn, matchExam } from "../../lib/utils";
import { ExamTabs } from "./cards";
import { EmptyState } from "./ui";

type Item = { id: string; title: string; category: string; price: number; rating: number };

export type FilterDef<T> = {
    title: string;
    values: (item: T) => string[];
};

const PAGE_SIZE = 12;

/**
 * Shared catalog: exam tabs, filter sidebar (built from the data with live
 * counts), search, sort, price range and pagination. Used by Courses,
 * Test Series and Study Material so they look and behave the same.
 */
/** Re-mounts the catalog when the URL query changes (?exam=UPSC&q=polity). */
export function Catalog<T extends Item>(props: CatalogProps<T>) {
    const params = useSearchParams();
    const exam = params.get("exam");
    const initialTab = (exam && matchExam(exam, props.tabs.slice(1))) || props.tabs[0] || "All";
    return <CatalogInner key={params.toString()} {...props} initialTab={initialTab} initialSearch={params.get("q") ?? ""} />;
}

type CatalogProps<T> = {
    items: T[];
    tabs: readonly string[];
    filters: FilterDef<T>[];
    searchText: (item: T) => string;
    renderCard: (item: T) => ReactNode;
    noun: string;
    showFilters?: boolean;
};

function CatalogInner<T extends Item>({
    items,
    tabs,
    filters,
    searchText,
    renderCard,
    noun,
    showFilters = true,
    initialTab,
    initialSearch,
}: CatalogProps<T> & { initialTab: string; initialSearch: string }) {
    const allTab = tabs[0] ?? "All";

    const [tab, setTab] = useState(initialTab);
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState(initialSearch);
    const [sort, setSort] = useState("Most Popular");
    const maxItemPrice = useMemo(() => Math.max(1000, ...items.map((i) => i.price)), [items]);
    const priceCeiling = Math.ceil(maxItemPrice / 500) * 500;
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [drawer, setDrawer] = useState(false);

    const limit = maxPrice ?? priceCeiling;

    const tabItems = useMemo(
        () => (tab === allTab ? items : items.filter((i) => i.category === tab)),
        [items, tab, allTab]
    );

    const groups = useMemo(
        () =>
            filters
                .map((f) => {
                    const counts = new Map<string, number>();
                    tabItems.forEach((it) => f.values(it).forEach((v) => v && counts.set(v, (counts.get(v) ?? 0) + 1)));
                    return { title: f.title, def: f, options: [...counts.entries()].sort((a, b) => b[1] - a[1]) };
                })
                .filter((g) => g.options.length > 0),
        [filters, tabItems]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let list = tabItems.filter((it) => {
            if (q && !searchText(it).toLowerCase().includes(q)) return false;
            if (it.price > limit) return false;
            // Within one group: OR. Across groups: AND.
            for (const g of groups) {
                const picked = g.options.map(([v]) => v).filter((v) => selected.includes(v));
                if (picked.length && !g.def.values(it).some((v) => picked.includes(v))) return false;
            }
            return true;
        });
        if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
        else if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
        else if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);
        return list;
    }, [tabItems, search, limit, groups, selected, sort, searchText]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    const toggle = (v: string) => {
        setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
        setPage(1);
    };
    const clear = () => {
        setSelected([]);
        setSearch("");
        setMaxPrice(null);
        setPage(1);
    };

    const panel = (
        <>
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="t-card-title font-black text-slate-900">Filters</h2>
                <button type="button" onClick={clear} className="t-small font-bold text-brand hover:underline">
                    Reset All
                </button>
            </div>
            <label className="t-search mb-5 flex h-10 items-center gap-2 rounded-lg bg-slate-50 px-3 text-slate-400 ring-1 ring-slate-200 focus-within:ring-brand">
                <Search size={15} />
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder={`Search ${noun}...`}
                    className="w-full bg-transparent text-slate-700 outline-none"
                />
            </label>
            {groups.map((g) => (
                <div key={g.title} className="border-b border-slate-100 py-5 first:pt-0">
                    <h3 className="t-search mb-3.5 font-extrabold text-slate-800">{g.title}</h3>
                    <div className="space-y-3">
                        {g.options.map(([label, count]) => (
                            <label key={label} className="t-small flex cursor-pointer items-center gap-3 text-slate-600 hover:text-slate-900">
                                <input type="checkbox" checked={selected.includes(label)} onChange={() => toggle(label)} className="h-4 w-4 rounded border-slate-300" />
                                <span className="flex-1 font-medium">{label}</span>
                                <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-slate-400">{count}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <div className="pt-5">
                <h3 className="t-search mb-4 font-extrabold text-slate-800">Price Range</h3>
                <input
                    type="range"
                    min={0}
                    max={priceCeiling}
                    step={100}
                    value={limit}
                    onChange={(e) => {
                        setMaxPrice(Number(e.target.value));
                        setPage(1);
                    }}
                    className="h-2 w-full cursor-pointer"
                    aria-label="Maximum price"
                />
                <div className="mt-2 flex justify-between text-[0.75rem] font-bold text-slate-500">
                    <span>₹0</span>
                    <span>Up to ₹{limit.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </>
    );

    return (
        <>
            {tabs.length > 1 && (
                <ExamTabs
                    tabs={tabs}
                    active={tab}
                    onChange={(t) => {
                        setTab(t);
                        setSelected([]);
                        setPage(1);
                    }}
                />
            )}

            <section className="container-site py-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    {showFilters && (
                        <button
                            type="button"
                            onClick={() => setDrawer(true)}
                            className="t-search flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-bold shadow-sm lg:hidden"
                        >
                            <SlidersHorizontal size={16} /> Filters
                            {selected.length > 0 && <span className="rounded-full bg-brand px-1.5 text-[0.6875rem] text-white">{selected.length}</span>}
                        </button>
                    )}
                    <p className="t-card-title hidden font-extrabold text-slate-800 lg:block">
                        Showing {filtered.length} {noun}
                    </p>
                    <label className="ml-auto flex items-center gap-3">
                        <span className="t-search hidden font-medium text-slate-500 sm:inline">Sort by:</span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="t-search h-10 rounded-lg border border-slate-300 bg-white px-4 font-bold shadow-sm outline-none focus:border-brand"
                        >
                            <option>Most Popular</option>
                            <option>Rating</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </label>
                </div>

                <div className={cn("grid items-start gap-8", showFilters && "lg:grid-cols-[16.25rem_minmax(0,1fr)]")}>
                    {showFilters && (
                        <aside className="sticky hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:block" style={{ top: "calc(var(--nav-offset, 0px) + 5.5rem)" }}>
                            {panel}
                        </aside>
                    )}

                    <div>
                        {shown.length > 0 ? (
                            <div className={cn("grid gap-5 sm:grid-cols-2", showFilters ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4")}>
                                {shown.map((it) => (
                                    <div key={it.id} className="flex">
                                        <div className="w-full">{renderCard(it)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<Search size={48} />}
                                title={`No ${noun} found`}
                                description="Try changing your filters or searching for something else."
                                action={
                                    <button type="button" onClick={clear} className="t-search rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-600">
                                        Clear All Filters
                                    </button>
                                }
                            />
                        )}

                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <PageBtn disabled={current === 1} onClick={() => setPage(current - 1)} label="Previous page">
                                    <ChevronLeft size={18} />
                                </PageBtn>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <PageBtn key={p} active={p === current} onClick={() => setPage(p)} label={`Page ${p}`}>
                                        {p}
                                    </PageBtn>
                                ))}
                                <PageBtn disabled={current === totalPages} onClick={() => setPage(current + 1)} label="Next page">
                                    <ChevronRight size={18} />
                                </PageBtn>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {drawer && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    <button type="button" aria-label="Close filters" onClick={() => setDrawer(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
                    <aside className="absolute bottom-0 left-0 top-0 w-[20rem] max-w-full overflow-y-auto bg-white p-6 shadow-2xl">
                        <button type="button" onClick={() => setDrawer(false)} className="absolute right-4 top-4 rounded-md bg-slate-100 p-2 text-slate-600" aria-label="Close">
                            <X size={18} />
                        </button>
                        {panel}
                        <button type="button" onClick={() => setDrawer(false)} className="t-search mt-6 w-full rounded-lg bg-brand py-3 font-bold text-white">
                            Show {filtered.length} {noun}
                        </button>
                    </aside>
                </div>
            )}
        </>
    );
}

function PageBtn({
    children,
    active,
    disabled,
    onClick,
    label,
}: {
    children: ReactNode;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={() => {
                onClick();
                window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            className={cn(
                "t-search grid h-10 min-w-10 place-items-center rounded-lg px-3 font-bold shadow-sm transition disabled:opacity-40",
                active ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300"
            )}
        >
            {children}
        </button>
    );
}
