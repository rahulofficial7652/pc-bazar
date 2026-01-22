import { getHomePageData } from "@/lib/home"
import { Hero } from "@/components/home/Hero"
import { Categories } from "@/components/home/Categories"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"

export default async function HomePage() {
  const data = await getHomePageData()

  return (
    <main>
      <Hero data={data.hero} />
      <Categories data={data.categories} />
      <FeaturedProducts data={data.featuredProducts} />
    </main>
  )
}
