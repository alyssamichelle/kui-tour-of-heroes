import {Component, ComponentFactoryResolver, HostListener, OnInit} from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: '[must-explode]',
  template: '<ng-content></ng-content>',
})
export class ExplodeComponent implements OnInit {
  targetting = false;
  constructor() {}

  ngOnInit(): void {}

  @HostListener('contextmenu', ['$event'])
  async explodeIt(ev: MouseEvent) {
    /** BOOM! get the target out of the event */
    const target = ev.target as HTMLElement;
    ev.preventDefault();
    makeItGoBoom(target);
  }
}

/**
 * The code behind this point is using pure DOM manipulation, and can be used inside any framework
 * Its based loosely on the blogpost referenced at the bottom.
 */

async function makeItGoBoom(target: HTMLElement) {
  const inputCanvas = await html2canvas(target);
  const sourceCtx = inputCanvas.getContext('2d');

  const {particleCtx, particleCanvas} = createParticleCanvas();

  // Get the color data for our button
  const width = target.offsetWidth;
  const height = target.offsetHeight;
  const colorData = sourceCtx.getImageData(0, 0, width, height).data;
  const particles: ExplodingParticle[] = [];

  const sampleRate = Math.max(Math.floor(10 + Math.random() * 10), Math.floor(width * height * 0.0001));

  let count = 0;

  for (let localX = 0; localX < width; localX++) {
    for (let localY = 0; localY < height; localY++) {
      if (count % sampleRate === 0) {
        const index = (localY * width + localX) * 4;
        const rgbaColorArr = colorData.slice(index, index + 4);
        if (rgbaColorArr.every((color) => color === 255)) {
          // skip full white pixels. and don't count them for the samplerate!
          count--;
          continue;
        }

        const bcr = target.getBoundingClientRect();
        const globalX = bcr.left + localX;
        const globalY = bcr.top + localY;

        particles.push(new ExplodingParticle(globalX, globalY, rgbaColorArr, particleCtx));
      }
      count++;
    }
  }
  /** "play" the explosion */
  await triggerExplosion(particles);
  document.body.removeChild(particleCanvas);
}

class ExplodingParticle {
  // Set the speed for our particle
  speed = {
    x: -10 + Math.random() * 20,
    y: -10 + Math.random() * 20,
  };

  // Size our particle
  radius = 10 + Math.random() * 5;
  // set the reduction factor
  reduce = (10 + Math.random() * 25) / 100;

  constructor(
    private startX: number,
    private startY: number,
    private rgbArray: Uint8ClampedArray,
    public ctx: CanvasRenderingContext2D
  ) {}

  get done() {
    // calculate "done"
    return this.radius <= 3;
  }

  draw() {
    if (this.radius > 0) {
      // Draw a circle at the current location
      this.ctx.beginPath();
      this.ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]} , 1)`;
      this.ctx.fill();

      // Update the particle's location and life
      this.radius -= this.reduce;
      this.startX += this.speed.x;
      this.startY += this.speed.y;
    }
  }
}

// var particleCanvas, particleCtx;
function createParticleCanvas() {
  // Create our canvas
  const particleCanvas = document.createElement('canvas');
  const particleCtx = particleCanvas.getContext('2d');

  // Size our canvas
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;

  // Position out canvas
  particleCanvas.style.position = 'absolute';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';

  // Make sure it's on top of other elements
  particleCanvas.style.zIndex = '1001';

  // Make sure other elements under it are clickable
  particleCanvas.style.pointerEvents = 'none';

  // Add our canvas to the page
  document.body.appendChild(particleCanvas);
  return {particleCtx, particleCanvas};
}

function triggerExplosion(particles: ExplodingParticle[]) {
  const clearOldParticles = (p) => p.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  return new Promise((resolve) => {
    const explosionStep = (list: ExplodingParticle[]) => {
      list[0] && clearOldParticles(list[0]);
      for (const particle of list) {
        particle.draw();
      }

      if (list.length === 0) {
        return resolve();
      }
      // iterate over particles that aren't done.
      window.requestAnimationFrame(() => explosionStep(list.filter((p) => !p.done)));
    };

    explosionStep(particles);
  });
}

/**
 * The idea of the particle effect can be found in this article: https://css-tricks.com/adding-particle-effects-to-dom-elements-with-canvas/
 */
