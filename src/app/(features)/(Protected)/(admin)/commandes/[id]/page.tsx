import CommandeDetailView from "@/views/commandes/CommandeDetailView"
export default function CommandeDetailPage({ params }: { params: { id: string } }) {
  return <CommandeDetailView id={params.id} />
}
