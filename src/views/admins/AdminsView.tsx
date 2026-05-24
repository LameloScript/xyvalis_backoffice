"use client";

import * as React from "react";
import {
  ShieldCheck,
  UserPlus,
  History,
  MoreHorizontal,
  Shield,
  Crown,
  Users as UsersIcon,
  Truck,
  Store,
  Megaphone,
  Calculator,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role =
  | "super_admin"
  | "gestionnaire_prestataires"
  | "gestionnaire_clients"
  | "gestionnaire_relais"
  | "marketing"
  | "chef_relais"
  | "comptable";

type Statut = "actif" | "desactive";

type Permission = "lire" | "ecrire" | "modifier" | "supprimer";
type PagePermissions = Record<Permission, boolean>;

const PAGES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "commandes", label: "Commandes" },
  { key: "organisateurs", label: "Organisateurs" },
  { key: "prestataires", label: "Prestataires" },
  { key: "points-relais", label: "Points relais" },
  { key: "litiges", label: "Litiges" },
  { key: "validations", label: "Validations" },
  { key: "promotions", label: "Promotions" },
  { key: "finance", label: "Finance" },
  { key: "tarification", label: "Tarification" },
  { key: "contenu", label: "Contenu" },
  { key: "analytics", label: "Statistiques" },
  { key: "admins", label: "Admins" },
  { key: "event", label: "event" },
];

const PERMS: { key: Permission; label: string }[] = [
  { key: "lire", label: "Lire" },
  { key: "ecrire", label: "Écrire" },
  { key: "modifier", label: "Modifier" },
  { key: "supprimer", label: "Supprimer" },
];

function defaultPermissions(): Record<string, PagePermissions> {
  return Object.fromEntries(
    PAGES.map((p) => [
      p.key,
      { lire: true, ecrire: false, modifier: false, supprimer: false },
    ]),
  );
}

type Admin = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: Role;
  statut: Statut;
  derniereConnexion: string;
  creeLe: string;
  permissions?: Record<string, PagePermissions>;
};

type Activite = {
  id: string;
  admin: string;
  role: Role;
  action: string;
  cible: string;
  date: string;
  ip: string;
};

import adminsMockData from "@/data/mock/admins.json";

const adminsData: Admin[] = adminsMockData.adminsData as Admin[];

const activitesData: Activite[] = adminsMockData.activitesData as Activite[];

const roleConfig: Record<
  Role,
  { label: string; icon: typeof Crown; className: string }
> = {
  super_admin: {
    label: "Super Admin",
    icon: Crown,
    className: "bg-purple-600/10 text-purple-600",
  },
  gestionnaire_prestataires: {
    label: "Gestion prestataires",
    icon: Truck,
    className: "bg-blue-600/10 text-blue-600",
  },
  gestionnaire_clients: {
    label: "Gestion clients",
    icon: UsersIcon,
    className: "bg-amber-600/10 text-amber-600",
  },
  gestionnaire_relais: {
    label: "Gestion relais",
    icon: Store,
    className: "bg-violet-600/10 text-violet-600",
  },
  marketing: {
    label: "Marketing",
    icon: Megaphone,
    className: "bg-pink-600/10 text-pink-600",
  },
  chef_relais: {
    label: "Chef de relais",
    icon: Store,
    className: "bg-cyan-600/10 text-cyan-600",
  },
  comptable: {
    label: "Comptable",
    icon: Calculator,
    className: "bg-green-600/10 text-green-600",
  },
};

const statutConfig: Record<Statut, { label: string; className: string }> = {
  actif: { label: "Actif", className: "bg-green-600/10 text-green-600" },
  desactive: { label: "Désactivé", className: "bg-red-600/10 text-red-600" },
};

export default function AdminsView() {
  const [data, setData] = React.useState<Admin[]>(adminsData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [form, setForm] = React.useState({
    nom: "",
    email: "",
    telephone: "",
    role: "gestionnaire_clients" as Role,
    permissions: defaultPermissions(),
  });

  const kpis = React.useMemo(
    () => ({
      total: data.length,
      actifs: data.filter((a) => a.statut === "actif").length,
      superadmins: data.filter((a) => a.role === "super_admin").length,
      desactives: data.filter((a) => a.statut === "desactive").length,
    }),
    [data],
  );

  const adminColumns: ColumnDef<Admin>[] = React.useMemo(
    () => [
      {
        accessorKey: "nom",
        header: "Nom",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
              {(row.getValue("nom") as string).charAt(0)}
            </div>
            <div>
              <p className="font-medium">{row.getValue("nom")}</p>
              <p className="text-xs text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "telephone",
        header: "Téléphone",
        cell: ({ row }) => (
          <span className="text-sm">{row.getValue("telephone")}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => {
          const r = row.getValue("role") as Role;
          const cfg = roleConfig[r];
          const Icon = cfg.icon;
          return (
            <Badge
              variant="outline"
              className={`border-none rounded-sm ${cfg.className}`}
            >
              <Icon className="mr-1 h-3 w-3" /> {cfg.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "derniereConnexion",
        header: "Dernière connexion",
        cell: ({ row }) => {
          const d = new Date(row.getValue("derniereConnexion") as string);
          return (
            <span className="text-sm text-muted-foreground">
              {new Intl.DateTimeFormat("fr-FR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(d)}
            </span>
          );
        },
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
          const s = row.getValue("statut") as Statut;
          const cfg = statutConfig[s];
          return (
            <Badge
              variant="outline"
              className={`border-none rounded-sm ${cfg.className}`}
            >
              {cfg.label}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const admin = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Modifier le rôle</DropdownMenuItem>
                <DropdownMenuItem>Voir le journal</DropdownMenuItem>
                <DropdownMenuSeparator />
                {admin.statut === "actif" ? (
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() =>
                      setData((prev) =>
                        prev.map((a) =>
                          a.id === admin.id ? { ...a, statut: "desactive" } : a,
                        ),
                      )
                    }
                  >
                    Désactiver le compte
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-green-600"
                    onClick={() =>
                      setData((prev) =>
                        prev.map((a) =>
                          a.id === admin.id ? { ...a, statut: "actif" } : a,
                        ),
                      )
                    }
                  >
                    Réactiver le compte
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const adminTable = useReactTable({
    data,
    columns: adminColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting },
    initialState: { pagination: { pageSize: 8 } },
  });

  function handleCreate() {
    if (!form.nom || !form.email) return;
    const nouveau: Admin = {
      id: `ADM-${String(data.length + 1).padStart(3, "0")}`,
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      role: form.role,
      statut: "actif",
      derniereConnexion: new Date().toISOString(),
      creeLe: new Date().toISOString().slice(0, 10),
    };
    setData((prev) => [nouveau, ...prev]);
    setForm({
      nom: "",
      email: "",
      telephone: "",
      role: "gestionnaire_clients",
      permissions: defaultPermissions(),
    });
    setOpenCreate(false);
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Profils administrateurs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestion des comptes admin, rôles et journal d&apos;activité
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Nouveau compte administrateur</DialogTitle>
              <DialogDescription>
                Le mot de passe sera envoyé par SMS au nouveau compte
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Nom complet</Label>
                    <Input
                      value={form.nom}
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                      placeholder="Prénom Nom"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="prenom@event.ci"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={form.telephone}
                      onChange={(e) =>
                        setForm({ ...form, telephone: e.target.value })
                      }
                      placeholder="+225 07 ..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Rôle</Label>
                    <Select
                      value={form.role}
                      onValueChange={(v) =>
                        setForm({ ...form, role: v as Role })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          Object.entries(roleConfig) as [
                            Role,
                            (typeof roleConfig)[Role],
                          ][]
                        ).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>
                            {cfg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Permissions par page */}
                <div className="grid gap-2">
                  <Label>Permissions par page</Label>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-2 px-3 text-left font-medium text-muted-foreground w-[40%]">
                            Page
                          </th>
                          {PERMS.map((p) => (
                            <th
                              key={p.key}
                              className="py-2 px-2 text-center font-medium text-muted-foreground"
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>{p.label}</span>
                                <Checkbox
                                  checked={PAGES.every(
                                    (pg) => form.permissions[pg.key][p.key],
                                  )}
                                  onCheckedChange={(checked) => {
                                    const updated = { ...form.permissions };
                                    PAGES.forEach((pg) => {
                                      updated[pg.key] = {
                                        ...updated[pg.key],
                                        [p.key]: !!checked,
                                      };
                                    });
                                    setForm({ ...form, permissions: updated });
                                  }}
                                />
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {PAGES.map((page, i) => {
                          const perms = form.permissions[page.key];
                          const allChecked = PERMS.every((p) => perms[p.key]);
                          return (
                            <tr
                              key={page.key}
                              className={
                                i % 2 === 0 ? "bg-background" : "bg-muted/20"
                              }
                            >
                              <td className="py-2 px-3 font-medium flex items-center gap-2">
                                <Checkbox
                                  checked={allChecked}
                                  onCheckedChange={(checked) => {
                                    const updated = { ...form.permissions };
                                    updated[page.key] = Object.fromEntries(
                                      PERMS.map((p) => [p.key, !!checked]),
                                    ) as PagePermissions;
                                    setForm({ ...form, permissions: updated });
                                  }}
                                />
                                {page.label}
                              </td>
                              {PERMS.map((perm) => (
                                <td
                                  key={perm.key}
                                  className="py-2 px-2 text-center"
                                >
                                  <Checkbox
                                    checked={perms[perm.key]}
                                    onCheckedChange={(checked) => {
                                      const updated = { ...form.permissions };
                                      updated[page.key] = {
                                        ...updated[page.key],
                                        [perm.key]: !!checked,
                                      };
                                      setForm({
                                        ...form,
                                        permissions: updated,
                                      });
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    La case à gauche du nom de page sélectionne toutes les
                    permissions. La ligne d&apos;en-tête sélectionne toute la
                    colonne.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Total admins</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.total}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-white/20 text-white">
                <Shield className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">comptes enregistrés</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Comptes actifs</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.actifs}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-emerald-500 text-white">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">en service</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Super admins</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.superadmins}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-violet-500 text-white">
                <Crown className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">accès total</div>
          </CardFooter>
        </Card>
        <Card className="@container/card bg-primary border-primary shadow-xs">
          <CardHeader>
            <CardDescription className="text-white/70">Désactivés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-white">
              {kpis.desactives}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="border-none bg-rose-500 text-white">
                <Shield className="h-3.5 w-3.5 text-white" />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-white/60">comptes bloqués</div>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="comptes">
        <TabsList>
          <TabsTrigger value="comptes" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Comptes admin
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Journal d&apos;activité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comptes">
          <div className="overflow-x-auto rounded-md border bg-white">
            <div className="min-w-[850px]">
              <Table>
                <TableHeader>
                  {adminTable.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>
                          {h.isPlaceholder
                            ? null
                            : flexRender(
                                h.column.columnDef.header,
                                h.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {adminTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">
                  Journal d&apos;activité admin
                </CardTitle>
                <CardDescription>
                  Toutes les actions effectuées par les administrateurs
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activitesData.map((a) => {
                    const cfg = roleConfig[a.role];
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Intl.DateTimeFormat("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(a.date))}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {a.admin}
                            </span>
                            <Badge
                              variant="outline"
                              className={`mt-0.5 w-fit border-none rounded-sm text-xs ${cfg.className}`}
                            >
                              {cfg.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{a.action}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {a.cible}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {a.ip}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
