import { Metadata } from "next";
import TasksTable from "./components/Tasks";
export const metadata: Metadata = {
    title: 'TDLogistics | Tasks',
}
const DataTablesPage = () => {
    return (
        <div className="mt-5 grid h-[calc(100dvh-158px)] md:h-[calc(100dvh-126px)] grid-cols-1 gap-5">
            <TasksTable />
        </div>
    );
};

export default DataTablesPage;

