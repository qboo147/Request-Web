/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { AiOutlineExclamationCircle, AiOutlineMinus } from "react-icons/ai";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from "@components/ui/select.tsx";
import toast from "react-hot-toast";
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

import { 
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from "@components/ui/table.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/redux.config";
import { getAllProjects } from "@/lib/redux/reducers/projects.reducer";
import { Claim } from "@/lib/schemas/claim.schema";
import { createClaim, getAllClaims, submitClaim } from "@/lib/redux/reducers/claims.reducer";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";
import { Tooltip } from "antd";


interface Project {
    name: string;
    from: string;
    to: string;
    code: string;
}

const ClaimCreate = () => {
  const dispatch: AppDispatch = useDispatch();

    const projectState = useSelector((state: any) => state.project.projects);
    const claimState = useSelector((state: any) => state.claim.claims);
    const projectData: Project[] = [];

    console.log(claimState);

    useEffect(() => {
        dispatch(getAllProjects());
    }, [])

    useEffect(() => {
        dispatch(getAllClaims());
    }, [])

    for (let i = 0; i < projectState.length; i++) {
        projectData.push({
            name: projectState[i].name,
            from: projectState[i].from,
            to: projectState[i].to,
            code: projectState[i].code
        });
    }

    const [selectedProject, setSelectedProject] = useState({
        name: '',
        from: '',
        to: '',
        code: ''
    });

  const [tableData, setTableData] = useState([
    {
      date: Date().toString(),
      day: "",
      from: Date().toString(),
      to: Date().toString(),
      remarks: "",
      money: 0,
    },
  ]);
  const [row, setRow] = useState(1);
  const [data, setData] = useState<Claim>();
  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const [showSubmissionDialog, setShowSubmissionDialog] =
    useState<boolean>(false);
  const [remarks, setRemarks] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{
    status: string;
    project_name: string;
    remarks: string;
    records: RecordError[];
  }>({
    status: "",
    project_name: "Project name is required",
    remarks: "Remark is required",
    records: Array(tableData.length).fill({
      date: "",
      from: "",
      to: "",
      remarks: "Remark is required",
      amount: "Money is required",
    }),
  });

    const handleDateChange = (index: number, date: Date) => {
        setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData];
            updatedTableData[index].date = date.toString();
            updatedTableData[index].day = date.toLocaleDateString('en-us', { weekday: 'short' })
            return updatedTableData;
        });
        setData(pushData())
    }

    const handleDateFromChange = (index: number, dateFrom: Date) => {
        setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData];
            updatedTableData[index].from = dateFrom.toString();
            return updatedTableData;
        });
        setData(pushData())
    }

  const handleDateToChange = (index: number, dateTo: Date) => {
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[index].to = dateTo.toString();
      return updatedTableData;
    });
    setData(pushData());
  };
  
  const handleProjectName = (newName: string) => {
      const initialSelectedProject = projectData.find((project) => project.name === newName);
      if (initialSelectedProject){
          setSelectedProject(initialSelectedProject);
          const extractedDate = new Date(initialSelectedProject?.from)
          for(let i=0; i<row; i++){
              handleDateChange(i, extractedDate);
              handleDateFromChange(i, extractedDate);
              handleDateToChange(i, extractedDate);
          }
      }
      setData(pushData());
  }

    const handleRemarksChange = (index: number, newRemark: string) => {
        setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData];
            updatedTableData[index].remarks = newRemark;
            return updatedTableData;
        });
        setData(pushData())
    }

    const handleMoneyChange = (index: number, newMoney: number) => {
        setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData];
            updatedTableData[index].money = newMoney;
            return updatedTableData;
        });
        setData(pushData())
    }

    const handleRemarks = (newRemark: string) => {
        setRemarks(newRemark)
        setData(pushData())
    }

  const handleBack = () => {
    window.history.back();
  };
  interface RecordError {
    date: string;
    from: string;
    to: string;
    remarks: string;
    amount: string;
  }
  
  interface FormErrors {
    status: string;
    project_name: string;
    remarks: string;
    records: RecordError[];
  }
  

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
  

  const handleSubmit = () => {
    setData(pushData);
    if (errors.status !== "yes") {
      setShowSubmissionDialog(true);
    } else {
      toast.error("Invalid inputs", {
        position: "top-right",
      });
    }
  };

    const handleSave = () => {
        setData(pushData);
        if (errors.status !== 'yes'){
            setShowConfirmationDialog(true);
        } else {
            toast.error("Invalid inputs", {
                position: "top-right"
            });
        }
    };

  const pushData = () => {
    const submitData: Claim = {
      id: (claimState.length + 1).toString(),
      staff: {
        id: userData.id,
        name: userData.name,
        department: userData.department,
      },
      project: {
        name: selectedProject.name,
        from: selectedProject.from,
        to: selectedProject.to,
      },
      remarks: remarks,
      records: [...tableData],
      created_at: "",
      updated_at: "",
      status: "",
      total_money: 0,
    };
    setErrors(validateForm(submitData));
    return submitData;
  };

    const confirmSubmission = async () => {
        const submitData = pushData();
        submitData.total_money = tableData.reduce((total, record) => total + record.money,0)
        try {
          if (errors.status !== 'yes'){
              const message = await dispatch(createClaim(submitData));
              if (message.meta.requestStatus === 'fulfilled') {
                dispatch(submitClaim({claim_id: Number(submitData.id), formData: submitData}))
                navigate('/claims/pending');
                toast.success("Claim submitted successfully", {
                    position: "top-right"
                });
              }
          } else {
              toast.error("Invalid inputs. Can't submit.", {
                  position: "top-right"
              });
          }
          setShowSubmissionDialog(false);
        } catch (error) {
          console.log(error);
          throw new Error("Unable to submit claim");
        }
        
    };

    const cancelSubmission = () => {
        setShowSubmissionDialog(false);
    };

    const confirmSave = () => {
        const saveData = pushData();
        saveData.total_money = tableData.reduce((total, record) => total + record.money,0)
        if (errors.status !== 'yes'){
          console.log(saveData);
          dispatch(createClaim(saveData));
          navigate('/claims/draft');
          toast.success("Claim saved successfully", {
              position: "top-right"
          });
        } else {
            toast.error("Invalid inputs. Can't save.", {
                position: "top-right"
            });
        }
        setShowConfirmationDialog(false);
    };

    const cancelSave = () => {
        setShowConfirmationDialog(false);
    };

    useEffect(() => {
        const incrementRow = () => {
            const newRow = {
                date: Date().toString(), 
                day: '',
                from: Date().toString(), 
                to: Date().toString(), 
                remarks: '',
                money: 0
            };
            const newErrorRow ={
                date: '',
                from: '',
                to: '',
                remarks: '',
                amount: ''
            }
            setTableData(prevTableData => [...prevTableData, newRow]);
            setErrors(prevErrors => ({
                ...prevErrors,
                records: [...prevErrors.records, newErrorRow]
            }));
            setRow(prevRow => prevRow + 1);
        };
    
        const button = document.querySelector('.increment-button');
        if (button){
            button.addEventListener('click', incrementRow);
    
            return () => {
                button.removeEventListener('click', incrementRow);
            };   
        }
    }, []);

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            if (row === 1) {
                toast.error("Cannot delete the only row", {
                    position: "top-right"
                });
            }
            else{
                setTableData((prevRows) => prevRows.filter((_, index) => index !== deleteId));
                setRow(prevRow => prevRow - 1);
                toast.success("Delete successfully", {
                    position: "top-right"
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
            {/* <IoArrowBackOutline onClick={handleBack} /> */}
          </div>
          <div className="pr-2">
            <span>Claim Status: </span>
            <span className="text-[#007AAC] font-semibold">Unknown</span>
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
                  <div className="relative">
                    <Select
                      onValueChange={(e) => handleProjectName(e)}
                      value={selectedProject.name}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Project ..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projectData.map((project, index) => (
                          <SelectItem
                            key={index}
                            value={project.name}>
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
                    {errors.project_name && (
                      <Tooltip title={errors.project_name} className="absolute top-[11.5px] right-2 text-red-500 bg-white">
                        <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                      </Tooltip>
                    )}
                  </div>
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
                    {userData.rank}
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
                    )}{" "}
                    hours
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
                    <TableHead className="text-black font-bold"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: row }).map((_, i) => (
                    <TableRow
                      key={i}
                      className={i % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                    >
                      <TableCell className="w-[113px]">
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <DateTimePicker
                              displayFormat={{ hour24: "dd/MM/yyyy" }}
                              value={tableData[i].date ? new Date(tableData[i].date) : new Date()} // Default to current date if undefined
                              onChange={(date) => handleDateChange(i, date ?? new Date())} // Ensure date is always a Date
                              placeholder="01/01/1990"
                            />
                            {errors.records[i].date && (
                              <Tooltip title={errors.records[i].date} className="absolute top-[11.5px] left-2 text-red-500 bg-destructive-foreground">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[61px]">
                        <span>
                          {new Date(tableData[i].date)?.toLocaleDateString(
                            "en-us",
                            { weekday: "short" }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <DateTimePicker
                              displayFormat={{ hour24: "dd/MM/yyyy HH:mm:ss" }}
                              value={tableData[i].from ? new Date(tableData[i].from) : new Date()} // Default to current date if undefined
                              onChange={(dateFrom) => handleDateFromChange(i, dateFrom ?? new Date())} // Ensure dateFrom is always a Date
                              placeholder="01/01/1990 23:59:59"
                            />
                            {errors.records[i].from && (
                              <Tooltip title={errors.records[i].from} className="absolute top-[11.5px] left-2 text-red-500 bg-destructive-foreground">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="w-[200px]">
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <DateTimePicker
                              displayFormat={{ hour24: "dd/MM/yyyy HH:mm:ss" }}
                              value={tableData[i].to ? new Date(tableData[i].to) : new Date()} // Default to current date if undefined
                              onChange={(dateTo) => handleDateToChange(i, dateTo ?? new Date())} // Ensure dateTo is always a Date
                              placeholder="01/01/1990 23:59:59"
                            />
                            {errors.records[i].to && (
                                <Tooltip title={errors.records[i].to} className="absolute top-[11.5px] left-2 text-red-500 bg-destructive-foreground">
                                  <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                                </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>


                      <TableCell>
                        <span>
                          {(new Date(tableData[i].to).getTime() -
                            new Date(tableData[i].from).getTime()) /
                            (1000 * 60 * 60)}{" "}
                          hours
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              className="p-2 border border-gray-200 rounded-md h-[40px] w-[220px]"
                              placeholder="..."
                              value={tableData[i].remarks}
                              onChange={(e) => handleRemarksChange(i, e.target.value)}
                            />
                            {errors.records[i].remarks && (
                              <Tooltip title={errors.records[i].remarks} className="absolute top-[11px] right-2 text-red-500">
                                <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <div className="flex justify-center items-center gap-1">
                              <span>$</span>
                              <input
                                className="p-2 border border-gray-200 rounded-md h-[40px] w-[90px]"
                                placeholder="..."
                                type="number"
                                min={0}
                                value={tableData[i].money.toFixed(2)}
                                onChange={(e) =>
                                  handleMoneyChange(i, parseFloat(e.target.value))
                                }
                              />
                            </div>
                            {errors.records[i].amount && (
                                <Tooltip title={errors.records[i].amount} className="absolute top-[11px] right-2 text-red-500 bg-white">
                                  <AiOutlineExclamationCircle className="h-[18px] w-[18px]" />
                                </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex justify-center items-center w-min">
                        <AiOutlineMinus
                          className="text-2xl text-black cursor-pointer outline-1 border-1 border-black rounded-sm p-1 mt-2 hover:bg-gray-200 transition-all"
                          onClick={() => handleDelete(i)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end items-center">
                <button className="increment-button mt-3 mb-1 px-2 rounded-md border border-slate-500 hover:bg-[#007AAC] hover:text-white transition-all">
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
                      value={remarks}
                      onChange={(e) => handleRemarks(e.target.value)}
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
                    Total Amount: $<span>{tableData.reduce((total, record) => total + record.money, 0).toFixed(2)}</span>
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  className="p-2 rounded-md bg-[#007AAC] text-white w-[120px] flex justify-center items-center hover:bg-green-500 hover:shadow-md transition-all"
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
        <button
          onClick={handleBack}
          className="p-2 ml-3 rounded-md bg-gray-400 text-white w-[120px] flex justify-center items-center hover:bg-red-600 hover:shadow-md transition-all"
        >
          Cancel
        </button>
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
            <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will Save Claim as Draft.<br/>
                            Please click 'Save' to submit the claim or 'Cancel' to close the dialog.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={confirmSave} className="bg-[#0077AC]">Save</AlertDialogAction>
                        <AlertDialogCancel onClick={cancelSave} className="bg-white">Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the selected claims? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={confirmDelete} className="bg-[#F83033]">Delete</AlertDialogAction>
                        <AlertDialogCancel onClick={cancelDelete} className="bg-white">Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
      </div>
    );
  }
  const allowedRoles = ["claimer"];

  export default withAuthorization(ClaimCreate, allowedRoles);
    