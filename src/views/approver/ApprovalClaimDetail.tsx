/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Modal } from "antd";
import { Claim } from "@/lib/schemas/claim.schema";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/redux.config";
import { updateClaim } from "@/lib/redux/reducers/claims.reducer";
import toast from "react-hot-toast";
import withAuthorization from "@/lib/utils/withAuthorization";
const ApprovalClaimDetail = () => {
  const location = useLocation();
  const nav = useNavigate();
  const { claim } = location.state as { claim: Claim };
  const [status, setstatus] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const handleUpdateClaim = async () => {
    const claim_id = claim.id as any; // Example claim ID
    if (claim.staff) {
      const formData = {
        // The data you want to update
        status: status,
        staff: claim.staff,
        project: claim.project,
        records: claim.records,
        remarks: status == "return" ? remarktodatabase : claim.remarks,
        total_money: claim.total_money,
        created_at: claim.created_at,
        updated_at: claim.updated_at,
        id: claim.id,
      };

      console.log(formData);
      await dispatch(updateClaim({ claim_id, formData }));
    }

    //ko load bang claimstate ma dung mang khac => luc change claim state ko thay doi ma phai reload
    setTimeout(() => {
      nav("/approver/vetting");
    }, 1000);
    console.log(remarktodatabase);
  };

  if (!claim) {
    return <div>No claim data available</div>;
  }

  //modal approve
  const [openApprove, setOpenApprove] = useState(false);
  const showApprove = () => {
    setOpenApprove(true);
  };

  const hideApprove = () => {
    setOpenApprove(false);
  };
  const confirmApprove = () => {
    hideApprove();
    toast.success("Approve success", {
      position: "top-right",
    });
    handleUpdateClaim();
  };

  //delete 1 claim
  const [openDelete, setOpenDelete] = useState(false);
  const showDelete = () => {
    setOpenDelete(true);
  };

  const hideDelete = () => {
    setOpenDelete(false);
  };
  const confirmDelete = () => {
    hideDelete();
    toast.success("Reject success", {
      position: "top-right",
    });

    handleUpdateClaim();
  };

  //return 1 claim with remark
  const [openReturn1, setOpenReturn1] = useState(false);
  const showReturn1 = () => {
    setOpenReturn1(true);
  };
  const hideReturn1 = () => {
    setOpenReturn1(false);
    setremarkinput("");
    setshowalert(false);
    setremarked(false);
  };
  const confirmReturn1 = () => {
    if (!remarked) {
      setshowalert(true);
    } else {
      hideReturn1();
      showReturn2();
    }
  };

  const [remarked, setremarked] = useState(false);
  const [remarkinput, setremarkinput] = useState("");
  //do remark input hide modal se lam moi ve ""
  const [remarktodatabase, setremarktodatabase] = useState("");
  const [showalert, setshowalert] = useState(false);

  //confirm return 1 claim
  const [openReturn2, setOpenReturn2] = useState(false);
  const showReturn2 = () => {
    setOpenReturn2(true);
  };

  const hideReturn2 = () => {
    setOpenReturn2(false);
  };
  const confirmReturn2 = () => {
    hideReturn2();

    toast.success("Return success", {
      position: "top-right",
    });
    handleUpdateClaim();
  };

  return (
    <div className="p-4 lg:px-20">
      {/* modal return with remark */}
      <Modal
        title="Return Request"
        open={openReturn1}
        onOk={confirmReturn1}
        onCancel={hideReturn1}
      >
        <div className="flex flex-row">
          <p className="mb-2.5 mr-0.75">Remark</p>
          <p className="text-red-500">*</p>
        </div>

        <Input
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              confirmReturn1();
            }
          }}
          value={remarkinput}
          onChange={(e) => {
            setremarkinput(e.target.value);
            setremarktodatabase(e.target.value);
            if (e.target.value == "") {
              setremarked(false);
            } else {
              setremarked(true);
            }
          }}
        />

        {showalert ? (
          <p style={{ color: "red" }}>
            Please input your remarks in order to return Claim.
          </p>
        ) : (
          <></>
        )}
      </Modal>
      {/* modal confirm return 1 claim*/}
      <Modal
        title="Confirm"
        open={openReturn2}
        onOk={confirmReturn2}
        onCancel={hideReturn2}
      >
        Are you sure want to continue this action?
      </Modal>
      {/* modal approve 1 claim*/}
      <Modal
        title="Confirm"
        open={openApprove}
        onOk={confirmApprove}
        onCancel={hideApprove}
      >
        This action will approve Claim
        <div></div>
        Please click ‘Ok’ to approve the claim or ‘Cancel’ to close the dialog.
      </Modal>
      {/* modal rejecjt 1 claim*/}
      <Modal
        title="Confirm"
        open={openDelete}
        onOk={confirmDelete}
        onCancel={hideDelete}
      >
        This action will reject Claim
        <div></div>
        Please click ‘Ok’ to reject the claim or ‘Cancel’ to close the dialog.
      </Modal>
      <div className="rounded bg-white shadow-lg p-4">
        <h2 className="text-xl mb-4">
          <Link to="/approver/vetting">
            <div className="flex items-center mt-2 ml-2">
              <img src="/images/back.svg" alt="Back" className="w-6 h-6" />
              <p className="ml-4 text-[20px]/[20px] font-medium">
                Back to For My Vetting
              </p>
            </div>
          </Link>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 font-medium px-48 pt-28 pb-28">
          <div className="flex flex-col space-y-4">
            <label>
              <strong className="text-gray-700">Claim ID</strong>
              <Input
                type="text"
                value={claim.id}
                disabled
                className="bg-gray-300 mt-1 rounded-lg"
              />
            </label>
            <label>
              <strong className="text-gray-700">Project Name</strong>
              <Input
                type="text"
                value={claim.project.name}
                disabled
                className="bg-gray-300 mt-1 rounded-lg"
              />
            </label>
            <label>
              <strong className="text-gray-700">Total Hours (h)</strong>
              <Input
                type="text"
                value={claim.records.length}
                disabled
                className="bg-gray-300 mt-1 rounded-lg"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-4">
            <label>
              <strong className="text-gray-700">Staff Name</strong>
              <Input
                type="text"
                value={claim.staff.name}
                disabled
                className="bg-gray-300 mt-1 rounded-lg"
              />
            </label>
            <div className="flex space-x-4">
              <label className="flex-1">
                <strong className="text-gray-700">From</strong>
                <Input
                  type="text"
                  value={claim.project.from}
                  disabled
                  className="bg-gray-300 mt-1 rounded-lg"
                />
              </label>
              <label className="flex-1">
                <strong className="text-gray-700">To</strong>
                <Input
                  type="text"
                  value={claim.project.to}
                  disabled
                  className="bg-gray-300 mt-1 rounded-lg"
                />
              </label>
            </div>
            <label>
              <strong className="text-gray-700">Total Amount (USD)</strong>
              <Input
                type="text"
                value={claim.total_money
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                disabled
                className="bg-gray-300 mt-1 rounded-lg"
              />
            </label>
          </div>
        </div>

        <div className="w-full flex justify-end">
          <Button
            className="mr-5 text-lg text-white bg-[#007ACC] w-[160px] p-5"
            onClick={() => {
              showApprove();

              setstatus("approved");
            }}
          >
            Approve Claims
          </Button>
          <Button
            className="mr-5 text-lg w-[160px] p-5"
            onClick={() => {
              showReturn1();

              setstatus("return");
            }}
          >
            Return Claims
          </Button>
          <Button
            className="mr-5 mb-5 text-lg text-white bg-[#A30D11] w-[160px] p-5"
            onClick={() => {
              showDelete();

              setstatus("rejected");
            }}
          >
            Reject Claims
          </Button>
        </div>
      </div>
    </div>
  );
};

const allowedRoles = ["approver"];

export default withAuthorization(ApprovalClaimDetail, allowedRoles);
