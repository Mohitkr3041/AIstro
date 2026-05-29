import { useEffect, useRef } from "react";

export function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return undefined;
    }

    const stars = [];
    let frameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.length = 0;

      for (let i = 0; i < 110; i += 1) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.3,
          opacity: Math.random() * 0.8 + 0.15,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 92, 255, ${star.opacity})`;
        ctx.fill();

        star.opacity += star.speed * 0.018;
        if (star.opacity > 0.95 || star.opacity < 0.12) {
          star.speed *= -1;
        }
      });

      frameId = requestAnimationFrame(animate);
    };

    setCanvasSize();
    animate();
    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-violet-50/50" />
    </div>
  );
}
