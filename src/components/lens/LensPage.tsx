import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CameraService, { PhotoResult } from "../../services/CameraServices";

// Theme
const theme = {
  colors: {
    background: "#000000",
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

// Styled Components
const LensContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
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
  position: absolute;
  top: 0;
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
  justify-content: center;
  width: 100%;
  flex: 1;
  position: relative;
`;

const ImagePreview = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${(props) => (props.$hasImage ? "transparent" : "#111")};

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
  position: absolute;
  bottom: 0;
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

const ImageTools = styled.div`
  position: absolute;
  bottom: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 10px;
  z-index: 5;
`;

const ToolButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  padding: 8px 16px;

  svg {
    margin-bottom: 4px;
    font-size: 18px;
  }
`;

const CropContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  background-color: #000;
  display: flex;
  flex-direction: column;
`;

const CropHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const CropTitle = styled.h3`
  font-size: 16px;
  margin: 0;
  color: white;
`;

const CropArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #000;
  overflow: hidden;
`;

const CropButton = styled.button`
  padding: 8px 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    background-color: rgba(66, 133, 244, 0.5);
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
`;

// Results UI Components
const ResultsPanel = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.$visible ? "60%" : "0")};
  background-color: #121212;
  transition: height 0.3s ease-in-out;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
  z-index: 15;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #3c4043;
  position: relative;
`;

const HandleBar = styled.div`
  width: 40px;
  height: 4px;
  background-color: #3c4043;
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
`;

const ResultsTitle = styled.h3`
  margin: 0;
  padding-top: 8px;
  font-size: 16px;
  color: ${theme.colors.textPrimary};
`;

const TabsContainer = styled.div`
  display: flex;
  overflow-x: auto;
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
  height: calc(100% - 110px);
  overflow-y: auto;
  padding: 8px 16px;
`;

const ResultCard = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  margin-bottom: 12px;
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

// Mock Results Data
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

const LensPage: React.FC = () => {
  // State management
  const [currentImage, setCurrentImage] = useState<PhotoResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [resultsViewHeight, setResultsViewHeight] = useState(60);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect to handle results when image changes
  useEffect(() => {
    if (currentImage?.webPath) {
      analyzeImage();
    } else {
      setShowResults(false);
    }
  }, [currentImage]);

  const handleBack = () => {
    // In a real app, you would navigate back
    // For this example, we'll just reset the state
    setCurrentImage(null);
    setShowResults(false);
  };

  const handleTakePhoto = async () => {
    try {
      setIsAnalyzing(true);
      const photo = await CameraService.takePhoto();
      setCurrentImage(photo);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Failed to take photo:", error);
      setIsAnalyzing(false);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      setIsAnalyzing(true);
      const photo = await CameraService.selectFromGallery();
      setCurrentImage(photo);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Failed to select from gallery:", error);
      setIsAnalyzing(false);
    }
  };

  const analyzeImage = () => {
    if (!currentImage) return;

    setIsAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      setResults(mockResults);
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1000);
  };

  const handleCrop = () => {
    setIsCropping(true);
    // Reset crop when entering crop mode
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // Make a centered square crop initially
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        1, // Square aspect ratio
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImage = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<PhotoResult> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", 0.95);
    });

    const webPath = URL.createObjectURL(blob);

    return {
      path: webPath,
      webPath,
      format: "jpeg",
    };
  };

  const handleConfirmCrop = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      setIsAnalyzing(true);
      const croppedImage = await getCroppedImage(imgRef.current, completedCrop);
      setCurrentImage(croppedImage);
      setIsCropping(false);
      // Analysis will happen automatically via useEffect when currentImage changes
    } catch (e) {
      console.error("Error cropping image:", e);
      setIsAnalyzing(false);
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
  };

  const handleToggleResultsView = () => {
    // Toggle between half screen and full screen results
    setResultsViewHeight(resultsViewHeight === 60 ? 90 : 60);
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
        <div style={{ width: 24 }} /> {/* Placeholder for spacing */}
      </Header>

      {isCropping && currentImage ? (
        <CropContainer>
          <CropHeader>
            <CancelButton onClick={handleCancelCrop}>Cancel</CancelButton>
            <CropTitle>Crop Image</CropTitle>
            <CropButton
              onClick={handleConfirmCrop}
              disabled={!completedCrop?.width || !completedCrop?.height}
            >
              Done
            </CropButton>
          </CropHeader>
          <CropArea>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
            >
              <img
                ref={imgRef}
                src={currentImage.webPath}
                alt="Crop"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </CropArea>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CropContainer>
      ) : (
        <>
          <LensViewport>
            <ImagePreview $hasImage={!!currentImage?.webPath}>
              {currentImage?.webPath ? (
                <img src={currentImage.webPath} alt="Selected" />
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
                  <p>
                    Take a photo or select an image to search with Google Lens
                  </p>
                </NoImagePlaceholder>
              )}
            </ImagePreview>
          </LensViewport>

          {currentImage?.webPath && !showResults && (
            <ImageTools>
              <ToolButton onClick={handleCrop}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z" />
                </svg>
                Crop
              </ToolButton>
            </ImageTools>
          )}

          {!showResults && (
            <ActionBar>
              <ActionButton onClick={handleSelectFromGallery}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
                </svg>
                Gallery
              </ActionButton>

              <CameraTrigger onClick={handleTakePhoto}>
                <TriggerInner />
              </CameraTrigger>

              {currentImage?.webPath && (
                <ActionButton onClick={handleCrop}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z" />
                  </svg>
                  Crop
                </ActionButton>
              )}

              {!currentImage?.webPath && (
                <div style={{ width: 70 }}></div> // Placeholder for spacing
              )}
            </ActionBar>
          )}

          {/* Results Panel - slides up from bottom after image analysis */}
          <ResultsPanel
            $visible={showResults}
            style={{ height: `${resultsViewHeight}%` }}
          >
            <ResultsHeader onClick={handleToggleResultsView}>
              <HandleBar />
              <ResultsTitle>Search results</ResultsTitle>
            </ResultsHeader>

            <TabsContainer>
              <Tab
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
              >
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

            <ResultsList>
              {results.map((result) => (
                <ResultCard key={result.id}>
                  <ResultImageContainer>
                    <ResultImage src={result.image} alt={result.title} />
                    {result.price && (
                      <ProductPrice>{result.price}</ProductPrice>
                    )}
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
          </ResultsPanel>
        </>
      )}

      {isAnalyzing && (
        <LoadingOverlay>
          <LoadingSpinner />
          <p>Analyzing image...</p>
        </LoadingOverlay>
      )}
    </LensContainer>
  );
};

export default LensPage;
