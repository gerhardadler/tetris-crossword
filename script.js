const root = document.querySelector(':root')
const first_cell = document.getElementsByClassName("crossword-cell")[0]

root.style.setProperty('--cell-size', first_cell.clientHeight + "px")

window.addEventListener("resize", (event) => {
    root.style.setProperty('--cell-size', first_cell.clientHeight + "px")
})

const textareas = document.querySelectorAll(".crossword-cell textarea")
const solutions = ['J', 'N', 'A', 'Z', 'J', 'O', 'S', 'E', 'P', 'H', 'D', 'A', 'S', 'N', 'E', 'S', 'O', 'N', 'P', 'B', 'A', 'G', 'B', 'Y', 'C', 'A', 'I', 'S', 'A', 'A', 'C', 'E', 'A', 'L', 'F', 'A', 'D', 'U', 'M', 'B', 'A', 'S', 'S', 'E', 'S', 'A', 'O', 'R', 'I', 'O', 'N', 'R', 'H', 'O', 'D', 'E', 'C', 'T', 'T', 'I', 'R', 'E', 'S', 'O', 'M', 'E']
window.addEventListener("keyup", (event) => {
    for (let i = 0; i < textareas.length; ++i) {
        if (textareas[i].value.toUpperCase() != solutions[i]) {
            return
        }
    }
    alert("bean")
})