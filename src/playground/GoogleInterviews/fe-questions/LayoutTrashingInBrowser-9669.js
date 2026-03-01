class PreventLayoutTrashingInBrowser{
    constructor(){
        this.reads = []
        this.writes = []
        this.scheduled = false
        this.scheduledBatchEventFn = false
    }

    _scheduledFlush(){
        if(this.scheduled) return
        this.scheduled = true
        requestAnimationFrame(()=>{
            // READ phase
            const reads = this.reads
            this.reads = []
            reads.forEach(read=> read())
            
            // WRITE phase
            const writes = this.writes
            this.writes = []
            writes.forEach(write => write())

            this.scheduled = false
        })
    }

    scheduleEventFn(fn){
        if(this.scheduledBatchEventFn) return
        this.scheduledBatchEventFn = true

        requestAnimationFrame(()=>{
            this.scheduledBatchEventFn = false
            fn()
        })
    }

    readFn(fn){
        this.reads.push(fn)
        this._scheduledFlush()
    }

    writeFn(fn){
        this.writes.push(fn)
        this._scheduledFlush()
    }
}

const dom = new PreventLayoutTrashingInBrowser()

function resizeAllParagraphsToMatchBlockWidth(box, paragraphs){
    let px
    dom.readFn(()=>{
        px = box.offsetWidth
    })

    dom.writeFn(() =>
        paragraphs.forEach(p=> p.style.width = `${px}px`)
    )
}

box.addEventListener("resize", () => dom.scheduleEventFn(()=>resizeAllParagraphsToMatchBlockWidth(box, paragraphs)))