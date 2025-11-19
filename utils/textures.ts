import * as THREE from 'three';

export const createSolarTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base - Monocrystalline Black/Blue
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 512, 1024);

    // Grid lines (Busbars)
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    
    // Vertical lines
    const cols = 4;
    const colWidth = 512 / cols;
    for (let i = 1; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * colWidth, 0);
      ctx.lineTo(i * colWidth, 1024);
      ctx.stroke();
    }

    // Horizontal faint lines (Fingers)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i < 1024; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export const createPCBTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // PCB Green
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, 256, 128);

    // Copper Traces
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, Math.random() * 128);
      ctx.lineTo(Math.random() * 256, Math.random() * 128);
      ctx.stroke();
    }

    // IC Chips (Black rectangles)
    ctx.fillStyle = '#111827';
    for (let i = 0; i < 5; i++) {
      const w = 20 + Math.random() * 30;
      const h = 20 + Math.random() * 30;
      ctx.fillRect(Math.random() * (256 - w), Math.random() * (128 - h), w, h);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};