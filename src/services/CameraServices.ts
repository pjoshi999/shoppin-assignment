import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export interface PhotoResult {
  base64String?: string;
  dataUrl?: string;
  path?: string;
  webPath?: string;
  format?: string;
}

class CameraService {
  // Take a photo using the device camera
  async takePhoto(): Promise<PhotoResult> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, // Set to false since we'll handle cropping in our app
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      return {
        dataUrl: image.dataUrl,
        path: image.path,
        webPath: image.webPath,
        format: image.format,
      };
    } catch (error) {
      console.error("Error taking photo:", error);
      throw error;
    }
  }

  // Select photo from gallery
  async selectFromGallery(): Promise<PhotoResult> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, // Set to false since we'll handle cropping in our app
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      return {
        dataUrl: image.dataUrl,
        path: image.path,
        webPath: image.webPath,
        format: image.format,
      };
    } catch (error) {
      console.error("Error selecting photo:", error);
      throw error;
    }
  }

  // Convert a blob to a PhotoResult
  async blobToPhotoResult(blob: Blob): Promise<PhotoResult> {
    const webPath = URL.createObjectURL(blob);

    return {
      webPath,
      format: blob.type.split("/")[1] || "jpeg",
    };
  }

  // Save a cropped image
  async saveCroppedImage(blob: Blob): Promise<PhotoResult> {
    try {
      const webPath = URL.createObjectURL(blob);

      return {
        webPath,
        format: blob.type.split("/")[1] || "jpeg",
      };
    } catch (error) {
      console.error("Error saving cropped image:", error);
      throw error;
    }
  }

  // Convert a data URL to a blob
  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}

export default new CameraService();
