import { z } from "zod";

export interface Claim {
  status: string;
  staff: {
    id: number;
    name: string;
    department: string;
  };
  project: {
    name: string;
    from: string;
    to: string;
  };
  records: {
    date: string;
    day: string;
    from: string;
    to: string;
    remarks: string;
    money: number;
  }[];
  remarks: string;
  total_money: number;
  created_at: string;
  updated_at: string;
  id?: string;
}

const StaffSchema = z.object({
  id: z.number(),
  name: z.string(),
  department: z.string(),
});

const ProjectSchema = z.object({
  name: z.string(),
  from: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  to: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
});

const RecordSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  day: z.string(),
  from: z.string(),
  to: z.string(),
  remarks: z.string(),
  money: z.number(),
});

const claimSchema = z.object({
  status: z.string(),
  staff: StaffSchema,
  project: ProjectSchema,
  records: z.array(RecordSchema),
  remarks: z.string(),
  total_money: z.number(),
  created_at: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
  updated_at: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
});

export type ClaimSchema = z.infer<typeof claimSchema>;
