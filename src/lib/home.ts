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

// ================= MOCK DATA =================
const heroData: HeroData = {
  badge: "New Us",
  title: "Same Store",
  highlight: "You Trust",
  description:
    "We’ve redesigned our website to offer faster performance and a cleaner shopping experience.",
  primaryCta: "Shop Now",
  secondaryCta: "Explore",
}

const categories: Category[] = [
  {
    id: "custom-pc",
    title: "Custom PC",
    description: "Build your PC exactly the way you want.",
    cta: "Start Building",
  },
  {
    id: "peripherals",
    title: "Peripherals",
    description: "Everything you need for your setup.",
    cta: "Explore",
  },
  {
    id: "monitors",
    title: "Monitors",
    description: "Top brands and stunning displays.",
    cta: "View Monitors",
  },
  {
    id: "prebuilt",
    title: "Prebuilt PC",
    description: "Ready-to-use powerful machines.",
    cta: "Shop Now",
  },
]

const featuredProducts: Product[] = Array.from({ length: 8 }).map(
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
  // 🔁 FUTURE:
  // const res = await fetch("/api/home")
  // return res.json()

  return {
    hero: heroData,
    categories,
    featuredProducts,
  }
}
