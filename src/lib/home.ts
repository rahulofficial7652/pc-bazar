// ================= TYPES =================
export type HeroData = {
  badge: string
  title: string
  highlight: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export type Category = {
  id: string
  title: string
  description: string
  cta: string
}

export type Product = {
  id: string
  name: string
  subtitle: string
  price: number
  inStock: boolean
}


export const featuredProducts: Product[] = Array.from({ length: 8 }).map(
  (_, i) => ({
    id: `p-${i}`,
    name: "Gaming PC",
    subtitle: "High performance build",
    price: 59999 + i * 2000,
    inStock: true,
  })
)

// ================= DATA ACCESS =================
export async function getHomePageData() {

  return {
    featuredProducts,
  }
}
