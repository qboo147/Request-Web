export const users: {
  id: number;
  username: string;
  password: string;
  role: "admin" | "finance" | "approver" | "claimer";
}[] = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "finance", password: "finance123", role: "finance" },
  { id: 3, username: "approver", password: "approver123", role: "approver" },
  { id: 4, username: "claimer", password: "claimer123", role: "claimer" },
  {
    id: 5,
    username: "khangbuiquoc@gmail.com",
    password: "123",
    role: "claimer",
  },
  {
    id: 6,
    username: "khangbuiquoc1@gmail.com",
    password: "123",
    role: "approver",
  },
  {
    id: 7,
    username: "khangbuiquoc2@gmail.com",
    password: "123",
    role: "finance",
  },
  {
    id: 8,
    username: "khangbuiquoc3@gmail.com",
    password: "123",
    role: "admin",
  },
];
