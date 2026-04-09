// import React, { useEffect, useRef } from 'react';

// interface Particle {
//   x: number;
//   y: number;
//   originX: number;
//   originY: number;
//   size: number;
//   color: string;
//   vx: number;
//   vy: number;
//   opacity: number;
//   targetOpacity: number;
//   life: number;
// }

// const CursorParticles: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Handle high DPI displays
//     const dpr = window.devicePixelRatio || 1;
//     let width = window.innerWidth;
//     let height = window.innerHeight;

//     const resize = () => {
//       width = window.innerWidth;
//       height = window.innerHeight;
//       canvas.width = width * dpr;
//       canvas.height = height * dpr;
//       ctx.scale(dpr, dpr);
//     };

//     resize();
//     window.addEventListener('resize', resize);

//     // Mouse tracking
//     const mouse = { x: width / 2, y: height / 2, moved: false };
//     const prevMouse = { x: width / 2, y: height / 2 };

//     const onMouseMove = (e: MouseEvent) => {
//       prevMouse.x = mouse.x;
//       prevMouse.y = mouse.y;
//       mouse.x = e.clientX;
//       mouse.y = e.clientY;
//       mouse.moved = true;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (e.touches.length > 0) {
//         prevMouse.x = mouse.x;
//         prevMouse.y = mouse.y;
//         mouse.x = e.touches[0].clientX;
//         mouse.y = e.touches[0].clientY;
//         mouse.moved = true;
//       }
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('touchmove', onTouchMove);

//     // Particle settings
//     const isMobile = window.innerWidth < 768;
//     const maxParticles = isMobile ? 15 : 40;
//     const colors = ['rgba(0, 229, 255,', 'rgba(255, 255, 255,']; // Neon cyan and white
//     const particles: Particle[] = [];

//     // Initialize particles
//     for (let i = 0; i < maxParticles; i++) {
//       particles.push({
//         x: Math.random() * width,
//         y: Math.random() * height,
//         originX: Math.random() * width,
//         originY: Math.random() * height,
//         size: Math.random() * 2 + 0.5,
//         color: colors[Math.floor(Math.random() * colors.length)],
//         vx: (Math.random() - 0.5) * 0.5,
//         vy: (Math.random() - 0.5) * 0.5,
//         opacity: Math.random() * 0.5 + 0.1,
//         targetOpacity: Math.random() * 0.5 + 0.1,
//         life: Math.random() * 100,
//       });
//     }

//     let animationFrameId: number;

//     const render = () => {
//       // Create trailing effect by clearing with a slightly opaque black
//       ctx.globalCompositeOperation = 'source-over';
//       ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Very subtle fade for trails against our near-black bg
//       ctx.fillRect(0, 0, width, height);

//       ctx.globalCompositeOperation = 'lighter';

//       const dx = mouse.x - prevMouse.x;
//       const dy = mouse.y - prevMouse.y;
//       const speed = Math.sqrt(dx * dx + dy * dy);

//       particles.forEach((p) => {
//         // Distance to mouse
//         const distDx = mouse.x - p.x;
//         const distDy = mouse.y - p.y;
//         const distance = Math.sqrt(distDx * distDx + distDy * distDy);

//         // Attraction / physics
//         const maxDist = 250; // Radius of attraction
//         let force = 0;

//         if (distance < maxDist && distance > 0) {
//           // Attract towards cursor gently
//           force = (maxDist - distance) / maxDist;
//           p.vx += (distDx / distance) * force * 0.05 * (speed > 5 ? 1.5 : 1);
//           p.vy += (distDy / distance) * force * 0.05 * (speed > 5 ? 1.5 : 1);
//           p.targetOpacity = 0.8; // Glow brighter near mouse
//         } else {
//           // Wander back to origin slightly or just idle
//           p.vx += (p.originX - p.x) * 0.0001;
//           p.vy += (p.originY - p.y) * 0.0001;
//           p.targetOpacity = 0.2; // Dim away from mouse
//         }

//         // Friction
//         p.vx *= 0.95;
//         p.vy *= 0.95;

//         // Add idle float
//         p.vx += Math.sin(p.life * 0.01) * 0.02;
//         p.vy += Math.cos(p.life * 0.01) * 0.02;

//         p.x += p.vx;
//         p.y += p.vy;
//         p.life++;

//         // Smooth opacity transition
//         p.opacity += (p.targetOpacity - p.opacity) * 0.05;

//         // Wrap around boundaries smoothly (or bounce)
//         if (p.x < -10) p.x = width + 10;
//         if (p.x > width + 10) p.x = -10;
//         if (p.y < -10) p.y = height + 10;
//         if (p.y > height + 10) p.y = -10;

//         // Draw particle
//         ctx.beginPath();
//         // Glow effect
//         ctx.shadowBlur = 10;
//         ctx.shadowColor = p.color + '1)'; // Full opacity color for glow
        
//         ctx.fillStyle = p.color + p.opacity + ')';
//         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//         ctx.fill();
        
//         // Reset shadow for next particle to avoid stacking too much if not intended
//         ctx.shadowBlur = 0;
//       });

//       animationFrameId = requestAnimationFrame(render);
//     };

//     render();

//     return () => {
//       window.removeEventListener('resize', resize);
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('touchmove', onTouchMove);
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 z-10 pointer-events-none"
//       style={{
//         width: '100vw',
//         height: '100vh',
//         mixBlendMode: 'screen', // Helps blend glows with bg
//       }}
//       aria-hidden="true"
//     />
//   );
// };

// export default CursorParticles;
