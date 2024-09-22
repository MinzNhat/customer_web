
import { Metadata } from "next";
import AccountTable from "./components/Account";
export const metadata: Metadata = {
    title: 'TDLogistics | Account',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <AccountTable />
        </div>
    );
};

export default DataTablesPage;

