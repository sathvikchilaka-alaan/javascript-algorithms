class DisjointSetUnion{
    constructor(n){
        this.parent = Array.from({length: n+1}, (_, i)=> i) // 1-indexed array to point 1st element with 1...
        this.size = new Array(n).fill(1) // The size of a node means the number of elements in the set whose root is that node.
    }

    unite(a, b){ // O(N)
        const parentA = this.find(a)
        const parentB = this.find(b)

        if(parentA !== parentB){
            // Attach smaller tree to the bigger one, to maintain shallower tree overall
            if(this.size[parentA] > this.size[parentB]){
                this.parent[parentB] = parentA
                this.size[parentA] += this.size[parentB]
            } else{
                this.parent[parentA] = parentB
                this.size[parentB] += this.size[parentA]
            }
        }
    }

    find(x){ // O(N)
        if(this.parent[x] !== x){
            // THe first time, it will do entirely but the subsequent times, it gonna be simple
            this.parent[x] = this.find(this.parent[x])
        }

        return this.parent[x]
    }
}

// Big signals that indicate it's a DSU:
// If a problem says-
// 	•	mark elements as processed
// 	•	skip elements already processed
// 	•	find next available element
// 	•	later queries overwrite earlier queries