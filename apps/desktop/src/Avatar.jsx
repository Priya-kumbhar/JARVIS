import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";


Live2DModel.registerTicker(PIXI.Ticker);

const MODEL_PATH =
  "/live2d/hiyori_en/hiyori_free/runtime/hiyori_free_t08.model3.json";
const MOTION_MAP = {
  idle:     "Idle",
  thinking: "FlickDown",
  speaking: "Tap",
  happy:    "Flick",
};

export default function Avatar({ expression = "idle" }) {
  const canvasRef = useRef(null);
  const modelRef  = useRef(null);
  const appRef    = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        const app = new PIXI.Application({
          view: canvasRef.current,
          width: 300,
          height: 380,
          backgroundAlpha: 0,      
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });
        if (cancelled) { app.destroy(); return; }
        appRef.current = app;

        
        const model = await Live2DModel.from(MODEL_PATH, {
          autoInteract: false,   
        });
        if (cancelled) return;
        modelRef.current = model;

        
        app.stage.addChild(model);
        model.anchor.set(0.5, 1.0);        
        model.x = app.screen.width  / 2;
        model.y = app.screen.height;
        model.scale.set(0.22);             

        
        model.motion("Idle");

      } catch (err) {
        console.error("[Avatar] Live2D load failed:", err);
      }
    }

    loadModel();

    return () => {
      cancelled = true;
      appRef.current?.destroy(true);  
      appRef.current  = null;
      modelRef.current = null;
    };
  }, []);

  
  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;
    const group = MOTION_MAP[expression] ?? "Idle";
    model.motion(group);
  }, [expression]);

  return (
    <div
      className="w-full flex justify-center shrink-0"
      style={{ height: 200, overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{ background: "transparent", display: "block" }}
      />
    </div>
  );
}