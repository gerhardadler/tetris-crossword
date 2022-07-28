const root = document.querySelector(':root')
const first_cell = document.getElementsByClassName("crossword-cell")[0]

root.style.setProperty('--cell-size', first_cell.clientHeight + "px")

window.addEventListener("resize", (event) => {
    root.style.setProperty('--cell-size', first_cell.clientHeight + "px")
})