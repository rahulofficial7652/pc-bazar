"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface ProductForm {
  name: string
  price: number
  stock: number
  category: string
  specs: string
}

export default function AdminProductsPage() {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    specs: "",
  })

  async function submit() {
    let specs = {}
    try {
      specs = JSON.parse(form.specs || "{}")
    } catch {
      console.error("Invalid JSON in specs:", form.specs)
    }

    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        specs,
      }),
    })
    
    window.location.reload()
  }

  return (
    <div className="max-w-xl p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>
            Add a new product to the store.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="Price" onChange={e => setForm({...form, price: Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" placeholder="Stock" onChange={e => setForm({...form, stock: Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)})} />


          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Category (keyboard)" onChange={e => setForm({...form, category: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specs">Specs</Label>
            <Textarea
              id="specs"
              placeholder='Specs JSON ( { "dpi": "16000" } )'
              onChange={e => setForm({...form, specs: e.target.value})}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={submit}>Add Product</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
