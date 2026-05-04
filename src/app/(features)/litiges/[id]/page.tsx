import LitigeDetailView from "@/views/litiges/LitigeDetailView"

export default function LitigeDetailPage({ params }: { params: { id: string } }) {
  return <LitigeDetailView id={params.id} />
}
