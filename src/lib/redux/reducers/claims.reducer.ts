/* eslint-disable @typescript-eslint/no-explicit-any */
import { Claim } from '@/lib/schemas/claim.schema';
import { projects_claims_API } from '@lib/utils/axios.config';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// #region ALL
export const getAllClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getAllClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllClaimsByStaff = createAsyncThunk<Claim[], number, { rejectValue: string }>("claim/getAllClaimsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.staff.id === staff_id);

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region DRAFT
export const getDraftClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getDraftClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "draft");

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDraftClaimsByStaff = createAsyncThunk<Claim[], number, { rejectValue: string }>("claim/getDraftClaimsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "draft" && claim.staff.id === staff_id);

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region PENDING
export const getPendingClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getPendingClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "pending");

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPendingClaimsByStaff = createAsyncThunk<Claim[], number, { rejectValue: string }>("claim/getPendingClaimsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const pendingClaims = res.data.filter((claim: Claim) => claim.status === "pending" && claim.staff.id === staff_id);

      return fulfillWithValue(pendingClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region APPROVED
export const getApprovedClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getApprovedClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "approved");

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getApprovedClaimsByStaff = createAsyncThunk<Claim[], number, { rejectValue: string }>("claim/getApprovedClaimsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "approved" && claim.staff.id === staff_id);

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region PAID
export const getPaidClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getPaidClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "paid");

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getPaidClaimsByStaff = createAsyncThunk<Claim[], number, { rejectValue: string }>("claim/getPaidClaimsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "paid" && claim.staff.id === staff_id);

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region APPROVED-PAID
export const getApprovedPaidClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getApprovedPaidClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const pendingClaims = res.data.filter((claim: Claim) => claim.status === "approved" || claim.status === "paid");

      return fulfillWithValue(pendingClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region REJECTED-CANCELLED
export const getRejectedCancelledClaims = createAsyncThunk<Claim[], void, { rejectValue: string }>("claim/getAllRejectedCancelledClaims", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => claim.status === "rejected" || claim.status === "cancelled");

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getRejectedCancelledClaimsByStaff = createAsyncThunk<Claim[], number, { rejectValue: string }>("claim/getRejectedCancelledClaimsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data.filter((claim: Claim) => 
        (claim.status === "rejected" || claim.status === "cancelled") && 
        claim.staff.id === staff_id
      );

      return fulfillWithValue(claims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region EXTRA
// DRAFT ====> PENDING: SUBMIT
export const submitClaim = createAsyncThunk<Claim, { claim_id?: number, formData: Claim }, { rejectValue: string }>("claim/submitClaim",
  async ({ claim_id, formData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "draft") {
        return rejectWithValue("Claim status must be \"draft\"");
      } else if (claim.status === 404) {
        await projects_claims_API.post("/api/claims", formData);
      }

      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        ...formData,
        status: "pending", 
        updated_at: new Date().toISOString(), 
      });
      console.log(formData)
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const submitClaims = createAsyncThunk<Claim[], number[], { rejectValue: string }>(
  "claim/submitClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "draft")) {
        return rejectWithValue("All claims' status must be \"draft\"");
      }

      const submittedClaims = await Promise.all(
        claim_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/claims/${id}`, { 
            status: "pending", 
            updated_at: new Date().toISOString(),
          });
          return res.data;
        })
      );

      return fulfillWithValue(submittedClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// PENDING ====> DRAFT: RETURN
export const returnClaim = createAsyncThunk<Claim, number, { rejectValue: string }>("claim/returnClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "pending") {
        return rejectWithValue("Claim status must be \"pending\"");
      }

      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        status: "draft", 
        updated_at: new Date().toISOString(), 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const returnClaims = createAsyncThunk<Claim[], number[], { rejectValue: string }>(
  "claim/returnClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "pending")) {
        return rejectWithValue("All claims' status must be \"pending\"");
      }

      const returnedClaims = await Promise.all(
        claim_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/claims/${id}`, { 
            status: "draft", 
            updated_at: new Date().toISOString(), 
          });
          return res.data;
        })
      );

      return fulfillWithValue(returnedClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// PENDING ====> APPROVED: APPROVE
export const approveClaim = createAsyncThunk<Claim, number, { rejectValue: string }>("claim/approveClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "pending") {
        return rejectWithValue("Claim status must be \"pending\"");
      }

      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        status: "approved", 
        updated_at: new Date().toISOString(), 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const approveClaims = createAsyncThunk<Claim[], number[], { rejectValue: string }>(
  "claim/approveClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "pending")) {
        return rejectWithValue("All claims' status must be \"pending\"");
      }

      const approvedClaims = await Promise.all(
        claim_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/claims/${id}`, { 
            status: "approved", 
            updated_at: new Date().toISOString(),
          });
          return res.data;
        })
      );

      return fulfillWithValue(approvedClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// APPROVED ====> PAID: PAID
export const paidClaim = createAsyncThunk<Claim, number, { rejectValue: string }>("claim/paidClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "approved") {
        return rejectWithValue("Claim status must be \"approved\"");
      }

      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        status: "paid", 
        updated_at: new Date().toISOString(), 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const paidClaims = createAsyncThunk<Claim[], number[], { rejectValue: string }>(
  "claim/paidClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "approved")) {
        return rejectWithValue("All claims' status must be \"approved\"");
      }

      const paidClaims = await Promise.all(
        claim_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/claims/${id}`, { 
            status: "paid",
            updated_at: new Date().toISOString(), 
          });
          return res.data;
        })
      );

      return fulfillWithValue(paidClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


// PENDING ====> REJECT: REJECT
export const rejectClaim = createAsyncThunk<Claim, number, { rejectValue: string }>("claim/rejectClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "pending") {
        return rejectWithValue("Claim status must be \"pending\"");
      }

      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        status: "rejected", 
        updated_at: new Date().toISOString(), 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const rejectClaims = createAsyncThunk<Claim[], number[], { rejectValue: string }>("claim/rejectClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "pending")) {
        return rejectWithValue("All claims' status must be \"pending\"");
      }

      const rejectedClaims = await Promise.all(
        claim_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/claims/${id}`, { 
            status: "rejected",
            updated_at: new Date().toISOString(), 
          });
          return res.data;
        })
      );

      return fulfillWithValue(rejectedClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// DRAFT ====> CANCELLED: CANCEL
export const cancelClaim = createAsyncThunk<Claim, number, { rejectValue: string }>("claim/cancelClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "draft") {
        return rejectWithValue("Claim status must be \"draft\"");
      }

      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        status: "cancelled", 
        updated_at: new Date().toISOString(), 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const cancelClaims = createAsyncThunk<Claim[], number[], { rejectValue: string }>("claim/cancelClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "draft")) {
        return rejectWithValue("All claims' status must be \"draft\"");
      }

      const cancelledClaims = await Promise.all(
        claim_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/claims/${id}`, { 
            status: "cancelled", 
            updated_at: new Date().toISOString(), 
          });
          return res.data;
        })
      );

      return fulfillWithValue(cancelledClaims);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region CRUD
export const getClaim = createAsyncThunk<Claim, number, { rejectValue: string }>("claim/getClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get(`/api/claims/${claim_id}`);

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createClaim = createAsyncThunk<Claim, Claim, { rejectValue: string }>("claim/createClaim",
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.post("/api/claims", { 
        ...formData, 
        status: "draft", 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(), 
       });
       console.log(formData)
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateClaim = createAsyncThunk<Claim, { claim_id: number, formData: Claim }, { rejectValue: string }>("claim/updateClaim",
  async ({ claim_id, formData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.put(`/api/claims/${claim_id}`, { 
        ...formData, 
        updated_at: new Date().toISOString(), 
      });

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteClaim = createAsyncThunk<string, number, { rejectValue: string }>("claim/deleteClaim",
  async (claim_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const claim = await projects_claims_API.get(`/api/claims/${claim_id}`);
      if (claim.data.status !== "draft") {
        return rejectWithValue("Claim status must be \"draft\"");
      }

      await projects_claims_API.delete(`/api/claims/${claim_id}`);
      return fulfillWithValue(claim_id.toString());
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteClaims = createAsyncThunk<string[], number[], { rejectValue: string }>("claim/deleteClaims",
  async (claim_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/claims");
      const claims = res.data;
      const filteredClaims: Claim[] = claims.filter((claim: Claim) => claim_ids.includes(Number(claim.id)));

      if (filteredClaims.some((claim) => claim.status !== "draft")) {
        return rejectWithValue("All claims' status must be \"draft\"");
      }

      await Promise.all(
        claim_ids.map(async (id) => await projects_claims_API.delete(`/api/claims/${id}`))
      );

      return fulfillWithValue(claim_ids.map((id) => id.toString()));
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

const claimSlice = createSlice({
  name: "claim",
  initialState: {
    error: "",
    message: "",
    isLoading: false,
    claims: [] as Claim[],
    currentClaim: null as Claim | null,
    totalClaims: 0,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = "";
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    // #region ALL states
    // GET ALL CLAIMS
    builder
    .addCase(getAllClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getAllClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // GET CLAIMS BY STAFF
    .addCase(getAllClaimsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllClaimsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getAllClaimsByStaff.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region DRAFT states
    // GET ALL DRAFT CLAIMS
    .addCase(getDraftClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getDraftClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getDraftClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // GET DRAFT CLAIMS BY STAFF
    .addCase(getDraftClaimsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getDraftClaimsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getDraftClaimsByStaff.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region PENDING states
    // GET ALL PENDING CLAIMS
    .addCase(getPendingClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getPendingClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getPendingClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // GET PENDING CLAIMS BY STAFF
    .addCase(getPendingClaimsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getPendingClaimsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getPendingClaimsByStaff.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region APPROVED states
    // GET ALL APPROVED CLAIMS
    .addCase(getApprovedClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getApprovedClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getApprovedClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // GET APPROVED CLAIMS BY STAFF
    .addCase(getApprovedClaimsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getApprovedClaimsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getApprovedClaimsByStaff.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region PAID states
    // GET ALL PAID CLAIMS
    .addCase(getPaidClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getPaidClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getPaidClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // GET PAID CLAIMS BY STAFF
    .addCase(getPaidClaimsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getPaidClaimsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getPaidClaimsByStaff.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region APPROVED-PAID states
    // GET ALL APPROVED-PAID CLAIMS
    .addCase(getApprovedPaidClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getApprovedPaidClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getApprovedPaidClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region REJECTED-CANCELLED states
    // GET ALL REJECTED-CANCELLED CLAIMS
    .addCase(getRejectedCancelledClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getRejectedCancelledClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getRejectedCancelledClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // GET REJECTED-CANCELLED CLAIMS BY STAFF
    .addCase(getRejectedCancelledClaimsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getRejectedCancelledClaimsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claims";
    })
    .addCase(getRejectedCancelledClaimsByStaff.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.claims = action.payload;
      state.totalClaims = action.payload.length;
    })
    // #endregion

    // #region EXTRA states
    // DRAFT ====> PENDING: SUBMIT
    .addCase(submitClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(submitClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error submitting claim";
    })
    .addCase(submitClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim submitted";
      state.currentClaim = action.payload;
    
      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })
    .addCase(submitClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(submitClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error submitting claims";
    })
    .addCase(submitClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.message = `Submitted ${action.payload.length} claims`;
    
      const submittedClaims = action.payload;
      submittedClaims.forEach((submittedClaim) => {
        const index = state.claims.findIndex((claim) => claim.id === submittedClaim.id);
        if (index !== -1) {
          state.claims[index] = submittedClaim;
        }
      });
    })

    // PENDING ====> DRAFT: RETURN
    .addCase(returnClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(returnClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error returning claim";
    })
    .addCase(returnClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim returned";
      state.currentClaim = action.payload;
      
      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })
    .addCase(returnClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(returnClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error returning claims";
    })
    .addCase(returnClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.message = `Returned ${action.payload.length} claims`;
    
      const returnedClaims = action.payload;
      returnedClaims.forEach((returnedClaim) => {
        const index = state.claims.findIndex((claim) => claim.id === returnedClaim.id);
        if (index !== -1) {
          state.claims[index] = returnedClaim;
        }
      });
    })
    
    // PENDING ====> APPROVED: APPROVE
    .addCase(approveClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(approveClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error approving claim";
    })
    .addCase(approveClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim approved";
      state.currentClaim = action.payload;

      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })
    .addCase(approveClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(approveClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error approving claims";
    })
    .addCase(approveClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.message = `Approved ${action.payload.length} claims`;
    
      const approvedClaims = action.payload;
      approvedClaims.forEach((approvedClaim) => {
        const index = state.claims.findIndex((claim) => claim.id === approvedClaim.id);
        if (index !== -1) {
          state.claims[index] = approvedClaim;
        }
      });
    })
    
    // APPROVED ====> PAID: PAID
    .addCase(paidClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(paidClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error paying claim";
    })
    .addCase(paidClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim paid";
      state.currentClaim = action.payload
    
      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })
    .addCase(paidClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(paidClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error paying claims";
    })
    .addCase(paidClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.message = `Paid ${action.payload.length} claims`;
    
      const paidClaims = action.payload;
      paidClaims.forEach((paidClaim) => {
        const index = state.claims.findIndex((claim) => claim.id === paidClaim.id);
        if (index !== -1) {
          state.claims[index] = paidClaim;
        }
      });
    })

    // PENDING ====> REJECT: REJECT
    .addCase(rejectClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(rejectClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error rejecting claim";
    })
    .addCase(rejectClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim rejected";
      state.currentClaim = action.payload;
    
      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })
    .addCase(rejectClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(rejectClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error rejecting claims";
    })
    .addCase(rejectClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.message = `Rejected ${action.payload.length} claims`;
    
      const rejectedClaims = action.payload;
      rejectedClaims.forEach((rejectedClaim) => {
        const index = state.claims.findIndex((claim) => claim.id === rejectedClaim.id);
        if (index !== -1) {
          state.claims[index] = rejectedClaim;
        }
      });
    })

    // DRAFT ====> CANCELLED: CANCEL
    .addCase(cancelClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(cancelClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error cancelling claim";
    })
    .addCase(cancelClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim cancelled";
      state.currentClaim = action.payload;
    
      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })
    .addCase(cancelClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(cancelClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error cancelling claims";
    })
    .addCase(cancelClaims.fulfilled, (state, action: PayloadAction<Claim[]>) => {
      state.isLoading = false;
      state.message = `Cancelled ${action.payload.length} claims`;
    
      const cancelledClaims = action.payload;
      cancelledClaims.forEach((cancelledClaim) => {
        const index = state.claims.findIndex((claim) => claim.id === cancelledClaim.id);
        if (index !== -1) {
          state.claims[index] = cancelledClaim;
        }
      });
    })
    // #endregion
    
    // #region CRUD states
    // GET 1 CLAIM
    .addCase(getClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving claim";
    })
    .addCase(getClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.currentClaim = action.payload;
    })
    
    // CREATE CLAIM
    .addCase(createClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error creating claim";
    })
    .addCase(createClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim created";
      state.claims.push(action.payload);
      state.totalClaims = state.claims.length;
    })
    
    // UPDATE 1 CLAIM
    .addCase(updateClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error creating claim";
    })
    .addCase(updateClaim.fulfilled, (state, action: PayloadAction<Claim>) => {
      state.isLoading = false;
      state.message = "Claim updated";
      
      const index = state.claims.findIndex((claim) => claim.id === action.payload.id);
      if (index !== -1) {
        state.claims[index] = action.payload;
      }
    })

    // DELETE 1 CLAIM
    .addCase(deleteClaim.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteClaim.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error deleting claim";
    })
    .addCase(deleteClaim.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = "Claim deleted";
      state.claims = state.claims.filter((claim) => claim.id !== action.payload);
      state.totalClaims = state.claims.length;
    })

    // DELETE CLAIMS
    .addCase(deleteClaims.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteClaims.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error deleting claims";
    })
    .addCase(deleteClaims.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.isLoading = false;
      state.message = "Claims deleted";
      state.claims = state.claims.filter((claim) => !action.payload.includes(String(claim.id)));
      state.totalClaims = state.claims.length;
    });
    // #endregion
  },
});

export const { clearMessages } = claimSlice.actions;
export const claimReducer = claimSlice.reducer;
