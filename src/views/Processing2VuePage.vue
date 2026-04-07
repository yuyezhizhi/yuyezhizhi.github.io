<template>
  <div class="fullscreen-canvas" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import p5 from 'p5'

// === Processing2Vue 转换示例 ===
// 原始 Processing 代码见底部注释

const canvasContainer = ref(null)
let sketchInstance = null

// 鱼群模拟 (Boids Algorithm)
// 转换自 Processing 经典示例

const sketch = (p) => {
  let boids = []
  const numBoids = 100

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    for (let i = 0; i < numBoids; i++) {
      boids.push(new Boid(
        p.random(p.width),
        p.random(p.height)
      ))
    }
  }

  p.draw = () => {
    p.background(30, 40, 60)

    for (let boid of boids) {
      boid.edges()
      boid.flock(boids)
      boid.update()
      boid.show()
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  class Boid {
    constructor(x, y) {
      this.pos = p.createVector(x, y)
      this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1))
      this.acc = p.createVector(0, 0)
      this.maxSpeed = 3
      this.maxForce = 0.1
    }

    edges() {
      if (this.pos.x > p.width) this.pos.x = 0
      if (this.pos.x < 0) this.pos.x = p.width
      if (this.pos.y > p.height) this.pos.y = 0
      if (this.pos.y < 0) this.pos.y = p.height
    }

    flock(boids) {
      let alignment = this.align(boids)
      let cohesion = this.cohere(boids)
      let separation = this.separate(boids)

      alignment.mult(1.5)
      cohesion.mult(1.0)
      separation.mult(1.8)

      this.acc.add(alignment)
      this.acc.add(cohesion)
      this.acc.add(separation)
    }

    align(boids) {
      let perceptionRadius = 50
      let steering = p.createVector(0, 0)
      let total = 0

      for (let other of boids) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (other !== this && d < perceptionRadius) {
          steering.add(other.vel)
          total++
        }
      }

      if (total > 0) {
        steering.div(total)
        steering.setMag(this.maxSpeed)
        steering.sub(this.vel)
        steering.limit(this.maxForce)
      }
      return steering
    }

    cohere(boids) {
      let perceptionRadius = 75
      let steering = p.createVector(0, 0)
      let total = 0

      for (let other of boids) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (other !== this && d < perceptionRadius) {
          steering.add(other.pos)
          total++
        }
      }

      if (total > 0) {
        steering.div(total)
        steering.sub(this.pos)
        steering.setMag(this.maxSpeed)
        steering.sub(this.vel)
        steering.limit(this.maxForce)
      }
      return steering
    }

    separate(boids) {
      let perceptionRadius = 50
      let steering = p.createVector(0, 0)
      let total = 0

      for (let other of boids) {
        let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
        if (other !== this && d < perceptionRadius) {
          let diff = p5.Vector.sub(this.pos, other.pos)
          diff.div(d)
          steering.add(diff)
          total++
        }
      }

      if (total > 0) {
        steering.div(total)
        steering.setMag(this.maxSpeed)
        steering.sub(this.vel)
        steering.limit(this.maxForce)
      }
      return steering
    }

    update() {
      this.pos.add(this.vel)
      this.vel.add(this.acc)
      this.vel.limit(this.maxSpeed)
      this.acc.mult(0)
    }

    show() {
      let speed = this.vel.mag()
      let hue = p.map(speed, 0, this.maxSpeed, 200, 300)
      p.colorMode(p.HSB)
      p.fill(hue, 70, 90)
      p.noStroke()
      
      p.push()
      p.translate(this.pos.x, this.pos.y)
      p.rotate(this.vel.heading() + p.PI / 2)
      p.beginShape()
      p.vertex(0, -8)
      p.vertex(-5, 8)
      p.vertex(5, 8)
      p.endShape(p.CLOSE)
      p.pop()
      
      p.colorMode(p.RGB)
    }
  }
}

onMounted(() => {
  if (canvasContainer.value) {
    sketchInstance = new p5(sketch, canvasContainer.value)
  }
})

onUnmounted(() => {
  if (sketchInstance) {
    sketchInstance.remove()
  }
})
</script>

<style scoped>
.fullscreen-canvas {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #1e283c;
}

.fullscreen-canvas canvas {
  display: block;
}
</style>

<!--
================================================================================
原始 Processing 代码 (未经转换)
================================================================================

Boid[] boids;
int numBoids = 100;

void setup() {
  size(800, 600);
  boids = new Boid[numBoids];
  for (int i = 0; i < numBoids; i++) {
    boids[i] = new Boid(random(width), random(height));
  }
}

void draw() {
  background(30, 40, 60);
  
  for (Boid boid : boids) {
    boid.edges();
    boid.flock(boids);
    boid.update();
    boid.show();
  }
}

class Boid {
  PVector pos, vel, acc;
  float maxSpeed = 3;
  float maxForce = 0.1;

  Boid(float x, float y) {
    pos = new PVector(x, y);
    vel = PVector.random2D();
    acc = new PVector(0, 0);
  }

  void edges() {
    if (pos.x > width) pos.x = 0;
    if (pos.x < 0) pos.x = width;
    if (pos.y > height) pos.y = 0;
    if (pos.y < 0) pos.y = height;
  }

  void flock(Boid[] boids) {
    PVector alignment = align(boids);
    PVector cohesion = cohere(boids);
    PVector separation = separate(boids);
    
    alignment.mult(1.5);
    cohesion.mult(1.0);
    separation.mult(1.8);
    
    acc.add(alignment);
    acc.add(cohesion);
    acc.add(separation);
  }

  PVector align(Boid[] boids) {
    int perceptionRadius = 50;
    PVector steering = new PVector(0, 0);
    int total = 0;
    
    for (Boid other : boids) {
      float d = dist(pos.x, pos.y, other.pos.x, other.pos.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.vel);
        total++;
      }
    }
    
    if (total > 0) {
      steering.div(total);
      steering.setMag(maxSpeed);
      steering.sub(vel);
      steering.limit(maxForce);
    }
    return steering;
  }

  PVector cohere(Boid[] boids) {
    int perceptionRadius = 75;
    PVector steering = new PVector(0, 0);
    int total = 0;
    
    for (Boid other : boids) {
      float d = dist(pos.x, pos.y, other.pos.x, other.pos.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.pos);
        total++;
      }
    }
    
    if (total > 0) {
      steering.div(total);
      steering.sub(pos);
      steering.setMag(maxSpeed);
      steering.sub(vel);
      steering.limit(maxForce);
    }
    return steering;
  }

  PVector separate(Boid[] boids) {
    int perceptionRadius = 50;
    PVector steering = new PVector(0, 0);
    int total = 0;
    
    for (Boid other : boids) {
      float d = dist(pos.x, pos.y, other.pos.x, other.pos.y);
      if (other != this && d < perceptionRadius) {
        PVector diff = PVector.sub(pos, other.pos);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }
    
    if (total > 0) {
      steering.div(total);
      steering.setMag(maxSpeed);
      steering.sub(vel);
      steering.limit(maxForce);
    }
    return steering;
  }

  void update() {
    pos.add(vel);
    vel.add(acc);
    vel.limit(maxSpeed);
    acc.mult(0);
  }

  void show() {
    fill(200, 70, 90);
    noStroke();
    float angle = vel.heading() + PI/2;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    beginShape();
    vertex(0, -8);
    vertex(-5, 8);
    vertex(5, 8);
    endShape(CLOSE);
    pop();
  }
}

================================================================================
-->
