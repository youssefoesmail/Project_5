// --- Directions
// Given an positive integer,convert it to an array of its digits
// --- Examples
//   numberToArray(15) === [1,5]
//   numberToArray(9813) === [9,8,1,3]
//   numberToArray(500) === [5,0,0]
//   numberToArray(15) === [1,5]
//   numberToArray(0) === [0]
const numberToArray = (n) => {
  const arr = n.toString().split("");
  return arr.map((elem) => {
    return elem.Number();
  });
};
