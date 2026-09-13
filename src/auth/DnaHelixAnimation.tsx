import React, { useEffect, useRef } from 'react';

interface DnaHelixAnimationProps {
  className?: string;
  strandCount?: number;
  basePairCount?: number;
}

export const DnaHelixAnimation: React.FC<DnaHelixAnimationProps> = ({
  className = '',
  basePairCount = 38
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating ambient molecular particles
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const PARTICLE_COUNT = 45;
    const colors = ['#0891b2', '#06b6d4', '#059669', '#10b981', '#3b82f6'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2, // Drifting upward
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw floating ambient molecular particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      // 2. Render 3D Rotating DNA Double Helix
      const centerX = width * 0.5;
      const helixHeight = height * 1.1;
      const startY = -height * 0.05;
      const amplitude = Math.min(width * 0.28, 260); // Helix radius
      const stepY = helixHeight / basePairCount;

      rotationAngle += 0.016; // Smooth rotation speed

      type HelixNode = {
        strand: 1 | 2;
        x: number;
        y: number;
        z: number;
        scale: number;
        alpha: number;
        pairIndex: number;
      };

      const nodes: HelixNode[] = [];

      for (let i = 0; i < basePairCount; i++) {
        const y = startY + i * stepY;
        const angle = rotationAngle + (i * 0.22);

        // Strand 1 position (x, y, z)
        const x1 = centerX + Math.cos(angle) * amplitude;
        const z1 = Math.sin(angle); // -1 (back) to +1 (front)
        const scale1 = (z1 + 1.6) / 2.6;
        const alpha1 = Math.max(0.15, (z1 + 1.2) / 2.2);

        // Strand 2 position (180 degrees offset)
        const x2 = centerX + Math.cos(angle + Math.PI) * amplitude;
        const z2 = Math.sin(angle + Math.PI);
        const scale2 = (z2 + 1.6) / 2.6;
        const alpha2 = Math.max(0.15, (z2 + 1.2) / 2.2);

        nodes.push({ strand: 1, x: x1, y, z: z1, scale: scale1, alpha: alpha1, pairIndex: i });
        nodes.push({ strand: 2, x: x2, y, z: z2, scale: scale2, alpha: alpha2, pairIndex: i });
      }

      // Draw base-pair rungs connecting the pairs
      for (let i = 0; i < basePairCount; i++) {
        const n1 = nodes[i * 2];
        const n2 = nodes[i * 2 + 1];

        const avgZ = (n1.z + n2.z) / 2;
        const rungAlpha = Math.max(0.12, (avgZ + 1.2) / 2.2) * 0.7;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);

        // Dual-color base pair gradient
        const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        if (i % 2 === 0) {
          grad.addColorStop(0, '#0891b2'); // Cyan
          grad.addColorStop(0.5, '#22d3ee');
          grad.addColorStop(1, '#059669'); // Emerald
        } else {
          grad.addColorStop(0, '#0284c7'); // Sky
          grad.addColorStop(0.5, '#818cf8'); // Indigo
          grad.addColorStop(1, '#10b981'); // Mint
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, 2.5 * ((avgZ + 1.5) / 2.5));
        ctx.globalAlpha = rungAlpha;
        ctx.stroke();

        // Small base-pair connection dot at midpoint
        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 2 * ((avgZ + 1.5) / 2.5), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = rungAlpha * 0.9;
        ctx.fill();

        ctx.restore();
      }

      // Draw continuous helical backbone ribbons
      const drawBackbone = (strandNum: 1 | 2, color: string) => {
        const strandNodes = nodes.filter(n => n.strand === strandNum);
        if (strandNodes.length < 2) return;

        ctx.save();
        for (let i = 0; i < strandNodes.length - 1; i++) {
          const curr = strandNodes[i];
          const next = strandNodes[i + 1];

          ctx.beginPath();
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = 3.5 * curr.scale;
          ctx.globalAlpha = curr.alpha * 0.85;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8 * curr.scale;
          ctx.stroke();
        }
        ctx.restore();
      };

      drawBackbone(1, '#0891b2'); // Clinical Primary Cyan
      drawBackbone(2, '#059669'); // Social Accent Emerald

      // Draw glowing nucleotide nodes
      nodes.forEach(node => {
        ctx.save();
        ctx.beginPath();
        const radius = 5.5 * node.scale;
        ctx.arc(node.x, node.y, Math.max(2, radius), 0, Math.PI * 2);

        const nodeColor = node.strand === 1 ? '#06b6d4' : '#10b981';
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = node.alpha;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 10 * node.scale;
        ctx.fill();

        // Bright white center specular glint
        if (node.z > -0.2) {
          ctx.beginPath();
          ctx.arc(node.x - radius * 0.25, node.y - radius * 0.25, Math.max(1, radius * 0.35), 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = node.alpha * 0.9;
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [basePairCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`dna-helix-canvas ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.85
      }}
    />
  );
};
