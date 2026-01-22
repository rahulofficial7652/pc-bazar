import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Bit<span className="text-primary">Kart</span>
          </h3>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Your one-stop shop for custom PCs, peripherals,
            and high-performance hardware.
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Shop
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="#">Custom PC</Link></li>
            <li><Link href="#">Prebuilt Systems</Link></li>
            <li><Link href="#">Monitors</Link></li>
            <li><Link href="#">Peripherals</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Contact</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Support</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Legal
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Refund Policy</Link></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} BitKart. All rights reserved.
          </p>
          <p>
            Built with ❤️ using modern web technologies
          </p>
        </div>
      </div>
    </footer>
  )
}
