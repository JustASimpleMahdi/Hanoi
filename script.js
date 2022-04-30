const rodEls = document.querySelectorAll(".rod")
const solveButton = document.querySelector("#solve")

const speed = 200

let moves = []


solveButton.addEventListener("click", Solve)

function Solve() {
    hanoi(3, 1, 3)

    solveButton.innerHTML = "Solving..."
    solveButton.disabled = true

    let i = 0
    const interval = setInterval(() => {
        move_piece(moves[i])
        i++
        if (i >= moves.length) {
            solveButton.innerHTML = "Solved!"
            clearInterval(interval)
        }
    }, speed)
}

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
    moves.push({ start, end })
}


function move_piece({ start, end }) {
    let firstEl = rodEls[start - 1].querySelector("span")

    rodEls[start - 1].removeChild(firstEl)
    rodEls[end - 1].prepend(firstEl.cloneNode())
}