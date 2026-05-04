export type ShopSettings = {
  name: string
  email: string
  phone: string
  country: string
  currency: string
  language: string
  emailNotif: boolean
  smsNotif: boolean
  address?: string
  profilePhoto?: string
  identityDoc?: string
  rccmDoc?: string
  providerLogos?: Record<string, string>
  paymentProviders?: string[]
  deliveryByPlatform?: boolean
  deliveryPlatformName?: string
  twoFactorEnabled?: boolean
  twoFactorSecret?: string
}

const KEY = "shopSettings"

const defaults: ShopSettings = {
  name: "Xyvalis Delivery",
  email: "contact@xyvalis.com",
  phone: "+225 07 11 22 33",
  country: "CI",
  currency: "fcfa",
  language: "fr",
  emailNotif: true,
  smsNotif: false,
  address: "Abidjan, Côte d'Ivoire",
  profilePhoto: "",
  identityDoc: "",
  rccmDoc: "",
  providerLogos: {
    "Orange Money": "/assets/logo-brand/logo.png",
    "Moov Money": "/assets/logo-brand/logo-moov.png",
    "MTN Mobile Money": "/assets/logo-brand/logo-mtn.png",
    "Wave": "/assets/logo-brand/logo-wave.png",
    "Carte bancaire": "",
  },
  paymentProviders: ["Orange Money", "Moov Money", "MTN Mobile Money", "Wave", "Carte bancaire"],
  deliveryByPlatform: true,
  deliveryPlatformName: "Xyvalis Delivery",
  twoFactorEnabled: false,
}

export function getSettings(): ShopSettings {
  if (typeof window === "undefined") return defaults
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<ShopSettings>
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function saveSettings(next: ShopSettings) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}
