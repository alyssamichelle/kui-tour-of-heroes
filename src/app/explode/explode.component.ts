import {Component, HostListener, OnInit} from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: '[must-explode]',
  template: '<ng-content></ng-content>',
})
export class ExplodeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @HostListener('contextmenu', ['$event'])
  async explodeIt(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    console.log(target);
    ev.preventDefault();
    const canvas = await html2canvas(target);
    const ctx = canvas.getContext('2d');
    
    const {particleCtx, particleCanvas} = createParticleCanvas();
    
    const reductionFactor = 17;
    
    // Get the color data for our button
    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const colorData = ctx.getImageData(0, 0, width, height).data;
    const particles: ExplodingParticle[] = [];

    // Keep track of how many times we've iterated (in order to reduce
    // the total number of particles create)
    let count = 0;

    // Go through every location of our button and create a particle
    for (let localX = 0; localX < width; localX++) {
      for (let localY = 0; localY < height; localY++) {
        if (count % reductionFactor === 0) {
          const index = (localY * width + localX) * 4;
          const rgbaColorArr = colorData.slice(index, index + 4);

          const bcr = target.getBoundingClientRect();
          const globalX = bcr.left + localX;
          const globalY = bcr.top + localY;
          console.log(globalX,globalY)

          particles.push(new ExplodingParticle(globalX, globalY, rgbaColorArr));
        }
        count++;
      }
    }
    /** "play" the explosion */
    await updateExplosion(particles, particleCtx);
    document.body.removeChild(particleCanvas)
  }
}

/* An "exploding" particle effect that uses circles */
class ExplodingParticle {
  // Set how long we want our particle to animate for
  animationDuration = 1000; // in ms
  startTime = Date.now();

  // Set the speed for our particle
  speed = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random() * 10,
  };

  // Size our particle
  radius = 5 + Math.random() * 5;

  // Set a max time to live for our particle
  life = 30 + Math.random() * 10;
  remainingLife = this.life;

  constructor(private startX: number, private startY: number, private rgbArray: Uint8ClampedArray) {}

  // This function will be called by our animation logic later on
  draw(ctx) {

    if (this.remainingLife > 0 && this.radius > 0) {
      // Draw a circle at the current location
      ctx.beginPath();
      ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.rgbArray[0] + ',' + this.rgbArray[1] + ',' + this.rgbArray[2] + ', 1)';
      ctx.fill();

      // Update the particle's location and life
      this.remainingLife--;
      this.radius -= 0.25;
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

function updateExplosion(particles, particleCtx) {
  return new Promise((resolve) => {
    // Clear out the old particles
    if (typeof particleCtx !== 'undefined') {
      particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    const update = () => {
      // Draw all of our particles in their new location
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw(particleCtx);

        // Simple way to clean up if the last particle is done animating
        if (i === particles.length - 1) {
          let percent = (Date.now() - particles[i].startTime) / particles[i].animationDuration;

          if (percent > 1) {
            return resolve();
          }
        }
      }
      // Animate performantly
      window.requestAnimationFrame(update);
    };
    update();
  });
}
