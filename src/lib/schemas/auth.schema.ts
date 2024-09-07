import { z } from "zod";

export interface Auth {
  email: string;
  password: string;
}

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthSchema = z.infer<typeof authSchema>;
