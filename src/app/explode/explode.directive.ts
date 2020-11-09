import {Directive, HostListener, OnInit} from '@angular/core';
import html2canvas from 'html2canvas';

@Directive({
  selector: '[must-explode]',
})
export class ExplodeDirective implements OnInit {
  targetting = false;
  constructor() {}

  ngOnInit(): void {}

  /** listening to mouse buttons 3, prevent its default action */
  @HostListener('mouseup', ['$event'])
  handleUp(ev: MouseEvent) {
    ev.button === 3 && ev.preventDefault();
  }

  @HostListener('mousedown', ['$event'])
  async explodeIt(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    if (ev.button === 3) {
      ev.preventDefault();
      /** BOOM! get the target out of the event */
      makeItGoBoom(target);
    }
  }
}

/**
 * The code behind this point is using pure DOM manipulation, and can be used inside any framework
 * Its based loosely on the blogpost referenced at the bottom.
 */

async function makeItGoBoom(target: HTMLElement) {
  const noBlackAndWhitePixels = (pixel: Pixel): boolean =>
    /** check RGB, and ignore Alpha (opacity) */
    !pixel.rgba.every((color, i) => (i === 3 ? true : color > 240 || color < 10));

  /** extract some data from the target */
  const {left, top, bottom, right} = target.getBoundingClientRect();
  const targetWidth = right - left;
  
  /** extract the target as an Uint8ClampedArray of colors */
  const colorData = await extractColors(target);
  const pixelCount = Math.floor(colorData.length/4)

  /** create a canvas to draw the explosion onto */
  const particleCanvas = createParticleCanvas();
  const ctx = particleCanvas.getContext('2d');

  /** create an array of pixels that we can animate */
  const pixels = Array.from({length: pixelCount}, createPixel)
    /** but drop the white pixels */
    .filter(noBlackAndWhitePixels);

  /* we don't want to draw all the pixels, so calculate */
  const spread = calculateSpread(pixels.length);

  const particles = pixels.reduce(getEvenSpreadParticles, [] as Particle[]);

  /** for giggles, log some "statistics" */
  console.log({
    'original Pixels': pixelCount.toLocaleString('us-us'),
    'number of particles': particles.length.toLocaleString('us-us'),
    'spread by': spread.toLocaleString('us-us'),
  });
  /** "play" the explosion */
  await triggerExplosion(particles);
  document.body.removeChild(particleCanvas);

  return;

  /** create a Pixel */
  function createPixel(_, i): Pixel {
    const y = Math.floor(i / targetWidth);
    const x = i - y * targetWidth;
    const offsset = i * 4;
    const rgba = colorData.slice(offsset, offsset + 4);
    return {x: x + left, y: y + top, rgba, ctx};
  }

  /** go over the array, and only convert qualifying pixes to particals */
  function getEvenSpreadParticles(particles: Particle[], pixel: Pixel, i: number, pixels: Pixel[]): Particle[] {
    return i % spread === 0 ? particles.concat([pixel2particle(pixel)]) : particles;
  }

  /**
   * Calculate the modules number 
   * so we have between 5500 and 12.500 particles.
   * this way we always have an interesting explosion
   */
  function calculateSpread(pixNum) {
    const minRandom = Math.max(1, Math.floor(pixNum / 5500));
    const maxRandom = Math.min(300, Math.floor(pixNum / 12500));
    const r = minRandom + getRandomInt(maxRandom - minRandom);
    return r;
  }
}

/**
 * Fetch all the colors available in the viewpot and return an array with unique colors, that are not white(ish)
 */
async function extractColors(elm: HTMLElement): Promise<Uint8ClampedArray> {
  try {
    const canvas = await html2canvas(elm, {
      width: elm.clientWidth, // DOM original width
      height: elm.clientHeight,
      scrollY: -window.pageYOffset,
      scrollX: 0,
    });
    // to check the canvas, add it to the app
    // const img = document.createElement('img');
    // img.src = canvas.toDataURL();
    // document.body.appendChild(img);
    return canvas.getContext('2d').getImageData(0, 0, elm.clientWidth, elm.clientHeight).data;
  } catch (e) {
    console.log(e);
    return ([] as unknown) as Uint8ClampedArray;
  }
}

function pixel2particle(pixel: Pixel): Particle {
  const speed = {
    x: -10 + getRandomInt(20),
    y: -10 + getRandomInt(20),
  };
  const radius = 10 + getRandomInt(5);
  const reduce = (10 + getRandomInt(25)) / 100;
  const rgbaString = `rgba(${pixel.rgba[0]}, ${pixel.rgba[1]}, ${pixel.rgba[2]} , 1)`;
  return {
    ...pixel,
    rgbaString,
    speed,
    radius,
    reduce,
  };
}

function draw(particle: Particle): Particle | undefined {
  // Draw a circle at the current location
  particle.ctx.beginPath();
  particle.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  particle.ctx.fillStyle = particle.rgbaString;
  particle.ctx.fill();

  const radius = particle.radius - particle.reduce;
  if (radius > 3) {
    /** if there is still a usable radius return a new particle */
    const x = particle.x + particle.speed.x;
    const y = (particle.y += particle.speed.y);
    return {...particle, radius, x, y};
  }
}

/**
 * helper function for true random intergers.
 * @param max the maxium returned
 */
function getRandomInt(max: number): number {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  let randomNumber = randomBuffer[0] / (0xffffffff + 1);
  return Math.floor(randomNumber * (Math.floor(max) + 1));
}

// var particleCanvas, particleCtx;
function createParticleCanvas() {
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  particleCanvas.style.position = 'fixed';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.zIndex = '1001';
  particleCanvas.style.pointerEvents = 'none';
  document.body.appendChild(particleCanvas);
  return particleCanvas;
}

function triggerExplosion(particles: Particle[]) {
  const clearOldParticles = (p) => p.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  return new Promise((resolve) => {
    const explosionStep = (list: Particle[]) => {
      list[0] && clearOldParticles(list[0]);
      const nextStep = list.reduce((next, particle) => next.concat([draw(particle)].filter(Boolean)), [] as Particle[]);
      return nextStep.length === 0 ? resolve() : window.requestAnimationFrame(() => explosionStep(nextStep));
    };

    explosionStep(particles);
  });
}

interface Pixel {
  x: number;
  y: number;
  rgba: Uint8ClampedArray;
  ctx: CanvasRenderingContext2D;
}
interface Particle extends Pixel {
  rgbaString: string;
  speed: {
    x: number;
    y: number;
  };
  radius: number;
  reduce: number;
}
/**
 * The idea of the particle effect can be found in this article: https://css-tricks.com/adding-particle-effects-to-dom-elements-with-canvas/
 */
