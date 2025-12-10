"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import PhoneInput from "@/components/phone-input"
import Link from "next/link"
import type { School } from "@/lib/db"

const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  email_id: z.string().email("Invalid email address"),
})

type SchoolFormData = z.infer<typeof schoolSchema>

interface EditSchoolFormProps {
  schoolId: string
}

export default function EditSchoolForm({ schoolId }: EditSchoolFormProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
  })

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${schoolId}`)
        if (!response.ok) {
          throw new Error("School not found")
        }
        const data = await response.json()
        setSchool(data)
        setImageUrl(data.image)

        // Parse phone from contact
        const contact = data.contact || ""
        // Extract country code and phone number
        const phoneMatch = contact.match(/^(\+\d+)(\d{10})$/)
        if (phoneMatch) {
          setCountryCode(phoneMatch[1])
          setPhone(phoneMatch[2])
        } else {
          setPhone(contact.replace(/\D/g, "").slice(-10))
        }

        reset({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          email_id: data.email_id,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load school")
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [schoolId, reset])

  const handlePhoneChange = (value: string, code: string) => {
    setPhone(value)
    setCountryCode(code)
    if (value.length === 10) {
      setPhoneError(null)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError(null)
    setImageUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload image")
      }

      const data = await response.json()
      setImageUrl(data.url)
    } catch (uploadError) {
      setImageError(uploadError instanceof Error ? uploadError.message : "Failed to upload image")
    } finally {
      setImageUploading(false)
    }
  }

  const onSubmit = async (data: SchoolFormData) => {
    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          contact: `${countryCode}${phone}`,
          image: imageUrl,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update school")
      }

      setIsSuccess(true)

      setTimeout(() => {
        router.push("/schools")
      }, 2000)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to update school")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to edit a school.</p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild>
              <Link href="/schools">Back to Schools</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (school && school.user_id !== user.id) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">You can only edit schools that you created.</p>
            <Button asChild>
              <Link href="/schools">Back to Schools</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSuccess) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">School Updated Successfully!</h2>
            <p className="text-muted-foreground">Redirecting you to the schools list...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* School Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              School Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter school name"
              className="bg-background text-foreground border-input"
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">
              Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              placeholder="Enter full address"
              className="bg-background text-foreground border-input resize-none"
              rows={3}
              {...register("address")}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Enter city"
                className="bg-background text-foreground border-input"
                {...register("city")}
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-foreground">
                State <span className="text-destructive">*</span>
              </Label>
              <Input
                id="state"
                placeholder="Enter state"
                className="bg-background text-foreground border-input"
                {...register("state")}
              />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>
          </div>

          {/* Contact and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <PhoneInput value={phone} onChange={handlePhoneChange} error={phoneError || undefined} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_id" className="text-foreground">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email_id"
                type="email"
                placeholder="school@example.com"
                className="bg-background text-foreground border-input"
                {...register("email_id")}
              />
              {errors.email_id && <p className="text-sm text-destructive">{errors.email_id.message}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-foreground">
              School Image
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              {imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="School preview"
                    className="max-h-40 mx-auto rounded-md object-cover"
                  />
                  <p className="text-sm text-muted-foreground">Image uploaded</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => setImageUrl(null)}>
                    Remove Image
                  </Button>
                </div>
              ) : (
                <label htmlFor="image" className="cursor-pointer">
                  <div className="space-y-2">
                    {imageUploading ? (
                      <Loader2 className="h-10 w-10 mx-auto text-muted-foreground animate-spin" />
                    ) : (
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {imageUploading ? "Uploading..." : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF or WebP (max 5MB)</p>
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                </label>
              )}
            </div>
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href="/schools">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting || imageUploading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update School"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
