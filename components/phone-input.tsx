"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

const countries: Country[] = [
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string, countryCode: string, fullNumber: string) => void
  error?: string
  className?: string
}

export default function PhoneInput({ value, onChange, error, className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [phoneNumber, setPhoneNumber] = useState(value)

  // Detect user's country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        const countryCode = data.country_code
        const country = countries.find((c) => c.code === countryCode)
        if (country) {
          setSelectedCountry(country)
        }
      } catch {
        // Default to India if detection fails
        setSelectedCountry(countries[0])
      }
    }
    detectCountry()
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhoneNumber(digits)
    onChange(digits, selectedCountry.dialCode, `${selectedCountry.dialCode}${digits}`)
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    onChange(phoneNumber, country.dialCode, `${country.dialCode}${phoneNumber}`)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-r-none border-r-0 px-3 bg-muted hover:bg-muted/80 min-w-[90px] justify-between"
            >
              <span className="text-xl mr-1">{selectedCountry.flag}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto w-[250px]">
            {countries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className="cursor-pointer"
              >
                <span className="text-xl mr-2">{country.flag}</span>
                <span className="flex-1 text-foreground">{country.name}</span>
                <span className="text-muted-foreground">{country.dialCode}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {selectedCountry.dialCode}
          </span>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter 10 digit number"
            className={cn(
              "rounded-l-none pl-12 bg-background text-foreground border-input",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            maxLength={10}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {phoneNumber && phoneNumber.length !== 10 && (
        <p className="text-sm text-muted-foreground">
          {10 - phoneNumber.length} more digit{10 - phoneNumber.length !== 1 ? "s" : ""} required
        </p>
      )}
    </div>
  )
}
