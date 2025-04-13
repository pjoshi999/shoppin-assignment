import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

// Create a theme object since we no longer rely on imported theme
const theme = {
  colors: {
    background: "#121212",
    backgroundLight: "#1e1e1e",
    primary: "#8ab4f8",
    textPrimary: "#ffffff",
    textSecondary: "#9aa0a6",
    border: "#3c4043",
    priceTag: "#202124",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
  },
};

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: ${theme.colors.background};
  color: ${theme.colors.textPrimary};
`;

const Header = styled.header`
  width: 90%;
  margin: auto;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2e3133;
  border-bottom: 1px solid ${theme.colors.border};
  border-radius: 99999px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border-radius: 24px;
  padding: 8px 0px;
  flex: 1;
  max-width: 600px;
  position: relative;
`;

const GoogleLogo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  color: #93979a;
  font-size: 14px;
`;

const ThumbnailPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ccc;
  margin-right: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 8px;
  padding: 0 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 16px;
  background: none;
  border: none;
  color: ${(props) =>
    props.active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${(props) => (props.active ? "500" : "normal")};
  position: relative;
  white-space: nowrap;
  cursor: pointer;
  font-size: 14px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 3px;
    background-color: ${(props) =>
      props.active ? theme.colors.primary : "transparent"};
    border-radius: 3px 3px 0 0;
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
`;

const LimitedResultsNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  border-bottom: 1px solid ${theme.colors.border};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ResultCard = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  margin-bottom: 16px;
`;

const ResultImageContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ResultImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: ${theme.borderRadius.small};
`;

const ResultContent = styled.div`
  padding: 12px 8px 8px 8px;
`;

const ResultTitle = styled.h4`
  margin: 0 0 4px 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
`;

const ResultSource = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.textSecondary};
  font-size: 12px;
  margin-top: 4px;
`;

const SourceLogo = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e8eaed;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const ProductPrice = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: ${theme.colors.priceTag};
  color: ${theme.colors.textPrimary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
`;

const FeedbackBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(32, 33, 36, 0.9);
  color: ${theme.colors.textPrimary};
  z-index: 100;
`;

const FeedbackText = styled.div`
  font-size: 14px;
  flex: 1;
`;

const FeedbackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  padding: 8px;
  cursor: pointer;
`;

interface ResultItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  link: string;
  source: string;
  sourceLogo?: string;
  price?: string;
}

const mockResults: ResultItem[] = [
  {
    id: "1",
    title: "Amazon.com: GuliriFei Women's Two Piece...",
    image: "https://m.media-amazon.com/images/I/71JRQsKKONL._AC_UY1000_.jpg",
    link: "https://www.amazon.com",
    source: "Amazon.com",
    sourceLogo: "https://www.amazon.com/favicon.ico",
  },
  {
    id: "2",
    title: "Buy Trendyol Striped Cotton Top - Tops for Women",
    image:
      "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/12278548/2023/6/5/d4f6f175-3518-4a97-b7c3-87b71a75ff071685955560071-Trendyol-Women-Tops-2791685955559443-1.jpg",
    link: "https://www.myntra.com",
    source: "Myntra",
    sourceLogo: "https://www.myntra.com/favicon.ico",
    price: "₹659*",
  },
  {
    id: "3",
    title: "Purple Short Sleeve V-Neck Top",
    image: "https://www.gap.com/webcontent/0052/752/084/cn52752084.jpg",
    link: "https://www.gap.com",
    source: "Gap",
    sourceLogo: "https://www.gap.com/favicon.ico",
  },
];

const LensResultsPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [showFeedback, setShowFeedback] = useState(true);

  // Get the image from the location state
  const { image } = location.state || {};

  useEffect(() => {
    // In a real app, you would analyze the image here
    // For now, we'll just set the mock results
    setResults(mockResults);
  }, []);

  return (
    <ResultsContainer>
      <Header>
        {/* <GoogleLogo>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </GoogleLogo>
        <SearchBar>
          {image?.webPath && (
            <ThumbnailPreview>
              <img src={image.webPath} alt="Search" />
            </ThumbnailPreview>
          )}
          <SearchInput>Add to search</SearchInput>
        </SearchBar>
        <AccountCircle>A</AccountCircle> */}
        <div className="flex items-center rounded-full px-4 relative w-full">
          <GoogleLogo>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </GoogleLogo>

          {/* Search Input */}
          <SearchBar>
            {image?.webPath && (
              <ThumbnailPreview>
                <img src={image.webPath} alt="Search" />
              </ThumbnailPreview>
            )}
            <SearchInput>Add to search</SearchInput>
          </SearchBar>
          <img
            src="https://lh3.googleusercontent.com/fife/ALs6j_F5MefMO-x1n7aMV1ZICIwtLY_KyyyhAE1WyKNHKSQx-Fg_6BkcfNZDNNB8BM1hA9dj0xtX4X7rs4fijaiiS-8HVbY_1F2eM8gWJp375hDctslSdTf-57Vv1Sc80__sWlVCSTu0WOJ4O1R8IDTUOcmI3rK_wDUL0fi9DxAc1hLRFrDkfa_HZG8qs7NibI18rm-AZj5jW-08v07eA6ujorBiGfhnu9sSiRdXq8MD8XQrKoh8ZqYKw34WLcyzjwImbvqxqcxs7rhqb5Wxkm5fff7BY6IiRAJgxkOCZ-IAc-SoTyzmvna64TzqW4UlWX4rTXmydOZHs-K_79J0PvFJ6Gps3-pMCZ05IU-KPHiuomAMYjPuS-dSEgkYWTONUpude0DKdFST0VdIDRbl1slQKHr-Sj7cA7MRTewod04XnioSfd-O6D1PsysphVmketjUpW34lrY9ucnwb-ylty3F14R4hngEfV_cdRb7D92b_Cbxr_NTQM7cJ4MKfQkelYKxSmzuThnUYuo-p7F9yJUVCIKuwkzd-rlqFLWlUU8Vcs9DqLF7o9Cv-EH18N6JrFo7B42IJcem8eNmiHEx-SI4hAQNW_ryQcphGQ_GLuyCJZdbyI1APrFETdGKm77HiC4v3MhJDwACfOyQmCo5g-mHlRcIZRQxQLfzdmCnxjJUvscfWzfqhcd4k-JUgV9ImCtBcXD0XoJAZnU1R8FFTdEpcWTh2XrluyPKTXJRMiMQib4Gx9-RFR5zoWBf0ziXYWRAUIuwm72T5KRmVjdfRkb09-UvLkloZIjwMGFNymuGmgyMJ2hrQCLeiTZGRDI1piAxbBpO4sSWeKJqb3UeMxYY6pXph6hKBdXGhzYlsX_Pjn1wUybYw3_5BF9IByMuOWCdKlIlPADuIA0yAOBHLWbFji8sVYAh__Pc8Ifv-xxpcTXdSM85BJlWc82kM9lNlFXnuQb9lYe_SPqO9ndeeuEpF0oDkYmvKYhXhRH6A0DN1HOCY5wbM7e_fa6Sz8lXuV7PYvVDAemnaeylpSDWzZ76Cps0q7VkD1---SgJsbhpRp4Lnq84FFi3V0OtzBv-OZD9iGRqdzBFyIUXUsD9TBoc7IXUCroHpVk56wHM4Rp4MaR9KUinP0rHYZOjSGKA0Iwpy5PIxwuNrMw32vSHMQPJtQeB4ki-9ZNtpJSz1YyZ7uKiXx4IJsqWQAi9_AKalUKo7_0OM9u0K7rPIobGjjNpGmBfn_26XeoRar98MyrRSDdrKyepuGvo_c-IYwc2L9Z9ZNOGvD13T4OGTH312KuLJKgdkCgebd-o3G4SyaF7mwrOyoLiINBizrWz_0_0mY2Fc8sHeN4IrBsc6xTtFwrldLWjBSAWwqXppsyCyQqRiRWZ_AJN1tttnzK6_o8I8A0p0xlv796FW-quYybrybZrzsUNE4je-2yJ69zDpL468HEhkALsUSpHe5Z_O8S6apnMy3nVUre0mhYQ8nS3ih6VaGaJ7F-jq9q01xLtz1vGuJhIGnvEtbfU=s64-c"
            alt=""
            className="h-8 w-8 rounded-full cursor-pointer"
          />
        </div>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All
        </Tab>
        <Tab
          active={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        >
          Products
        </Tab>
        <Tab
          active={activeTab === "visual"}
          onClick={() => setActiveTab("visual")}
        >
          Visual matches
        </Tab>
        <Tab
          active={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        >
          About this image
        </Tab>
      </TabsContainer>

      <LimitedResultsNotice>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        Results for people are limited
      </LimitedResultsNotice>

      <ResultsList>
        {results.map((result) => (
          <ResultCard key={result.id}>
            <ResultImageContainer>
              <ResultImage src={result.image} alt={result.title} />
              {result.price && <ProductPrice>{result.price}</ProductPrice>}
            </ResultImageContainer>
            <ResultContent>
              <ResultSource>
                <SourceLogo>
                  {result.sourceLogo ? (
                    <img
                      src={result.sourceLogo}
                      alt={result.source}
                      width="16"
                      height="16"
                    />
                  ) : (
                    result.source.charAt(0)
                  )}
                </SourceLogo>
                {result.source}
              </ResultSource>
              <ResultTitle>{result.title}</ResultTitle>
            </ResultContent>
          </ResultCard>
        ))}
      </ResultsList>

      {showFeedback && (
        <FeedbackBar>
          <FeedbackText>Are these results useful?</FeedbackText>
          <FeedbackButton>Yes</FeedbackButton>
          <FeedbackButton>No</FeedbackButton>
          <CloseButton onClick={() => setShowFeedback(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </CloseButton>
        </FeedbackBar>
      )}
    </ResultsContainer>
  );
};

export default LensResultsPage;
