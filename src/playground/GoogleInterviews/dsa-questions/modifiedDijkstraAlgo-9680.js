class BinaryHeap{
    constructor(comparator, heap = []){
        this.comparator = comparator // returns true for (a, b) => a < b
        this.heap = []

        if(Array.isArray(heap) && heap.length){
            heap.forEach(x => {
                this.push(x)
            })
        }
    }

    size(){
        return this.heap.length
    }

    peek(){
        return this.heap[0]
    }

    push(x){
        if(x === null) return

        this.heap.push(x)
        let i = this.heap.length - 1
        while(i>0){
            const parentId = (i-1) >> 1

            if(this.comparator(this.heap[i], this.heap[parentId])){
                [this.heap[i], this.heap[parentId]] = [this.heap[parentId], this.heap[i]]
                i = parentId
            } else break
        }
    }

    pop(){
        if(!this.heap.length) return null
        if(this.heap.length === 1) return this.heap.pop()
        const top = this.heap[0]
        this.heap[0] = this.heap.pop()

        const n = this.heap.length
        let i=0
        while(true){
            const leftChild = 2*i+1, rightChild = 2*(i+1)
            let best = i

            if(leftChild<n && this.comparator(this.heap[leftChild], this.heap[best])) best = leftChild
            if(rightChild<n && this.comparator(this.heap[rightChild], this.heap[best])) best = rightChild

            if(i===best) break
            [this.heap[i], this.heap[best]] = [this.heap[best], this.heap[i]]
            i = best
        }

        return top
    }
}