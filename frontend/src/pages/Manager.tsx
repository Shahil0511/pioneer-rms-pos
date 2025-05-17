import { Sidebar } from "../components/pageComponents/sidebar/SideBar";
import { Outlet } from "react-router-dom";

const Manager = () => {
    return (
        <div className="flex">
            <Sidebar role={"manager"} />
            <div className="flex-1 p-4">
                <Outlet />
            </div>
        </div>
    );
};

export default Manager;
