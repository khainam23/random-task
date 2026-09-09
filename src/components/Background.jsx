import { useEffect, useRef } from 'react';

// ─── Optimised background: CSS gradient base + Canvas 2D fluid blobs ───
// WebGL2 FBO approach had alpha issues — Canvas 2D is simpler,
// guaranteed visible, and still very performant at 30fps.

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    let W, H, animId, lastTime = 0;
    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
    const FPS_CAP = 30;
    const INTERVAL = 1000 / FPS_CAP;

    // ── Blob definitions (position as fraction of screen) ──────
    const blobs = [
      { x: 0.15, y: 0.20, r: 0.38, c1: '#1d4ed8', c2: '#0ea5e9', speed: 0.00018, ox: 0.08, oy: 0.07 },
      { x: 0.80, y: 0.75, r: 0.32, c1: '#4f46e5', c2: '#3b82f6', speed: 0.00022, ox: 0.07, oy: 0.09 },
      { x: 0.50, y: 0.15, r: 0.28, c1: '#0369a1', c2: '#6366f1', speed: 0.00015, ox: 0.10, oy: 0.06 },
      { x: 0.85, y: 0.25, r: 0.22, c1: '#1e40af', c2: '#0ea5e9', speed: 0.00025, ox: 0.06, oy: 0.08 },
      { x: 0.10, y: 0.80, r: 0.26, c1: '#312e81', c2: '#3b82f6', speed: 0.00020, ox: 0.09, oy: 0.05 },
    ];

    // ── Aurora lines ────────────────────────────────────────────
    const auroras = [
      { yBase: 0.22, amp: 0.06, freq: 2.2, speed: 0.0004, hue: '59,130,246' },
      { yBase: 0.68, amp: 0.05, freq: 1.8, speed: 0.0003, hue: '99,102,241' },
      { yBase: 0.45, amp: 0.04, freq: 2.8, speed: 0.0005, hue: '14,165,233' },
    ];

    // ── Particles ───────────────────────────────────────────────
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.8 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0006 + Math.random() * 0.0008,
      drift: (Math.random() - 0.5) * 0.00008,
    }));

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const onMouse = e => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    const onTouch = e => {
      if (!e.touches.length) return;
      mx = e.touches[0].clientX / window.innerWidth;
      my = e.touches[0].clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });

    function draw(ts) {
      animId = requestAnimationFrame(draw);
      if (ts - lastTime < INTERVAL) return;
      lastTime = ts;
      const t = ts;

      // Smooth mouse
      tmx += (mx - tmx) * 0.05;
      tmy += (my - tmy) * 0.05;

      // ── 1. Dark base ───────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#05080f';
      ctx.fillRect(0, 0, W, H);

      // ── 2. Fluid blobs (radial gradients, globalCompositeOperation) ─
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      blobs.forEach((b, i) => {
        const bx = (b.x + Math.sin(t * b.speed + i * 1.3) * b.ox
                       + (tmx - 0.5) * 0.04) * W;
        const by = (b.y + Math.cos(t * b.speed * 0.8 + i * 0.9) * b.oy
                       + (tmy - 0.5) * 0.04) * H;
        const r  = b.r * Math.min(W, H);

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        g.addColorStop(0,   b.c1 + 'cc');  // ~80% opacity center
        g.addColorStop(0.5, b.c2 + '55');  // ~33%
        g.addColorStop(1,   b.c1 + '00');  // transparent edge
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(bx, by,
          r * (0.9 + 0.1 * Math.sin(t * 0.0003 + i)),
          r * (0.8 + 0.1 * Math.cos(t * 0.0004 + i)),
          t * 0.0001 * (i % 2 === 0 ? 1 : -1),
          0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // ── 3. Aurora streaks ──────────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      auroras.forEach(a => {
        const yc = a.yBase * H;
        const points = 80;

        // Build path
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const px = (i / points) * W;
          const py = yc
            + Math.sin(i / points * Math.PI * a.freq + t * a.speed) * a.amp * H
            + Math.sin(i / points * Math.PI * (a.freq * 1.7) + t * a.speed * 1.3) * a.amp * H * 0.4;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }

        // Glow effect via multiple strokes
        [12, 6, 2].forEach((lw, li) => {
          const alpha = [0.03, 0.07, 0.18][li];
          ctx.strokeStyle = `rgba(${a.hue},${alpha})`;
          ctx.lineWidth   = lw;
          ctx.stroke();
        });
      });

      ctx.restore();

      // ── 4. Particles ───────────────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      particles.forEach(p => {
        const px    = ((p.x + p.drift * t * 0.01) % 1 + 1) % 1 * W;
        const py    = (p.y - p.speed * 0.02 * (t / 1000)) % 1 * H;
        const alpha = 0.25 + 0.45 * Math.abs(Math.sin(t * 0.001 * p.speed * 800 + p.phase));

        const g = ctx.createRadialGradient(px, py, 0, px, py, p.r * 2.5);
        g.addColorStop(0,   `rgba(160,210,255,${alpha})`);
        g.addColorStop(1,   'rgba(160,210,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // ── 5. Mouse glow ──────────────────────────────────────────
      const mgx = tmx * W, mgy = tmy * H;
      const mgr = Math.min(W, H) * 0.22;
      const mg  = ctx.createRadialGradient(mgx, mgy, 0, mgx, mgy, mgr);
      mg.addColorStop(0,   'rgba(96,165,250,0.10)');
      mg.addColorStop(0.5, 'rgba(59,130,246,0.04)');
      mg.addColorStop(1,   'rgba(29,78,216,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // ── 6. Center vignette (darken mid so content reads well) ──
      const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
      vg.addColorStop(0,   'rgba(5,8,15,0.55)');
      vg.addColorStop(0.5, 'rgba(5,8,15,0.20)');
      vg.addColorStop(1,   'rgba(5,8,15,0)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none', display: 'block',
      }}
    />
  );
}
