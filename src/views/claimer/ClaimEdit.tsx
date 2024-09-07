import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui/table.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  getClaim,
  submitClaim,
  updateClaim,
} from "@/lib/redux/reducers/claims.reducer";
import { getAllProjects } from "@/lib/redux/reducers/projects.reducer";
import toast from "react-hot-toast";
import { AiOutlineExclamationCircle, AiOutlineMinus } from "react-icons/ai";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Claim } from "@/lib/schemas/claim.schema";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";
import { Tooltip } from "antd";

interface RecordError {
    date: string;
    from: string;
    to: string;
    remarks: string;
    amount: string;
  }

const ClaimEdit = () => {
  const { claimid } = useParams();

  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claim.currentClaim);
  const projects = useSelector((state: RootState) => state.project.projects);
  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);

  useEffect(() => {
    if (claimid) {
      dispatch(getClaim(parseInt(claimid)));
    }
  }, [claimid]);

  useEffect(() => {
    dispatch(getAllProjects());
  }, []);

  let detailedData: Partial<Claim> = {};

  if (claims) {
    detailedData = {
      status: claims.status,
      staff: {
        id: claims.staff?.id,
        name: claims.staff?.name,
        department: claims.staff?.department,
      },
      project: {
        name: claims.project?.name,
        from: claims.project?.from,
        to: claims.project?.to,
      },
      remarks: claims.remarks,
      total_money: claims.total_money,
      records: claims.records?.map((record) => ({
        date: record.date,
        day: record.day,
        from: record.from,
        to: record.to,
        remarks: record.remarks,
        money: record.money,
      })),
      id: claims.id,
      created_at: claims.created_at,
      updated_at: claims.updated_at,
    };
  }

  const [selectedProject, setSelectedProject] = useState({
    name: "",
    from: "",
    to: "",
    code: "",
  });

  const [tableData, setTableData] = useState(
    detailedData.records || [
      {
        date: new Date().toString(),
        day: "",
        from: new Date().toString(),
        to: new Date().toString(),
        remarks: "",
        money: 0,
      },
    ]
  );

  useEffect(() => {
    if (detailedData.records) {
      setTableData(detailedData.records);
    }
  }, [claims?.records]);

  useEffect(() => {
    if(detailedData.remarks){
        setRemark(detailedData.remarks)
    }
  }, [claims?.remarks]);

  const [totalMoney, setTotalMoney] = useState(detailedData.total_money);

  useEffect(() => {
    if(detailedData.total_money){
      setTotalMoney(detailedData.total_money)
    }
  }, [claims?.total_money]); 

  const [remark, setRemark] = useState(detailedData.remarks);
  const [row, setRow] = useState<number>(tableData.length);

  useEffect(() => {
    if(detailedData.records){
      setRow(detailedData.records.length)
    }
  }, [claims?.records])

  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const [showSubmissionDialog, setShowSubmissionDialog] =
    useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    status: string;
    project_name: string;
    remarks: string;
    records: RecordError[];
  }>({
    status: "",
    project_name: "",
    remarks: "",
    records: Array(detailedData.records?.length).fill({
      date: "",
      from: "",
      to: "",
      remarks: "",
      amount: "",
    }),
  });

  useEffect(() => {
    if(detailedData) {
      setErrors({
        status: "",
        project_name: "",
        remarks: "",
        records: Array(detailedData.records?.length).fill({
          date: "",
          from: "",
          to: "",
          remarks: "",
          amount: "",
        }),
      })
    }  
  }, [claims])
  
  useEffect(() => {
    if (projects.length > 0 && claims?.project?.name) {
      const initialSelectedProject = projects.find(
        (project) => project.name === claims.project.name
      );
      if (initialSelectedProject) {
        setSelectedProject(initialSelectedProject);
      }
    }
  }, [projects, claims?.project.name]);

  const handleDateChange = (index: number, newDate: Date) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index].date = newDate.toString();
      updatedTableData[index].day = newDate.toLocaleDateString("en-us", {
        weekday: "short",
      });
      return updatedTableData;
    });
    detailedData = pushData();
  };

  const handleFromDateChange = (index: number, newFromDate: Date) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index].from = newFromDate.toString();
      return updatedTableData;
    });
    detailedData = pushData();
  };

  const handleToDateChange = (index: number, newToDate: Date) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index].to = newToDate.toString();
      return updatedTableData;
    });
    detailedData = pushData();
  };

  const handleRemarksChange = (index: number, newRemark: string) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index].remarks = newRemark;
      return updatedTableData;
    });
    detailedData = pushData();
  };

  const handleMoney = (index: number, newMoney: string) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index].money = parseFloat(newMoney);
      return updatedTableData;
    });
    setTotalMoney(tableData.reduce((total, record) => total + record.money, 0));
    detailedData = pushData();
  };

  const handleRemark = (newRemark: string) => {
    setRemark(newRemark);
    detailedData = pushData();
  };

  const handleProjectName = (newName: string) => {
    const selectedProject = projects.find(
      (project) => project.name === newName
    );
    if (selectedProject) {
      setSelectedProject(selectedProject);
      const extractedDate = new Date(selectedProject.from);
      for (let i = 0; i < row; i++) {
        handleDateChange(i, extractedDate);
        handleFromDateChange(i, extractedDate);
        handleToDateChange(i, extractedDate);
      }
    }
    detailedData = pushData();
  };

  const addRow = () => {
    const newRow = {
      date: new Date().toString(),
      day: "",
      from: new Date().toString(),
      to: new Date().toString(),
      remarks: "",
      money: 0,
    };
    const newErrorRow = {
      date: "",
      from: "",
      to: "",
      remarks: "",
      amount: "",
    };
    setTableData([...tableData, newRow]);
    errors.records.push(newErrorRow);
  };

  useEffect(() => {
    const incrementRow = () => {
      setRow((prevRow) => prevRow + 1);
    };

    const button = document.querySelector(".increment-button");
    if (button) {
      button.addEventListener("click", incrementRow);

      return () => {
        button.removeEventListener("click", incrementRow);
      };
    }
  }, []);

  const validateForm = (data: any) => {
    const errors = {
      status: "",
      project_name: "",
      remarks: "",
      records: [] as RecordError[],
    };
  
    if (!data.project.name) {
      errors.project_name = "Project name is required";
      errors.status = "yes";
    }
  
    for (let i = 0; i < data.records.length; i++) {
      const element: RecordError = {
        date: "",
        from: "",
        to: "",
        remarks: "",
        amount: "",
      };
  
      if (!data.records[i].date) {
        element.date = "Date is required";
        errors.status = "yes";
      } else if (
        new Date(data.records[i].date) < new Date(data.project.from) ||
        new Date(data.records[i].date) > new Date(data.project.to)
      ) {
        element.date = "Date is out of project duration";
        errors.status = "yes";
      }
  
      if (!data.records[i].from) {
        element.from = "From date is required";
        errors.status = "yes";
      } else if (
        new Date(data.records[i].date) > new Date(data.records[i].from)
      ) {
        element.from = "From date is invalid";
        errors.status = "yes";
      } else if (
        new Date(data.records[i].from) < new Date(data.project.from) ||
        new Date(data.records[i].from) > new Date(data.project.to)
      ){
        element.from = "Date is out of project duration"
        errors.status = "yes"
      }
  
      if (!data.records[i].to) {
        element.to = "To date is required";
        errors.status = "yes";
      } else if (
        new Date(data.records[i].date) > new Date(data.records[i].to) ||
        new Date(data.records[i].to) < new Date(data.records[i].from)
      ) {
        element.to = "To date is invalid";
        errors.status = "yes";
      } else if (
        new Date(data.records[i].to) > new Date(data.project.to)
      ) {
        element.from = "Date is out of project duration"
        errors.status = "yes"
      }
  
      if (!data.records[i].remarks) {
        element.remarks = "Remarks is required";
        errors.status = "yes";
      }
  
      if (data.records[i].money === 0 || !data.records[i].money) {
        element.amount = "Amount is required";
        errors.status = "yes";
      }
  
      errors.records.push(element);
    }
  
    if (!data.remarks) {
      errors.remarks = "Remarks is required";
      errors.status = "yes";
    }
  
    if (!errors.project_name && !errors.records.length && !errors.remarks) {
      errors.status = "";
    }
  
    return errors;
  };

  const pushData = () => {
    const Data: Claim = {
      id: detailedData?.id || "",
      staff: {
        id: detailedData?.staff?.id || 0,
        name: detailedData?.staff?.name || "",
        department: detailedData?.staff?.department || "",
      },
      project: {
        name: selectedProject?.name || "",
        from: selectedProject?.from || "",
        to: selectedProject?.to || "",
      },
      remarks: remark || "",
      records: tableData || [], 
      status: "draft",
      total_money: totalMoney || 0,
      created_at: detailedData?.created_at || new Date().toISOString(),
      updated_at: detailedData?.updated_at || new Date().toISOString(),
    };
    setErrors(validateForm(Data));
    return Data;
  };

  const handleSubmit = () => {
    detailedData = pushData();
    console.log(detailedData);
    if (errors.status !== "yes") {
      setShowSubmissionDialog(true);
    } else {
      toast.error("Invalid inputs. Can't Submit", {
        position: "top-right",
      });
    }
  };

  const handleSave = () => {
    detailedData = pushData();
    if (errors.status !== "yes") {
      setShowConfirmationDialog(true);
    } else {
      toast.error("Invalid inputs. Can't Save", {
        position: "top-right",
      });
    }
  };

  const confirmSubmission = () => {
    const submitData = pushData();
    if (errors.status !== "yes") {
        console.log(submitData);
      dispatch(
        submitClaim({ claim_id: Number(claimid), formData: submitData })
      );
      navigate("/claims/pending");
      toast.success("Claim submitted successfully", {
        position: "top-right",
      });
    } else {
        console.log(submitData);

      toast.error("Invalid inputs. Can't Submit", {
        position: "top-right",
      });
    }
    setShowSubmissionDialog(false);
  };

  const cancelSubmission = () => {
    setShowSubmissionDialog(false);
  };

  const confirmSave = () => {
    const saveData = pushData();
    console.log(saveData);
    if (errors.status !== "yes") {
      const claim_id = Number(claimid);
      dispatch(updateClaim({ claim_id, formData: saveData }));
      navigate("/claims/draft");
      toast.success("Claim saved successfully", {
        position: "top-right",
      });
    } else {
      toast.error("Invalid inputs. Can't Save", {
        position: "top-right",
      });
    }
    setShowConfirmationDialog(false);
  };

  const cancelSave = () => {
    setShowConfirmationDialog(false);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      if (row === 1) {
        toast.error("Cannot delete the only row", {
          position: "top-right",
        });
      } else {
        setTableData((prevRows) =>
          prevRows.filter((_, index) => index !== deleteId)
        );
        setRow((prevRow) => prevRow - 1);
        toast.success("Delete successfully", {
          position: "top-right",
        });
        setDeleteId(null);
      }
    }
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4 rounded bg-white shadow-lg">
        <div className="w-full flex justify-between items-center mb-4 text-black">
          <div className="text-lg hover:shadow-lg p-2 rounded-md">
          </div>
          <div className="pr-2">
            <span>Claim Status: </span>
            <span className="text-[#007AAC] font-semibold">
              {claims?.status}
            </span>
          </div>
        </div>
        <div className="p-3 flex justify-evenly items-center">
          <div className="flex flex-col gap-7">
            <div className="grid grid-cols-2 gap-[70px]">
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-full">
                  <span className="font-medium">
                    Project Name<span className="text-red-600">*</span>
                  </span>
                  <Select
                    onValueChange={handleProjectName}
                    value={selectedProject.name}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedProject.name || claims?.project?.name
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project, index) => (
                        <SelectItem key={index} value={project.name}>
                          <div className="flex items-center gap-1">
                            <span>{project.name}</span> <br />
                            <span className="text-xs text-gray-500">
                              Code: {project.code}
                            </span>{" "}
                            <br />
                            <span className="text-xs text-gray-500">
                              Duration: {project.from} - {project.to}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Staff ID</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Staff Name</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[70px]">
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[240px]">
                  <span className="font-medium">Project Duration</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {selectedProject
                      ? `${Math.ceil(
                          (new Date(selectedProject.to).getTime() -
                            new Date(selectedProject.from).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : ""}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[240px]">
                  <span className="font-medium">Role in Project</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.rank.toLocaleUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Staff Department</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.department}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Total Working Hour</span>
                  <span
                    id="totalWorkingHours"
                    className="p-2 border border-gray-200 rounded-md h-[40px]"
                  >
                    {tableData.reduce(
                      (total, record) =>
                        total +
                        (new Date(record.to).getTime() -
                          new Date(record.from).getTime()) /
                          (1000 * 60 * 60),
                      0
                    )} hours
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto shadow-md rounded-md p-2 pt-1">
              <span className="text-xl pb-3">Claims</span>
              <Table className="min-w-full divide-y">
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="text-black font-bold">
                      Date<span className="text-red-600">*</span>
                    </TableHead>
                    <TableHead className="text-black font-bold">Day</TableHead>
                    <TableHead className="text-black font-bold">
                      From<span className="text-red-600">*</span>
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      To<span className="text-red-600">*</span>
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      Total No. of Hours
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      Remarks<span className="text-red-600">*</span>
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      Amount<span className="text-red-600">*</span>
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((detail, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <DateTimePicker
                              displayFormat={{ hour24: "dd/MM/yyyy" }}
                              onChange={(newDate) =>
                                handleDateChange(index, newDate || new Date())
                              }
                              value={new Date(detail.date)}
                              placeholder={new Date(
                                detail.date
                              ).toLocaleDateString("en-GB")}
                            />
                            {errors.records[index].date && (
                              <Tooltip title={errors.records[index].date} className="absolute top-[11.5px] left-2 text-red-500 bg-destructive-foreground">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>
                          {new Date(detail.date).toLocaleDateString("en-us", {
                            weekday: "short",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <DateTimePicker
                              displayFormat={{ hour24: "dd/MM/yyyy HH:mm:ss" }}
                              onChange={(newFromDate) =>
                                handleFromDateChange(
                                  index,
                                  newFromDate || new Date()
                                )
                              }
                              value={new Date(detail.from)}
                              placeholder={new Date(detail.from).toLocaleString(
                                "en-GB"
                              )}
                            />
                            {errors.records[index].from && (
                              <Tooltip title={errors.records[index].from} className="absolute top-[11.5px] left-2 text-red-500 bg-destructive-foreground">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <DateTimePicker
                              displayFormat={{ hour24: "dd/MM/yyyy HH:mm:ss" }}
                              onChange={(newToDate) =>
                                handleToDateChange(index, newToDate || new Date())
                              }
                              value={new Date(detail.to)}
                              placeholder={new Date(detail.to).toLocaleString(
                                "en-GB"
                              )}
                            />
                            {errors.records[index].to && (
                              <Tooltip title={errors.records[index].to} className="absolute top-[11.5px] left-2 text-red-500 bg-destructive-foreground">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {" "}
                        {(new Date(detail.to).getTime() -
                          new Date(detail.from).getTime()) /
                          (1000 * 60 * 60)}{" "}
                        hours
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              className="p-2 border border-gray-200 rounded-md h-[40px] w-[220px]"
                              onChange={(e) =>
                                handleRemarksChange(index, e.target.value)
                              }
                              value={detail.remarks}
                              placeholder={detail.remarks}
                            />
                            {errors.records[index].remarks && (
                              <Tooltip title={errors.records[index].remarks} className="absolute top-[11px] right-2 text-red-500">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-center items-center gap-1">
                            <span>$</span>
                            <div className="relative">
                              <input
                                className="p-2 border border-gray-200 rounded-md h-[40px] w-[90px]"
                                placeholder="0"
                                type="number"
                                min={0}
                                value={detail.money.toFixed(2)}
                                onChange={(e) =>
                                  handleMoney(index, e.target.value)
                                }
                              />
                              {errors.records[index].amount && (
                                <Tooltip title={errors.records[index].amount} className="absolute top-[11px] right-2 text-red-500 bg-white">
                                  <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex justify-center items-center">
                        <AiOutlineMinus
                          className="text-2xl text-black cursor-pointer outline-1 border-1 border-black rounded-sm p-1 mt-2 hover:bg-gray-200 transition-all"
                          onClick={() => handleDelete(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end items-center">
                <button
                  className="increment-button mt-3 mb-1 px-2 rounded-md border border-slate-500 hover:bg-[#007AAC] hover:text-white transition-all"
                  onClick={addRow}
                >
                  Add more
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex items-center gap-10">
                <div className="flex flex-col gap-2 w-full">
                  <span className="font-medium">
                    Remarks<span className="text-red-600">*</span>
                  </span>
                  <div className="relative">
                    <textarea
                      className="p-2 border border-gray-200 rounded-md w-full"
                      rows={4}
                      cols={40}
                      value={remark}
                      onChange={(e) => handleRemark(e.target.value)}
                    />
                    {errors.remarks && (
                      <Tooltip title={errors.remarks} className="absolute top-[11.5px] right-2 text-red-500 bg-white">
                        <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <div className="pl-4 flex justify-start items-center w-full">
                  <span className="font-medium">
                    Total Amount: ${totalMoney?.toFixed(2)}
                  </span>
                </div>
                <button
                  className="p-2 rounded-md bg-[#007AAC] text-white w-[120px] flex justify-center items-center hover:bg-green-500 hover:shadow-md transition-all"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end items-center mt-5">
        <button
          onClick={handleSave}
          className="p-2 mx-3 rounded-md bg-[#007AAC] text-white w-[120px] flex justify-center items-center hover:shadow-md transition-all"
        >
          Save
        </button>
        <Link
          to={"/claims/draft"}
          className="p-2 ml-3 rounded-md bg-gray-400 text-white w-[120px] flex justify-center items-center hover:bg-red-600 hover:shadow-md transition-all"
        >
          Cancel
        </Link>
      </div>
      {/* Confirmation Dialog for Submission */}
      <AlertDialog
        open={showSubmissionDialog}
        onOpenChange={setShowSubmissionDialog}
      >
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this claim? <br />
              Please click 'Submit' to submit the claim or 'Cancel' to close the
              dialog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={confirmSubmission}
              className="bg-[#0077AC]"
            >
              Submit
            </AlertDialogAction>
            <AlertDialogCancel onClick={cancelSubmission} className="bg-white">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Save */}
      <AlertDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      >
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Save</AlertDialogTitle>
            <AlertDialogDescription>
              This action will Save Claim as Draft.
              <br />
              Please click 'Save' to submit the claim or 'Cancel' to close the
              dialog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmSave} className="bg-[#0077AC]">
              Save
            </AlertDialogAction>
            <AlertDialogCancel onClick={cancelSave} className="bg-white">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected claims? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmDelete} className="bg-[#F83033]">
              Delete
            </AlertDialogAction>
            <AlertDialogCancel onClick={cancelDelete} className="bg-white">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
const allowedRoles = ["claimer"];

export default withAuthorization(ClaimEdit, allowedRoles);
