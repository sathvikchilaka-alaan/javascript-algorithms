const isTree = (parent) =>{
    if(!parent.length) return false

    let rootsCount = 0
    let root = -1
    const n = parent.length
    let graph = Array.from({length: n}, ()=>[])

    for (let i = 0; i < n; i++) {
        const p = parent[i];
        if (p === -1) {
            rootsCount++;
          root = i;
        } else {
          if (p < 0 || p >= n) return false;
          graph[p].push(i);
        }
    }
    if(rootsCount !== 1) return false 

    let vis = Array(n).fill(0)
    let visitedNodes= 0

    function dfs(s){
        if(vis[s]===1) return false
        if(vis[s]===2) return true

        vis[s] = 1
        visitedNodes++

        for(const u of graph[s]){
            if(!dfs(u))
                return false
        }

        vis[s]=2
        return true
    }

    if(!dfs(root)) return false

    return visitedNodes === n

}