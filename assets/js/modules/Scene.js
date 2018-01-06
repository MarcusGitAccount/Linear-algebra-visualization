'use strict';

import {add, areEqual, multiply, norm, orthogonalization, zero, copy} from './Vectors.js';
import {default as constants} from './Constants.js';

const defaultColors = {
  origin: '#ff0000',
  grid:   'gray',
  axis:   'blue'
};

// the Y value for every coordinate must be multiplied by -1 always, as the origin
// doesn't start at (0, 0)

export default class Scene {
  constructor(canvas, options, origin = [0, 0], unit= 10, colors = defaultColors) {
    this.scene   = canvas;
    this.context = canvas.getContext('2d');

    if (options.size != undefined) {
      this.scene.height = options.size.height;
      this.scene.width  = options.size.width;
    }

    this.span   = constants.versors[0];
    this.center = [this.scene.width / 2, this.scene.height / 2];
    this.origin = origin;
    this.unit   = unit;
    this.colors = colors;
  }

  coords(point) {
    const [x, y] = point;

    return add(this.center, multiply([x, -y], this.unit));
  }

  dot(center, size, color) {
    const [x, y] = this.coords(center);
    
    this.context.beginPath();
    this.context.arc(x, y, size, 0, 2 * Math.PI, true);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
  }

  line(start, end, size, color) {
    for (let i = 0; i < start.length; i++)
      if (start[i] == end[i])
        start[i] += .5, end[i] += .5;

    this.context.beginPath()
    this.context.moveTo(start[0], start[1]);
    this.context.linewidth = size;
    this.context.strokeStyle = color;
    this.context.lineTo(end[0], end[1]);
    this.context.stroke();
    this.context.closePath();
  }

  arrow(direction, color, length = .1) {
    let B, C, _C; // points
    let base, other = [1, 1];    
    
    
    if (areEqual(direction, other)) {
      other = copy(direction);
      other[0] -= 1;
    }
    base = orthogonalization([direction, other]);
    // tip and B are on the given direction
    //B = multiply(base[0], )

    // this.vector(base[0], 'red');
    // this.vector(base[1], 'red');

    console.log(base[0])
    B  = multiply(base[0], norm(direction) - Math.SQRT2 * length);
    C  = add(B, multiply(base[1],  length));
    _C = add(B, multiply(base[1], -length));

    
    this.context.beginPath();
    this.context.moveTo(...this.coords(direction));
    this.context.lineTo(...this.coords(C));
    this.context.lineTo(...this.coords(_C));
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
  }

  clear() {
    this.context.clearRect(0, 0, this.scene.width, this.scene.height);
  }

  getIntersectionPoX(boundaries, direction, point) {
    // given a line described by a direction and point
    // found the interstion points with 2 boundary lines
    // (parallel lines with Ox)
    const [x, y] = point;
    const [i, j] = direction;
    const [up, down] = boundaries;

    let parted = (j * x - i * y);

    return [(parted + i * up) / j, (parted + i * down) / j];
  }

  getIntersectionPoY(boundaries, direction, point) {
    // given a line described by a direction and point
    // found the interstion points with 2 boundary lines
    // (parallel lines with OY)
    const [x, y] = point;
    const [i, j] = direction;
    const [left, right] = boundaries;

    return [(j * x + j * left - i * y) / -i, (j * x + j * right - i * y) / -i];
  }

  drawFront() {
    this.context.globalCompositeOperation = 'source-over';
  }
  
  drawBack() {
    this.context.globalCompositeOperation = 'destination-over';
  }

  axis(span, color, grid = false, gridOptions = null){
    let magnitude;

    for (const components of span) {
      const versor = copy(components);

      if (areEqual(versor, [0, 0]))
        continue;
      
      magnitude = norm(versor) * this.unit;
      versor[1] *= -1;
      if (versor[1] == 0) {
        let [startY, endY] = this.getIntersectionPoY([0, this.scene.width], versor, this.center);

        this.line([0, startY], [this.scene.width, endY], 1, color);
        if (grid) {
          let [start, end] = [startY, endY]

          this.drawBack();
          while (startY <= this.scene.height || endY <= this.scene.height) {
            startY += magnitude
            endY   += magnitude
            this.line([0, startY], [this.scene.width, endY], 1, gridOptions.color);
          }
          while (start >= 0 || end >= 0) {
            start -= magnitude
            end   -= magnitude
            this.line([0, start], [this.scene.width, end], 1, gridOptions.color);
          }
          this.drawFront();
        }
        continue;
      }
      
      let [startX, endX] = this.getIntersectionPoX([0, this.scene.height], versor, this.center);
      
      this.line([startX, 0], [endX, this.scene.height], 1, color);
      if (grid) {
        let [start, end] = [startX, endX]
        
        this.drawBack();
        while (startX <= this.scene.width || endX <= this.scene.width) {
          startX += magnitude
          endX   += magnitude
          this.line([startX, 0], [endX, this.scene.height], 1, gridOptions.color);
        }
        while (start >= 0 || end >= 0) {
          start -= magnitude
          end   -= magnitude
          this.line([start, 0], [end, this.scene.height], 1, gridOptions.color);
        }
        this.drawFront();
      }
    }
  }

  init(grid = false, options = {color: '#eee'}) {
    const origin = this.coords(this.origin);

    this.axis(this.span, this.colors.axis, grid, options);
    this.dot(origin, 2, this.colors.origin);
  }

  axisOrt(span, color, grid = false, gridOptions = null) {
    const base = orthogonalization(span);

    this.axis(base, color, grid, gridOptions);
  }

  vector(components, color, base = this.span) {
    let _components = zero(components.length);

    for (let i = 0; i < components.length; i++)
      _components = add(_components, multiply(base[i], components[i]));
    
    console.log(this.coords(_components), _components, this.center, this.span)
    this.line(this.center, this.coords(_components), 1, color);
    this.arrow(_components, color)
  }
}

// is point in path