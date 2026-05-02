import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  toggleFavourite,
  selectIsFavourite,
} from "../../features/favourites/favouritesSlice";
import type { FavouriteItem } from "../../types/favourites";
import styles from "./FavouriteButton.module.scss";

type FavouriteButtonProps = {
  item: FavouriteItem;
};

export default function FavouriteButton({ item }: FavouriteButtonProps) {
  const dispatch = useAppDispatch();
  const isFavourite = useAppSelector(selectIsFavourite(item.id, item.type));

  const label = isFavourite
    ? `Remove ${item.title} from favourites`
    : `Add ${item.title} to favourites`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(toggleFavourite(item));
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${isFavourite ? styles.active : ""}`}
      onClick={handleClick}
      aria-pressed={isFavourite}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{isFavourite ? "★" : "☆"}</span>
    </button>
  );
}
