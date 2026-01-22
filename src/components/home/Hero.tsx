import { Button } from "@/components/ui/button"
import { HeroData } from "@/lib/home"

export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="relative overflow-hidden bg-background">
      
      {/* soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="uppercase text-sm font-medium text-muted-foreground">
            {data.badge}
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {data.title}{" "}
            <span className="text-primary">
              {data.highlight}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-muted-foreground">
            {data.description}
          </p>

          <div className="mt-8 flex gap-4">
            <Button size="lg">
              {data.primaryCta}
            </Button>

            <Button size="lg" variant="outline">
              {data.secondaryCta}
            </Button>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative h-[320px] rounded-xl border bg-card shadow-sm" />
      </div>
    </section>
  )
}
