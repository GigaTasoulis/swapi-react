export type FavouriteType = "character" | "film";

export type FavouriteItem = {
  id: string;
  type: FavouriteType;
  title: string;
  url: string;
};
