import { Metadata } from "next";
import StaffTable from "./components/Staff";
export const metadata: Metadata = {
    title: 'TDLogistics | Staff',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <StaffTable />
        </div>
    );
};

export default DataTablesPage;

