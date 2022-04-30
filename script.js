
let moves = []


hanoi(3, 1, 3)


function hanoi(n, start, end) {
    if (n === 1) move_one(start, end)
    else {
        // This line is very interesting
        let other = 6 - (start + end)

        hanoi(n - 1, start, other)
        move_one(start, end)
        hanoi(n - 1, other, end)
    }
}
function move_one(start, end) {
    console.log(`${start} -> ${end}`)
    moves.push({ start, end })
}
