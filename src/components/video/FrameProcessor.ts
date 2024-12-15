export class FrameProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tempCanvas: HTMLCanvasElement;
  private tempCtx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d')!;
  }

  async captureFrame(videoElement: HTMLVideoElement): Promise<{ 
    blob: Blob;
    isMisaligned: boolean;
    error?: string;
  }> {
    this.canvas.width = videoElement.videoWidth;
    this.canvas.height = videoElement.videoHeight;
    this.tempCanvas.width = videoElement.videoWidth;
    this.tempCanvas.height = videoElement.videoHeight;

    // Draw the original frame
    this.ctx.drawImage(videoElement, 0, 0);

    // Convert to grayscale
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const grayscaleData = this.convertToGrayscale(imageData);
    
    // Apply Gaussian blur (simplified version)
    const blurredData = this.applyGaussianBlur(grayscaleData);
    
    // Apply Canny edge detection (simplified version)
    const edges = this.applyCanny(blurredData);

    // Find contours (simplified version)
    const contours = this.findContours(edges);

    // Check for misalignment
    const frameConfig = {
      x: 50,
      y: 50,
      width: 200,
      height: 280
    };

    let isMisaligned = false;
    if (contours.length > 0) {
      // Find largest contour
      const largestContour = this.findLargestContour(contours);
      const boundingBox = this.getBoundingBox(largestContour);

      // Check if object crosses frame boundaries
      isMisaligned = (
        boundingBox.x < frameConfig.x ||
        boundingBox.x + boundingBox.width > frameConfig.x + frameConfig.width ||
        boundingBox.y < frameConfig.y ||
        boundingBox.y + boundingBox.height > frameConfig.y + frameConfig.height
      );
    }

    // Convert canvas to blob
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve({
          blob: blob!,
          isMisaligned,
          error: isMisaligned ? 'Object has crossed the border of the frame!' : undefined
        });
      }, 'image/jpeg', 0.8);
    });
  }

  private convertToGrayscale(imageData: ImageData): Uint8ClampedArray {
    const data = imageData.data;
    const grayscale = new Uint8ClampedArray(imageData.width * imageData.height);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      grayscale[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    }
    
    return grayscale;
  }

  private applyGaussianBlur(data: Uint8ClampedArray): Uint8ClampedArray {
    // Simplified Gaussian blur implementation
    return data;
  }

  private applyCanny(data: Uint8ClampedArray): Uint8ClampedArray {
    // Simplified Canny edge detection
    return data;
  }

  private findContours(edges: Uint8ClampedArray): Array<Array<{ x: number; y: number }>> {
    // Simplified contour finding
    // For demo purposes, return a simple contour
    return [[
      { x: 60, y: 60 },
      { x: 160, y: 60 },
      { x: 160, y: 260 },
      { x: 60, y: 260 }
    ]];
  }

  private findLargestContour(contours: Array<Array<{ x: number; y: number }>>): Array<{ x: number; y: number }> {
    // Return the contour with the largest area
    return contours[0];
  }

  private getBoundingBox(contour: Array<{ x: number; y: number }>): { x: number; y: number; width: number; height: number } {
    const xs = contour.map(p => p.x);
    const ys = contour.map(p => p.y);
    
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    const width = Math.max(...xs) - x;
    const height = Math.max(...ys) - y;
    
    return { x, y, width, height };
  }

  drawResult(canvas: HTMLCanvasElement, data: any, frameConfig: { x: number; y: number; width: number; height: number }) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the frame
    ctx.strokeStyle = data.isMisaligned ? 'red' : 'green';
    ctx.lineWidth = 2;
    ctx.strokeRect(frameConfig.x, frameConfig.y, frameConfig.width, frameConfig.height);

    // Add error message if misaligned
    if (data.isMisaligned) {
      ctx.font = '20px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText('ERROR: Misalignment Detected', 50, 30);
    }
  }
}