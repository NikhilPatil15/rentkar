import { connectDB } from "@/lib/database/connectDB";
import DeliveryPartner from "@/lib/models/partner.model";
import { error } from "console";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";

/* Fetching all delivery partners */
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const partners = await DeliveryPartner.find();

    if (partners.length === 0) {
      return NextResponse.json(
        { message: "Partners does not exist!" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "All delivery partners fetched successfully!",
        data: partners,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* Delivery partner creation route */
export async function POST(request: NextRequest) {

    await connectDB()

  const { name, email, phone, areas, shift } = await request.json();

  if ([name, email, phone].some((value) => value.trim() === "")) {
    return NextResponse.json(
      { message: "All fields are required!" },
      { status: 400 }
    );
  }

  if (areas.length === 0) {
    return NextResponse.json(
      { message: "Atleast one area is must!" },
      { status: 400 }
    );
  }

  const alreadyExist = await DeliveryPartner.findOne({ email: email });

  if (
    alreadyExist &&
    alreadyExist.phone === phone &&
    alreadyExist.name === name
  ) {
    return NextResponse.json(
      { message: "Delivery partner already exist! " },
      { status: 400 }
    );
  }

  try {
    const partner = await DeliveryPartner.create({
      name: name,
      email: email,
      phone: phone,
      areas: areas,
      shift: shift,
    });

    return NextResponse.json(
      { message: "Delivery Partner created successfully!", data: partner },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
        { error: 'Bad Request' },
        { status: 400 }
      );
  }
}
