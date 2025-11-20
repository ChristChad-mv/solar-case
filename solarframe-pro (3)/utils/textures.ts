
import * as THREE from 'three';

export const createSolarTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Base - Deep Monocrystalline Blue/Black
    // Adding a subtle gradient to simulate light interaction
    const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
    gradient.addColorStop(0, '#0f172a'); // Dark Slate
    gradient.addColorStop(1, '#000000'); // Pure Black
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Main Busbars (Thicker silver lines)
    ctx.strokeStyle = '#e2e8f0'; // Bright Silver
    ctx.lineWidth = 4;
    
    const cols = 5;
    const colWidth = 1024 / cols;
    for (let i = 1; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * colWidth, 0);
      ctx.lineTo(i * colWidth, 1024);
      ctx.stroke();
    }

    // Fingers (Thin horizontal lines collecting current)
    ctx.strokeStyle = '#475569'; // Darker Grey for subtlety
    ctx.lineWidth = 1;
    for (let i = 0; i < 1024; i += 12) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }

    // Add slight noise/grain for realism
    const imageData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 10;
      data[i] += noise;
      data[i+1] += noise;
      data[i+2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
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
