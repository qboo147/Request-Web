import { z } from "zod";

export interface Project {
  name: string;
  code: string;
  from: string;
  to: string;
  active: boolean;
  project_manager: string;
  quality_assurance: string;
  technical_lead: string[];
  business_analyst: string[];
  developers: string[];
  testers: string[];
  technical_consultant: string[];
  id?: string;
}

const projectSchema = z.object({
  name: z.string(),
  code: z.string(),
  from: z.string(),
  to: z.string(),
  project_manager: z.string(),
  quality_assurance: z.string(),
  technical_lead: z.array(z.string()),
  business_analyst: z.array(z.string()),
  developers: z.array(z.string()),
  testers: z.array(z.string()),
  technical_consultant: z.array(z.string()),
});

export type ProjectSchema = z.infer<typeof projectSchema>;
