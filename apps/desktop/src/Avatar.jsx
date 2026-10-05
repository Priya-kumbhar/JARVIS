import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";

Live2DModel.registerTicker(PIXI.Ticker);

const MODEL_PATH =
  "/live2d/hiyori_en/hiyori_free/runtime/hiyori_free_t08.model3.json";

const MOTION_MAP = {
  idle: "Idle",
  thinking: "FlickDown",
  speaking: "Tap",
  happy: "Flick",
};

const FALLBACK_EMOJI = {
  idle: "🤖",
  thinking: "🤔",
  speaking: "💬",
  happy: "😊",
};

export default function Avatar({ expression = "idle" }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver = null;

    const init = async () => {
      try {
        const container = containerRef.current;

        if (!container) {
          console.error("[Avatar] Container not found");
          return;
        }

        // ----------------------------------
        // CREATE PIXI APP
        // ----------------------------------

        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);

        const app = new PIXI.Application({
          width,
          height,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        if (cancelled) {
          app.destroy(true);
          return;
        }

        appRef.current = app;

        // IMPORTANT:
        // Pixi owns this canvas, React does not.
        container.appendChild(app.view);

        app.view.style.width = "100%";
        app.view.style.height = "100%";
        app.view.style.display = "block";

        // ----------------------------------
        // LOAD LIVE2D MODEL
        // ----------------------------------

        console.log("[Avatar] Loading model...");

        const model = await Live2DModel.from(MODEL_PATH, {
          autoInteract: false,
        });

        if (cancelled) {
          model.destroy();
          return;
        }

        modelRef.current = model;

        console.log("[Avatar] Model loaded successfully");

        app.stage.addChild(model);

        // ----------------------------------
        // MODEL POSITION
        // ----------------------------------

        model.anchor.set(0.5, 0);  // top-centre: model grows downward from head

        // Use the fixed native model height — NOT model.height which changes
        // as we call scale.set() and creates a circular scaling bug
        const nativeHeight = model.internalModel.originalHeight || 1800;

        const resizeModel = () => {
          if (!appRef.current || !modelRef.current || !containerRef.current) {
            return;
          }

          const newWidth  = Math.max(containerRef.current.clientWidth,  1);
          const newHeight = Math.max(containerRef.current.clientHeight, 1);

          app.renderer.resize(newWidth, newHeight);

          // Scale so the model fills ~85% of the container height
          const scale = (newHeight * 0.85) / nativeHeight;
          model.scale.set(scale);

          // Centre horizontally
          model.x = newWidth / 2;

          // Nudge above canvas top to crop the blank whitespace at top of model
          model.y = -newHeight * 0.08;
        };

        // RAF delay: let the browser finish CSS layout so clientHeight is real
        requestAnimationFrame(() => {
          resizeModel();
        });

        // ----------------------------------
        // HANDLE CONTAINER RESIZE
        // ----------------------------------

        resizeObserver = new ResizeObserver(() => {
          resizeModel();
        });

        resizeObserver.observe(container);

        // ----------------------------------
        // START IDLE MOTION
        // ----------------------------------

        model.motion("Idle");

        console.log("[Avatar] Live2D ready");
      } catch (error) {
        console.error("[Avatar] Live2D load failed:", error);

        if (!cancelled) {
          setFailed(true);
        }
      }
    };

    init();

    // ----------------------------------
    // CLEANUP
    // ----------------------------------

    return () => {
      cancelled = true;

      resizeObserver?.disconnect();
      resizeObserver = null;

      const model = modelRef.current;
      const app = appRef.current;

      modelRef.current = null;
      appRef.current = null;

      try {
        if (model) {
          model.destroy();
        }
      } catch (err) {
        console.warn("[Avatar] Model cleanup warning:", err);
      }

      try {
        if (app) {
          app.destroy(true, {
            children: true,
            texture: false,
            baseTexture: false,
          });
        }
      } catch (err) {
        console.warn("[Avatar] Pixi cleanup warning:", err);
      }
    };
  }, []);

  // ----------------------------------
  // CHANGE MOTION
  // ----------------------------------

  useEffect(() => {
    const model = modelRef.current;

    if (!model) return;

    const motion = MOTION_MAP[expression] || "Idle";

    try {
      model.motion(motion);
    } catch (error) {
      console.warn(`[Avatar] Motion "${motion}" failed:`, error);
    }
  }, [expression]);

  // ----------------------------------
  // FALLBACK
  // ----------------------------------

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span
          className="text-6xl"
          style={{
            filter:
              expression === "thinking"
                ? "grayscale(0.5)"
                : "none",
            animation: "avatarPulse 2s ease-in-out infinite",
          }}
        >
          {FALLBACK_EMOJI[expression] || "🤖"}
        </span>

        <style>{`
          @keyframes avatarPulse {
            0%, 100% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.06);
            }
          }
        `}</style>
      </div>
    );
  }

  // ----------------------------------
  // PIXI CONTAINER
  // ----------------------------------

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[45%] min-h-[280px] overflow-hidden flex items-end justify-center"
    />
  );
}