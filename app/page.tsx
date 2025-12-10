import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Plus, Search, Building2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
              School Management Made Simple
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Add, manage, and discover schools with our comprehensive school management system. Build your school
              directory with ease.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/add-school">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New School
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/schools">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Schools
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your school directory
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Add Schools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Easily add new schools with our intuitive form. Upload images and validate all inputs.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Search & Filter</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find schools quickly with powerful search and filtering options by city or state.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Responsive Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access your school directory from any device - desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Start building your school directory today. It only takes a few minutes.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/add-school">Add Your First School</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
