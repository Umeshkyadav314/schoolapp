"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
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

const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  email_id: z.string().email("Invalid email address"),
})

type SchoolFormData = z.infer<typeof schoolSchema>

export default function AddSchoolForm() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

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

  const handlePhoneChange = (value: string, code: string, fullNumber: string) => {
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
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setImageUploading(false)
    }
  }

  const onSubmit = async (data: SchoolFormData) => {
    // Validate phone - must be exactly 10 digits
    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/schools", {
        method: "POST",
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
        throw new Error("Failed to add school")
      }

      setIsSuccess(true)
      reset()
      setImageUrl(null)
      setPhone("")

      setTimeout(() => {
        router.push("/schools")
      }, 2000)
    } catch (error) {
      console.error("Error adding school:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!loading && !user) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to add a school.</p>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">School Added Successfully!</h2>
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
                  <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
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
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || imageUploading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding School...
              </>
            ) : (
              "Add School"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
