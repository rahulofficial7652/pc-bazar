import { NextResponse } from "next/server"
import { Product } from "@/models/product"
import "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json()
  
  if (!body.name || !body.price || !body.stock) {
    return NextResponse.json(
      {
        success: false,
        message: "name, price and stock are required",
      },
      { status: 400 }
    );
  }

  if (isNaN(body.price) || isNaN(body.stock)) {
    return NextResponse.json(
      {
        success: false,
        message: "price and stock must be numbers",
      },
      { status: 400 }
    );
  }

  const product = await Product.create(body)
  return NextResponse.json(product)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  const filter = category ? { category } : {}
  const products = await Product.find(filter)

  return NextResponse.json(products)
}
