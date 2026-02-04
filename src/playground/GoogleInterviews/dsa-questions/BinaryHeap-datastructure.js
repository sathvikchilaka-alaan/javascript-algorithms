export default class BinaryHeap{
    constructor(comparator){
        this.heap = []
        this.comparator = comparator // return true for (a, b) => a < b
    }

    peek(){ // O(1)
        return this.heap[0] ?? null
    }

    size(){
        return this.heap.length
    }

    push(num){ // O(logN)
        if(num === null || num === undefined) return
        if(!this.heap.length) {
            this.heap.push(num)
            return
        }

        this.heap.push(num)
        let i = this.heap.length-1
        while(i>0){
            let parentIdx = (i-1)>>1
            if (this.comparator(this.heap[i], this.heap[parentIdx])){
                [this.heap[i], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[i]]
                i = parentIdx
            }
            else break
        }
    }

    pop(){ // O(logN)
        if(!this.heap.length) return null
        if(this.heap.length === 1) return this.heap.pop()
        let top = this.heap[0]
        let last = this.heap.pop()
        this.heap[0] = last
        let i = 0
        let n = this.heap.length

        while(true){
            let leftChild = 2*i+1
            let rightChild = 2*(i+1)
            let best = i

            if(leftChild<n && this.comparator(this.heap[leftChild], this.heap[best])) best = leftChild
            if(rightChild<n && this.comparator(this.heap[rightChild], this.heap[best])) best = rightChild

            if(best === i ) break

            [this.heap[i], this.heap[best]] = [this.heap[best], this.heap[i]]
            i = best
        }

        return top
    }
}