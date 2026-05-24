"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Loader2, User, Truck, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const COMMUNES_19 = [
  "Abobo", "Adjamé", "Attécoubé", "Anyama", "Bingerville", "Cocody",
  "Dabou", "Grand-Bassam", "Jacqueville", "Koumassi", "Marcory",
  "Plateau", "Port-Bouët", "Songon", "Treichville", "Yopougon",
  "Azaguié", "Alépé", "Agboville",
]

const COMMUNES_12 = [
  "Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi", "Marcory",
  "Plateau", "Port-Bouët", "Treichville", "Yopougon", "Bingerville", "Songon",
]

const QUARTIERS: Record<string, string[]> = {
  Cocody: ["Angré", "Riviera 1", "Riviera 2", "Riviera 3", "Deux Plateaux", "Bonoumin", "Palmeraie"],
  Yopougon: ["Siporex", "Selmer", "Wassakara", "Niangon", "Andokoi", "Toits Rouges"],
  Abobo: ["PK 18", "Avocatier", "Clouétcha", "Williamsville", "Agbaou"],
  Adjamé: ["Marché Adjamé", "220 Logements", "Liberté", "Ébrié"],
  Plateau: ["Centre-Ville", "Indénié", "Cocotiers"],
  Marcory: ["Anoumabo", "Biétry", "Zone 4"],
  Koumassi: ["Camp Militaire", "Remblai", "Sogefia"],
  Treichville: ["Port", "Gare", "Village"],
  "Port-Bouët": ["Vridi", "Gonzagueville", "Aéroport"],
  Attécoubé: ["Banco", "Santé"],
  Bingerville: ["Centre", "Akouai"],
  Songon: ["Centre", "Agban"],
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

type Role = "client" | "prestataire" | "relais"

function FileField({ label, name, accept = "image/*" }: { label: string; name: string; accept?: string }) {
  const [fileName, setFileName] = React.useState("")
  const ref = React.useRef<HTMLInputElement>(null)
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div
        onClick={() => ref.current?.click()}
        className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-3 hover:bg-accent transition-colors"
      >
        <Upload className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground truncate">
          {fileName || "Sélectionner un fichier"}
        </span>
      </div>
      <input
        ref={ref}
        type="file"
        name={name}
        accept={accept}
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
      />
    </div>
  )
}

export default function AddOrganisateurView() {
  const router = useRouter()
  const [role, setRole] = React.useState<Role>("client")
  const [commune, setCommune] = React.useState("")
  const [zones, setZones] = React.useState<string[]>([])
  const [horaires, setHoraires] = React.useState<Record<string, { ouvert: boolean; o: string; f: string }>>(
    Object.fromEntries(JOURS.map((j) => [j, { ouvert: j !== "Dimanche", o: "08:00", f: "18:00" }]))
  )
  const [isLoading, setIsLoading] = React.useState(false)

  const quartiers = commune ? (QUARTIERS[commune] ?? []) : []
  const toggleZone = (z: string) =>
    setZones((p) => (p.includes(z) ? p.filter((x) => x !== z) : [...p, z]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsLoading(false)
    router.push("/organisateurs")
  }

  const RoleTab = ({ value, label, icon: Icon }: { value: Role; label: string; icon: React.ElementType }) => (
    <button
      type="button"
      onClick={() => { setRole(value); setCommune(""); setZones([]) }}
      className={cn(
        "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
        role === value ? "bg-primary text-white" : "text-muted-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">
            L&apos;utilisateur recevra ses identifiants par SMS et pourra vérifier son numéro à la première connexion.
          </p>
        </div>
      </div>

      {/* Role tabs */}
      <div className="inline-flex items-center gap-1 rounded-lg border bg-white p-1">
        <RoleTab value="client" label="Client" icon={User} />
        <RoleTab value="prestataire" label="Prestataire" icon={Truck} />
        <RoleTab value="relais" label="Point relais" icon={Store} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Identité — commun à tous */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Identité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">{role === "relais" ? "Prénom du responsable" : "Prénom"}</Label>
                <Input id="prenom" name="prenom" placeholder="Konan" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">{role === "relais" ? "Nom du responsable" : "Nom"}</Label>
                <Input id="nom" name="nom" placeholder="Yao" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone (+225)</Label>
                <Input id="telephone" name="telephone" placeholder="07 00 00 00 00" maxLength={10} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
                <Input id="email" name="email" type="email" placeholder="konan@exemple.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localisation — Client & Relais */}
        {(role === "client" || role === "relais") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Localisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {role === "relais" && (
                <div className="space-y-2">
                  <Label htmlFor="nom_relais">Nom du point relais</Label>
                  <Input id="nom_relais" name="nom_relais" placeholder="Boutique Chez Mariam" maxLength={60} required />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Commune</Label>
                  <Select value={commune} onValueChange={setCommune} required>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {(role === "client" ? COMMUNES_19 : COMMUNES_12).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quartier</Label>
                  <Select disabled={!commune} required>
                    <SelectTrigger>
                      <SelectValue placeholder={commune ? "Sélectionner" : "Choisir une commune"} />
                    </SelectTrigger>
                    <SelectContent>
                      {quartiers.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reperes">Repères / Description</Label>
                <textarea
                  id="reperes"
                  name="reperes"
                  required
                  maxLength={200}
                  placeholder="Ex : Face à la pharmacie du marché, portail bleu..."
                  className="w-full min-h-[70px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              {role === "relais" && (
                <div className="space-y-2">
                  <Label>Type de local</Label>
                  <Select required>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boutique">Boutique personnelle</SelectItem>
                      <SelectItem value="domicile">Domicile</SelectItem>
                      <SelectItem value="local">Local dédié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Documents — Prestataire */}
        {role === "prestataire" && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pièce d&apos;identité & documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse de domicile</Label>
                  <Input id="adresse" name="adresse" placeholder="Cocody Angré, Rue des Jardins..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type de pièce</Label>
                    <Select required>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cni">CNI</SelectItem>
                        <SelectItem value="passeport">Passeport</SelectItem>
                        <SelectItem value="sejour">Titre de séjour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="num_piece">Numéro de la pièce</Label>
                    <Input id="num_piece" name="num_piece" placeholder="CI0123456789" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FileField label="Pièce — recto" name="piece_recto" />
                  <FileField label="Pièce — verso" name="piece_verso" />
                  <FileField label="Permis de conduire" name="permis" accept=".pdf,image/*" />
                  <FileField label="Casier judiciaire" name="casier" accept=".pdf,image/*" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Zones de livraison
                  {zones.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({zones.length} sélectionnée{zones.length > 1 ? "s" : ""})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {COMMUNES_12.map((zone) => (
                    <label
                      key={zone}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-colors",
                        zones.includes(zone) ? "border-primary bg-primary/5" : "hover:bg-accent"
                      )}
                    >
                      <Checkbox
                        checked={zones.includes(zone)}
                        onCheckedChange={() => toggleZone(zone)}
                      />
                      <span className="text-sm">{zone}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Véhicule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type de véhicule</Label>
                    <Select required>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moto">Moto</SelectItem>
                        <SelectItem value="tricycle">Tricycle</SelectItem>
                        <SelectItem value="camionnette">Camionnette</SelectItem>
                        <SelectItem value="voiture">Voiture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="immat">Immatriculation</Label>
                    <Input id="immat" name="immat" placeholder="1234 AB 01" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FileField label="Photo du véhicule" name="photo_vehicule" />
                  <FileField label="Document d&apos;assurance" name="assurance" accept=".pdf,image/*" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Paiement & contact d&apos;urgence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opérateur Mobile Money</Label>
                    <Select required>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orange">Orange Money</SelectItem>
                        <SelectItem value="wave">Wave</SelectItem>
                        <SelectItem value="mtn">MTN MoMo</SelectItem>
                        <SelectItem value="moov">Moov Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="num_mm">Numéro Mobile Money</Label>
                    <Input id="num_mm" name="num_mm" placeholder="07 00 00 00 00" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urg_nom">Contact d&apos;urgence — nom</Label>
                    <Input id="urg_nom" name="urg_nom" placeholder="Konan Aya" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urg_tel">Contact d&apos;urgence — téléphone</Label>
                    <Input id="urg_tel" name="urg_tel" placeholder="05 00 00 00 00" required />
                  </div>
                </div>
              </CardContent>
            </Card>

          </>
        )}

        {/* Horaires + Local — Relais */}
        {role === "relais" && (
          <>
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Horaires d&apos;ouverture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {JOURS.map((jour) => {
                  const h = horaires[jour]
                  return (
                    <div
                      key={jour}
                      className={cn(
                        "flex items-center gap-3 rounded-md border px-3 py-2 transition-colors",
                        !h.ouvert && "opacity-60"
                      )}
                    >
                      <Switch
                        checked={h.ouvert}
                        onCheckedChange={(v) => setHoraires((p) => ({ ...p, [jour]: { ...p[jour], ouvert: v } }))}
                      />
                      <span className="w-24 text-sm font-medium">{jour}</span>
                      {h.ouvert ? (
                        <div className="flex items-center gap-2 ml-auto">
                          <input
                            type="time"
                            value={h.o}
                            onChange={(e) => setHoraires((p) => ({ ...p, [jour]: { ...p[jour], o: e.target.value } }))}
                            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                          />
                          <span className="text-muted-foreground text-sm">→</span>
                          <input
                            type="time"
                            value={h.f}
                            onChange={(e) => setHoraires((p) => ({ ...p, [jour]: { ...p[jour], f: e.target.value } }))}
                            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                          />
                        </div>
                      ) : (
                        <span className="ml-auto text-sm text-muted-foreground">Fermé</span>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Local</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacite">Capacité (colis max)</Label>
                    <Input id="capacite" name="capacite" type="number" min={1} placeholder="50" required />
                  </div>
                  <FileField label="Photo du local" name="photo_local" />
                </div>
              </CardContent>
            </Card>
          </>
        )}

       </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Création...</> : "Créer le compte"}
          </Button>
        </div>
      </form>
    </div>
  )
}
