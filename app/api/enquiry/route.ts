import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().optional(),
  product: z.enum(["250g", "1kg", "Bulk", "Custom"]).or(z.string().min(1, "Product or order type is required")),
  quantity: z.string().min(1, "Quantity is required"),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, email, city, product, quantity, message } = parsed.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email: email ?? null,
        city: city ?? null,
        product,
        quantity,
        message: message ?? null,
      },
    });

    return NextResponse.json(
      { success: true, id: enquiry.id, message: "Enquiry submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enquiry POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
