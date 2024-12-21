import { ObjectId } from "mongoose";

export type AssignmentTypes = {
  orderId: ObjectId;
  partnerId: ObjectId;
  timestamp: Date;
  status: "success" | "failed";
  reason?: string;
};

export type AssignmentMetrics = {
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: { reason: string; count: number }[];
};
