"use client";

import * as React from "react";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Link2,
  Clock,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatutImport = "succes" | "erreur" | "en_attente";

type ImportRecord = {
  id: string;
  eventId: string;
  nom: string;
  email: string;
  telephone: string;
  type: "client" | "vendeur";
  importeLe: string;
  statut: StatutImport;
  message: string | null;
};

import xyvalisData from "@/data/mock/xyvalis.json";

const importsData: ImportRecord[] = xyvalisData as ImportRecord[];

const statutConfig: Record<StatutImport, { label: string; className: string }> =
  {
    succes: { label: "Succès", className: "bg-green-600/10 text-green-600" },
    erreur: { label: "Erreur", className: "bg-red-600/10 text-red-600" },
    en_attente: {
      label: "En attente",
      className: "bg-amber-600/10 text-amber-600",
    },
  };

export default function eventView() {
  const [syncing, setSyncing] = React.useState(false);
  const [data] = React.useState<ImportRecord[]>(importsData);

  const kpis = React.useMemo(
    () => ({
      importes: data.filter((i) => i.statut === "succes").length,
      erreurs: data.filter((i) => i.statut === "erreur").length,
      enAttente: data.filter((i) => i.statut === "en_attente").length,
      total: data.length,
    }),
    [data],
  );

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  }

  return (
    <div className="px-4 mt-4 lg:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Intégration event
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Synchronisation des comptes importés depuis event
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter le rapport
          </Button>
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Synchronisation..." : "Lancer une synchro"}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Comptes importés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-green-600">
              {kpis.importes}
            </CardTitle>
            <CardAction>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-muted-foreground">créés automatiquement</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Erreurs de sync</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-red-600">
              {kpis.erreurs}
            </CardTitle>
            <CardAction>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-muted-foreground">à résoudre</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>En attente</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-amber-600">
              {kpis.enAttente}
            </CardTitle>
            <CardAction>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-muted-foreground">validation en cours</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total traité</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {kpis.total}
            </CardTitle>
            <CardAction>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-xs">
            <div className="text-muted-foreground">depuis le début</div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status sync */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              État de la connexion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Statut API</span>
              <Badge
                variant="outline"
                className="border-none rounded-sm bg-green-600/10 text-green-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                Connectée
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dernière synchro</span>
              <span className="font-medium">26 avr. 2026 à 13h00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prochaine synchro</span>
              <span className="font-medium">Dans 5h</span>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground mb-1">Endpoint</p>
              <p className="font-mono text-xs bg-muted px-2 py-1.5 rounded break-all">
                https://api.event.ci/v1/sync/users
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Fréquence</p>
              <p className="font-medium">Toutes les 6 heures</p>
            </div>
          </CardContent>
        </Card>

        {/* Erreurs récentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Erreurs récentes
            </CardTitle>
            <CardDescription>
              Comptes qui n&apos;ont pas pu être importés correctement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data
              .filter((i) => i.statut === "erreur")
              .map((err) => (
                <div
                  key={err.id}
                  className="flex items-start gap-3 p-3 rounded-md border border-red-100 bg-red-50/40"
                >
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-medium text-sm">{err.nom}</p>
                      <span className="text-xs text-muted-foreground font-mono">
                        {err.eventId}
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">{err.message}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Résoudre
                  </Button>
                </div>
              ))}
            {data.filter((i) => i.statut === "erreur").length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Aucune erreur — toutes les synchros sont à jour
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Historique d&apos;importation
          </CardTitle>
          <CardDescription>
            Tous les comptes importés depuis event
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID event</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Importé le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Détail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => {
                    const cfg = statutConfig[row.statut];
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs">
                          {row.eventId}
                        </TableCell>
                        <TableCell className="font-medium">{row.nom}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{row.email}</span>
                            <span className="text-xs text-muted-foreground">
                              {row.telephone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {row.type === "client" ? "Client" : "Vendeur"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Intl.DateTimeFormat("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(row.importeLe))}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-none rounded-sm ${cfg.className}`}
                          >
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[240px]">
                          {row.message ?? "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
