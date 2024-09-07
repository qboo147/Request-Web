/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import * as yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Select } from "antd";
import { Project } from "@/lib/schemas/project.schema";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { createProject } from "@/lib/redux/reducers/projects.reducer";
import { MdOutlineError } from "react-icons/md";
import { getAllStaff } from "@/lib/redux/reducers/staff.reducer";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import withAuthorization from "@/lib/utils/withAuthorization";

let schema = yup.object().shape({
  name: yup.string().required("Please specify value for this field"),
  code: yup.string().required("Please specify value for this field"),
  from: yup.string().required("Please specify value for this field"),
  to: yup.string().required("Please specify value for this field"),
  project_manager: yup.string().required("Please specify value for this field"),
  quality_assurance: yup
    .string()
    .required("Please specify value for this field"),
  technical_lead: yup
    .array()
    .min(1, "Please specify value for this field")
    .required("Please specify value for this field"),
  business_analyst: yup
    .array()
    .min(1, "Please specify value for this field")
    .required("Please specify value for this field"),
  developers: yup
    .array()
    .min(1, "Please specify value for this field")
    .required("Please specify value for this field"),
  testers: yup
    .array()
    .min(1, "Please specify value for this field")
    .required("Please specify value for this field"),
  technical_consultant: yup
    .array()
    .min(1, "Please specify value for this field")
    .required("Please specify value for this field"),
});

const ProjectCreate = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllStaff());
  }, []);

  const staffState = useSelector((state: RootState) => state.staff.staff);

  const staffOptions = staffState.map((staff, index) => ({
    label: staff.name,
    value: staff.name,
  }));

  const formik = useFormik<Project>({
    initialValues: {
      name: "",
      code: "",
      from: "",
      to: "",
      project_manager: "",
      quality_assurance: "",
      technical_lead: [],
      business_analyst: [],
      developers: [],
      testers: [],
      technical_consultant: [],
      active: true,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      //alert(JSON.stringify(values));
      console.log(values);

      dispatch(createProject(values));
      toast.success("Create Project Successfully !");
      formik.resetForm();
      setTimeout(() => {
        navigate("/config/project");
      }, 300);
    },
  });

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="w-full p-4 bg-[#ffffff] roudned-md">
        <div className="w-full p-2 bg-[#ffffff] roudned-md justify-center ">
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
            <form onSubmit={formik.handleSubmit} className="w-full">
              <div className="flex w-full h-fit gap-5">
                <div className="w-1/2 h-full font-medium">
                  <div className="flex flex-col w-[500px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      Project Name <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="relative">
                      <MdOutlineError
                        className={`absolute z-10 right-3 top-[20%] text-[#EB5757] w-[24px] h-[24px] ${
                          formik.touched.name && formik.errors.name
                            ? ""
                            : "hidden"
                        }`}
                      />
                      <input
                        className={`pl-3 block w-full border rounded-md p-2 text-[#666666] bg-[#FFFFFF] ${
                          formik.touched.name && formik.errors.name
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        type="text"
                        placeholder={"Project Name"}
                        name="name"
                        onChange={formik.handleChange("name")}
                        onBlur={formik.handleBlur("name")}
                        value={formik.values.name}
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.name && formik.errors.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[250px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      Project Code <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="relative">
                      <MdOutlineError
                        className={`absolute z-10 right-3 top-[20%] text-[#EB5757] w-[24px] h-[24px] ${
                          formik.touched.code && formik.errors.code
                            ? ""
                            : "hidden"
                        }`}
                      />
                      <input
                        className={`pl-3 block w-full border rounded-md p-2 text-[#666666] bg-[#FFFFFF] ${
                          formik.touched.code && formik.errors.code
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        type="text"
                        placeholder={"Project Code"}
                        name="code"
                        onChange={formik.handleChange("code")}
                        onBlur={formik.handleBlur("code")}
                        value={formik.values.code}
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.code && formik.errors.code}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[250px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      From <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="relative">
                      <input
                        className={`pl-3 block w-full border rounded-md p-2 text-[#666666] bg-[#FFFFFF] ${
                          formik.touched.from && formik.errors.from
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        type="date"
                        placeholder={"DD/MM/YYYY"}
                        name="from"
                        onChange={formik.handleChange("from")}
                        onBlur={formik.handleBlur("from")}
                        value={formik.values.from}
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.from && formik.errors.from}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[250px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      To <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="relative">
                      <input
                        className={`pl-3 block w-full border rounded-md p-2 text-[#666666] bg-[#FFFFFF] ${
                          formik.touched.to && formik.errors.to
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        type="date"
                        placeholder={"DD/MM/YYYY"}
                        name="to"
                        onChange={formik.handleChange("to")}
                        onBlur={formik.handleBlur("to")}
                        value={formik.values.to}
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.to && formik.errors.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[250px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      PM <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="w-full h-[42px]">
                      <select
                        className={`w-full h-full relative font-normal border rounded-md p-2 ${
                          formik.touched.project_manager &&
                          formik.errors.project_manager
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        name="project_manager"
                        onChange={formik.handleChange("project_manager")}
                        onBlur={formik.handleBlur("project_manager")}
                        value={formik.values.project_manager}
                      >
                        <option value="" disabled>
                          -- Project Manager --
                        </option>
                        {staffState.map((i, j) => {
                          return staffState[j].department ===
                            "Project Manager" ? (
                            <option key={j} value={i.name}>
                              {i.name}
                            </option>
                          ) : (
                            ""
                          );
                        })}
                      </select>
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.project_manager &&
                          formik.errors.project_manager}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[250px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      QA <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="w-full h-[42px]">
                      <select
                        className={`w-full h-full relative font-normal border rounded-md p-2 ${
                          formik.touched.quality_assurance &&
                          formik.errors.quality_assurance
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        name="quality_assurance"
                        onChange={formik.handleChange("quality_assurance")}
                        onBlur={formik.handleBlur("quality_assurance")}
                        value={formik.values.quality_assurance}
                      >
                        <option value="" disabled>
                          -- Quality Assurance --
                        </option>
                        {staffState.map((i, j) => {
                          return staffState[j].department.startsWith("QA") ? (
                            <option key={j} value={i.name}>
                              {i.name}
                            </option>
                          ) : (
                            ""
                          );
                        })}
                      </select>
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.quality_assurance &&
                          formik.errors.quality_assurance}
                      </p>
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
                        allowClear
                        className={`h-full relative block border rounded-md ${
                          formik.touched.technical_lead &&
                          formik.errors.technical_lead
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        placeholder={"Technical Lead"}
                        defaultValue={formik.values.technical_lead}
                        options={staffOptions}
                        onChange={(value) =>
                          formik.setFieldValue("technical_lead", value)
                        }
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.technical_lead &&
                          formik.errors.technical_lead}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[500px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      BA <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="w-full h-[42px]">
                      <Select
                        mode="multiple"
                        allowClear
                        className={`h-full relative block border rounded-md ${
                          formik.touched.business_analyst &&
                          formik.errors.business_analyst
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        placeholder={"Business Analyst"}
                        defaultValue={formik.values.business_analyst}
                        options={staffOptions}
                        onChange={(value) =>
                          formik.setFieldValue("business_analyst", value)
                        }
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.business_analyst &&
                          formik.errors.business_analyst}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[500px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      Developers <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="w-full h-[42px]">
                      <Select
                        mode="multiple"
                        allowClear
                        className={`h-full relative block border rounded-md ${
                          formik.touched.developers && formik.errors.developers
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        placeholder={"Developers"}
                        defaultValue={formik.values.developers}
                        options={staffOptions}
                        onChange={(value) =>
                          formik.setFieldValue("developers", value)
                        }
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.developers && formik.errors.developers}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[500px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      Testers <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="w-full h-[42px]">
                      <Select
                        mode="multiple"
                        allowClear
                        className={`h-full relative block border rounded-md ${
                          formik.touched.testers && formik.errors.testers
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        placeholder={"Testers"}
                        defaultValue={formik.values.testers}
                        options={staffOptions}
                        onChange={(value) =>
                          formik.setFieldValue("testers", value)
                        }
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.testers && formik.errors.testers}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-[500px] mb-6">
                    <span className="text-[12px] text-[#666666] mb-1">
                      Technical Consultancy <a className="text-[#FF0000]">*</a>
                    </span>
                    <div className="w-full h-[42px]">
                      <Select
                        mode="multiple"
                        allowClear
                        className={`h-full relative block border rounded-md ${
                          formik.touched.technical_consultant &&
                          formik.errors.technical_consultant
                            ? "border-[#EB5757]"
                            : ""
                        }`}
                        placeholder={"Technical Consultancy"}
                        defaultValue={formik.values.technical_consultant}
                        options={staffOptions}
                        onChange={(value) =>
                          formik.setFieldValue("technical_consultant", value)
                        }
                      />
                    </div>
                    <div className="">
                      <p className="text-[12px] font-normal text-[#EB5757]">
                        {formik.touched.technical_consultant &&
                          formik.errors.technical_consultant}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full pt-5">
                <div className="flex justify-end">
                  <div className="flex justify-center items-center w-[246px] h-[64px] bg-[#F1F6F9] border border-[#9BA4B4] rounded-lg mx-1">
                    <Link to={"/config/project"}>
                      <button className="font-bold text-[#14274E] text-[24px]">
                        Cancel
                      </button>
                    </Link>
                  </div>
                  <div className="flex justify-center items-center w-[246px] h-[64px] bg-[#007ACC] rounded-lg mx-1">
                    <button
                      type="submit"
                      className="font-bold text-white text-[24px]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
const allowedRoles = ["admin"];

export default withAuthorization(ProjectCreate, allowedRoles);
