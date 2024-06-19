export const getRandomNumber = (start, end) =>
  start + Math.floor(Math.random() * end + 1 - Number.EPSILON);
