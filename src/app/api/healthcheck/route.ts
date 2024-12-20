import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // You can access query parameters like this:
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name') || 'anonymous';

    return NextResponse.json(
      { message: `hello ${name}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json(
      { message: 'hello from POST', data: body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad Request' },
      { status: 400 }
    );
  }
}