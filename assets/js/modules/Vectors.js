'use strict';

export function add(...vectors) {
  return vectors.reduce((total, current) => {
    for (let i = 0; i < current.length; i++)
      total[i] += current[i];

    return total;
  }, Array.from({length: vectors[0].length}, () => 0));
}

export function multiply(vector, scalar) {
  const result = copy(vector);

  return result.map(component => component * scalar);
} 

export function dot(a, b) {
  return Array.from({
    length: a.length
  }, (_, index) => a[index] * b[index]).reduce((total, curr) => total + curr);
}

export function norm(vector, product = dot) {
  return Math.sqrt(product(vector, vector));
}

export function unit(vector, product = dot) {
  const magnitude = norm(vector, product);

  return multiply(vector, 1 / magnitude);
}

export function copy(vector) {
  return [...vector];
}

export function zero(dimension = 2) {
  return Array.from({
    length: dimension
  }, () => 0);
}

export function segmentToVersors(segment) {
  const vector = Array.from({length: segment.start.length});

  for (let index = 0; index < vector.length; index++)
    vector[index++] = segment.end[index] - segment.start[index];

  return vector;
}

export function orthogonalization(base) {
  const result = [];

  for (const versor of base)
    result.push(copy(versor));

  for (let i = 0; i < base.length; i++) {  
    for (let j = 0; j < i; j++) {
      const scalar = -dot(result[i], result[j]) / dot(result[j], result[j]);

      result[i] = add(multiply(result[j], scalar), result[i]);
    }
  }

  console.log('Before normalizing:\n', result);
  for (let i = 0; i < result.length; i++)
    result[i] = multiply(result[i], 1 / norm(result[i]));

  for (let i = 1; i < result.length; i++)
    if (isNaN(result[i][0]))
      throw 'One ore more vectors are not lineary independent.';

  return result;
}

export function areEqual(a, b) {
  if (a.length != b.length)
    return false;
  
  for (let i = 0; i < a.length; i++)
    if (a[i] != b[i])
      return false;

  return true;
}

function printMatrix(matrix) {
  for (const row of matrix)
    console.log(...row);
  console.log('');
}

export function det(matrix, size) {
  let first, value, col;

  console.log(matrix);
  printMatrix(matrix);
  if (size == 1)
    return matrix[0][matrix.length - 1];

  first = 0;
  col   = matrix.length - 1 - size;
  while (matrix[first][col] == 0 && first < matrix.length)
    first++;

  // matrix has a column of zeroes
  if (matrix[first][0] == 0)
    return 0;

  value = matrix[first][col]; 
  for (let i = first + 1; i < matrix.length; i++) {
    if (matrix[i][col] != 0) {
      // make zeroes on the line
      const scalar = matrix[i][col] / value;

      matrix[i] = add(matrix[i], multiply(matrix[first], -scalar));
    }
  }

  matrix.slice(first, first + 1);
  return value * (first % 2 == 1 ? 1 : -1) * det(matrix, size - 1);
}