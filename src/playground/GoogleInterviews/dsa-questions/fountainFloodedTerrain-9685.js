class FountainFloodedTerrains{

    getFloodedTerriansByFountains1D(terrains, fountains){
        const n = terrains.length

        let isFlooded = Array(n).fill(false)
        let isFountain = Array(n).fill(false)
        let cMax = -1

        fountains.forEach(node=> isFountain[node]=true)

        for(let i=0; i<n; i++){ // Left->Right Sweep, as water can move in 1D directions
            if(isFountain[i]) {
                cMax= Math.max(cMax, terrains[i])
                continue
            }

            if(cMax !== -1){
                if(terrains[i]<cMax) isFlooded[i] = true
                else cMax = -1
            }
        }

        cMax = -1
        for(let i=n-1; i>=0; i++){ // Right->Left Sweep, as water can move in 1D directions
            if(isFountain[i]) {
                cMax= Math.max(cMax, terrains[i])
                continue
            }

            if(cMax !== -1){
                if(terrains[i]<cMax) isFlooded[i] = true
                else cMax = -1
            }
        }

        return isFlooded
    }
    
    getFloodedTerriansByFountains2D(terrains, fountains){
        const m=terrains.length, n=terrains[0].length

        let isFlooded = Array.from({length: m}, ()=>Array(n).fill(false))
        const dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]]

        const isValidIndex = (x, y) =>{
            return x>=0 && y>=0 && x<m && y<n
        }
        const fountainSet = new Set(fountains.map(([x,y]) => `${x},${y}`)) // Lil smart func to find if x,y is a fountain or not in O(N)
        
        fountains.forEach(([fx, fy])=>{ // We flood by considering each fountain at a time, so we dont update the maxFountainHeight for a queue BFS traversal of a fountain
            let maxFountainHeight = terrains[fx][fy]
            let isVisited = Array.from({length: m}, ()=>Array(n).fill(false)) // Visited from this fountain only, coz we want to isolate each fountain's flow

            let queue = []
            queue.push({x:fx, y:fy})
            isVisited[fx][fy] = true
            
            let i = 0
            while(i<queue.length){
                let {x:cx, y:cy} = queue[i++]

                for(let j = 0; j < dirs.length; j++){
                    const [dx, dy] = dirs[j]
                    const nx = cx+dx, ny = cy+dy

                    if(!isValidIndex(nx, ny) || isVisited[nx][ny]) continue

                    if(terrains[nx][ny] < maxFountainHeight){
                        isVisited[nx][ny] = true
                        if(!fountainSet.has(`${nx},${ny}`)){
                            isFlooded[nx][ny] = true
                        }

                        queue.push({x:nx, y:ny})
                    }
                }
            }
        })

        return isFlooded
    }
}