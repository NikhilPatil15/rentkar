import { connectDB } from "@/lib/database/connectDB";
import Assignment from "@/lib/models/assignment.model";
import DeliveryPartner from "@/lib/models/partner.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    await connectDB()
    const assignments = await Assignment.find();

    let successCount = 0;
    let failureCount = 0;
    let totalTime = 0;
    const failureReasons: { reason: string; count: number }[] = [];

    for (let assignment of assignments) {
        const partner = await DeliveryPartner.findById(assignment.partnerId);

      if (assignment.status === "success") {
        successCount++;
        totalTime +=
          new Date().getTime() - new Date(assignment.timestamp).getTime();
       
        //   partner.metrics.completedOrders += 1;
      } else {
        failureCount++;
        const reason = assignment.reason || "Unknown";
        const existingReason = failureReasons.find((r) => r.reason === reason);
        if (existingReason) {
          existingReason.count++;
        } else {
          failureReasons.push({ reason, count: 1 });
        }
      }
    }

    const successRate = successCount / (successCount + failureCount);
    const averageTime = successCount > 0 ? totalTime / successCount : 0;

    return NextResponse.json({
      message: "Assignment metrics calculated successfully!",
      data:{
        totalAssigned: successCount + failureCount,
        successRate,
        averageTime,
      },
      status:200
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to calculate the Metrics!",
      status: 400,
    });
  }
}
