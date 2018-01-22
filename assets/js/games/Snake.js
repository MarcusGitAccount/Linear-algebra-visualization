'use strict';

import {zero, add, multiply, copy, areEqual} from '../modules/Vectors.js';

export default class Snake {
  constructor(canvas, size, colors, fps = 1, startingLength = 5) {
    this.scene = canvas;
    this.context = canvas.getContext('2d');

    if (size) {
      this.scene.width = size.width;
      this.scene.height = size.height;
      this.tile = size.tile;
      this.center = [size.width / 2, size.height / 2];
    }

    this.keys = {
      '37': [-this.tile, 0],
      '39': [ this.tile, 0],
      '38': [0, -this.tile],
      '40': [0,  this.tile]
    }

    window.addEventListener('keydown', this.keyStrokes.bind(this));

    this.colors = colors || {
      apple: '#311b92', 
      snake: {
        body: '#4caf50',
        head: '#d50000'
      },
      score: '#f50057',
      background: '#fff'
    };

    this.context.font = "20px Arial";

    this.startingLength = startingLength;
    this.prevStroke = 39;
    this.requestId = null;
    this.fps = fps;
    this.timeout = null;
    this.event = false;
    this.init(startingLength);
  }

  keyStrokes(e) {
    console.log(e)
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      if (this.prevStroke != e.keyCode && Math.abs(this.prevStroke - e.keyCode) != 2) {
        this.direction = this.keys[e.keyCode];
        this.prevStroke = e.keyCode;
      }
    }
  }

  square(position, color, size, border = true) {
    const [x, y] = position;

    this.context.beginPath();
    this.context.lineWidth = 1
    this.context.rect(x - size, y, size, size);
    if (border) {
      this.context.strokeStyle = this.colors.background;
      this.context.fillStyle = color;
      this.context.stroke();
    }
    this.context.fill();
    this.context.closePath();
  }

  snakeAndAppleCollision(apple) {
    if (areEqual(apple, this.head))
      return true;
    for (const piece of this.tail)
      if (areEqual(piece, apple))
        return true;
    return false;
  }

  getApple() {
    const position = [0, 0];

    do {
      position[0] = (Math.random() * (this.scene.width -  2) / this.tile | 0 + 1) * this.tile;
      position[1] = (Math.random() * (this.scene.height - 2) / this.tile | 0 + 1  ) * this.tile;
    } while (this.snakeAndAppleCollision(position) == true);

    return position;
  }

  init(length = 5) {
    this.head = this.center;
    this.tail = [];
    this.direction = [this.tile, 0];
    this.apple = this.getApple();

    for (let i = 1; i <= length; i++)
      this.tail.push([this.center[0] - i * this.tile, this.center[1]]);

    this.requestId = window.requestAnimationFrame(this.animation.bind(this));
  }

  draw() {
    this.square(this.head, this.colors.snake.head, this.tile);
    for (const position of this.tail)
      this.square(position, this.colors.snake.body, this.tile, true);
    this.square(this.apple, this.colors.apple, this.tile);

    this.context.beginPath();
    this.context.fillStyle = this.colors.score;
    this.context.fillText(`Score: ${this.tail.length - this.startingLength}`, 5, 25);
    this.context.closePath();
  }

  clearScene() {
    this.context.clearRect(0, 0, this.scene.width, this.scene.height);
  }

  checkCollision() {
    for (const piece of this.tail)
      if (areEqual(this.head, piece))
        return true;
    return false;
  }

  animation(timestamp) {
    if (this.checkCollision() == true) {
      window.cancelAnimationFrame(this.requestId);
      window.clearTimeout(this.timeout);
      this.init(this.startingLength);
      return ;
    }
    
    if (areEqual(this.head, this.apple)) {
      this.apple = this.getApple();
      this.tail.push([0, 0]);
    }

    this.clearScene();
    this.draw();
    for (let i = this.tail.length - 1; i > 0; i--)
      this.tail[i] = copy(this.tail[i - 1]);

    this.tail[0] = copy(this.head);
    this.head = add(this.head, this.direction);

    if (this.head[0] == 0)
      this.head[0] = this.scene.width;
    else if (this.head[0] > this.scene.width)
      this.head[0] = 0;
  
    if (this.head[1] < 0) 
      this.head[1] = this.scene.height - this.tile;
    else if (this.head[1] >= this.scene.height)
      this.head[1] = 0;

    this.timeout = setTimeout(() => {
      this.requestId = window.requestAnimationFrame(this.animation.bind(this))
    }, 1000 / this.fps);
  }
}