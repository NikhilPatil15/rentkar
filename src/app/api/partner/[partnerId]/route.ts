import { connectDB } from "@/lib/database/connectDB";
import DeliveryPartner from "@/lib/models/partner.model";
import { NextRequest, NextResponse } from "next/server";

interface ParamsTypes {
  partnerId: string;
}

export async function PUT(request: NextRequest,{ params }: { params: ParamsTypes }) {
  try {
    await connectDB()
    const { partnerId } = params;
    const { areas, shift, name, email, phone, status } = await request.json();

    const partner = await DeliveryPartner.findById(partnerId);

    if (!partner) {
      return NextResponse.json(
        { message: "Partner does not exist!" },
        { status: 404 }
      );
    }

    partner.areas = areas ? areas : partner?.areas;
    partner.shift = shift ? shift : partner?.shift;
    (partner.name = name ? name : partner?.name),
      (partner.email = email ? email : partner?.email);
    partner.phone = phone ? phone : partner?.phone;
    partner.status = status ? status : partner?.status;

    await partner.save({ validateBeforeSave: false });

    return NextResponse.json(
      {
        message: "Partner details changed sucessfully!",
        updatePartner: partner,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
        { error: 'Bad Request' },
        { status: 400 }
      );
  }
}

export async function DELETE(request: NextRequest,{ params }: { params: ParamsTypes }) {
  try {
    await connectDB()
    const { partnerId } = params;
    const partner = await DeliveryPartner.findById(partnerId);

    if (!partner) {
      return NextResponse.json(
        { message: "Partner does not exist!" },
        { status: 404 }
      );
    }

    await partner.deleteOne();

    return NextResponse.json(
      { message: "Partner deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
        { error: 'Bad Request' },
        { status: 400 }
      );
  }
}
