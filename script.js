const rodEls = document.querySelectorAll(".rod")
const solveButton = document.querySelector("#solve")

const count = 3
const speed = .3
const start = 1, end = 3
CreateDiscs()


let moves = []
const animation_properties = {
    fill: "forwards",
    easing: "ease-in-out"
}

solveButton.addEventListener("click", Solve, { once: true })


function CreateDiscs() {
    for (let i = 0; i < count; i++) {
        let span = document.createElement("span")
        span.style.setProperty("--size", i + 1)
        rodEls[start - 1].appendChild(span)
    }
}

async function Solve() {
    hanoi(count, start, end)

    solveButton.innerHTML = "Solving..."
    solveButton.disabled = true

    console.time("Time")

    for (let move of moves) {
        await move_piece(move)
    }

    console.timeEnd("Time")


    solveButton.removeEventListener("click", Solve)
    solveButton.innerHTML = "Solved! Click to Restart."
    solveButton.disabled = false
    solveButton.addEventListener("click", Restart, { once: true })
}

function Restart() {
    moves = []
    rodEls.forEach(rod => rod.innerHTML = "")
    CreateDiscs()

    solveButton.innerText = "Solve"
    solveButton.addEventListener("click", Solve, { once: true })
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

async function move_piece({ start, end }) {
    start--, end--

    console.log(start, end)
    const endRod = rodEls[end]
    const startRod = rodEls[start]

    const currentBar = startRod.querySelector("span")

    await piece_out(currentBar, startRod)
    await piece_move_to(currentBar, endRod)
    await piece_in(currentBar, endRod)


    return
}

function piece_out(bar, rod, { duration } = { duration: 300 * speed }) {
    const rodBound = rod.getBoundingClientRect()
    const barBound = bar.getBoundingClientRect()
    fixed_mod(bar)

    bar.animate([{
        top: rodBound.top - (barBound.height + 10) + "px"
    }], { ...animation_properties, duration })

    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
}
function piece_move_to(bar, rod, { duration } = { duration: 600 * speed }) {
    const rodBound = rod.getBoundingClientRect()
    bar.animate([{
        left: rodBound.left + "px"
    }], { ...animation_properties, duration }
    )

    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
}
async function piece_in(bar, rod, { duration } = { duration: 300 * speed }) {
    const firstPieceBound = rod.querySelector("span")?.getBoundingClientRect()

    const rodBound = rod.getBoundingClientRect()
    const barBound = bar.getBoundingClientRect()

    let top = -barBound.height
    if (firstPieceBound == null) top += rodBound.bottom
    else top += firstPieceBound.top


    bar.animate([{
        top: top + "px"
    }], { ...animation_properties, duration }

    )

    await new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration)
    })

    const startRod = bar.parentElement
    const endRod = rod
    startRod.removeChild(bar)
    endRod.prepend(bar)
    fixed_mod(bar, false)

    return
}
function fixed_mod(bar, flag = true) {
    if (flag) {
        const barBound = bar.getBoundingClientRect()
        bar.style.position = "fixed"
        bar.style.left = barBound.left + barBound.width / 2 - 7.5 + "px"
        bar.style.top = barBound.top + "px"
    } else {
        bar.style.position = null
        bar.style.left = null
        bar.style.top = null
    }
}