import { radialChartConfig } from "@lib/utils/chart.config";
import { ChartConfig } from "@components/ui/chart";
import { Claim } from "@lib/schemas/claim.schema";
import { projects_claims_API, staff_API } from "@lib/utils/axios.config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Staff } from "@/lib/schemas/staff.schema";
import { Project } from "@/lib/schemas/project.schema";

interface TotalsCount {
  waiting: number;
  accepted: number; 
  declined: number; 
  projects: number; 
  staff: number;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// #region AGGREGATE DATA
const aggregateClaimsByStatus = (data: Claim[], chartConfig: ChartConfig) => {
  const statusCount = data.reduce((acc: Record<string, number>, curr: Claim) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
    fill: chartConfig[status]?.color,
  }));
};

const aggregateClaimsByMonth = (data: Claim[]) => {
  const monthTotals = Array(monthNames.length).fill(null).map(() => ({
    draft: 0,
    pending: 0,
    approved: 0,
    paid: 0,
    rejected: 0,
    cancelled: 0,
  }));

  data.forEach((claim) => {
    const monthIndex = new Date(claim.updated_at).getMonth();

    switch (claim.status) {
      case 'draft':
        monthTotals[monthIndex].draft += 1;
        break;
      case 'pending':
        monthTotals[monthIndex].pending += 1;
        break;
      case 'approved':
        monthTotals[monthIndex].approved += 1;
        break;
      case 'paid':
        monthTotals[monthIndex].paid += 1;
        break;
      case 'rejected':
        monthTotals[monthIndex].rejected += 1;
        break;
      case 'cancelled':
        monthTotals[monthIndex].cancelled += 1;
        break;
    }
  });

  return monthNames.map((month, index) => ({
    month: month,
    ...monthTotals[index],
  }));
};

const aggregateClaimsByCurrentMonth = (data: Claim[]) => {
  const currentMonthIndex = new Date().getMonth();
  const currentYearIndex = new Date().getFullYear();
  const totals = { waiting: 0, accepted: 0, declined: 0 };

  data.forEach((claim) => {
    const monthIndex = new Date(claim.updated_at).getMonth();
    const yearIndex = new Date(claim.updated_at).getFullYear();

    if (monthIndex === currentMonthIndex && yearIndex === currentYearIndex) {
      switch (claim.status) {
        case 'draft':
        case 'pending':
          totals.waiting += 1;
          break;
        case 'approved':
        case 'paid':
          totals.accepted += 1;
          break;
        case 'rejected':
        case 'cancelled':
          totals.declined += 1;
          break;
      }
    }
  });

  return totals;
};

const aggregateStaffProjectsByMonth = (staffData: Staff[], projectsData: Project[]) => {
  const monthTotals = monthNames.map((month) => ({
    month,
    staff: 0,
    projects: 0,
  }));

  staffData.forEach((staff) => {
    const monthIndex = new Date(staff.updatedAt).getMonth();
    monthTotals.slice(monthIndex).forEach((total) => total.staff += 1);
  });

  projectsData.forEach((project) => {
    const monthIndex = new Date(project.from).getMonth();
    monthTotals.slice(monthIndex).forEach((total) => total.projects += 1);
  });

  return monthTotals;
};
// #endregion

// #region GET DATA
export const getDashboardData = createAsyncThunk<{ radialChartData: ClaimsByStatus, barChartData: ClaimsByMonth, areaChartData: StaffProjectsByMonth, totalData: TotalsCount }, void, { rejectValue: string }>("dashboard/getDashboardData",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const [claimsResponse, projectsResponse, staffResponse] = await Promise.all([
        projects_claims_API.get("/api/claims"),
        projects_claims_API.get("/api/projects"),
        staff_API.get("/resource/staff"),
      ]);

      const radialChartData = aggregateClaimsByStatus(claimsResponse.data, radialChartConfig);
      const barChartData = aggregateClaimsByMonth(claimsResponse.data);
      const areaChartData = aggregateStaffProjectsByMonth(staffResponse.data.data, projectsResponse.data);

      const claimsCount = aggregateClaimsByCurrentMonth(claimsResponse.data);
      const projectCount = projectsResponse.data.length;
      const staffCount = staffResponse.data.data.length;

      return fulfillWithValue({ radialChartData, barChartData, areaChartData, 
        totalData: { 
          ...claimsCount, 
          projects: projectCount, 
          staff: staffCount,
        } 
      });
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    error: "",
    message: "",
    isLoading: false,
    radialChartData: [] as ClaimsByStatus,
    barChartData: [] as ClaimsByMonth,
    areaChartData: [] as StaffProjectsByMonth,
    totalWaiting: 0,
    totalAccepted: 0,
    totalDeclined: 0,
    totalClaims: 0,
    totalProjects: 0,
    totalStaff: 0,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = "";
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    // GET DASHBOARD DATA
    builder
    .addCase(getDashboardData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getDashboardData.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving dashboard data";
    })
    .addCase(getDashboardData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.radialChartData = action.payload.radialChartData;
      state.barChartData = action.payload.barChartData;
      state.areaChartData = action.payload.areaChartData;

      state.totalWaiting = action.payload.totalData.waiting;
      state.totalAccepted = action.payload.totalData.accepted;
      state.totalDeclined = action.payload.totalData.declined;

      state.totalClaims = action.payload.radialChartData.reduce((sum, item) => sum + item.value, 0);
      state.totalProjects = action.payload.totalData.projects;
      state.totalStaff = action.payload.totalData.staff;
    });
  },
});

export type ClaimsByStatus = ReturnType<typeof aggregateClaimsByStatus>;
export type ClaimsByMonth = ReturnType<typeof aggregateClaimsByMonth>;
export type ClaimsByCurrentMonth = ReturnType<typeof aggregateClaimsByCurrentMonth>;
export type StaffProjectsByMonth = ReturnType<typeof aggregateStaffProjectsByMonth>;

export const { clearMessages } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;