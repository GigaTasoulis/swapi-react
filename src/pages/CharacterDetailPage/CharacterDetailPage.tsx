import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCharacterByIdQuery } from "../../api/swapiApi";
import BackLink from "../../components/BackLink/BackLink";
import DetailRow from "../../components/DetailRow/DetailRow";
import StateMessage from "../../components/StateMessage/StateMessage";
import FavouriteButton from "../../components/FavouriteButton/FavouriteButton";
import styles from "./CharacterDetailPage.module.scss";

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useGetCharacterByIdQuery(
    id ?? skipToken,
  );

  return (
    <article>
      <BackLink to="/characters" label="Back to characters" />

      {isLoading && (
        <StateMessage variant="loading" title="Loading character…" />
      )}

      {isError && (
        <StateMessage
          variant="error"
          title="Couldn't load this character"
          description="It may not exist, or the request failed."
          action={
            <button
              type="button"
              className={styles.retry}
              onClick={() => refetch()}
            >
              Try again
            </button>
          }
        />
      )}

      {data && (
        <>
          <header className={styles.header}>
            <h1 className={styles.heading}>{data.name}</h1>
            <FavouriteButton
              item={{
                id: id!,
                type: "character",
                title: data.name,
                url: data.url,
              }}
            />
          </header>

          <dl className={styles.details}>
            <DetailRow label="Born" value={data.birth_year} />
            <DetailRow label="Gender" value={data.gender} />
            <DetailRow label="Height" value={`${data.height} cm`} />
            <DetailRow label="Mass" value={`${data.mass} kg`} />
            <DetailRow label="Eye color" value={data.eye_color} />
            <DetailRow label="Hair color" value={data.hair_color} />
            <DetailRow label="Skin color" value={data.skin_color} />
            <DetailRow label="Films" value={data.films.length} />
          </dl>
        </>
      )}
    </article>
  );
}
