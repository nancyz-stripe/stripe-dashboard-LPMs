import { useRef, useEffect, useState, useCallback } from 'react';
import { geoOrthographic, geoPath, geoGraticule, geoContains, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Region configs: rotation [lambda, phi, gamma] and scale multiplier (>1 = zoom in)
const REGION_CONFIGS = {
  'Global':       { rotation: [0, -20, 0],    scale: 1 },
  'Americas':     { rotation: [80, -20, 0],   scale: 1.4 },
  'Europe':       { rotation: [-10, -52, 0],  scale: 2.2 },
  'Asia-Pacific': { rotation: [-100, -25, 0], scale: 1.4 },
  'Middle East':  { rotation: [-45, -25, 0],  scale: 1.8 },
  'Africa':       { rotation: [-15, 0, 0],    scale: 1.6 },
};

// Payment volume heatmap data — ISO 3166-1 numeric country codes
// Values 0–1 represent relative payment volume intensity
const VOLUME_DATA = {
  // Europe — high volume
  276: 0.95, // Germany (DE)
  528: 0.85, // Netherlands (NL)
  250: 0.75, // France (FR)
  826: 0.70, // United Kingdom
  724: 0.55, // Spain
  380: 0.50, // Italy
  56:  0.45, // Belgium
  40:  0.40, // Austria
  756: 0.38, // Switzerland
  616: 0.35, // Poland
  752: 0.32, // Sweden
  578: 0.28, // Norway
  208: 0.26, // Denmark
  246: 0.24, // Finland
  372: 0.30, // Ireland
  620: 0.22, // Portugal
  203: 0.20, // Czech Republic

  // Americas
  840: 0.90, // United States
  124: 0.50, // Canada
  76:  0.55, // Brazil
  484: 0.35, // Mexico
  32:  0.25, // Argentina
  152: 0.20, // Chile
  170: 0.18, // Colombia

  // Asia-Pacific
  392: 0.60, // Japan
  156: 0.55, // China
  410: 0.45, // South Korea
  36:  0.50, // Australia
  356: 0.40, // India
  702: 0.35, // Singapore
  360: 0.20, // Indonesia
  764: 0.18, // Thailand
  458: 0.22, // Malaysia
  554: 0.30, // New Zealand

  // Middle East
  784: 0.40, // UAE
  682: 0.35, // Saudi Arabia
  376: 0.30, // Israel
  792: 0.25, // Turkey
  634: 0.15, // Qatar

  // Africa
  710: 0.30, // South Africa
  566: 0.20, // Nigeria
  404: 0.15, // Kenya
  818: 0.18, // Egypt
  504: 0.12, // Morocco
};

// Interpolate between base color and intense purple based on volume
function getHeatmapColor(volume) {
  if (volume === undefined) return null;
  // From light lavender to deep brand purple
  const r = Math.round(230 - volume * 130); // 230 → 100
  const g = Math.round(220 - volume * 150); // 220 → 70
  const b = Math.round(250 - volume * 10);  // 250 → 240
  const alpha = 0.35 + volume * 0.55;       // 0.35 → 0.9
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Globe({ size = 360, activeRegion = 'Europe', focusCountryId = null, onCountryClick }) {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const countriesRef = useRef(null);
  const rotationRef = useRef([-10, -52, 0]);
  const scaleRef = useRef(2.2);
  const targetRotationRef = useRef([-10, -52, 0]);
  const targetScaleRef = useRef(2.2);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(false);
  const projectionRef = useRef(null);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // Load world data
  useEffect(() => {
    fetch(WORLD_URL)
      .then((res) => res.json())
      .then((world) => {
        worldRef.current = feature(world, world.objects.countries);
        countriesRef.current = worldRef.current.features;
        setLoaded(true);
      })
      .catch(() => {});
  }, []);

  // Center on a specific country when focusCountryId is set
  useEffect(() => {
    if (!focusCountryId || !countriesRef.current) return;
    const country = countriesRef.current.find(c => parseInt(c.id, 10) === focusCountryId);
    if (country) {
      const centroid = geoCentroid(country);
      targetRotationRef.current = [-centroid[0], -centroid[1], 0];
      targetScaleRef.current = 3.0;
      autoRotateRef.current = false;
    }
  }, [focusCountryId]);

  // Update target rotation + scale when region changes (skip if country is focused)
  useEffect(() => {
    if (focusCountryId) return;
    const config = REGION_CONFIGS[activeRegion] || REGION_CONFIGS['Europe'];
    targetRotationRef.current = config.rotation;
    targetScaleRef.current = config.scale;
    autoRotateRef.current = activeRegion === 'Global';
  }, [activeRegion, focusCountryId]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !countriesRef.current) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = size;
    const h = size;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const baseScale = w / 2 - 2;
    const projection = geoOrthographic()
      .translate([w / 2, h / 2])
      .scale(baseScale * scaleRef.current)
      .rotate(rotationRef.current)
      .clipAngle(90);

    projectionRef.current = projection;
    const path = geoPath(projection, ctx);

    ctx.clearRect(0, 0, w, h);

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, 2 * Math.PI);
    ctx.clip();

    // Ocean / globe background
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 2, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(w / 2 - 40, h / 2 - 40, 20, w / 2, h / 2, w / 2);
    gradient.addColorStop(0, '#f7f5fd');
    gradient.addColorStop(0.5, '#eeeafc');
    gradient.addColorStop(1, '#e8e4ff');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Graticule
    const graticule = geoGraticule().step([20, 20]);
    ctx.beginPath();
    path(graticule());
    ctx.strokeStyle = 'rgba(200, 195, 230, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Draw each country individually with heatmap coloring
    countriesRef.current.forEach((country) => {
      const id = parseInt(country.id, 10);
      const volume = VOLUME_DATA[id];
      const heatColor = getHeatmapColor(volume);

      ctx.beginPath();
      path(country);

      if (heatColor) {
        // Country with payment volume — heatmap color
        ctx.fillStyle = heatColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(140, 120, 200, 0.5)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      } else {
        // Country without data — neutral base
        ctx.fillStyle = 'rgba(200, 195, 230, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(180, 170, 220, 0.35)';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [size]);

  // Animation loop
  useEffect(() => {
    if (!loaded) return;

    const animate = () => {
      const current = rotationRef.current;
      const target = targetRotationRef.current;

      // Smooth interpolation to target rotation
      const ease = 0.12;
      const autoRotateSpeed = autoRotateRef.current && !isDraggingRef.current ? 0.08 : 0;

      const newRotation = [
        current[0] + (target[0] - current[0]) * ease + autoRotateSpeed,
        current[1] + (target[1] - current[1]) * ease,
        0,
      ];

      // Smooth interpolation to target scale
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * ease;

      // Apply drag velocity
      if (!isDraggingRef.current && (Math.abs(velocityRef.current.x) > 0.01 || Math.abs(velocityRef.current.y) > 0.01)) {
        newRotation[0] += velocityRef.current.x;
        newRotation[1] += velocityRef.current.y;
        targetRotationRef.current = [...newRotation];
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
      }

      // Update auto-rotate target (only for Global)
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current[0] += autoRotateSpeed;
      }

      rotationRef.current = newRotation;
      draw();
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [loaded, draw]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    clickStartRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    const sensitivity = 0.3;

    rotationRef.current = [
      rotationRef.current[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, rotationRef.current[1] - dy * sensitivity)),
      0,
    ];
    targetRotationRef.current = [...rotationRef.current];
    velocityRef.current = { x: dx * sensitivity, y: -dy * sensitivity };
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e) => {
    const dx = e.clientX - clickStartRef.current.x;
    const dy = e.clientY - clickStartRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 5) return;
    if (!onCountryClick || !projectionRef.current || !countriesRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (e.clientX - rect.left) * (canvas.width / rect.width / dpr);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height / dpr);
    // Canvas-relative coords for tooltip positioning
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const coords = projectionRef.current.invert([x, y]);
    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) {
      onCountryClick(null, { canvasX, canvasY });
      return;
    }

    for (const country of countriesRef.current) {
      if (geoContains(country, coords)) {
        onCountryClick(parseInt(country.id, 10), { canvasX, canvasY });
        return;
      }
    }
    onCountryClick(null, { canvasX, canvasY });
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size, cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    />
  );
}
