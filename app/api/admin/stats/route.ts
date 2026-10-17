import { adminDb } from "../../../lib/firebase-admin";
import { handle, ok, requireAdmin } from "../../../lib/server";
import { toMillis } from "../../../lib/utils";

export const runtime = "nodejs";

type OrderDoc = {
    id: string;
    status?: string;
    total?: number;
    createdAt?: unknown;
    orderNumber?: string;
    userName?: string;
    userEmail?: string;
    items?: { kind: string; id: string; title: string; price: number }[];
    paymentReference?: string;
};

function monthKey(ms: number) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
    return handle(async () => {
        const auth = await requireAdmin(["owner", "admin"]);
        if (auth.error) return auth.error;
        const db = adminDb();
        const [ordersSnap, usersSnap, reviewsSnap, supportSnap] = await Promise.all([
            db.collection("orders").limit(5000).get(),
            db.collection("users").limit(10000).get(),
            db.collection("reviews").where("status", "==", "pending").limit(500).get(),
            db.collection("support_queries").where("status", "==", "open").limit(500).get(),
        ]);

        const orders: OrderDoc[] = ordersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, "id">) }));
        const paid = orders.filter((o) => o.status === "paid");
        const now = Date.now();
        const thisMonth = monthKey(now);
        const lastMonthDate = new Date(now);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = monthKey(lastMonthDate.getTime());

        const months: string[] = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(1);
            d.setMonth(d.getMonth() - i);
            months.push(monthKey(d.getTime()));
        }
        const revenueByMonth = Object.fromEntries(months.map((m) => [m, 0]));
        const ordersByMonth = Object.fromEntries(months.map((m) => [m, 0]));
        const signupsByMonth = Object.fromEntries(months.map((m) => [m, 0]));

        paid.forEach((o) => {
            const m = monthKey(toMillis(o.createdAt));
            if (m in revenueByMonth) revenueByMonth[m] += o.total ?? 0;
        });
        orders.forEach((o) => {
            const m = monthKey(toMillis(o.createdAt));
            if (m in ordersByMonth) ordersByMonth[m] += 1;
        });
        usersSnap.docs.forEach((d) => {
            const m = monthKey(toMillis(d.data().createdAt));
            if (m in signupsByMonth) signupsByMonth[m] += 1;
        });

        const products = new Map<string, { title: string; kind: string; sales: number; revenue: number }>();
        paid.forEach((o) =>
            (o.items ?? []).forEach((i) => {
                const key = `${i.kind}:${i.id}`;
                const p = products.get(key) ?? { title: i.title, kind: i.kind, sales: 0, revenue: 0 };
                p.sales += 1;
                p.revenue += i.price ?? 0;
                products.set(key, p);
            })
        );

        const statusCounts: Record<string, number> = {};
        orders.forEach((o) => (statusCounts[o.status ?? "pending"] = (statusCounts[o.status ?? "pending"] ?? 0) + 1));

        const sum = (list: OrderDoc[]) => list.reduce((s, o) => s + (o.total ?? 0), 0);

        return ok({
            totals: {
                revenue: sum(paid),
                revenueThisMonth: sum(paid.filter((o) => monthKey(toMillis(o.createdAt)) === thisMonth)),
                revenueLastMonth: sum(paid.filter((o) => monthKey(toMillis(o.createdAt)) === lastMonth)),
                orders: orders.length,
                paidOrders: paid.length,
                pendingOrders: orders.filter((o) => o.status === "pending").length,
                awaitingVerification: orders.filter((o) => o.status === "pending" && o.paymentReference).length,
                students: usersSnap.size,
                studentsThisMonth: signupsByMonth[thisMonth] ?? 0,
                pendingReviews: reviewsSnap.size,
                openQueries: supportSnap.size,
            },
            months,
            revenueByMonth,
            ordersByMonth,
            signupsByMonth,
            statusCounts,
            topProducts: [...products.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8),
            recentOrders: orders
                .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
                .slice(0, 8)
                .map((o) => ({
                    id: o.id,
                    orderNumber: o.orderNumber,
                    userName: o.userName,
                    userEmail: o.userEmail,
                    total: o.total,
                    status: o.status,
                    createdAt: toMillis(o.createdAt),
                    items: (o.items ?? []).map((i) => i.title),
                })),
        });
    });
}
