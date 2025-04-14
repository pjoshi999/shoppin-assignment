import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CameraService, { PhotoResult } from "../services/CameraServices";
import { TabProps } from "../types";

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

const LensContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100dvh;
  background-color: ${theme.colors.background};
  color: ${theme.colors.textPrimary};
  position: relative;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  z-index: 10;
  position: relative;
  background-color: ${theme.colors.background};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: white;
`;

const LensViewport = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  position: relative;
`;

const ImagePreview = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: ${(props) => (props.hasImage ? "50dvh" : "74dvh")};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #111;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: white;
  font-size: 12px;
  cursor: pointer;
  padding: 8px;

  svg {
    margin-bottom: 6px;
    font-size: 24px;
  }
`;

const CameraTrigger = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:active {
    transform: scale(0.95);
  }
`;

const TriggerInner = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
`;

const NoImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.7);
  height: 100%;

  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.8;
  }

  p {
    max-width: 280px;
    line-height: 1.4;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResultsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.textPrimary};
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin: 8px 0;
  padding: 0 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<TabProps>`
  padding: 12px 16px;
  background: none;
  border: none;
  color: ${(props) =>
    props.$active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${(props) => (props.$active ? "500" : "normal")};
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
      props.$active ? theme.colors.primary : "transparent"};
    border-radius: 3px 3px 0 0;
  }
`;

const ResultsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  background-color: ${theme.colors.backgroundLight};
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
  margin: 5px 0 4px 0;
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
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 10px;
`;

const CornerCropIndicator = styled(ReactCrop)`
  & .ReactCrop__crop-selection {
    border: none;
  }

  & .ReactCrop__crop-selection::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 10px;
    height: 10px;
    border-top: 2px solid white;
    border-left: 2px solid white;
  }

  & .ReactCrop__crop-selection::after {
    content: "";
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    border-bottom: 2px solid white;
    border-right: 2px solid white;
  }

  & .ReactCrop__crop-selection .corner-indicator-top-right {
    content: "";
    position: absolute;
    top: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    border-top: 2px solid white;
    border-right: 2px solid white;
  }

  & .ReactCrop__crop-selection .corner-indicator-bottom-left {
    content: "";
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 10px;
    height: 10px;
    border-bottom: 2px solid white;
    border-left: 2px solid white;
  }
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
    image: "https://picsum.photos/200",
    link: "https://www.amazon.com",
    source: "Amazon.com",
  },
  {
    id: "2",
    title: "Buy Trendyol Striped Cotton Top - Tops for Women",
    image: "https://picsum.photos/201",
    link: "https://www.myntra.com",
    source: "Myntra",
  },
  {
    id: "3",
    title: "Purple Short Sleeve V-Neck Top",
    image: "https://picsum.photos/202",
    link: "https://www.gap.com",
    source: "Gap",
  },
  {
    id: "4",
    title: "H&M V-neck Cotton Top",
    image: "https://picsum.photos/203",
    link: "https://www.hm.com",
    source: "H&M",
  },
];

const LensPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState<PhotoResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (currentImage) {
      setResults(mockResults);
      setShowResults(true);
    }
  }, [currentImage]);

  useEffect(() => {
    // Update results whenever crop changes
    if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      setIsAnalyzing(true);

      const timer = setTimeout(() => {
        const shuffledResults = [...mockResults].sort(
          () => Math.random() - 0.5
        );
        setResults(shuffledResults);
        setIsAnalyzing(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [completedCrop]);

  const handleBack = () => {
    navigate("/");
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await CameraService.takePhoto();
      setCurrentImage(photo);
    } catch (error) {
      console.error("Failed to take photo:", error);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const photo = await CameraService.selectFromGallery();
      setCurrentImage(photo);
    } catch (error) {
      console.error("Failed to select from gallery:", error);
    }
  };

  const onImageLoad = () => {
    setCrop({
      unit: "%",
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    });
  };

  return (
    <LensContainer>
      <Header>
        <BackButton onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </BackButton>
        <PageTitle>Search with your camera</PageTitle>
        <div style={{ width: 24 }} />
      </Header>

      <LensViewport>
        <ImagePreview hasImage={!!currentImage?.webPath}>
          {currentImage?.webPath ? (
            <CornerCropIndicator
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={undefined}
            >
              <img
                ref={imgRef}
                src={currentImage.webPath}
                alt="Selected image"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                onLoad={onImageLoad}
              />
            </CornerCropIndicator>
          ) : (
            <NoImagePlaceholder>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <p>Take a photo or select an image to search with Google Lens</p>
            </NoImagePlaceholder>
          )}
        </ImagePreview>

        {/* {currentImage?.webPath && (
          <AspectRatioSelector>
            <AspectRatioButton
              $active={selectedAspectRatio === "free"}
              onClick={() => handleAspectRatioChange("free")}
            >
              Free
            </AspectRatioButton>
            <AspectRatioButton
              $active={selectedAspectRatio === "1:1"}
              onClick={() => handleAspectRatioChange("1:1")}
            >
              Square
            </AspectRatioButton>
            <AspectRatioButton
              $active={selectedAspectRatio === "4:3"}
              onClick={() => handleAspectRatioChange("4:3")}
            >
              4:3
            </AspectRatioButton>
            <AspectRatioButton
              $active={selectedAspectRatio === "16:9"}
              onClick={() => handleAspectRatioChange("16:9")}
            >
              16:9
            </AspectRatioButton>
          </AspectRatioSelector>
        )} */}
      </LensViewport>

      {!currentImage?.webPath && (
        <ActionBar>
          <ActionButton onClick={handleSelectFromGallery}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
            </svg>
            Gallery
          </ActionButton>

          <CameraTrigger onClick={handleTakePhoto}>
            <TriggerInner />
          </CameraTrigger>

          <div style={{ width: 70 }} />
        </ActionBar>
      )}

      {currentImage?.webPath && showResults && (
        <ResultsSection>
          <TabsContainer>
            <Tab
              $active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All
            </Tab>
            <Tab
              $active={activeTab === "products"}
              onClick={() => setActiveTab("products")}
            >
              Products
            </Tab>
            <Tab
              $active={activeTab === "visual"}
              onClick={() => setActiveTab("visual")}
            >
              Visual matches
            </Tab>
            <Tab
              $active={activeTab === "about"}
              onClick={() => setActiveTab("about")}
            >
              About this image
            </Tab>
          </TabsContainer>

          <LimitedResultsNotice>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            Results for people are limited
          </LimitedResultsNotice>

          <ResultsList>
            {results.map((result) => (
              <ResultCard key={result.id}>
                <ResultImageContainer>
                  <ResultImage src={result.image} alt={result.title} />
                </ResultImageContainer>
                <ResultContent>
                  <ResultSource>
                    <SourceLogo>{result.source.charAt(0)}</SourceLogo>
                    {result.source}
                  </ResultSource>
                  <ResultTitle>{result.title}</ResultTitle>
                </ResultContent>
              </ResultCard>
            ))}
          </ResultsList>
        </ResultsSection>
      )}

      {isAnalyzing && (
        <LoadingOverlay>
          <LoadingSpinner />
          <p>Analyzing image...</p>
        </LoadingOverlay>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </LensContainer>
  );
};

export default LensPage;
