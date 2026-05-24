import PrestataireDetailView from "@/views/prestataires/PrestataireDetailView"

export default async function PrestataireDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PrestataireDetailView id={id} />
}
