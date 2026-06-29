import { useErp } from "./store";

export interface CompanyProfile {
  name: string;
  tagline: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  phone: string;          // primary contact / owner WhatsApp
  email: string;          // primary email
  logoText: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  bank: string;
  upi: string;
  financialYear: string;
}

const KEY = "honey-erp-company";

function defaultFinancialYear(): string {
  const d = new Date();
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  const next = (y + 1) % 100;
  return `${String(y % 100).padStart(2, "0")}-${String(next).padStart(2, "0")}`;
}

export const DEFAULT_COMPANY: CompanyProfile = {
  name: "HONEY ENTERPRISES",
  tagline: "Stone Crusher • Aggregate Trading • Transport",
  gstin: "06ABCDE1234F1Z5",
  address: "Yard No. 12, NH-48, Gurugram, Haryana",
  city: "Gurugram",
  state: "Haryana",
  phone: "8059075260",
  email: "sumit2and2singh@gmail.com",
  logoText: "HONEY ENTERPRISES",
  ownerName: "Sumit Singh",
  ownerPhone: "8059075260",
  ownerEmail: "sumit2and2singh@gmail.com",
  bank: "HDFC Bank • A/c 50200012345678 • IFSC HDFC0001234",
  upi: "honey@upi",
  financialYear: defaultFinancialYear(),
};

export function loadCompany(): CompanyProfile {
  try {
    const profile = useErp.getState().companyProfile;
    if (profile && profile.name) {
      return {
        name: profile.name,
        tagline: profile.tagline || "",
        gstin: profile.gstin || profile.gst || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        phone: profile.phone || "",
        email: profile.email || "",
        logoText: profile.logoText || "",
        ownerName: profile.ownerName || "",
        ownerPhone: profile.ownerPhone || "",
        ownerEmail: profile.ownerEmail || "",
        bank: profile.bank || profile.bankDetails || "",
        upi: profile.upi || profile.upiId || "",
        financialYear: profile.financialYear || defaultFinancialYear(),
      };
    }
  } catch (e) {
    console.error("Failed to load company profile from store:", e);
  }
  return DEFAULT_COMPANY;
}

export function saveCompany(_p: CompanyProfile): void {
  // Saved via clients API directly in settings.tsx
}

