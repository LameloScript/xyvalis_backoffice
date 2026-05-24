import OrganisateurDetailView from "@/views/organisateurs/OrganisateurDetailView"

export default async function OrganisateurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrganisateurDetailView id={id} />
}
