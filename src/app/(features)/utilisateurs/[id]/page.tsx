import UserDetailView from "@/views/utilisateurs/UserDetailView"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return <UserDetailView id={params.id} />
}
