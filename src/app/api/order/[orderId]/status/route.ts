import { connectDB } from "@/lib/database/connectDB";
import Order from "@/lib/models/order.model";
import { NextRequest, NextResponse } from "next/server";

interface ParamsOrderTypes {
  orderId: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: ParamsOrderTypes }
) {
  await connectDB();

  const { orderId } = await params;
  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ message: "Status is not given!", status: 400 });
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status: status,
      },
    },
    { new: true }
  );

  if (!order) {
    return NextResponse.json({ message: "Order does not exist!", status: 400 });
  }

  return NextResponse.json({
    message: "Order status changes successfully!",
    order,
    status: 200,
  });
}
