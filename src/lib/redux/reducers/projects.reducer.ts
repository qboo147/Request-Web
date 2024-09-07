import { Project } from '@/lib/schemas/project.schema';
import { projects_claims_API, staff_API } from '@lib/utils/axios.config';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// #region EXTRA
// Deactivate 1 project
export const activateProject = createAsyncThunk<Project, number, { rejectValue: string }>("project/activateProject", 
  async (project_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const project = await projects_claims_API.get("/api/projects");
      if (project.data.active) {
        return rejectWithValue("Cannot activate active project");
      }

      const res = await projects_claims_API.put(`/api/projects/${project_id}`, { 
        active: true, 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactivate multiple projects
export const activateProjects = createAsyncThunk<Project[], number[], { rejectValue: string }>("project/activateProjects", 
  async (project_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/projects");
      const projects = res.data;
      const filteredProjects: Project[] = projects.filter((project: Project) => project_ids.includes(Number(project.id)));

      if (filteredProjects.some((project) => project.active)) {
        return rejectWithValue("Cannot activate active projects");
      }

      const deactivatedProjects = await Promise.all(
        project_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/projects/${id}`, { 
            active: true, 
          });
          return res.data;
        })
      );

      return fulfillWithValue(deactivatedProjects);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactivate 1 project
export const deactivateProject = createAsyncThunk<Project, number, { rejectValue: string }>("project/deactivateProject", 
  async (project_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const project = await projects_claims_API.get("/api/projects");
      if (project.data.active === false) {
        return rejectWithValue("Cannot deactivate inactive project");
      }

      const res = await projects_claims_API.put(`/api/projects/${project_id}`, { 
        active: false, 
      });
      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Deactivate multiple projects
export const deactivateProjects = createAsyncThunk<Project[], number[], { rejectValue: string }>("project/deactivateProjects", 
  async (project_ids, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/projects");
      const projects = res.data;
      const filteredProjects: Project[] = projects.filter((project: Project) => project_ids.includes(Number(project.id)));

      if (filteredProjects.some((project) => !project.active)) {
        return rejectWithValue("Cannot deactivate inactive projects");
      }

      const deactivatedProjects = await Promise.all(
        project_ids.map(async (id) => {
          const res = await projects_claims_API.put(`/api/projects/${id}`, { 
            active: false, 
          });
          return res.data;
        })
      );

      return fulfillWithValue(deactivatedProjects);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// #endregion

// Get ALL projects
export const getAllProjects = createAsyncThunk<Project[], void, { rejectValue: string }>("project/getAllProjects", 
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/projects");

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get ALL projects with staff
export const getAllProjectsByStaff = createAsyncThunk<Project[], number, { rejectValue: string }>("project/getAllProjectsByStaff", 
  async (staff_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get("/api/projects");
      const projects: Project[] = res.data;
      
      const staffResponse = await staff_API.get(`/resource/staff/${staff_id}`);
      const staffName = staffResponse.data.name;

      const filteredProjects = projects.filter((project) => {
        return (
          project.project_manager === staffName ||
          project.quality_assurance === staffName ||
          project.technical_lead.includes(staffName) ||
          project.business_analyst.includes(staffName) ||
          project.developers.includes(staffName) ||
          project.testers.includes(staffName) ||
          project.technical_consultant.includes(staffName)
        );
      });

      return fulfillWithValue(filteredProjects);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get 1 project
export const getProject = createAsyncThunk<Project, number, { rejectValue: string }>("project/getProject",
  async (project_id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.get(`/api/projects/${project_id}`);

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create project
export const createProject = createAsyncThunk<Project, Project, { rejectValue: string }>("project/createProject", 
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.post("/api/projects", { ...formData });

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update 1 project
export const updateProject = createAsyncThunk<Project, { project_id: number, formData: Project }, { rejectValue: string }>("project/updateProject", 
  async ({ project_id, formData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const res = await projects_claims_API.put(`/api/projects/${project_id}`, { ...formData });

      return fulfillWithValue(res.data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    error: "",
    message: "",
    isLoading: false,
    projects: [] as Project[],
    currentProject: null as Project | null,
    projectByStaff: [] as Project[],
    totalProjects: 0,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    // #region EXTRA states
    // ACTIVATE 1 PROJECT
    builder
    .addCase(activateProject.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(activateProject.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error activating project";
    })
    .addCase(activateProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.message = "Project deactivated";
      state.currentProject = action.payload;

      const index = state.projects.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    })

    // ACTIVATE PROJECTS
    .addCase(activateProjects.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(activateProjects.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error activating project";
    })
    .addCase(activateProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
      state.isLoading = false;
      state.message = `Deactivated ${action.payload.length.toString()} projects`;
      
      const activatedProjects = action.payload;
      activatedProjects.forEach((activatedProject) => {
        const index = state.projects.findIndex((project) => project.id === activatedProject.id);
        if (index !== -1) {
          state.projects[index] = activatedProject;
        }
      });
    })

    // DEACTIVATE 1 PROJECT
    .addCase(deactivateProject.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deactivateProject.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error deactivating project";
    })
    .addCase(deactivateProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.message = "Project deactivated";
      state.currentProject = action.payload;

      const index = state.projects.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    })

    // DEACTIVATE PROJECTS
    .addCase(deactivateProjects.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deactivateProjects.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error deactivating project";
    })
    .addCase(deactivateProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
      state.isLoading = false;
      state.message = `Deactivated ${action.payload.length.toString()} projects`;
      
      const deactivatedProjects = action.payload;
      deactivatedProjects.forEach((deactivatedProject) => {
        const index = state.projects.findIndex((project) => project.id === deactivatedProject.id);
        if (index !== -1) {
          state.projects[index] = deactivatedProject;
        }
      });
    })
    // #endregion

    // #region CRUD states
    // GET ALL PROJECTS
    .addCase(getAllProjects.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllProjects.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving projects";
    })
    .addCase(getAllProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
      state.isLoading = false;
      state.projects = action.payload;
      state.totalProjects = action.payload.length;
    })

    // GET ALL PROJECTS WITH STAFF
    .addCase(getAllProjectsByStaff.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllProjectsByStaff.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving projects by staff";
    })
    .addCase(getAllProjectsByStaff.fulfilled, (state, action: PayloadAction<Project[]>) => {
      state.isLoading = false;
      state.projectByStaff = action.payload;
    })

    // GET 1 PROJECT
    .addCase(getProject.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getProject.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error retrieving project";
    })
    .addCase(getProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.currentProject = action.payload;
    })
    
    // CREATE PROJECT
    .addCase(createProject.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(createProject.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error creating project";
    })
    .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.message = "Project created";
      state.projects.push(action.payload);
      state.totalProjects = state.projects.length;
    })
    
    // UPDATE 1 PROJECT
    .addCase(updateProject.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateProject.rejected, (state, action: PayloadAction<string | undefined>) => {
      state.isLoading = false;
      state.error = action.payload || "Error updating project";
    })
    .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.message = "Project updated";

      const index = state.projects.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    });
    // #endregion
  },
});

export const { clearMessages } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
