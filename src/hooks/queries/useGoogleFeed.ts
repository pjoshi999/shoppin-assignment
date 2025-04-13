import { useQuery } from "@tanstack/react-query";
import { feedKeys, fetchGoogleFeed } from "../../api/endpoints/feed";

export const useGoogleFeed = () => {
  return useQuery({
    queryKey: feedKeys.lists(),
    queryFn: () => fetchGoogleFeed(),
  });
};
