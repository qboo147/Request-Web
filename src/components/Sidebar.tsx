import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/shared/Logo";
import NavLinks from "@/components/NavLinks";
import { IoLogOutOutline } from "react-icons/io5";

interface SidebarProps {
  showSidebar: boolean;
}

export default function Sidebar({ showSidebar }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user data from local storage
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div
      className={clsx(
        "fixed flex flex-col w-[250px] h-screen top-0 z-50 bg-white shadow-md transition-all",
        {
          "-left-[250px] lg:left-0": !showSidebar,
          "left-0 shadow-black shadow-lg lg:shadow-none": showSidebar,
        }
      )}
    >
      {/* Top SideBar logo */}
      <div className="py-8">
        <Link to={"/"}>
          <Logo />
        </Link>
      </div>

      <div>
        <NavLinks />
      </div>

      {/* Empty flex box */}
      <div className="hidden h-auto w-full grow rounded-md md:block"></div>

      {/* Log out button */}
      <button
        onClick={handleLogout}
        className="flex w-full px-3 py-2 mb-2 justify-start items-center transition-all gap-2 hover:bg-[#F1F6F9] hover:shadow-md hover:pl-5"
      >
        <span className="text-xl">
          <IoLogOutOutline />
        </span>
        <span>Log out</span>
      </button>
    </div>
  );
}
