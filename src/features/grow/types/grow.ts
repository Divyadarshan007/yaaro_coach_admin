export type LeadStatus = "pending" | "invited" | "declined";

export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

export type PublicCoach = {
  coachId: string;
  name: string;
  avatar: string;
};
