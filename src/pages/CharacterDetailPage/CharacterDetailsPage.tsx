import { useParams } from "react-router-dom";

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <h1>Character #{id}</h1>;
}
