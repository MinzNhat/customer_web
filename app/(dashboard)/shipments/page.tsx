
import { Metadata } from "next";
import ShipmentTable from "./components/Shipment";
export const metadata: Metadata = {
    title: 'TDLogistics | Shipment',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <ShipmentTable />
        </div>
    );
};

export default DataTablesPage;

