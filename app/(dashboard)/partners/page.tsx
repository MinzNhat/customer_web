import { Metadata } from "next";
import PartnersTable from "./components/Partner";
export const metadata: Metadata = {
    title: 'TDLogistics | Partners',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <PartnersTable />
        </div>
    );
};

export default DataTablesPage;

