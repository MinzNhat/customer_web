import { Metadata } from "next";
import BusinessTable from "./components/Business";
// import VehicleTable from "./components/Vehicle";
export const metadata: Metadata = {
    title: 'TDLogistics | Business',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <BusinessTable />
        </div>
    );
};

export default DataTablesPage;

