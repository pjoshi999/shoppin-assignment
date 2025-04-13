import axios from "axios";

export const feedKeys = {
  all: ["feed"] as const,
  lists: () => [...feedKeys.all, "list"] as const,
};

export const fetchGoogleFeed = async () => {
  const { data } = await axios.get(
    "https://serpapi.com/search.json?engine=google_news&gl=in&hl=en&api_key=64878ca8257f3e94c5f7eff476ac9dd84631c452990b189dfb181c567fc9ecf9"
  );

  return data;
};
