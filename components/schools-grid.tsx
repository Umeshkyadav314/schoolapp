"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Building2, Search, Edit, Trash2, Phone, Mail } from "lucide-react"
import type { School } from "@/lib/db"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SchoolsGrid() {
  const [schools, setSchools] = useState<School[]>([])
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { user } = useAuth()

  const fetchSchools = async () => {
    try {
      const response = await fetch("/api/schools")
      if (!response.ok) {
        throw new Error("Failed to fetch schools")
      }
      const data = await response.json()
      setSchools(data)
      setFilteredSchools(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSchools(schools)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredSchools(
        schools.filter(
          (school) =>
            school.name.toLowerCase().includes(query) ||
            school.city.toLowerCase().includes(query) ||
            school.state.toLowerCase().includes(query) ||
            school.address.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, schools])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/schools/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSchools(schools.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error("Error deleting school:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive text-lg">{error}</p>
        <p className="text-muted-foreground mt-2">Please make sure the database table is created.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background text-foreground border-input"
          />
        </div>
      </div>

      {/* Schools Grid */}
      {filteredSchools.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {schools.length === 0 ? "No Schools Found" : "No Results Found"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {schools.length === 0
              ? "Be the first to add a school to our directory."
              : "Try adjusting your search query."}
          </p>
          {schools.length === 0 && user && (
            <Button asChild>
              <Link href="/add-school">Add Your First School</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredSchools.length} of {schools.length} schools
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchools.map((school) => (
              <Card
                key={school.id}
                className="bg-card border-border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {school.image ? (
                    <img
                      src={school.image || "/placeholder.svg"}
                      alt={school.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-1">{school.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{school.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{school.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{school.email_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {school.city}
                      </span>
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
                        {school.state}
                      </span>
                    </div>
                  </div>

                  {user && school.user_id === user.id && (
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <Link href={`/edit-school/${school.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={deletingId === school.id}
                          >
                            {deletingId === school.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-foreground">Delete School</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{school.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(school.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
