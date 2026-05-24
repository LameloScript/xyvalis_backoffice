import DevisTrackingView from "@/views/organisateurs/DevisTrackingView"

export default async function DevisTrackingPage({ params }: { params: Promise<{ id: string, devisId: string }> }) {
  const { id, devisId } = await params
  return <DevisTrackingView organisateurId={id} devisId={devisId} />
}
