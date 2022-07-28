class Textarea {
    constructor(element, x, y) {
        this.element = element
        this.x = x
        this.y = y
        
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
        return TEXTAREAS.find(object => {
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

    highlightWordRow(remove = false) { // remove = remove, will remove the shadow
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
            if (remove !== "remove") {
                cell.changeShadow(0.2)
                this.is_row_selected = true
            } else {
                cell.changeShadow(-0.2)
                this.is_row_selected = false
            }
        }
    }

    highlightWordColumn(remove = false) { // remove = remove, will remove the shadow
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
            if (remove !== "remove") {
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
            this.highlightWordRow("remove")
        }
        if (this.is_column_selected) {
            this.highlightWordColumn("remove")
        }
    }
}

const CELLS = document.querySelectorAll(".crossword-cell")
let CELL_POINTER = 0

let TEXTAREAS = []
for (let y = 0; y < 5; y++) {
    for (let x = 5; x < 15; x++) {
        const cell = CELLS[CELL_POINTER]
        CELL_POINTER++
        const textarea = cell.querySelector("textarea")
        if (textarea !== null) {
            TEXTAREAS.push(new Textarea(textarea, x, y))
        }
    }
}
for (let y = 5; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
        const cell = CELLS[CELL_POINTER]
        CELL_POINTER++
        const textarea = cell.querySelector("textarea")
        if (textarea !== null) {
            TEXTAREAS.push(new Textarea(textarea, x, y))
        }
    }
}

let WRITE_DIRECTION = "row"
for (const textarea of TEXTAREAS) {
    textarea.element.addEventListener("mouseover", () => {
        textarea.changeShadow(0.2)
    })
    textarea.element.addEventListener("mouseout", () => {
        textarea.changeShadow(-0.2)
    })
    textarea.element.addEventListener("focusin", () => {
        if (textarea.element !== document.activeElement) {
            if (textarea.nextCellRow()) {
                textarea.highlightWordRow()
            } else {
                textarea.highlightWordColumn()
            }
        } else if (WRITE_DIRECTION === "row") {
            textarea.highlightWordRow()
        } else {
            textarea.highlightWordColumn()
        }
    })
    textarea.element.addEventListener("focusout", () => {
        textarea.removeHighlightWord()
    })
    textarea.element.addEventListener("mousedown", () => {
        if (textarea.element !== document.activeElement) {
            if (textarea.nextCellRow()) {
                WRITE_DIRECTION = "row"
            } else {
                WRITE_DIRECTION = "column"
            }
        } else if (WRITE_DIRECTION === "row") {
            if (textarea.nextCellColumn()) {
                WRITE_DIRECTION = "column"
                textarea.removeHighlightWord()
                textarea.highlightWordColumn()
            }
        } else {
            if (textarea.nextCellRow()) {
                WRITE_DIRECTION = "row"
                textarea.removeHighlightWord()
                textarea.highlightWordRow()
            }
        }
    })
    textarea.element.addEventListener("keydown", (event) => {
        const key = event.key.toUpperCase()
        event.preventDefault()
        const callback = {
            "ARROWLEFT": [-1, 0],
            "ARROWRIGHT": [1, 0],
            "ARROWUP": [0, -1],
            "ARROWDOWN": [0, 1],
        }[key]
        const adjacent_cell = textarea.getRelatedCell(callback[0], callback[1])
            if (adjacent_cell) {
                adjacent_cell.element.focus()
            }
        if (key === "BACKSPACE") {
            if (textarea.element.value === "") {
                if (WRITE_DIRECTION === "row") {
                    const prev_row = textarea.prevCellRow()
                    if (prev_row) {
                        prev_row.element.value = ""
                        prev_row.element.focus()
                    }
                } else {
                    const prev_column = textarea.prevCellColumn()
                    if (prev_column) {
                        prev_column.element.value = ""
                        prev_column.element.focus()
                    }
                }
            } else {
                textarea.element.value = ""
            }
        }
        if (!/^[A-Z]$/.test(key)) {
            return
        }
        textarea.element.value = key

        if (WRITE_DIRECTION === "row") {
            const next_row = textarea.nextCellRow()
            if (next_row) {
                next_row.element.focus()
            }
        } else {
            const next_column = textarea.nextCellColumn()
            if (next_column) {
                next_column.element.focus()
            }     
        }
    })
}

// const textareas = document.querySelectorAll(".crossword-cell textarea")
// const solutions = ['J', 'N', 'A', 'Z', 'J', 'O', 'S', 'E', 'P', 'H', 'D', 'A', 'S', 'N', 'E', 'S', 'O', 'N', 'P', 'B', 'A', 'G', 'B', 'Y', 'C', 'A', 'I', 'S', 'A', 'A', 'C', 'E', 'A', 'L', 'F', 'A', 'D', 'U', 'M', 'B', 'A', 'S', 'S', 'E', 'S', 'A', 'O', 'R', 'I', 'O', 'N', 'R', 'H', 'O', 'D', 'E', 'C', 'T', 'T', 'I', 'R', 'E', 'S', 'O', 'M', 'E']
// window.addEventListener("keyup", (event) => {
//     for (let i = 0; i < textareas.length; ++i) {
//         if (textareas[i].value.toUpperCase() != solutions[i]) {
//             return
//         }
//     }
//     alert("bean")
// })