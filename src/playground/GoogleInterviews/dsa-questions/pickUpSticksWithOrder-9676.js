// const n = 3;
// const points = [5, 3, 2];
// const sticks = [[1, 2], [2, 3]];

const pickUpSticksWithOrder = (n, points, sticks) =>{ // This is only for non-negative points to each edge
    let indegree = Array(n+1).fill(0)
    let graph = Array.from({length: n+1}, ()=>[])
    let queue = []
    
    sticks.forEach(([u, v])=> {
        graph[u].push(v)
        indegree[v]++
    })
    
    for(let i= 1; i<=n; i++)
        if(!indegree[i]) queue.push(i)
            
    let resultOrder = []
    let total = 0
    let i = 0
    while(queue.length){
        let curr = queue[i++]

        resultOrder.push(curr)
        total+=points[curr-1]
        for(const u of graph[curr]){
            indegree[u]--
            if(!indegree[u]) queue.push(u)
        }
    }

    return { resultOrder, total }
}

// In case of negative points, this becomes a maximum-weight closure problem on a directed graph,
// which can be solved using a max-flow/min-cut reduction and this topo sort doesnt work.
