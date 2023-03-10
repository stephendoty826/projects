
let array = [{points: 1}, {points: 2}, {points: 3}]

let element = array.find(obj => obj.points === 2)

element.points = 0

console.log("array", array)
console.log('element', element);

