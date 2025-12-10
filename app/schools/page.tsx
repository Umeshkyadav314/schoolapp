import type { Metadata } from "next"
import SchoolsGrid from "@/components/schools-grid"

export const metadata: Metadata = {
  title: "View Schools - SchoolHub",
  description: "Browse all schools in our directory",
}

export default function SchoolsPage() {
  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Schools Directory</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of schools. Find the perfect institution for your needs.
          </p>
        </div>
        <SchoolsGrid />
      </div>
    </div>
  )
}
