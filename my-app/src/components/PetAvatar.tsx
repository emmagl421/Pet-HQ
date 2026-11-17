import { useEffect, useRef } from "react";
import { buildLayers, type CatAvatar } from "../lib/catAvatar";

//Each frame is 32 x 32 pixals
const FRAME = 32;

type PetAvatarProps = {
    avatar: CatAvatar;
    label: string;
    size?: number; //On-screen size in pixals
    frameMs?: number; //The lenght each frame is shown
};

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);                              // success → hand back the image
        img.onerror = () => reject(new Error(`Couldn't load ${src}`)); // failure → report the error
        img.src = src;                                                 // start loading
    });
}

function tint(img: HTMLImageElement, color: string | null): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    if (color) {
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(img, 0, 0);
    }
    return canvas;
}

// Finds the cat's visible pixels (across all frames) and returns how far
// to shift it so it sits in the middle of the 32x32 frame
function centerOffset(img: HTMLImageElement, frameCount: number) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

    let minX = FRAME, minY = FRAME, maxX = -1, maxY = -1;
    for (let f = 0; f < frameCount; f++) {
        for (let y = 0; y < FRAME; y++) {
            for (let x = 0; x < FRAME; x++) {
                const alpha = pixels[(y * img.width + f * FRAME + x) * 4 + 3];
                if (alpha > 0) {
                    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
                }
            }
        }
    }
    if (maxX < 0) return { dx: 0, dy: 0 }; // nothing visible

    return {
        dx: Math.round((FRAME - (minX + maxX + 1)) / 2),
        dy: Math.round((FRAME - (minY + maxY + 1)) / 2),
    };
}

function drawFrame(
    ctx: CanvasRenderingContext2D,
    layers: HTMLCanvasElement[],
    frame: number,
    offset: { dx: number; dy: number }
) {
    ctx.clearRect(0, 0, FRAME, FRAME);
    for (const layer of layers) {
        ctx.drawImage(layer, frame * FRAME, 0, FRAME, FRAME, offset.dx, offset.dy, FRAME, FRAME);
    }
}

export default function PetAvatar({ avatar, label, size = 128, frameMs = 200 }: PetAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { coat, pattern, eyes } = avatar;

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function start() {
      const layers = buildLayers({ coat, pattern, eyes });
      const images = await Promise.all(layers.map((layer) => loadImage(layer.src)));
      if (cancelled) return; // the avatar changed or the component closed while loading

      const tinted = images.map((img, i) => tint(img, layers[i].color));
      const frameCount = Math.max(1, Math.floor(images[0].width / FRAME));
      const offset = centerOffset(images[images.length - 1], frameCount); // the outline layer

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      
      let frame = 0;
      drawFrame(ctx, tinted, frame, offset);

      // Respect the "reduce motion" accessibility setting
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion && frameCount > 1) {
        timer = window.setInterval(() => {
          frame = (frame + 1) % frameCount;
          drawFrame(ctx, tinted, frame, offset);
        }, frameMs);
      }
    }

    start().catch((err) => console.error(err));

    // Cleanup: stop the old animation before starting a new one
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [coat, pattern, eyes, frameMs]);

  return (
    <canvas
      ref={canvasRef}
      width={FRAME}
      height={FRAME}
      role="img"
      aria-label={label}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}
