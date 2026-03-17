class BinaryHeap{
    constructor(comparator){
        this.heap = []
        this.comparator = comparator // Returns true, if (a, b) => a < b
    }

    size(){
        return this.heap.length
    }

    peek(){
        return this.heap[0]
    }

    push(x){ // O(Logn)
        this.heap.push(x)
        if(this.heap.length === 1) {
            return
        }
        let i = this.heap.length -1
        while(i>0){
            const parentInd = (i-1)>>1

            if(!this.comparator(this.heap[parentInd], this.heap[i])){
                [this.heap[i], this.heap[parentInd]] = [this.heap[parentInd], this.heap[i]]
                i = parentInd
            } else break
        }

        return
    }

    pop(){
        if(!this.heap.length) return null
        if(this.heap.length === 1)
            return this.heap.pop()
        
        const ans = this.heap[0]
        this.heap[0] = this.heap.pop()

        let i= 0
        while(true){
            const leftChild = 2*i+1, rightChild = 2*(i+1)
            let best = i
            
            if(leftChild < this.heap.length && !this.comparator(this.heap[best], this.heap[leftChild])) best = leftChild
            if(rightChild < this.heap.length && !this.comparator(this.heap[best], this.heap[rightChild])) best = rightChild

            if(i===best) break

            [this.heap[best], this.heap[i]] = [this.heap[i], this.heap[best]]
            i = best
        }

        return ans
    }
}

class OrderBooksViaSeller{

    constructor(){
        this.minHeap = new BinaryHeap((a, b) => {
            if(a.price === b.price) return a.timestamp < b.timestamp
            return a.price < b.price
        })
        this.removedOrders = new Set() // Set of seller_ids who have withdrawn themselves from the sale
    }

    insert_order(seller_id, price, timestamp){
        this.minHeap.push({seller_id, price, timestamp})
    }

    get_lowest_seller_id(){ // TC: O(NLogN), worst case
        while(this.minHeap.size()){
            const soldOrder = this.minHeap.pop()
            // If the seller has withdrawn then anyways we need to remove his products as well, 
            // so pop em and continue if that order happens to be one of the seller's product
            if(this.removedOrders.has(soldOrder.seller_id)){
                this.removedOrders.delete(soldOrder.seller_id)
                continue
            }

            return soldOrder.seller_id
        }
        return null
    }

    // Followup: If a seller can stock up more than one item as order.
    get_lowest_seller_id_for_quantity() {
        while (this.minHeap.size()) {
            const order = this.minHeap.pop()
    
            if (this.removedOrders.has(order.seller_id)) {
                continue
            }
    
            const sellerId = order.seller_id
            order.quantity -= 1 // Now, while pushing an item into heap, that obj will also has quantity prop
    
            if (order.quantity > 0) {
                this.minHeap.push(order)
            }
    
            return sellerId
        }
        return null
    }

    remove_seller_id(x){
        this.removedOrders.add(x)
    }
}