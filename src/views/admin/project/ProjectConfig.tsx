/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import { AppDispatch } from "@/lib/redux/redux.config";
import { FiEdit } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { FaPlus, FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { RiExpandUpDownFill } from "react-icons/ri";
import { Modal, Tooltip } from "antd";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDispatch } from "react-redux";
import {
  activateProject,
  deactivateProject,
  getAllProjects,
} from "@/lib/redux/reducers/projects.reducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import withAuthorization from "@/lib/utils/withAuthorization";

export type Project = {
  projectId: number;
  projectName: string;
  projectCode: string;
  from: Date;
  to: Date;
  pm: string;
  qa: string;
  active: boolean;
  action: any;
};

const ProjectConfig = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [parPage, setParPage] = useState(5);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState("");

  //const data: Project[] = [];

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "projectId",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project ID
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div
          onClick={() => navigate(`/config/project/${row.original.projectId}`)}
          style={{ cursor: "pointer" }}
        >
          <Tooltip title={`Project ID: ${row.original.projectId}`}>
            <span>{row.original.projectId}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      accessorKey: "projectName",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project Name
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div
          onClick={() => navigate(`/config/project/${row.original.projectId}`)}
          style={{ cursor: "pointer" }}
        >
          <Tooltip title={`${row.original.projectName}`}>
            <span className="block max-w-[100px] truncate">
              {row.original.projectName}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      accessorKey: "projectCode",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Project Code
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <div
          onClick={() => navigate(`/config/project/${row.original.projectId}`)}
          style={{ cursor: "pointer" }}
        >
          {row.getValue("projectCode")}
        </div>
      ),
    },
    {
      accessorKey: "from",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            From
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("from")}</div>,
      // cell: ({ row }) => (
      //   <div className="">
      //     {new Date(row.getValue("from")).toLocaleDateString()}
      //   </div>
      // ),
      // sortingFn: (rowA, rowB, columnId) => {
      //   const dateA = new Date(rowA.getValue(columnId)).getTime();
      //   const dateB = new Date(rowB.getValue(columnId)).getTime();
      //   return dateA - dateB;
      // },
    },
    {
      accessorKey: "to",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            To
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("to")}</div>,
    },
    {
      accessorKey: "pm",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PM
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <Tooltip title={`${row.original.pm}`}>
          <span className="block max-w-[100px] truncate">
            {row.original.pm}
          </span>
        </Tooltip>
      ),
    },
    {
      accessorKey: "qa",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            QA
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        <Tooltip title={`${row.original.qa}`}>
          <span className="block max-w-[100px] truncate">
            {row.original.qa}
          </span>
        </Tooltip>
      ),
    },
    {
      accessorKey: "active",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Active
            <RiExpandUpDownFill className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: ({ row }) => (
        //<div className="">{row.getValue("active")}</div>
        <Tooltip title={`${row.original.active}`}>
          <span className="block max-w-[100px] truncate">
            {row.getValue("active") ? "Active" : "Inactive"}
          </span>
        </Tooltip>
      ),
    },
    {
      accessorKey: "action",
      // eslint-disable-next-line no-empty-pattern
      header: ({ column}) => {
        return <button className="flex items-center">Action</button>;
      },
      cell: ({ row }) => <div className="">{row.getValue("action")}</div>,
    },
  ];

  const dispatch: AppDispatch = useDispatch();

  const projectState = useSelector((state: any) => state.project.projects);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [currentPage, parPage]);

  const showModalDeactivate = (e: any) => {
    setOpenDeactivate(true);
    setProjectId(e);
  };

  const hideModalDeactivate = () => {
    setOpenDeactivate(false);
  };

  const showModalActivate = (e: any) => {
    setOpenActivate(true);
    setProjectId(e);
  };

  const hideModalActivate = () => {
    setOpenActivate(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const data: Project[] = useMemo(
    () =>
      projectState.map((project: any, index: number) => ({
        projectId: project.id,
        projectName: project.name,
        projectCode: project.code,
        from: formatDate(project.from),
        to: formatDate(project.to),
        pm: project.project_manager,
        qa: project.quality_assurance,
        active: project.active,
        action: (
          <>
            <Link to={`/config/project/edit/${project.id}`}>
              <button title="Edit" className="text-[#007ACC] p-1">
                <FiEdit className="w-[24px] h-[24px]" />
              </button>
            </Link>
            {project.active === true ? (
              <>
                <button
                  title="Deactivate"
                  className="text-[#A30D11] p-1"
                  onClick={() => showModalDeactivate(project.id)}
                >
                  <FaRegCircleXmark className="w-[24px] h-[24px]" />
                </button>
              </>
            ) : (
              <>
                <button
                  title="Activate"
                  className="text-[#0da31a] p-1"
                  onClick={() => showModalActivate(project.id)}
                >
                  <FaRegCircleCheck className="w-[24px] h-[24px]" />
                </button>
              </>
            )}
          </>
        ),
      })),
    [projectState]
  );

  const deativateAProject = (e: any) => {
    dispatch(deactivateProject(e));
    setOpenDeactivate(false);
    toast.success("Deactivate Project Successfully !");
    setTimeout(() => {
      dispatch(getAllProjects());
    }, 100);
  };

  const activateAProject = (e: any) => {
    dispatch(activateProject(e));
    setOpenActivate(false);
    toast.success("Activate Project Successfully !");
    setTimeout(() => {
      dispatch(getAllProjects());
    }, 100);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * parPage;
    const endIndex = startIndex + parPage;
    return data.slice(startIndex, endIndex);
  }, [currentPage, parPage, data]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  console.log(projectState.length);

  const totalPages = Math.ceil(data.length / parPage);

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="w-full p-4 bg-[#ffffff] roudned-md">
        {/* Top section */}
        <div className="w-full">
          <h1 className="text-[20px] h-[37px] font-bold">
            Project Information
          </h1>
        </div>
        <div className="flex w-full h-[94px] justify-between items-center">
          <div className="flex items-center w-[930px] h-[32px]">
            <h1 className="px-2">Show</h1>
            <div className="">
              <select
                onChange={(e) => setParPage(parseInt(e.target.value))}
                className="px-1 py-1 outline-none bg-[#F7F6FE] rounded-md text-[#000000]"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </div>
            <h1 className="px-2">entries</h1>
            <div className="relative w-1/5">
              <CiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#000000]" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-1 py-1 w- bg-[#ffffff] border border-slate-700 rounded-lg text-[#000000] h-10"
              />
            </div>
          </div>

          <div>
            <Link
              to={"/config/project/create"}
              className="w-[123px] h-[32px] bg-[#007ACC] flex justify-between items-center p-2 rounded-md"
            >
              <FaPlus className="text-white w-[16px] h-[16px]" />
              <button className="text-[15px] font-bold text-white">
                Add Project
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className=" p-4 bg-[#ffffff] roudned-md">
          <div className="min-h-96">
            <Table className="text-sm text-left text-[#000000]">
              <TableHeader >
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                    {/* <TableHead>Action</TableHead> */}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, d) => (
                    <TableRow
                      className={`${d % 2 === 0 ? "bg-white" : "bg-[#F7F6FE]"}`}
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <div>
                        <Modal
                          title="Deactivate Project"
                          open={openDeactivate}
                          onOk={() => {
                            deativateAProject(projectId);
                          }}
                          onCancel={hideModalDeactivate}
                          okText="Confirm"
                          cancelText="Cancel"
                        >
                          <p>This action will DEACTIVATE Project</p>
                          <p>
                            Please click 'Confirm' to deactivate Project or
                            'Cancel' to close dialog
                          </p>
                        </Modal>
                        <Modal
                          title="Activate Project"
                          open={openActivate}
                          onOk={() => {
                            activateAProject(projectId);
                          }}
                          onCancel={hideModalActivate}
                          okText="Confirm"
                          cancelText="Cancel"
                        >
                          <p>This action will ACTIVATE Project</p>
                          <p>
                            Please click 'Confirm' to activate Project or
                            'Cancel' to close dialog
                          </p>
                        </Modal>
                      </div>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TableCell colSpan={9}>
        Total Projects: {data.length}
      </TableCell>
          <div className="w-full h-[63px] flex justify-center items-center p-3">
            <Pagination style={{ display: "flex", justifySelf: "end" }}>
              <PaginationContent>
                {/* back 1 page */}
                {currentPage == 1 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => {
                        if (currentPage != 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                    />
                  </PaginationItem>
                )}

                {/* back to page 1 */}
                {currentPage > 2 ? (
                  <PaginationItem>
                    <PaginationEllipsis
                      onClick={() => {
                        setCurrentPage(1);
                      }}
                    />
                  </PaginationItem>
                ) : (
                  <></>
                )}
                {currentPage == totalPages ? (
                  <PaginationItem
                    onClick={() => {
                      setCurrentPage(totalPages - 2);
                    }}
                  >
                    {totalPages - 2 > 0 ? (
                      <PaginationLink
                        href="#"
                        isActive={currentPage == 1}
                        onClick={() => {
                          setCurrentPage(currentPage > 2 ? currentPage - 1 : 1);
                        }}
                      >
                        {totalPages - 2}
                      </PaginationLink>
                    ) : (
                      <></>
                    )}
                  </PaginationItem>
                ) : (
                  <></>
                )}

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currentPage == 1}
                    onClick={() => {
                      setCurrentPage(currentPage > 2 ? currentPage - 1 : 1);
                    }}
                  >
                    {currentPage > 2 ? currentPage - 1 : 1}
                  </PaginationLink>
                </PaginationItem>

                {totalPages < 2 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage > 1}
                      onClick={() => {
                        {
                          setCurrentPage(currentPage > 1 ? currentPage : 2);
                        }
                      }}
                    >
                      {currentPage > 2 ? currentPage : 2}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {totalPages < 3 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    {currentPage == totalPages ? (
                      <></>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={() => {
                          setCurrentPage(currentPage > 2 ? currentPage + 1 : 3);
                        }}
                      >
                        {currentPage > 2 ? currentPage + 1 : 3}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                )}

                {currentPage >= totalPages - 1 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    <PaginationEllipsis
                      onClick={() => {
                        setCurrentPage(totalPages);
                      }}
                    />
                  </PaginationItem>
                )}

                {/* next 1 page*/}
                {totalPages == 1 ? (
                  <></>
                ) : (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => {
                        if (currentPage !== totalPages) {
                          setCurrentPage(currentPage + 1); // Increment currentPage by 1
                        }
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};
const allowedRoles = ["admin"];

export default withAuthorization(ProjectConfig, allowedRoles);
