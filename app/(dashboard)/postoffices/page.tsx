
import { Metadata } from "next";
import PostOfficesTable from "./components/PostOffices";
export const metadata: Metadata = {
    title: 'TDLogistics | Agency',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <PostOfficesTable />
        </div>
    );
};

export default DataTablesPage;

