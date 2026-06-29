'use client';

import React, { useEffect, useRef } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import type { Testimonial } from '@/data/testimonials';

interface CircularTestimonialsProps {
  items: Testimonial[];
  autoSpeed?: number;
  bend?: number;
  borderRadius?: number;
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function createStars(rating: number) {
  return '★★★★★'.slice(0, rating);
}

function createTestimonialTexture(testimonial: Testimonial) {
  const canvas = document.createElement('canvas');
  canvas.width = 860;
  canvas.height = 560;
  const context = canvas.getContext('2d');

  if (!context) {
    return canvas;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#ffffff');
  background.addColorStop(1, '#edf5ff');

  context.save();
  roundedRect(context, 18, 18, canvas.width - 36, canvas.height - 36, 34);
  context.fillStyle = background;
  context.shadowColor = 'rgba(7, 27, 52, 0.18)';
  context.shadowBlur = 24;
  context.shadowOffsetY = 14;
  context.fill();
  context.restore();

  context.strokeStyle = 'rgba(11, 61, 145, 0.1)';
  context.lineWidth = 2;
  roundedRect(context, 18, 18, canvas.width - 36, canvas.height - 36, 34);
  context.stroke();

  context.fillStyle = '#f59e0b';
  context.font = '700 28px Arial';
  context.fillText(createStars(testimonial.rating), 66, 84);

  roundedRect(context, 66, 108, 290, 42, 21);
  context.fillStyle = '#eef4ff';
  context.fill();
  context.strokeStyle = 'rgba(11, 61, 145, 0.08)';
  context.stroke();

  context.fillStyle = '#0b3d91';
  context.font = '700 20px Arial';
  context.fillText('INSTITUTIONAL FEEDBACK', 90, 136);

  context.fillStyle = '#425b7c';
  context.font = 'italic 31px Georgia';
  const quoteLines = wrapText(context, `“${testimonial.quote}”`, 640);
  quoteLines.slice(0, 5).forEach((line, index) => {
    context.fillText(line, 66, 216 + index * 46);
  });

  context.strokeStyle = 'rgba(11, 61, 145, 0.12)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(66, 422);
  context.lineTo(canvas.width - 66, 422);
  context.stroke();

  context.fillStyle = '#d9ebff';
  context.beginPath();
  context.arc(108, 480, 29, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#1677ff';
  context.font = '700 26px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(testimonial.name.charAt(0), 108, 481);
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';

  context.fillStyle = '#071b34';
  context.font = '700 26px Arial';
  context.fillText(testimonial.name, 154, 470);

  context.fillStyle = '#516780';
  context.font = '500 20px Arial';
  context.fillText(testimonial.role, 154, 502);

  context.fillStyle = '#1677ff';
  context.font = '700 18px Arial';
  context.fillText(testimonial.organization, 154, 532);

  return canvas;
}

class TestimonialMedia {
  extra = 0;
  width = 0;
  widthTotal = 0;
  x = 0;
  padding = 0.9;
  plane!: Mesh;
  program!: Program;

  constructor(
    private geometry: Plane,
    private gl: any,
    private canvas: HTMLCanvasElement,
    private index: number,
    private length: number,
    private scene: Transform,
    private screen: { width: number; height: number },
    private viewport: { width: number; height: number },
    private bend: number,
    private borderRadius: number
  ) {
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    texture.image = this.canvas;

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      transparent: true,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 p = position;
          p.z += uSpeed * 0.03;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );

          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.003, 0.003, d);
          gl_FragColor = vec4(color.rgb, color.a * alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [this.canvas.width, this.canvas.height] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
    });
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  onResize({
    screen,
    viewport,
  }: {
    screen?: { width: number; height: number };
    viewport?: { width: number; height: number };
  } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    const scale = this.screen.width < 768 ? 0.68 : 0.82;
    this.plane.scale.y = (this.viewport.height * (350 * scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (500 * scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  update(scroll: { current: number; last: number }, direction: 'left' | 'right') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const halfViewport = this.viewport.width / 2;
      const bendAbs = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + bendAbs * bendAbs) / (2 * bendAbs);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(Math.max(radius * radius - effectiveX * effectiveX, 0.0001));

      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }
    this.program.uniforms.uTime.value += 0.028;
    this.program.uniforms.uSpeed.value = scroll.current - scroll.last;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    const isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && isBefore) {
      this.extra -= this.widthTotal;
    }
    if (direction === 'left' && isAfter) {
      this.extra += this.widthTotal;
    }
  }
}

class CircularGalleryApp {
  renderer!: Renderer;
  gl!: any;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: TestimonialMedia[] = [];
  screen = { width: 0, height: 0 };
  viewport = { width: 0, height: 0 };
  scroll = { ease: 0.05, current: 0, target: 0, last: 0, position: 0 };
  isDown = false;
  start = 0;
  raf = 0;

  constructor(
    private container: HTMLDivElement,
    private items: Testimonial[],
    private bend: number,
    private borderRadius: number,
    private autoSpeed: number
  ) {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 38;
    this.camera.position.z = 17;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 24,
      widthSegments: 44,
    });
  }

  createMedias() {
    const entries = this.items.concat(this.items);
    this.medias = entries.map((item, index) => {
      const canvas = createTestimonialTexture(item);
      return new TestimonialMedia(
        this.planeGeometry,
        this.gl,
        canvas,
        index,
        entries.length,
        this.scene,
        this.screen,
        this.viewport,
        this.bend,
        this.borderRadius
      );
    });
  }

  onPointerDown = (event: MouseEvent | TouchEvent) => {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in event ? event.touches[0].clientX : event.clientX;
  };

  onPointerMove = (event: MouseEvent | TouchEvent) => {
    if (!this.isDown) return;
    const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.scroll.target = this.scroll.position + (this.start - x) * 0.03;
  };

  onPointerUp = () => {
    this.isDown = false;
  };

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
  };

  update = () => {
    if (!this.isDown) {
      this.scroll.target -= this.autoSpeed;
    }

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';

    this.medias.forEach(media => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
    this.container.addEventListener('touchstart', this.onPointerDown, { passive: true });
    window.addEventListener('touchmove', this.onPointerMove, { passive: true });
    window.addEventListener('touchend', this.onPointerUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('mousedown', this.onPointerDown);
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    this.container.removeEventListener('touchstart', this.onPointerDown);
    window.removeEventListener('touchmove', this.onPointerMove);
    window.removeEventListener('touchend', this.onPointerUp);

    if (this.renderer?.gl?.canvas?.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularTestimonials({
  items,
  autoSpeed = 0.08,
  bend = 1.25,
  borderRadius = 0.06,
}: CircularTestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !items.length) return;
    const app = new CircularGalleryApp(containerRef.current, items, bend, borderRadius, autoSpeed);
    return () => app.destroy();
  }, [items, autoSpeed, bend, borderRadius]);

  return <div ref={containerRef} className="h-full w-full overflow-hidden cursor-grab active:cursor-grabbing" />;
}
