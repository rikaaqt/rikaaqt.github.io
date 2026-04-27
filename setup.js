import "https://addsoupbase.github.io/webcomponents/paper-canvas.js"
import * as v from 'https://addsoupbase.github.io/v4.js'
const { brushsize, colorpicker, color, undo, paper, paperform } = v.id
paperform.onsubmit = () => {
    sessionStorage.setItem('d', paper.dataURL(1).slice(22))
}
brushsize.on({
    change() {
        paper.brushsize = this.valueAsNumber
    }
})
colorpicker.on({
    click: color.click.bind(color)
})
color.on({
    input() {
        let c = this.value
        paper.color = brushsize.style.accentColor = c
    }
})
paper.on({
    $wheel({ deltaY: y }) {
        paper.brushsize = brushsize.value = brushsize.valueAsNumber - (Math.sign(y) * 2)
    }
})
undo.on({
    click() {
        paper.undo()
    }
})
sessionStorage.removeItem('d')