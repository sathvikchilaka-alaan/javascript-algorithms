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

function dijkstraAlgo(graph, start){
    const n = graph.length
    let bestEff = new Array(n).fill(0)

    // Because we need to get the max efficiencies on multiplication, unlike usual dijkstra algo
    const maxHeap = new BinaryHeap((a, b)=> a[0] > b[0]) 
    maxHeap.push([1, start])
    bestEff[start] = 1

    while(maxHeap.size()){
        const [currEff, node] = maxHeap.pop()

        if (currEff < bestEff[node]) continue

        for(const [neigh, nextEff] of graph[node]){
            if(bestEff[neigh] < currEff*nextEff){ // Get the max for the bestEfficiency
                bestEff[neigh] = currEff*nextEff
                maxHeap.push([bestEff[neigh], neigh])
            }
        }
    }

    return bestEff
}

// Normal dijkstra using graph with -Log(weight) nodes, it also helps in handling veryyyyyyy tiny efficiencies the ones which JS cant underflow (IMP)
function dijkstraAlgo2(graph, start){
    const n = graph.length
    let bestEff = new Array(n).fill(Infinity)

    const minHeap = new BinaryHeap((a, b)=> a[0] < b[0])

    minHeap.push([0, start])
    bestEff[start] = 0

    while(minHeap.size()){
        const [currEff, node] = minHeap.pop()

        if (currEff > bestEff[node]) continue

        for(const [neigh, nextEff] of graph[node]){
            if(bestEff[neigh] > currEff + nextEff){ // Get the min for bestEfficiency as the weights are -Log(weight)
                bestEff[neigh] = currEff + nextEff
                minHeap.push([bestEff[neigh], neigh])
            }
        }
    }

    return bestEff
}

// Base question
function maxTransmissionEfficiency(n, edges, source, destination){
    const graph = Array.from({length: n}, ()=>[])
    const graph2 = Array.from({length: n}, ()=>[])

    edges.forEach(([u, v, weight])=>{
        graph[u].push([v, weight])
    })

    edges.forEach(([u, v, weight])=>{
        graph2[u].push([v, -Math.log(weight)]) // Max(a.b) <==> Min(-Log(a)-Log(b)), which we can do normal dijkstra on -Log(weight)
    })

    // Both r valid approaches
    const bestEff = dijkstraAlgo(graph, source)
    const bestEff2 = dijkstraAlgo2(graph2, source)

    return bestEff[destination]
    // return Math.exp(-dist[destination])
}

// Followup-1: The Signal Booster
// Question: You can upgrade exactly one edge to efficiency 1.0. Need the best possible source-to-destination path after choosing which edge to boost.

// Idea: For any edge (u -> v, w); if that edge is boosted to 1.0, then the path efficiency becomes: bestFromSource[u] * 1.0 * bestToDest[v]
function maxTransmissionEfficiencyWithSignalBooster(n, edges, source, destination){
    const graph = Array.from({length: n}, ()=>[])
    const invertedGraph = Array.from({length: n}, ()=>[])

    edges.forEach(([u, v, weight])=>{
        graph[u].push([v, weight])
    })
    edges.forEach(([u, v, weight])=>{
        invertedGraph[v].push([u, weight])
    })

    const bestFromSource = dijkstraAlgo(graph, source)
    const bestFromDestination = dijkstraAlgo(invertedGraph, destination)

    let ans = bestFromSource[destination]
    edges.forEach(([u, v, _]) => {
        if(bestFromSource[u]>0 && bestFromDestination[v]>0){ // Some nodes might not be able to reach
            // Idea: For any edge (u -> v, w); if that edge is boosted to 1.0, then the path efficiency becomes: bestFromSource[u] * 1.0 * bestToDest[v]
            ans = Math.max(ans, bestFromSource[u]*1*bestFromDestination[v]) 
        }
    })

    return ans
}


// Follow-up: Phase Parity
// Question: Now the path must contain an even number of edges. Need the maximum efficiency path from source to destination with even path length.
function maxEfficiencyEvenLength(n, edges, source, destination){
    const graph = Array.from({length: 2*n}, ()=>[])

    const getEvenNode = (n) => 2*n
    const getOddNode = (n) => 2*n+1

    edges.forEach(([u, v, weight])=>{
        // For each node, let's make odd & even versions of it and then we will take destination only for the even variant node of it
        graph[getEvenNode(u)].push([getOddNode(v), weight])
        graph[getOddNode(u)].push([getEvenNode(v), weight])
    })

    const bestEff = dijkstraAlgo(graph, getEvenNode(source)) // Start from the even node, as we r initiating from it

    return bestEff[getEvenNode(destination)]
}


function maxEfficiencyWithBudget(n, edges, source, destination, budget){
    const graph = Array.from({length: n}, ()=>[])
    const bestEff = Array.from({length: n}, () => new Array(budget+1).fill(0))

    edges.forEach(([u,v,eff,cost])=>{
        graph[u].push([v, eff, cost])
    })

    // Efficiency weights comparision first, followed by least cost required to move forward
    const maxHeap = new BinaryHeap((a, b) =>
        a[0] === b[0] ? a[1] < b[1] : a[0] > b[0]
    )

    maxHeap.push([1, 0, source]) // Efficiency, CostUsed, Node
    bestEff[source][0] = 1

    while(maxHeap.size()){
        const [currEff, costUsed, u] = maxHeap.pop()

        if (currEff < bestEff[u][costUsed]) continue

        for(const [v, nextEff, costRequired] of graph[u]){
            const updatedCost = costRequired+costUsed

            if(updatedCost>budget) continue

            if(currEff*nextEff > bestEff[v][updatedCost]){
                bestEff[v][updatedCost] = currEff * nextEff
                maxHeap.push([bestEff[v][updatedCost], updatedCost, v])
            }
        }
    }

    let ans = 0
    // Basically for all the paths of efficiency multiplications, we have reached the destination under the budget (as we have skipped >budget ones)
    // we want the one path with best efficiency
    bestEff[destination].forEach(efficiency => {
        ans=Math.max(ans, efficiency)
    })

    return ans
}

// IMP: There's no possibility of cycles here, as we keep multiplying... the product gets smaller and smaller... so it wont be a problem as we will reject it. Even in Signal Booster followup.


// I’d model the transmission grid as a directed weighted graph where edge weights are efficiencies in (0, 1]. Since total path efficiency is the product of edge efficiencies, I need the path with maximum product.
// A plain BFS or DFS won’t work because BFS optimizes hop count (basically can only work on un-weighted edges) and DFS over all paths is too expensive.
// I can solve it using a modified Dijkstra. Instead of storing shortest distance, I store best efficiency seen so far for each node. I use a max-heap, starting from efficiency 1 at the source. For each edge, I multiply current efficiency by edge efficiency, and if that improves the best known value for the neighbor, I update it.
// This works because all efficiencies are at most 1, so extending a path never increases its value. That gives the same monotonic property Dijkstra relies on.
// Time complexity is O((V + E) log V) and space complexity is O(V + E).
// As an alternative, I can also transform each weight using -log(w) and reduce the problem to standard shortest path.