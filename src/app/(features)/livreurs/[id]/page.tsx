import LivreurDetailView from "@/views/livreurs/LivreurDetailView"

export default function LivreurDetailPage({ params }: { params: { id: string } }) {
  return <LivreurDetailView id={params.id} />
}
