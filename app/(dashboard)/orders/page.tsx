import { Metadata } from "next";
import OrdersTable from "./components/Orders";
export const metadata: Metadata = {
    title: 'TDLogistics | Orders',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <OrdersTable />
        </div>
    );
};

export default DataTablesPage;

