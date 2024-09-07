import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Suspense, useState } from "react";
import clsx from "clsx";

export default function MainLayout() {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  return (
    <div className="w-full min-h-screen bg-[#F1F6F9]">
      <Header showSideBar={showSidebar} setShowSideBar={setShowSidebar} />
      <Sidebar showSidebar={showSidebar} />

      {/* Dims background when SideBar active */}
      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className={clsx(
          "fixed lg:hidden w-screen h-screen top-0 left-0 z-40 duration-200 bg-gray-500/80",
          {
            invisible: !showSidebar,
            visible: showSidebar,
          }
        )}
      ></div>

      {/* Displays other views */}
      <div className="ml-0 lg:ml-[250px] transition-all">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
