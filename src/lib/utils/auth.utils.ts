import { Staff } from "../schemas/staff.schema";
import { Auth } from "../schemas/staff.schema";
import { staff_API } from "./axios.config";
import * as CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Put in env later
// crypto-js problem
//1- npm install crypto-js --save
// 2- npm install @types/crypto-js
// 3-
//       from: import { CryptoJS } from ‘crypto-js’;
//       to: import * as CryptoJS from ‘crypto-js’;

// Encryption function
export const encryptData = (data: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  return ciphertext;
};

// Decryption function
export const decryptData = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

export const authorize = (loginInfo: Auth, staffList: Staff[]) => {
  for (const staff of staffList) {
    if (
      loginInfo.email === staff.email &&
      loginInfo.password === staff.password
    ) {
      return staff;
    }
  }
  return null;
};

export const isEmailRegistered = async (email: string): Promise<boolean> => {
  try {
    const [staffRes, pendingStaffRes] = await Promise.all([
      staff_API.get("/resource/staff"),
      staff_API.get("/resource/pendingStaff"),
    ]);

    const staffEmails = staffRes.data.data.map((staff: Staff) => staff.email);
    const pendingStaffEmails = pendingStaffRes.data.data.map(
      (staff: Staff) => staff.email
    );

    return staffEmails.includes(email) || pendingStaffEmails.includes(email);
  } catch (error) {
    console.error("Error checking email registration:", error);
    throw new Error("Unable to check email registration");
  }
};

export const checkEmailExists = async (
  email: string
): Promise<{
  exists: boolean;
  id?: string;
  role?: string;
  active?: boolean;
  name?: string;
  department?: string;
  rank?: string;
}> => {
  try {
    const response = await staff_API.get("/resource/staff");
    const staffList: Staff[] = response.data.data;
    const staff = staffList.find((staff) => staff.email === email);
    return {
      exists: !!staff,
      id: staff ? String(staff.id) : undefined,
      role: staff ? staff.role : undefined,
      active: staff ? staff.active : undefined,
      name: staff ? staff.name : undefined,
      department: staff ? staff.department : undefined,
      rank: staff ? staff.rank : undefined,
    };
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Unable to check email existence");
  }
};

export const generateOTP = (): string => {
  const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
  console.log("Generated OTP:", otp);
  return otp;
};
