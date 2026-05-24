'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { getSettings } from "@/lib/settings-store"
import { useEffect } from "react"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [is2FA, setIs2FA] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const settings = getSettings()
    setIs2FA(!!settings.twoFactorEnabled)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Vérifier le code
    // Pour la démo, on accepte "000000" ou n'importe quel code à 6 chiffres si 2FA est activé
    if (otp === "000000" || (is2FA && otp.length === 6)) {
      // Rediriger vers le dashboard
      router.push("/dashboard")
    } else {
      setError("Code de vérification incorrect")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-xl font-bold ">
              {is2FA ? "Authentification à deux facteurs" : "Entrez le code de vérification"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {is2FA 
                ? "Entrez le code à 6 chiffres généré par votre application d'authentification."
                : "Nous avons envoyé un code à 6 chiffres à votre email."
              }
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Code de vérification
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              required
              value={otp}
              onChange={(value) => {
                setOtp(value)
                setError("")
              }}
            >
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <FieldDescription className="text-center text-destructive">
                {error}
              </FieldDescription>
            )}
            <FieldDescription className="text-center">
              {is2FA 
                ? "Ouvrez votre application (Google Authenticator, Authy, etc.) pour obtenir le code."
                : "Entrez le code à 6 chiffres envoyé à votre email."
              }
            </FieldDescription>
          </Field>
          <Button type="submit">Vérifier</Button>
          {!is2FA && (
            <FieldDescription className="text-center">
              Vous n&apos;avez pas reçu le code ? <a href="#" className="underline underline-offset-4">Renvoyer</a>
            </FieldDescription>
          )}
        </FieldGroup>
      </form>
    </div>
  )
}
