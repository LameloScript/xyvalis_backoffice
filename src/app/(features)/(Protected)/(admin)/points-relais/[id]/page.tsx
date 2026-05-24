import PointRelaisDetailView from "@/views/points-relais/PointRelaisDetailView"

export default function PointRelaisDetailPage({ params }: { params: { id: string } }) {
  return <PointRelaisDetailView id={params.id} />
}
