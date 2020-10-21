import { Directive, HostListener, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';

@Directive({
  selector: '[must-explode]',
})
export class ExplodeDirective implements OnInit {
  targetting = false;
  constructor() {}

  ngOnInit(): void {}

  @HostListener('mouseup', ['$event'])
  handleup(ev: MouseEvent) {
    console.log(ev.button, ev);
    if (ev.button > 2) {
      ev.preventDefault();
    }
    }

  @HostListener('mousedown', ['$event'])
  async explodeIt(ev: MouseEvent) {
    /** BOOM! get the target out of the event */
    const target = ev.target as HTMLElement;
    console.log(ev.button, ev);
    if (ev.button>2) {
      ev.preventDefault();
      makeItGoBoom(target);
    }
  }
}

/**
 * The code behind this point is using pure DOM manipulation, and can be used inside any framework
 * Its based loosely on the blogpost referenced at the bottom.
 */

async function makeItGoBoom(target: HTMLElement) {
  const noWhitePixels = (pixel: Pixel): boolean => !pixel.rgba.every((color) => color > 240);

  /** extract some data from the target */
  const width = target.offsetWidth;
  const {left, top, bottom, right} = target.getBoundingClientRect();
  const targetWidth = right - left;
  const targetHeight = bottom - top;
  const baseQualifyNumber = findBaseQualify();
  /** extract the target as an Uint8ClampedArray of colors */
  const colorData = await extractColors(target);

  /** create a canvas to draw the explosion onto */
  const particleCanvas = createParticleCanvas();
  const ctx = particleCanvas.getContext('2d');

  /** create an array of particles that we can animate */
  const particles = Array.from({length: targetHeight * targetWidth}, createPixel)
    .filter(noWhitePixels)
    // .map(pixel2particle)
    .reduce(getEvenSpreadParticles, [] as Particle[]);

  /** for giggles, log some "statistics" */
  console.log({
    'original Pixels': (targetHeight * targetWidth).toLocaleString('us-us'),
    'number of particles': particles.length.toLocaleString('us-us'),
    'spread by': Math.max(baseQualifyNumber, Math.floor(targetHeight * targetWidth * 0.00015)).toLocaleString('us-us'),
  });
  /** "play" the explosion */
  await triggerExplosion(particles);
  document.body.removeChild(particleCanvas);

  return;

  function createPixel(_, i): Pixel {
    const y = Math.floor(i / targetWidth);
    const x = i - y * targetWidth;
    const offsset = i * 4;
    const rgba = colorData.slice(offsset, offsset + 4);
    // const rgba = `rgba(${rgbaRaw[0]}, ${rgbaRaw[1]}, ${rgbaRaw[2]} , 1)`
    return {x: x + left, y: y + top, rgba, ctx};
  }

  /** make sure there is an interesting amount of pixels. too much will be slow, too little is boring. */
  function qualify(i: number, pixels: Pixel[]) {
    return i % baseQualifyNumber === 0;
  }

  /** go over the array, and only convert qualifying pixes to particals */
  function getEvenSpreadParticles(particles: Particle[], pixel: Pixel, i: number, pixels: Pixel[]): Particle[] {
    return qualify(i, pixels) ? particles.concat([pixel2particle(pixel)]) : particles;
  }

  /**
   * quick and dirty, surely there is a nicer way to do this.
   * It makes sure that that there are at least 5500 and amx 10000
   * particles in the animation. depending on the size of the originating canvas
   */
  function findBaseQualify() {
    const pixelSize = targetHeight * targetWidth;
    let i = 5 + getRandomInt(25);
    let sample = Math.floor(pixelSize / i);
    while (sample < 5500 || sample > 10000) {
      i += (sample < 5500 ? -1 : 1) * (2 + getRandomInt(5));
      sample = Math.floor(pixelSize / i);
      if (pixelSize < 5500 || i < 1) {
        return 1;
      }
    }
    return i;
  }
}

/**
 * Fetch all the colors available in the viewpot and return an array with unique colors, that are not white(ish)
 */
async function extractColors(htmlDom: HTMLElement): Promise<Uint8ClampedArray> {
  try {
    return (
      await html2canvas(htmlDom, {
        width: htmlDom.clientWidth, // DOM original width
        height: htmlDom.clientHeight,
        scrollY: -window.pageYOffset,
        scrollX: 0,
      })
    )
      .getContext('2d')
      .getImageData(0, 0, htmlDom.clientWidth, htmlDom.clientHeight).data;
  } catch {
    return ([] as unknown) as Uint8ClampedArray;
  }
}

async function testIt(htmlDom) {
  // var htmlDom = document.getElementsByClassName('dialog_content')[0];

  html2canvas(htmlDom, {
    width: htmlDom.clientWidth, // DOM original width
    height: htmlDom.clientHeight,
    scrollY: -window.pageYOffset,
    scrollX: 0,
  }).then((canvas) => {
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    document.body.appendChild(img);
  });
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
