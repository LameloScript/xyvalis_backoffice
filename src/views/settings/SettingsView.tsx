"use client";

import * as React from "react";
import {
  User,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  Bell,
  CreditCard,
  Truck,
  Scale,
  Settings2,
  Building2,
  Mail,
  Home,
  Globe,
  ShieldCheck,
  Copy,
  CheckCircle2,
  Key,
  Laptop,
  Smartphone,
  LogOut,
  History,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { getSettings, saveSettings } from "@/lib/settings-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Payment providers configuration
const allPaymentProviders = [
  {
    key: "Orange Money",
    logo: "/assets/logo-brand/logo.png",
    description: "Mobile Money Orange",
    maxLength: 10,
    waitDays: "24h",
  },
  {
    key: "Moov Money",
    logo: "/assets/logo-brand/logo-moov.png",
    description: "Mobile Money Moov",
    maxLength: 10,
    waitDays: "24h",
  },
  {
    key: "MTN Mobile Money",
    logo: "/assets/logo-brand/logo-mtn.png",
    description: "MTN MoMo",
    maxLength: 10,
    waitDays: "24h",
  },
  {
    key: "Wave",
    logo: "/assets/logo-brand/logo-wave.png",
    description: "Wave Money",
    maxLength: 10,
    waitDays: "Instantané",
  },
  {
    key: "Carte bancaire",
    logo: "",
    description: "Visa, Mastercard",
    maxLength: 27,
    waitDays: "3-5 jours",
  },
];

// Données des pays d'Afrique de l'Ouest et leurs villes
const westAfricanCountries: Record<string, string[]> = {
  "cote-divoire": [
    "Abidjan",
    "Yamoussoukro",
    "Bouaké",
    "Korhogo",
    "San-Pédro",
    "Daloa",
    "Man",
    "Gagnoa",
    "Divo",
    "Anyama",
  ],
  senegal: [
    "Dakar",
    "Thiès",
    "Rufisque",
    "Kaolack",
    "Mbour",
    "Saint-Louis",
    "Ziguinchor",
    "Diourbel",
    "Louga",
    "Tambacounda",
  ],
  mali: [
    "Bamako",
    "Sikasso",
    "Mopti",
    "Koutiala",
    "Kayes",
    "Ségou",
    "Gao",
    "Tombouctou",
    "Kidal",
    "Koulikoro",
  ],
  "burkina-faso": [
    "Ouagadougou",
    "Bobo-Dioulasso",
    "Koudougou",
    "Banfora",
    "Ouahigouya",
    "Pouytenga",
    "Kaya",
    "Tenkodogo",
    "Fada N'Gourma",
    "Dédougou",
  ],
  niger: [
    "Niamey",
    "Zinder",
    "Maradi",
    "Agadez",
    "Tahoua",
    "Dosso",
    "Diffa",
    "Tillabéri",
    "Arlit",
    "Birni N'Konni",
  ],
  guinee: [
    "Conakry",
    "Nzérékoré",
    "Kankan",
    "Kindia",
    "Labé",
    "Mamou",
    "Boké",
    "Faranah",
    "Siguiri",
    "Kamsar",
  ],
  benin: [
    "Cotonou",
    "Porto-Novo",
    "Parakou",
    "Djougou",
    "Abomey-Calavi",
    "Bohicon",
    "Natitingou",
    "Lokossa",
    "Ouidah",
    "Kandi",
  ],
  togo: [
    "Lomé",
    "Sokodé",
    "Kara",
    "Kpalimé",
    "Atakpamé",
    "Bassar",
    "Tsévié",
    "Aného",
    "Mango",
    "Dapaong",
  ],
  ghana: [
    "Accra",
    "Kumasi",
    "Tamale",
    "Sekondi-Takoradi",
    "Ashaiman",
    "Sunyani",
    "Cape Coast",
    "Obuasi",
    "Tema",
    "Koforidua",
  ],
  nigeria: [
    "Lagos",
    "Kano",
    "Ibadan",
    "Abuja",
    "Port Harcourt",
    "Benin City",
    "Maiduguri",
    "Zaria",
    "Aba",
    "Jos",
  ],
  liberia: [
    "Monrovia",
    "Gbarnga",
    "Kakata",
    "Bensonville",
    "Harper",
    "Voinjama",
    "Buchanan",
    "Zwedru",
    "Harbel",
    "Pleebo",
  ],
  "sierra-leone": [
    "Freetown",
    "Bo",
    "Kenema",
    "Makeni",
    "Koidu",
    "Lunsar",
    "Port Loko",
    "Kabala",
    "Waterloo",
    "Bonthe",
  ],
  gambie: [
    "Banjul",
    "Serekunda",
    "Brikama",
    "Bakau",
    "Farafenni",
    "Lamin",
    "Sukuta",
    "Gunjur",
    "Soma",
    "Basse Santa Su",
  ],
  "guinee-bissau": [
    "Bissau",
    "Bafatá",
    "Gabú",
    "Bissorã",
    "Bolama",
    "Cacheu",
    "Bubaque",
    "Catió",
    "Mansôa",
    "Buba",
  ],
  "cap-vert": [
    "Praia",
    "Mindelo",
    "Santa Maria",
    "Assomada",
    "Pedra Badejo",
    "São Filipe",
    "Tarrafal",
    "Porto Novo",
    "Espargos",
    "Ribeira Grande",
  ],
  mauritanie: [
    "Nouakchott",
    "Nouadhibou",
    "Kiffa",
    "Kaédi",
    "Rosso",
    "Zouérat",
    "Atar",
    "Néma",
    "Sélibaby",
    "Aleg",
  ],
};

const countryNames: Record<string, string> = {
  "cote-divoire": "Côte d'Ivoire",
  senegal: "Sénégal",
  mali: "Mali",
  "burkina-faso": "Burkina Faso",
  niger: "Niger",
  guinee: "Guinée",
  benin: "Bénin",
  togo: "Togo",
  ghana: "Ghana",
  nigeria: "Nigeria",
  liberia: "Liberia",
  "sierra-leone": "Sierra Leone",
  gambie: "Gambie",
  "guinee-bissau": "Guinée-Bissau",
  "cap-vert": "Cap-Vert",
  mauritanie: "Mauritanie",
};

export default function SettingsView() {
  const [selectedCountry, setSelectedCountry] =
    React.useState<string>("cote-divoire");
  const [selectedCity, setSelectedCity] = React.useState<string>("");

  // Payment providers state
  const [enabledProviders, setEnabledProviders] = React.useState<string[]>([]);

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = React.useState(false);
  const [activationStep, setActivationStep] = React.useState<
    "scan" | "verify" | "recovery"
  >("scan");
  const [tempSecret, setTempSecret] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [recoveryCodes, setRecoveryCodes] = React.useState<string[]>([]);

  // Password State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Sessions State
  const [sessions, setSessions] = React.useState([
    {
      id: "1",
      device: 'MacBook Pro 16"',
      browser: "Chrome",
      os: "macOS",
      location: "Abidjan, Côte d'Ivoire",
      lastActive: "À l'instant",
      isCurrent: true,
      type: "desktop" as const,
    },
    {
      id: "2",
      device: "iPhone 13 Pro",
      browser: "Safari",
      os: "iOS 17",
      location: "Abidjan, Côte d'Ivoire",
      lastActive: "Il y a 2 heures",
      isCurrent: false,
      type: "mobile" as const,
    },
  ]);

  // Load settings on mount
  React.useEffect(() => {
    const settings = getSettings();
    setEnabledProviders(settings.paymentProviders || []);
    setIs2FAEnabled(settings.twoFactorEnabled || false);
  }, []);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity(""); // Reset city when country changes
  };

  const toggleProvider = (providerKey: string) => {
    setEnabledProviders((prev) => {
      if (prev.includes(providerKey)) {
        return prev.filter((p) => p !== providerKey);
      } else {
        return [...prev, providerKey];
      }
    });
  };

  const savePaymentSettings = () => {
    const settings = getSettings();
    saveSettings({ ...settings, paymentProviders: enabledProviders });
    toast.success("Moyens de paiement mis à jour");
  };

  // 2FA Functions
  const start2FAActivation = () => {
    // Generate a mock secret
    const secret = "JBSWY3DPEHPK3PXP"; // Example Base32 secret
    setTempSecret(secret);
    setActivationStep("scan");
    setOtpCode("");
    setIs2FAModalOpen(true);
  };

  const verifyAndActivate2FA = () => {
    if (otpCode.length !== 6) {
      toast.error("Veuillez entrer un code valide à 6 chiffres");
      return;
    }
    // Mock verification: accept any 6-digit code
    // In real app: verifyToken(tempSecret, otpCode)

    // Generate recovery codes
    const codes = Array.from(
      { length: 8 },
      () =>
        Math.random().toString(36).substring(2, 6).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 6).toUpperCase(),
    );
    setRecoveryCodes(codes);
    setActivationStep("recovery");
    toast.success("Code vérifié avec succès");
  };

  const confirm2FAActivation = () => {
    const settings = getSettings();
    saveSettings({
      ...settings,
      twoFactorEnabled: true,
      twoFactorSecret: tempSecret,
    });
    setIs2FAEnabled(true);
    setIs2FAModalOpen(false);
    toast.success("Authentification à deux facteurs activée");
  };

  const disable2FA = () => {
    const settings = getSettings();
    saveSettings({
      ...settings,
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
    });
    setIs2FAEnabled(false);
    toast.info("Authentification à deux facteurs désactivée");
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    // API call to update password would go here
    toast.success("Mot de passe mis à jour avec succès");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Session déconnectée");
  };

  const handleLogoutAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success("Toutes les autres sessions ont été déconnectées");
  };

  const cities = selectedCountry
    ? westAfricanCountries[selectedCountry] || []
    : [];

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez les paramètres de votre compte et de la plateforme
        </p>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="identity"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <User className="size-4" />
            <span className="hidden sm:inline">Identité & Branding</span>
            <span className="sm:hidden">Identité</span>
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Settings2 className="size-4" />
            <span className="hidden sm:inline">Préférences</span>
            <span className="sm:hidden">Préf.</span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <CreditCard className="size-4" />
            <span>Paiement</span>
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Truck className="size-4" />
            <span>Livraison</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <ShieldCheck className="size-4" />
            <span className="hidden sm:inline">Sécurité</span>
            <span className="sm:hidden">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger
            value="legal"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Scale className="size-4" />
            <span className="hidden sm:inline">Fiscalité & Légal</span>
            <span className="sm:hidden">Légal</span>
          </TabsTrigger>
        </TabsList>

        {/* Identité & Branding Tab */}
        <TabsContent value="identity" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <User className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {/* Prénom */}
                <div className="space-y-2">
                  <Label
                    htmlFor="firstname"
                    className="flex items-center gap-2"
                  >
                    <User className="size-4 text-muted-foreground" />
                    Prénom
                  </Label>
                  <Input
                    id="firstname"
                    defaultValue="Konan"
                    placeholder="Votre prénom"
                  />
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    Nom
                  </Label>
                  <Input
                    id="lastname"
                    defaultValue="Yves"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Organisation */}
                <div className="space-y-2">
                  <Label htmlFor="shopname" className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    Organisation
                  </Label>
                  <Input
                    id="shopname"
                    defaultValue="Xyvalis"
                    placeholder="Organisation"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    defaultValue="admin@xyvalis.com"
                    className="bg-muted/50 text-muted-foreground"
                    disabled
                  />
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    Téléphone<span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      defaultValue="+225 07 00 00 00 00"
                      placeholder="+225 07 ..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-primary bg-primary/10 rounded"
                    >
                      <MessageSquare className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Date de naissance */}
                <div className="space-y-2">
                  <Label
                    htmlFor="birthdate"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="size-4 text-muted-foreground" />
                    Date de naissance<span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="birthdate" type="date" className="pr-10" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Home className="size-4 text-muted-foreground" />
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    defaultValue="Cocody, Riviera 3"
                    placeholder="Votre adresse, Abidjan"
                  />
                </div>

                {/* Pays */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground" />
                    Pays<span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px]">
                      {Object.entries(countryNames).map(([value, name]) => (
                        <SelectItem key={value} value={value}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ville */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    Ville<span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px] max-h-[300px]">
                      {cities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city.toLowerCase().replace(/\s+/g, "-")}
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="px-8">Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Préférences Tab */}
        <TabsContent value="preferences" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <Settings2 className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                Préférences de la plateforme
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select defaultValue="xof">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xof">FCFA (XOF)</SelectItem>
                      <SelectItem value="eur">Euro (EUR)</SelectItem>
                      <SelectItem value="usd">Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select defaultValue="africa-abidjan">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fuseau horaire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa-abidjan">
                        Africa/Abidjan (UTC+0)
                      </SelectItem>
                      <SelectItem value="europe-paris">
                        Europe/Paris (UTC+1)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <Bell className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                Préférences de notification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <p className="text-muted-foreground text-sm">
                Configurez comment vous souhaitez recevoir les notifications
                concernant la plateforme.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Nouvelles commandes</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification pour chaque nouvelle commande
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Avis clients</p>
                    <p className="text-sm text-muted-foreground">
                      Être notifié des nouveaux avis sur vos produits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Messages des clients</p>
                    <p className="text-sm text-muted-foreground">
                      Notifications pour les messages reçus
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Promotions et actualités</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des informations sur les nouveautés de la
                      plateforme
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="px-8">Enregistrer les modifications</Button>
          </div>
        </TabsContent>

        {/* Paiement Tab */}
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <CreditCard className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                Méthodes de paiement acceptées
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <p className="text-muted-foreground text-sm">
                Activez ou désactivez les moyens de paiement acceptés sur la
                plateforme. Ces paramètres s&apos;appliquent également aux
                demandes de virement.
              </p>

              {/* Payment Providers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPaymentProviders.map((provider) => {
                  const isEnabled = enabledProviders.includes(provider.key);
                  return (
                    <div
                      key={provider.key}
                      className={cn(
                        "rounded-lg border-2 p-4 flex items-start gap-3 transition-all",
                        isEnabled
                          ? "border-primary bg-primary/5"
                          : "border-border opacity-60",
                      )}
                    >
                      <div className="size-14 rounded-lg bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                        {provider.logo ? (
                          <img
                            src={provider.logo}
                            alt={provider.key}
                            className="size-14 object-cover"
                          />
                        ) : (
                          <CreditCard className="size-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {provider.key}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                provider.waitDays === "Instantané"
                                  ? "bg-green-100 text-green-700"
                                  : provider.waitDays === "24h"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700",
                              )}
                            >
                              {provider.waitDays}
                            </span>
                          </div>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={() => toggleProvider(provider.key)}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {provider.description}
                        </div>
                        {isEnabled && (
                          <div className="space-y-1">
                            <Input
                              placeholder={
                                provider.key === "Carte bancaire"
                                  ? "RIB / IBAN"
                                  : `Numéro ${provider.key}`
                              }
                              className="h-8 text-sm"
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={provider.maxLength}
                              onKeyDown={(e) => {
                                if (
                                  !/[0-9]/.test(e.key) &&
                                  e.key !== "Backspace" &&
                                  e.key !== "Delete" &&
                                  e.key !== "Tab" &&
                                  e.key !== "ArrowLeft" &&
                                  e.key !== "ArrowRight"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                            <div className="text-[10px] text-muted-foreground">
                              Max. {provider.maxLength} chiffres
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button className="px-8" onClick={savePaymentSettings}>
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Tab */}
        <TabsContent value="delivery" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <Truck className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">Livraison</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Info banner */}
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 flex items-start gap-4">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Truck className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    Livraison gérée par la plateforme
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    La livraison de vos produits est entièrement prise en charge
                    par notre partenaire logistique. Vous n&apos;avez pas besoin
                    de configurer vos propres options de livraison.
                  </p>
                </div>
              </div>

              {/* Delivery info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <span className="font-medium text-sm">Zones couvertes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Toute la Côte d&apos;Ivoire
                  </p>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <span className="font-medium text-sm">Délai moyen</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    24h - 72h selon la zone
                  </p>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-primary" />
                    <span className="font-medium text-sm">Frais</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    À la charge du client
                  </p>
                </div>
              </div>

              {/* Contact support */}
              <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    Besoin d&apos;aide avec une livraison ?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Notre équipe support est disponible pour vous aider
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Contacter le support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <ShieldCheck className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">Sécurité du compte</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start justify-between space-x-4">
                <div className="space-y-1">
                  <h3 className="font-medium">
                    Authentification à deux facteurs (2FA)
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                    en exigeant un code de vérification à chaque connexion.
                  </p>
                  {is2FAEnabled && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="size-4" />
                      Authentification à deux facteurs activée
                    </div>
                  )}
                </div>
                {is2FAEnabled ? (
                  <Button variant="destructive" onClick={disable2FA}>
                    Désactiver
                  </Button>
                ) : (
                  <Button onClick={start2FAActivation}>Activer 2FA</Button>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Key className="size-5 text-primary" />
                  <h3 className="font-medium">Mot de passe</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">
                        Mot de passe actuel
                      </Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirmer le mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdatePassword}
                        disabled={
                          !currentPassword || !newPassword || !confirmPassword
                        }
                      >
                        Mettre à jour
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <History className="size-4" />
                        Historique
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium text-sm">
                      Exigences de sécurité
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Au moins 8 caractères</li>
                      <li>Au moins une lettre majuscule</li>
                      <li>Au moins une lettre minuscule</li>
                      <li>Au moins un chiffre</li>
                      <li>Au moins un caractère spécial</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Laptop className="size-5 text-primary" />
                    <h3 className="font-medium">Sessions actives</h3>
                  </div>
                  {sessions.length > 1 && (
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={handleLogoutAllOtherSessions}
                    >
                      Déconnecter tous les autres appareils
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                          {session.type === "mobile" ? (
                            <Smartphone className="size-5 text-muted-foreground" />
                          ) : (
                            <Laptop className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.device}</p>
                            {session.isCurrent && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Actuel
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.browser} sur{" "}
                            {session.os}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Dernière activité : {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleLogoutSession(session.id)}
                        >
                          <LogOut className="size-4 mr-2" />
                          Déconnecter
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Configuration de l&apos;authentification à deux facteurs
              </DialogTitle>
              <DialogDescription>
                {activationStep === "scan" &&
                  "Scannez le QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)."}
                {activationStep === "verify" &&
                  "Entrez le code à 6 chiffres généré par votre application."}
                {activationStep === "recovery" &&
                  "Sauvegardez ces codes de récupération en lieu sûr."}
              </DialogDescription>
            </DialogHeader>

            {activationStep === "scan" && (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="p-4 bg-white rounded-lg border shadow-sm">
                  <QRCodeSVG
                    value={`otpauth://totp/Xyvalis-Seller:Vendeur?secret=${tempSecret}&issuer=Xyvalis`}
                    size={200}
                    level="H"
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Clé secrète :{" "}
                    <span className="font-mono font-medium text-foreground">
                      {tempSecret}
                    </span>
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setActivationStep("verify")}
                >
                  J&apos;ai scanné le code
                </Button>
              </div>
            )}

            {activationStep === "verify" && (
              <div className="flex flex-col items-center justify-center space-y-6 py-4">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <div className="flex flex-col w-full gap-2">
                  <Button
                    className="w-full"
                    onClick={verifyAndActivate2FA}
                    disabled={otpCode.length !== 6}
                  >
                    Vérifier
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActivationStep("scan")}
                  >
                    Retour
                  </Button>
                </div>
              </div>
            )}

            {activationStep === "recovery" && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg grid grid-cols-2 gap-2 text-center font-mono text-sm">
                  {recoveryCodes.map((code, i) => (
                    <div key={i} className="bg-background p-2 rounded border">
                      {code}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-destructive font-medium text-center">
                  Attention : Ces codes sont le seul moyen de récupérer
                  l&apos;accès à votre compte si vous perdez votre téléphone.
                </p>
                <div className="flex gap-2 flex-col">
                  <Button className="w-full" onClick={confirm2FAActivation}>
                    Terminer
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const text = recoveryCodes.join("\n");
                      navigator.clipboard.writeText(text);
                      toast.success("Codes copiés dans le presse-papier");
                    }}
                  >
                    <Copy className="size-4 mr-2" /> Copier
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Fiscalité & Légal Tab */}
        <TabsContent value="legal" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
              <Scale className="size-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                Informations fiscales et légales
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <p className="text-muted-foreground text-sm">
                Ces informations sont nécessaires pour la conformité fiscale et
                légale de votre activité.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                <div className="space-y-2">
                  <Label htmlFor="business-type">Type d&apos;activité</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[250px]">
                      <SelectItem value="individual">Particulier</SelectItem>
                      <SelectItem value="auto-entrepreneur">
                        Auto-entrepreneur
                      </SelectItem>
                      <SelectItem value="entreprise-individuelle">
                        Entreprise individuelle
                      </SelectItem>
                      <SelectItem value="sarl">
                        SARL (Société à Responsabilité Limitée)
                      </SelectItem>
                      <SelectItem value="sarlu">
                        SARLU (SARL Unipersonnelle)
                      </SelectItem>
                      <SelectItem value="sa">SA (Société Anonyme)</SelectItem>
                      <SelectItem value="sas">
                        SAS (Société par Actions Simplifiée)
                      </SelectItem>
                      <SelectItem value="cooperative">Coopérative</SelectItem>
                      <SelectItem value="association">Association</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-number">
                    Numéro d&apos;identification fiscale
                  </Label>
                  <Input id="business-number" placeholder="CI-XXXX-XXXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Raison sociale</Label>
                  <Input id="business-name" placeholder="Nom de l'entreprise" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-address">
                    Adresse du siège social
                  </Label>
                  <Input id="business-address" placeholder="Adresse complète" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headquarters-city">Ville du siège</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px] max-h-[300px]">
                      <SelectItem value="abidjan">Abidjan</SelectItem>
                      <SelectItem value="yamoussoukro">Yamoussoukro</SelectItem>
                      <SelectItem value="bouake">Bouaké</SelectItem>
                      <SelectItem value="korhogo">Korhogo</SelectItem>
                      <SelectItem value="san-pedro">San-Pédro</SelectItem>
                      <SelectItem value="daloa">Daloa</SelectItem>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="gagnoa">Gagnoa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commune">Commune</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une commune" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[200px] max-h-[300px]">
                      <SelectItem value="plateau">Plateau</SelectItem>
                      <SelectItem value="cocody">Cocody</SelectItem>
                      <SelectItem value="marcory">Marcory</SelectItem>
                      <SelectItem value="treichville">Treichville</SelectItem>
                      <SelectItem value="adjame">Adjamé</SelectItem>
                      <SelectItem value="yopougon">Yopougon</SelectItem>
                      <SelectItem value="abobo">Abobo</SelectItem>
                      <SelectItem value="koumassi">Koumassi</SelectItem>
                      <SelectItem value="port-bouet">Port-Bouët</SelectItem>
                      <SelectItem value="bingerville">Bingerville</SelectItem>
                      <SelectItem value="anyama">Anyama</SelectItem>
                      <SelectItem value="songon">Songon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="px-8">Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
