import type { Metadata } from "next"
import EditSchoolForm from "@/components/edit-school-form"

export const metadata: Metadata = {
  title: "Edit School - SchoolHub",
  description: "Edit school information",
}

export default async function EditSchoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Edit School</h1>
            <p className="text-muted-foreground">Update the school information below</p>
          </div>
          <EditSchoolForm schoolId={id} />
        </div>
      </div>
    </div>
  )
}
