import { z } from "zod";

export interface Staff {
  name: string;
  department: string;
  rank: string;
  role: "approver" | "finance" | "claimer" | "admin";
  email: string;
  password: string;
  active: boolean;
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Auth {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface PasswordResetState {
  message: string;
  status: string;
  loading: boolean;
}

export interface UpdatePasswordPayload {
  email: string;
  password: string;
  role?: string;
  active?: boolean;
}

const staffSchema = z.object({
  name: z.string(),
  department: z.string(),
  rank: z.string(),
  role: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  id: z.number(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export type StaffSchema = z.infer<typeof staffSchema>;
