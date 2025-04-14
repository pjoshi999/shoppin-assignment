import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mockDiscoverData } from "../../data/dummyFeed";
import { theme } from "../../config/theme";
import DiscoverCard, { DiscoverCardItem } from "./DiscoverCard";
import axios from "axios";
const FeedContainer = styled.div`
  width: 100%;
  max-width: 650px;
  margin: ${theme.spacing.xl} auto 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.xxl};

  @media (min-width: 768px) {
    display: none;
  }
`;

interface ApiResponse {
  news_results?: DiscoverCardItem[];
}

const DiscoverFeed: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<Error | null>(null);

  // Use mockData as fallback
  const feedItems = data?.news_results || mockDiscoverData;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // setError(null);

      try {
        // SerpAPI endpoint
        const API_KEY = import.meta.env.VITE_APP_SERP_API_KEY;
        const serpApiUrl = `https://serpapi.com/search.json?engine=google_news&gl=in&hl=en&api_key=${API_KEY}`;

        // to get temporary access
        const corsProxy = "https://cors-anywhere.herokuapp.com/";

        const response = await axios.get(corsProxy + serpApiUrl);
        setData(response.data);
      } catch {
        // console.error("Error fetching data:", err);
        // setError(
        //   err instanceof Error ? err : new Error("Unknown error occurred")
        // );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <FeedContainer>
      {/* {error && <div>Error loading data: {error.message}</div>} */}
      {isLoading && <div>Loading...</div>}
      {feedItems?.map((item, index) => {
        return (
          <React.Fragment key={item.id || `item-${index}`}>
            <DiscoverCard item={item} />
            {index !== feedItems.length - 1 && (
              <hr className="border-[0.5px] border-[#4e4e4e]" />
            )}
          </React.Fragment>
        );
      })}
    </FeedContainer>
  );
};

export default DiscoverFeed;
