import { connectDB } from "@/lib/database/connectDB";
import Assignment from "@/lib/models/assignment.model";
import Order from "@/lib/models/order.model";
import DeliveryPartner from "@/lib/models/partner.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  /* Short Algo
  1.First check if the orderId and the PartnerId both are present if not then send an error response
  2.Then check if the order with the given orderId is present or not. if not then send an error response
  3.Once again check if the delivery partner with given partnerId is present or not.if not the send and error response
  4.Now check if the shift of the partner matches with the time 
  5.check if the delivery partner has that specified area 
  6.check if the currenLoad of the partner is not more than 3 or equal to 3 
  7.change the order status to assigned and increase the current load of the delivery partner  
  */

  await connectDB()
  const { orderId, partnerId } = await request.json();

  if ([orderId, partnerId].some((value) => value.trim() === "")) {
    return NextResponse.json({
      message: "All fields are necessary",
      status: 400,
    });
  }

  const order = await Order.findById(orderId);
  const partner = await DeliveryPartner.findById(partnerId);

  if (!order) {
    return NextResponse.json({ message: "Order does not exist!", status: 400 });
  }

  if (!partner) {
    return NextResponse.json({
      message: "Partner does not exist!",
      status: 400,
    });
  }

  if (order.status !== "pending") {
    const failedAssignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: new Date(),
      status: "failed",
      reason: "Order is already assigned or in progress",
    });
    return NextResponse.json({
      message: "Failed to assign order: Order is not in pending status",
      assignment: failedAssignment,
      status: 400,
    });
  }

  const currentTime: Date = new Date();
  const currentHour: number = currentTime.getHours();

  const shiftStart = +partner.shift.start;
  const shiftEnd = +partner.shift.end;

  const isShiftMatch = currentHour >= shiftStart && currentHour <= shiftEnd;

  if (!isShiftMatch) {
    // Log failed assignment due to shift mismatch
    const failedAssignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: currentTime,
      status: "failed",
      reason: "Delivery partner not available during this time.",
    });

    return NextResponse.json({
      message: "Failed to assign order: Delivery partner unavailable!",
      Fail: failedAssignment,
      status: 200,
    });
  }

  if (!partner.areas.includes(order.area)) {
    const failedAssignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: currentTime,
      status: "failed",
      reason: "Delivery partner does not serve the order's area.",
    });

    return NextResponse.json({
      message:
        "Failed to assign order: Delivery partner does not serve this area.",
      assignment: failedAssignment,
      status: 400,
    });
  }

  const partnerCurretLoad: number = partner.currentLoad;

  if (partnerCurretLoad >= 3) {
    const assignment = await Assignment.create({
      orderId,
      partnerId,
      timestamp: currentTime,
      status: "failed",
      reason: "Partner load exceeded",
    });

    return NextResponse.json({
      message: "Assignment failed due to partner load!",
      assignment: assignment,
      status: 200,
    });
  }

  const assignment = await Assignment.create({
    orderId,
    partnerId,
    timestamp: currentTime,
    status: "success",
    reason: null,
  });

  order.status = "assigned"
  partner.currentLoad += 1;

  await partner.save();

  return NextResponse.json(
    { message: "Order assigned successfully!", assignment: assignment },
    { status: 200 }
  );
}
