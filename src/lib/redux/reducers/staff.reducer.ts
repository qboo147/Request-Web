import { Staff } from '@/lib/schemas/staff.schema';
import { staff_API } from '@lib/utils/axios.config';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// #region EXTRA
// Deactivate 1 staff
export const activateStaff = createAsyncThunk<Staff, number, { rejectValue: string }>("staff/activateStaff",
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const staff = await staff_API.get(`/resource/staff/${staff_id}`);
      if (staff.data.active) {
        return rejectWithValue("Cannot activate active staff");
      }

      const res = await staff_API.put(`/resource/staff/${staff_id}`, { 
        ...staff.data,
        active: true, 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactivate multiple staff
export const activateStaffs = createAsyncThunk<Staff[], number[], { rejectValue: string }>("staff/activateStaffs",
  async (staff_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.get("/resource/staff");
      const staffs = res.data.data;
      const filteredStaffs: Staff[] = staffs.filter((staff: Staff) => staff_ids.includes(Number(staff.id)));

      if (filteredStaffs.some((staff) => staff.active)) {
        return rejectWithValue("Cannot activate active staff");
      }

      const deactivatedStaffs = await Promise.all(
        staff_ids.map(async (id) => {
          const staffData = filteredStaffs.find((staff) => staff.id === id);
          const res = await staff_API.put(`/resource/staff/${id}`, { 
            ...staffData,
            active: true, 
          });
          return res.data;
        })
      );

      return fulfillWithValue(deactivatedStaffs);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactivate 1 staff
export const deactivateStaff = createAsyncThunk<Staff, number, { rejectValue: string }>("staff/deactivateStaff",
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const staff = await staff_API.get(`/resource/staff/${staff_id}`);
      if (!staff.data.active) {
        return rejectWithValue("Cannot deactivate inactive staff");
      }

      const res = await staff_API.put(`/resource/staff/${staff_id}`, { 
        ...staff.data,
        active: false, 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactivate multiple staff
export const deactivateStaffs = createAsyncThunk<Staff[], number[], { rejectValue: string }>("staff/deactivateStaffs",
  async (staff_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.get("/resource/staff");
      const staffs = res.data.data;
      const filteredStaffs: Staff[] = staffs.filter((staff: Staff) => staff_ids.includes(Number(staff.id)));

      if (filteredStaffs.some((staff) => !staff.active)) {
        return rejectWithValue("Cannot deactivate inactive staff");
      }

      const deactivatedStaffs = await Promise.all(
        staff_ids.map(async (id) => {
          const staffData = filteredStaffs.find((staff) => staff.id === id);
          const res = await staff_API.put(`/resource/staff/${id}`, { 
            ...staffData, 
            active: false, 
          });
          return res.data;
        })
      );

      return fulfillWithValue(deactivatedStaffs);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Authorize staff
export const authorizeStaff = createAsyncThunk<number, number, { rejectValue: string }>("staff/authorizeStaff",
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.get(`/resource/pendingStaff/${staff_id}`);
      const staff = res.data;

      await staff_API.post("/resource/staff", { 
        ...staff, 
        department: "Temporary", 
        rank: "Newbie", 
        role: "claimer", 
        active: true, 
      });
      await staff_API.delete(`/resource/pendingStaff/${staff_id}`);

      return fulfillWithValue(staff_id);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Authorize staffs
export const authorizeStaffs = createAsyncThunk<number[], number[], { rejectValue: string }>("staff/authorizeStaffs",
  async (staff_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.get("/resource/pendingStaff");
      const staffs = res.data.data;
      const filteredStaffs: Staff[] = staffs.filter((staff: Staff) => staff_ids.includes(Number(staff.id)));

      await Promise.all(
        filteredStaffs.map(async (staff) => {
          await staff_API.post("/resource/staff", { 
            ...staff, 
            department: "Temporary", 
            rank: "Newbie", 
            role: "claimer", 
            active: true, 
          });
          await staff_API.delete(`/resource/pendingStaff/${staff.id}`);
        })
      );

      return fulfillWithValue(staff_ids);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// #region CRUD
// Get ALL staff
export const getAllStaff = createAsyncThunk<Staff[], void, { rejectValue: string }>("staff/getAllStaff", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
  try {
    const res = await staff_API.get("/resource/staff");

    return fulfillWithValue(res.data.data);
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// Get ALL pending staff
export const getAllPendingStaff = createAsyncThunk<Staff[], void, { rejectValue: string }>("staff/getAllPendingStaff", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.get("/resource/pendingStaff");

      return fulfillWithValue(res.data.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get 1 staff
export const getStaff = createAsyncThunk<Staff, number, { rejectValue: string }>("staff/getStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
  try {
    const res = await staff_API.get(`/resource/staff/${staff_id}`);

    return fulfillWithValue(res.data);
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

// Create staff
export const createStaff = createAsyncThunk<
  Staff,
  Staff,
  { rejectValue: string }
>(
  "staff/createStaff",
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.post("/resource/staff", { ...formData });

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update 1 staff
export const updateStaff = createAsyncThunk<
  Staff,
  { staff_id: number; formData: Staff },
  { rejectValue: string }
>(
  "staff/updateStaff",
  async ({ staff_id, formData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await staff_API.put(`/resource/staff/${staff_id}`, { ...formData });

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    error: "",
    message: "",
    isLoading: false,
    staff: [] as Staff[],
    currentStaff: null as Staff | null,
    totalStaff: 0,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // #region EXTRA states
    // ACTIVATE 1 STAFF
    builder
    .addCase(activateStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(activateStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error activating staff";
    })
    .addCase(activateStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.isLoading = false;
      state.message = "Staff activated";
      state.currentStaff = action.payload;

      const activatedStaff = action.payload;
      const index = state.staff.findIndex((staff) => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = activatedStaff;
      }
    })

    // ACTIVATE MULTIPLE STAFF
    .addCase(activateStaffs.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(activateStaffs.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error activating staff";
    })
    .addCase(activateStaffs.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.isLoading = false;
      state.message = `Activated ${action.payload.length.toString()} staff`;
      
      const activatedStaffs = action.payload;
      activatedStaffs.forEach((activatedStaff) => {
        const index = state.staff.findIndex((staff) => staff.id === activatedStaff.id);
        if (index !== -1) {
          state.staff[index] = activatedStaff;
        }
      })
    })

    // DEACTIVATE 1 STAFF
    .addCase(deactivateStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deactivateStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error deactivating staff";
    })
    .addCase(deactivateStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.isLoading = false;
      state.message = "Staff deactivated";
      state.currentStaff = action.payload;

      const deactivatedStaff = action.payload;
      const index = state.staff.findIndex((staff) => staff.id === deactivatedStaff.id);
      if (index !== -1) {
        state.staff[index] = deactivatedStaff;
      }
    })

    // DEACTIVATE MULTIPLE STAFF
    .addCase(deactivateStaffs.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deactivateStaffs.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error deactivating staff";
    })
    .addCase(deactivateStaffs.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.isLoading = false;
      state.message = `Deactivated ${action.payload.length.toString()} staff`;
      
      const deactivatedStaffs = action.payload;
      deactivatedStaffs.forEach((deactivatedStaff) => {
        const index = state.staff.findIndex((staff) => staff.id === deactivatedStaff.id);
        if (index !== -1) {
          state.staff[index] = deactivatedStaff;
        }
      })
    })

    // AUTHORIZE 1 STAFF
    .addCase(authorizeStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(authorizeStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error authorizing staff";
    })
    .addCase(authorizeStaff.fulfilled, (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.message = "Staff authorized";
      state.staff = state.staff.filter((staff) => staff.id !== action.payload);
    })

    // AUTHORIZE MULTIPLE STAFF
    .addCase(authorizeStaffs.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(authorizeStaffs.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error authorizing staff";
    })
    .addCase(authorizeStaffs.fulfilled, (state, action: PayloadAction<number[]>) => {
      state.isLoading = false;
      state.message = `${action.payload.length} staff authorized`;
      state.staff = state.staff.filter((staff) => !action.payload.includes(staff.id));
    })
    // #endregion

    // #region CRUD states
    // GET ALL STAFF
    .addCase(getAllStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving staff";
    })
    .addCase(getAllStaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.isLoading = false;
      state.staff = action.payload;
      state.totalStaff = action.payload.length;
    })

    // GET ALL PENDING STAFF
    .addCase(getAllPendingStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllPendingStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving staff";
    })
    .addCase(getAllPendingStaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
      state.isLoading = false;
      state.staff = action.payload;
      state.totalStaff = action.payload.length;
    })
    
    // GET 1 STAFF
    .addCase(getStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving staff";
    })
    .addCase(getStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.isLoading = false;
      state.currentStaff = action.payload;
    })
    
    // CREATE STAFF
    .addCase(createStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error creating staff";
    })
    .addCase(createStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.isLoading = false;
      state.message = "Staff created";
      state.staff.push(action.payload);
      state.totalStaff = state.staff.length;
    })
    
    // UPDATE 1 STAFF
    .addCase(updateStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error updating staff";
    })
    .addCase(updateStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
      state.isLoading = false;
      state.message = "Staff updated";

      const updatedStaff = action.payload;
      const index = state.staff.findIndex((staff) => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = updatedStaff;
      }
    });
    // #endregion
  },
});

export const { clearMessages } = staffSlice.actions;
export const staffReducer = staffSlice.reducer;
