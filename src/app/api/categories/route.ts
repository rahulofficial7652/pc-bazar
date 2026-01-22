import { NextResponse } from "next/server"
import { Category } from "@/models/category"
import "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json()
  const category = await Category.create(body)
  return NextResponse.json(category)
}

export async function GET() {
  const categories = await Category.find()
  return NextResponse.json(categories)
}
