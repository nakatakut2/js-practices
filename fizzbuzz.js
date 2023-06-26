let number = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
for (let x of number) {
  if (x % 3 == 0 && x % 5 == 0) {
    console.log("FizzBuzz");
  } else if (x % 5 == 0) {
    console.log("Buzz");
  } else if (x % 3 == 0) {
    console.log("Fizz");
  } else {
    console.log(x);
  }
}
