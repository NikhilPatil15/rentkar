import { connectDB } from "@/lib/database/connectDB";
import Order from "@/lib/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const orders = await Order.find();

    if (orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Order fetched successfully!", Orders: orders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  /* Short algo
  1.Check if all fields are given or not.
  2.Check the customer  object has all fields given if not then send error
  3.Check the items object has all fields given if not then send error and make sure that atleast one item is given from the body
  4.Check the scheduledFor date is not expired like it should be a date in the future
  5.if all validations are correct then create a document and send a success respose
  */

  await connectDB()
  const { customer, area, items, scheduledFor } = await request.json();

  /* Check if all the fields are given or not  */
  if ([area, scheduledFor].some((value) => value?.trim() === "")) {
    return NextResponse.json(
      { message: "All fields are necessary!" },
      { status: 401 }
    );
  }

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return NextResponse.json(
      { message: "Customer name, phone, and address are required." },
      { status: 401 }
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { message: "At least one item is required." },
      { status: 400 }
    );
  }

  for (const item of items) {
    if (!item.name || !item.quantity || !item.price) {
      return NextResponse.json(
        { message: "Each item must have a name, quantity, and price." },
        { status: 400 }
      );
    }
    if (typeof item.quantity !== "number" || typeof item.price !== "number") {
      return NextResponse.json(
        { message: "Item quantity and price must be numbers." },
        { status: 400 }
      );
    }
  }

  const scheduledDate = new Date(scheduledFor);
  const currentDate = new Date();

  if (scheduledDate < currentDate) {
    return NextResponse.json(
      { message: "Scheduled time cannot be in the past." },
      { status: 400 }
    );
  }
  try {
    const newOrder = await Order.create({
      customer: customer,
      area: area,
      items: items,
      scheduledFor: scheduledFor,
    });

    return NextResponse.json(
      { message: "Order created successfully!", Orders: newOrder },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Something went wrong while creating order!",
      },
      { status: 500 }
    );
  }
}
