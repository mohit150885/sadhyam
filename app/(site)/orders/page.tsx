import type { Metadata } from "next";
import { OrdersView } from "../../components/views/AccountViews";

export const metadata: Metadata = { title: "My Orders", robots: { index: false } };

export default function Page() {
    return <OrdersView />;
}
