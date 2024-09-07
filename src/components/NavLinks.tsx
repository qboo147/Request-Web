import { FaRegClock } from "react-icons/fa";
import {
  MdOutlineCancel,
  MdOutlineCreditScore,
  MdOutlineDashboard,
} from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import {
  IoMdAddCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { LuUserCheck2, LuUsers2 } from "react-icons/lu";
import { RiDraftLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import clsx from "clsx";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";
const links = [
  {
    section: "My Claims",
    role: "claimer",
    subLinks: [
      {
        name: "Create Claims",
        icon: <IoMdAddCircleOutline />,
        path: "/claims/create-claim",
      },
      {
        name: "Draft",
        icon: <RiDraftLine />,
        path: "/claims/draft",
      },
      {
        name: "Pending Approval",
        icon: <FaRegClock />,
        path: "/claims/pending",
      },
      {
        name: "Approved",
        icon: <IoMdCheckmarkCircleOutline />,
        path: "/claims/approved",
      },
      {
        name: "Paid",
        icon: <MdOutlineCreditScore />,
        path: "/claims/paid",
      },
      {
        name: "Rejected/Cancelled",
        icon: <MdOutlineCancel />,
        path: "/claims/rejected-cancelled",
      },
    ],
  },
  {
    section: "Claims for Approval",
    role: "approver",
    subLinks: [
      {
        name: "For my Vetting",
        icon: <IoMdCheckmarkCircleOutline />,
        path: "/approver/vetting",
      },
      {
        name: "Approved/Paid",
        icon: <MdOutlineCreditScore />,
        path: "/approver/approved-paid",
      },
    ],
  },
  {
    section: "Claims for Finance",
    role: "finance",
    subLinks: [
      {
        name: "Approved",
        icon: <IoMdCheckmarkCircleOutline />,
        path: "/finance/approved",
      },
      {
        name: "Paid",
        icon: <MdOutlineCreditScore />,
        path: "/finance/paid",
      },
    ],
  },
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    section: "Claims",
    role: "admin",
    subLinks: [
      {
        name: "Draft",
        icon: <RiDraftLine />,
        path: "/admin/claims/draft",
      },
      {
        name: "Pending Approval",
        icon: <FaRegClock />,
        path: "/admin/claims/pending",
      },
      {
        name: "Approved",
        icon: <IoMdCheckmarkCircleOutline />,
        path: "/admin/claims/approved",
      },
      {
        name: "Paid",
        icon: <MdOutlineCreditScore />,
        path: "/admin/claims/paid",
      },
      {
        name: "Rejected/Cancelled",
        icon: <MdOutlineCancel />,
        path: "/admin/claims/rejected-cancelled",
      },
    ],
  },
  {
    section: "Configuration",
    role: "admin",
    subLinks: [
      {
        name: "Staff Information",
        icon: <LuUsers2 />,
        path: "/config/staff",
      },
      {
        name: "Project Information",
        icon: <HiOutlineClipboardDocumentList />,
        path: "/config/project",
      },
      {
        name: "Authorize Staff",
        icon: <LuUserCheck2 />,
        path: "/config/pending-staff",
      },
    ],
  },
];

export default function NavLinks() {
  const { pathname } = useLocation();
  const [navLinks, setNavLinks] = useState<typeof links>([]);

  const getNavLinks = (role: string) => {
    const navLinks = [];

    for (const link of links) {
      if (link.role === role) {
        navLinks.push(link);
      }
    }
    return navLinks;
  };

  useEffect(() => {
    const encryptedData = getItemWithExpiry<string>("userData");

    if (encryptedData) {
      const decryptedData = decryptData(encryptedData);
      const userData = JSON.parse(decryptedData);

      const links = getNavLinks(userData.role);
      setNavLinks(links);
    }
  }, []);
  return (
    <ul>
      {/* Conditional "Create Claims" button for "claimer" role */}
      {navLinks.some((link) => link.role === "claimer") && (
        <div className="px-4 mb-4">
          <Link
            to="/claims/create-claim"
            className={clsx(
              "flex w-full px-4 py-4 my-2 justify-start items-center transition-all gap-2 rounded-lg hover:pl-5",
              {
                "bg-[#007AAC] text-white font-bold":
                  pathname === "/claims/create-claim",
                "hover:bg-[#F1F6F9] hover:shadow-md text-black":
                  pathname !== "/claims/create-claim",
              }
            )}
          >
            <IoMdAddCircleOutline className="text-xl" />
            <span>Create Claims</span>
          </Link>
        </div>
      )}

      {/* SideBar links from NavLinks.tsx */}
      <ul>
        {navLinks.map((navLink) =>
          // Generate Sections with SubLinks
          navLink.section ? (
            <li key={navLink.section}>
              <Link
                to={"/claims"}
                className="flex items-center px-4 pt-2 text-gray-400 border-t-2 font-bold text-sm uppercase"
              >
                {navLink.section}
              </Link>
              <ul className="pl-4">
                {navLink.subLinks.map(
                  (subLink) =>
                    subLink.path !== "/claims/create-claim" && (
                      <li key={subLink.name}>
                        <Link
                          to={subLink.path}
                          className={clsx(
                            "flex w-full px-3 py-2 my-2 justify-start items-center transition-all gap-2 rounded-l-lg hover:pl-5",
                            {
                              "bg-[#007AAC] text-white font-bold":
                                pathname === subLink.path,
                              "hover:bg-[#F1F6F9] hover:shadow-md text-black":
                                pathname !== subLink.path,
                            }
                          )}
                        >
                          <span className="text-xl">{subLink.icon}</span>
                          <span>{subLink.name}</span>
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </li>
          ) : (
            // Generate NavLinks without Sections
            <li className="pl-4" key={navLink.name}>
              <Link
                to={navLink.path || ""}
                className={clsx(
                  "flex w-full px-3 py-2 my-2 justify-start items-center transition-all gap-2 rounded-l-lg hover:pl-5",
                  {
                    "bg-[#007AAC] text-white font-bold":
                      pathname === navLink.path,
                    "hover:bg-[#F1F6F9] hover:shadow-md text-black":
                      pathname !== navLink.path,
                  }
                )}
              >
                <span className="text-xl">{navLink.icon}</span>
                <span>{navLink.name}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </ul>
  );
}
