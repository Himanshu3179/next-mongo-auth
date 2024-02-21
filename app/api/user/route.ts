import db from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Define the schema for the request body
const requestBodySchema = z.object({
  email: z.string().email().min(1, "Email cannot be empty"),
  name: z.string().min(1, "Name cannot be empty"),
  password: z.string().min(1, "Password cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate the body against the schema
    const { email, name, password } = requestBodySchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // remove password and return user
    const { password: _, ...user } = newUser;

    return NextResponse.json(
      { user, message: "User created Successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { user: null, message: error.message },
      { status: 500 }
    );
  }
}
