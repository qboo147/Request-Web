/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  activateProject,
  deactivateProject,
  getProject,
} from "@/lib/redux/reducers/projects.reducer";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { Modal, Select } from "antd";
import { Link } from "react-router-dom";
import withAuthorization from "@/lib/utils/withAuthorization";

const ProjectInfo = () => {
  const location = useLocation();
  const project_id = location.pathname.split("/")[3];
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getProject(Number(project_id)));
  }, [project_id]);

  const projectState = useSelector(
    (state: RootState) => state?.project?.currentProject
  );

  const name = projectState?.name || "";
  const code = projectState?.code || "";
  const from = projectState?.from || "";
  const to = projectState?.to || "";
  const projectManager = projectState?.project_manager || "";
  const qualityAssurance = projectState?.quality_assurance || "";
  const technicalLeads = projectState?.technical_lead || [];
  const ba = projectState?.business_analyst || [];
  const developers = projectState?.developers || [];
  const testers = projectState?.testers || [];
  const consultancy = projectState?.technical_consultant || [];
  const activate = projectState?.active;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const showModalDeactivate = (e: any) => {
    setOpenDeactivate(true);
  };

  const hideModalDeactivate = () => {
    setOpenDeactivate(false);
  };

  const showModalActivate = (e: any) => {
    setOpenActivate(true);
  };

  const hideModalActivate = () => {
    setOpenActivate(false);
  };

  const deativateAProject = (e: any) => {
    dispatch(deactivateProject(e));
    setOpenDeactivate(false);
    toast.success("Deactivate Project Successfully !");
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  };

  const activateAProject = (e: any) => {
    dispatch(activateProject(e));
    setOpenActivate(false);
    toast.success("Activate Project Successfully !");
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  };

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="w-full p-4 bg-[#ffffff] rounded-md">
        <div className="w-full p-2 bg-[#ffffff] rounded-md justify-center ">
          {/* Top section */}
          <div>
            <Link
              to={"/config/project"}
              className="w-[223px] h-[46px] flex justify-between items-center"
            >
              <IoMdReturnLeft className="h-[46px] w-[46px] p-2" />
              <div className="flex h-[20px] items-center">
                <h1 className="text-[20px]">Back to Project List</h1>
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="flex flex-col w-full items-center justify-center mt-7">
            <div className="flex w-full h-fit gap-5">
              <div className="w-1/2 h-full font-medium">
                <div className="flex flex-col w-[500px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    Project Name <a className="text-[#FF0000]">*</a>
                  </span>
                  <input
                    className="pl-3 block border rounded-md p-2 text-[#b8b8b8] bg-[#f5f5f5]"
                    type="text"
                    value={name}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-[250px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    Project Code <a className="text-[#FF0000]">*</a>
                  </span>
                  <input
                    className="pl-3 block border rounded-md p-2 text-[#b8b8b8] bg-[#f5f5f5]"
                    type="text"
                    value={code}
                    disabled
                  />
                </div>
                <div className="flex flex-col w-[250px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    From <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="relative">
                    <IoCalendarOutline className="absolute z-10 right-5 top-[25%] w-[20px] h-[20px] text-[#666666]" />
                    <input
                      className="pl-3 block w-full border rounded-md p-2 text-[#b8b8b8] bg-[#f5f5f5]"
                      type="text"
                      value={formatDate(from)}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[250px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    To <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="relative">
                    <IoCalendarOutline className="absolute z-10 right-5 top-[25%] w-[20px] h-[20px] text-[#666666]" />
                    <input
                      className="pl-3 block w-full border rounded-md p-2 text-[#b8b8b8] bg-[#f5f5f5]"
                      type="text"
                      value={formatDate(to)}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[250px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    PM <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={projectManager}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[250px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    QA <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={qualityAssurance}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-1/2 h-full font-semibold justify-end items-end">
                <div className="flex flex-col w-[500px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    Technical Lead <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      mode="multiple"
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={technicalLeads}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[500px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    BA <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      mode="multiple"
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={ba}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[500px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    Developers <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      mode="multiple"
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={developers}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[500px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    Testers <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      mode="multiple"
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={testers}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[500px] mb-6">
                  <span className="text-[12px] text-[#666666] mb-1">
                    Technical Consultancy <a className="text-[#FF0000]">*</a>
                  </span>
                  <div className="w-full h-[42px]">
                    <Select
                      mode="multiple"
                      className="relative block border rounded-md w-full h-auto min-h-full max-h-[300px] overflow-auto"
                      value={consultancy}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pt-5">
              <div className="flex justify-end">
                <div className="flex justify-center items-center w-[246px] h-[64px] bg-[#007ACC] rounded-lg mx-1">
                  <Link to={`/config/project/edit/${project_id}`}>
                    <button className="font-bold text-white text-[24px]">
                      Edit
                    </button>
                  </Link>
                </div>
                {activate === true ? (
                  <div className="flex justify-center items-center w-[246px] h-[64px] bg-[#A30D11] rounded-lg mx-1">
                    <button
                      className="font-bold text-white text-[24px]"
                      onClick={() => showModalDeactivate(project_id)}
                    >
                      Deactivate
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-[246px] h-[64px] bg-[#0da31a] rounded-lg mx-1">
                    <button
                      className="font-bold text-white text-[24px]"
                      onClick={() => showModalActivate(project_id)}
                    >
                      Activate
                    </button>
                  </div>
                )}
                <div>
                  <Modal
                    title="Deactivate Project"
                    open={openDeactivate}
                    onOk={() => {
                      deativateAProject(project_id);
                    }}
                    onCancel={hideModalDeactivate}
                    okText="Confirm"
                    cancelText="Cancel"
                  >
                    <p>This action will DEACTIVATE Project</p>
                    <p>
                      Please click 'Confirm' to deactivate Project or 'Cancel'
                      to close dialog
                    </p>
                  </Modal>
                  <Modal
                    title="Activate Project"
                    open={openActivate}
                    onOk={() => {
                      activateAProject(project_id);
                    }}
                    onCancel={hideModalActivate}
                    okText="Confirm"
                    cancelText="Cancel"
                  >
                    <p>This action will ACTIVATE Project</p>
                    <p>
                      Please click 'Confirm' to activate Project or 'Cancel' to
                      close dialog
                    </p>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const allowedRoles = ["admin"];

export default withAuthorization(ProjectInfo, allowedRoles);
