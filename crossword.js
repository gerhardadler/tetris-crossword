// Yes, I know this code is awful... It was thrown together quickly

class EditCell {
    constructor(element, x, y, solution, is_solution_cell) {
        this.element = element
        this.x = x
        this.y = y
        this.solution = solution
        this.is_solution_cell = is_solution_cell
        
        this.is_row_selected = false
        this.is_column_selected = false
    }

    changeShadow(amount) {
    const cell_background_color = this.element.style.backgroundColor
    let alpha
    if (cell_background_color !== "") {
        alpha = cell_background_color.match(/[0-9.]+\)$/)[0].slice(0, -1)
    } else {
        alpha = 0
    }
    alpha = parseFloat(alpha) + amount
    this.element.style.backgroundColor = "rgba(20, 20, 50, " + alpha + ")"
    }

    getRelatedCell(add_to_x, add_to_y) {
        return EDITCELLS.find(object => {
            return (object.x === this.x + add_to_x) && (object.y === this.y + add_to_y)
        })
    }

    nextCellRow() {
        return this.getRelatedCell(1, 0)
    }
    
    nextCellColumn() {
        return this.getRelatedCell(0, 1)
    }

    prevCellRow() {
        return this.getRelatedCell(-1, 0)
    }

    prevCellColumn() {
        return this.getRelatedCell(0, -1)
    }

    highlightWordRow(remove = false) {
        let highlight_cells = []
        for (let add_to_x = 0; true; ++add_to_x) {
            const row_cell = this.getRelatedCell(add_to_x, 0)
            if (row_cell) {
                highlight_cells.push(row_cell)
            } else {
                break
            }
        }
        for (let add_to_x = 0; true; --add_to_x) {
            const row_cell = this.getRelatedCell(add_to_x, 0)
            if (row_cell) {
                highlight_cells.push(row_cell)
            } else {
                break
            }
        }
        for (const cell of highlight_cells) {
            if (remove !== true) {
                cell.changeShadow(0.2)
                this.is_row_selected = true
            } else {
                cell.changeShadow(-0.2)
                this.is_row_selected = false
            }
        }
    }

    highlightWordColumn(remove = false) {
        let highlight_cells = []
        for (let add_to_y = 0; true; ++add_to_y) {
            const row_cell = this.getRelatedCell(0, add_to_y)
            if (row_cell) {
                highlight_cells.push(row_cell)
            } else {
                break
            }
        }
        for (let add_to_y = 0; true; --add_to_y) {
            const row_cell = this.getRelatedCell(0, add_to_y)
            if (row_cell) {
                highlight_cells.push(row_cell)
            } else {
                break
            }
        }
        for (const cell of highlight_cells) {
            if (remove !== true) {
                cell.changeShadow(0.2)
                this.is_column_selected = true
            } else {
                cell.changeShadow(-0.2)
                this.is_column_selected = false
            }
        }
    }

    removeHighlightWord() {
        if (this.is_row_selected) {
            this.highlightWordRow(true)
        }
        if (this.is_column_selected) {
            this.highlightWordColumn(true)
        }
    }
}

function checkIfSolved() {
    let fully_solved = true
    let solved = true
    for (let i = 0; i < EDITCELLS.length; ++i) {
        if (EDITCELLS[i].element.value !== EDITCELLS[i].solution) {
            fully_solved = false
            if (EDITCELLS[i].is_solution_cell) {
                solved = false
                return "no"
            }
        }
    }
    if (fully_solved) {
        return "fully_solved"
    }
    if (solved) {
        return "solved"
    }
}

const CELLS = Array.from(document.querySelectorAll(".crossword-cell"))

let EDITCELLS = []
// Don't cheat!
const ALL_SOLUTIONS = ['J', 'N', 'A', 'Z', 'J', 'O', 'S', 'E', 'P', 'H', 'D', 'A', 'S', 'N', 'E', 'S', 'O', 'N', 'P', 'B', 'A', 'G', 'B', 'Y', 'C', 'A', 'I', 'S', 'A', 'A', 'C', 'E', 'A', 'L', 'F', 'A', 'D', 'U', 'M', 'B', 'A', 'S', 'S', 'E', 'S', 'A', 'O', 'R', 'I', 'O', 'N', 'R', 'H', 'O', 'D', 'E', 'C', 'T', 'T', 'I', 'R', 'E', 'S', 'O', 'M', 'E']
const SOLUTION_POSITIONS = [{x: 7, y: 1}, {x: 6, y: 2}, {x: 6, y: 3}, {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 1, y: 8}, {x: 2, y: 8}, {x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8}]
for (let y = 0; y < 5; y++) {
    for (let x = 5; x < 15; x++) {
        const cell = CELLS.shift()
        const editcell = cell.querySelector("textarea")
        if (editcell !== null) {
            EDITCELLS.push(new EditCell(
                editcell,
                x,
                y,
                ALL_SOLUTIONS.shift(),
                SOLUTION_POSITIONS.some(object => { return (object.x === x) && (object.y === y) }
            )))
        }
    }
}
for (let y = 5; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
        const cell = CELLS.shift()
        const editcell = cell.querySelector("textarea")
        if (editcell !== null) {
            EDITCELLS.push(new EditCell(
                editcell,
                x,
                y,
                ALL_SOLUTIONS.shift(),
                SOLUTION_POSITIONS.some(object => { return (object.x === x) && (object.y === y) }
            )))
        }
    }
}

let WRITE_DIRECTION = "row"
for (const editcell of EDITCELLS) {
    editcell.element.addEventListener("mouseover", () => {
        editcell.changeShadow(0.2)
    })
    editcell.element.addEventListener("mouseout", () => {
        editcell.changeShadow(-0.2)
    })
    editcell.element.addEventListener("focusin", () => {
        if (editcell.element !== document.activeElement) {
            if (editcell.nextCellRow()) {
                editcell.highlightWordRow()
            } else {
                editcell.highlightWordColumn()
            }
        } else if (WRITE_DIRECTION === "row") {
            editcell.highlightWordRow()
        } else {
            editcell.highlightWordColumn()
        }
    })
    editcell.element.addEventListener("focusout", () => {
        editcell.removeHighlightWord()
    })
    editcell.element.addEventListener("mousedown", () => {
        if (editcell.element !== document.activeElement) {
            if (editcell.nextCellRow()) {
                WRITE_DIRECTION = "row"
            } else {
                WRITE_DIRECTION = "column"
            }
        } else if (WRITE_DIRECTION === "row") {
            if (editcell.nextCellColumn()) {
                WRITE_DIRECTION = "column"
                editcell.removeHighlightWord()
                editcell.highlightWordColumn()
            }
        } else {
            if (editcell.nextCellRow()) {
                WRITE_DIRECTION = "row"
                editcell.removeHighlightWord()
                editcell.highlightWordRow()
            }
        }
    })
    editcell.element.addEventListener("keydown", (event) => {
        const key = event.key.toUpperCase()
        event.preventDefault()
        const direction = {
            "ARROWLEFT": [-1, 0],
            "ARROWRIGHT": [1, 0],
            "ARROWUP": [0, -1],
            "ARROWDOWN": [0, 1]
        }[key]
        if (direction) {
            const adjacent_cell = editcell.getRelatedCell(direction[0], direction[1])
            if (adjacent_cell) {
                adjacent_cell.element.focus()
                return
            }
        }
        if (key === "BACKSPACE") {
            if (editcell.element.value === "") {
                if (WRITE_DIRECTION === "row") {
                    const prev_row = editcell.prevCellRow()
                    if (prev_row) {
                        prev_row.element.value = ""
                        prev_row.element.focus()
                    }
                } else {
                    const prev_column = editcell.prevCellColumn()
                    if (prev_column) {
                        prev_column.element.value = ""
                        prev_column.element.focus()
                    }
                }
            } else {
                editcell.element.value = ""
                return
            }
        }
        if (!/^[A-Z]$/.test(key)) {
            return
        }
        editcell.element.value = key

        if (WRITE_DIRECTION === "row") {
            const next_row = editcell.nextCellRow()
            if (next_row) {
                next_row.element.focus()
            }
        } else {
            const next_column = editcell.nextCellColumn()
            if (next_column) {
                next_column.element.focus()
            }     
        }
        switch (checkIfSolved()) {
            case "solved": 
                const solution_cells = document.getElementsByClassName("solution-cell")
                for (const solution_cell of solution_cells) {
                    solution_cell.classList.add("solution-cell", "solution-cell-solved") // Replace doesn't work for some reason?
                }
                break
            case "fully_solved":
                const popup = document.getElementById("popup")
                popup.style.visibility = "visible"
                popup.style.opacity = "1"
                break    
        }

    })
}

const popup = document.getElementById("popup")
popup.addEventListener("click", () => {
    popup.style.visibility = "hidden"
    popup.style.opacity = "0"
})