import { useParams } from "react-router-dom";

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <h1>Film #{id}</h1>;
}
