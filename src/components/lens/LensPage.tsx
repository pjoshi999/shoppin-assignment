import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CameraService, { PhotoResult } from "../../services/CameraServices";

// Enhanced styled components
const LensContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #000;
  color: #fff;
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

// const NoImagePlaceholder = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   padding: 32px;
//   color: rgba(255, 255, 255, 0.7);
//   height: 100%;

//   svg {
//     font-size: 48px;
//     margin-bottom: 16px;
//     opacity: 0.8;
//   }

//   p {
//     max-width: 280px;
//     line-height: 1.4;
//   }
// `;

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

const LensPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState<PhotoResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const photo = await CameraService.takePhoto();
        setCurrentImage(photo);
      } catch (error) {
        console.error("Failed to take photo:", error);
      }
    };

    fetchPhoto();
  }, []);

  const handleSelectFromGallery = async () => {
    try {
      const photo = await CameraService.selectFromGallery();
      setCurrentImage(photo);
    } catch (error) {
      console.error("Failed to select from gallery:", error);
    }
  };

  const handleAnalyzeImage = () => {
    if (!currentImage) return;

    setIsAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate("/lens/results", {
        state: {
          image: currentImage,
        },
      });
    }, 1500);
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
      const croppedImage = await getCroppedImage(imgRef.current, completedCrop);
      setCurrentImage(croppedImage);
      setIsCropping(false);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
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
                <></>
                // <NoImagePlaceholder>
                //   <svg
                //     width="48"
                //     height="48"
                //     viewBox="0 0 24 24"
                //     fill="currentColor"
                //   >
                //     <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                //   </svg>
                //   <p>
                //     Take a photo or select an image to search with Google Lens
                //   </p>
                // </NoImagePlaceholder>
              )}
            </ImagePreview>
          </LensViewport>

          {currentImage?.webPath && (
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

            <ActionButton
              onClick={handleAnalyzeImage}
              disabled={!currentImage || isAnalyzing}
              style={{ opacity: !currentImage ? 0.5 : 1 }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              Search
            </ActionButton>
          </ActionBar>
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
