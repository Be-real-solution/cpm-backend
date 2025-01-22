let a = [3, 6, 1, 8, 9, 10]

let b = a.reduce((previous, current) => {
  // console.log(previous + current);

  return previous+current
})

console.log(b);



Array.prototype.myReduce = function (callback, initialValue) {
  
  if (typeof callback !== "function") {
    throw new TypeError("Callback is not function!")
  }

  let array = this

  let accumulator = initialValue !== undefined ? initialValue : array[0]
  let startIndex = initialValue !== undefined ? 0 : 1

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i])
  }

  return accumulator
}

let d = a.myReduce((item, value) => {
  console.log(item + value);

  if (value % 2 == 0)
    return item + value
  else return item

}, 0)

console.log(d);