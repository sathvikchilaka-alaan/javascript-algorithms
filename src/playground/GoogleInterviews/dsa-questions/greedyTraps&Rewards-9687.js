class Game{
    constructor({
        subgridSize,
        radius,
        traps = [],
        rewards = [],
        mapHeight = 100,
        mapWidth = 100,
        startPosition = [0, 0]
    }){
        if (radius >= subgridSize) throw new Error("radius must be smaller than subgridSize")

        this.direcn = [ // List of directional pointers we need to calc
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ]

        this.radius = radius
        this.radiusSqu = radius * radius
        this.traps = new Set((traps.map(([x, y, v]) => this._parseObjectFromPos(x, y, v, true))))
        this.rewards = new Set((rewards.map(([x, y, v]) => this._parseObjectFromPos(x, y, v, false))))
        this.mapHeight = mapHeight
        this.mapWidth = mapWidth
        this.currPos = {
            x: startPosition[0],
            y: startPosition[1]
        }
        this.subgridSize = subgridSize

        // Building the 2D plane with subgrids
        this._subGridObjectMap = new Map() // { `subGridX,subGridY`, new Set(list of traps/rewards) }
        for(let currX = 0; currX<this.mapWidth; currX+=this.subgridSize){
            for(let currY = 0; currY<this.mapHeight; currY+=this.subgridSize){
                this._subGridObjectMap.set(this._parsePos(currX, currY), new Set())
            }
        }

        //Inserting traps into the _subGridObjectMap for easy retreival
        Array.from(this.traps).forEach(t=>{
            const [x, y, v, isTrap] = this._parsePosFromObject(t)

            const [subGridX, subGridY] = this._findSubGridMap(x, y) 
            const subgridRef = this._subGridObjectMap.get(this._parsePos(subGridX, subGridY))

            subgridRef.add(this._parseObjectFromPos(x, y, v, isTrap))
        })

        //Inserting rewards into the _subGridObjectMap for easy retreival
        Array.from(this.rewards).forEach(r=>{
            const [x, y, v, isTrap] = this._parsePosFromObject(r)

            const [subGridX, subGridY] = this._findSubGridMap(x, y) 
            const subgridRef = this._subGridObjectMap.get(this._parsePos(subGridX, subGridY))

            subgridRef.add(this._parseObjectFromPos(x, y, v, isTrap))
        })
    }

    _findSubGridMap(x, y){
        const sx = Math.max(0, Math.min(x - (x % this.subgridSize), this.mapWidth - this.subgridSize))
        const sy = Math.max(0, Math.min(y - (y % this.subgridSize), this.mapHeight - this.subgridSize))

        return [sx, sy]
    }

    _parsePos(x, y){
        return `${x},${y}`
    }

    _parseObjectFromPos(x, y, v, isTrap = false){
        return `${x},${y},${v},${isTrap ? 1:0}`
    }

    _parsePosFromObject(str){
        const [x, y, v, isTrap] = str.split(',').map(Number) // Making sure returned values r all Numbers

        return [x, y, v, !!isTrap]
    }

    _isCollision(x1, x2, y1, y2){
        return (x2-x1)**2 + (y2-y1)**2 <= this.radiusSqu
    }

    _applyCollisionCalScore(x, y, trapsSeenInMove){
        let score = 0

        this.direcn.forEach(([dX, dY])=>{
            const newX = x + dX*this.radius, newY = y + this.radius*dY
            
            if(newX>=0 && newX<this.mapWidth && newY>=0 && newY<this.mapHeight){
                const [ subGridX, subGridY] = this._findSubGridMap(newX, newY)
                const relevantObjs = this._subGridObjectMap.get(this._parsePos(subGridX, subGridY))

                Array.from(relevantObjs).forEach((obj)=>{
                    const [ox, oy, v, isTrap] = this._parsePosFromObject(obj)

                    if(this._isCollision(x, ox, y, oy)){
                        if(isTrap){
                            if(!trapsSeenInMove.has(obj)){ // Traps r applied only once in a move
                                score -= v
                                trapsSeenInMove.add(obj)
                            }
                        } else{
                            score += v
                            relevantObjs.delete(obj) // Rewards are removed once applied, in the entire game
                        }
                    }

                })
            }
        })

        return score
    }

    getCurrPos(){
        return [this.currPos.x, this.currPos.y]
    }

    moveTo(destX, destY){
        let {x:currX, y:currY} = this.currPos

        if(destX >= this.mapWidth || destY >= this.mapHeight || destX < 0 || destY < 0) throw new Error("Out of bounds from the 2D map")

        let currScore = 0

        const trapsSeenInMove = new Set()
        while(currX!== destX || currY !== destY){
            // Greedy approach to reach destination, no optimization... so basically diagnolly
            if(currX < destX) currX++
            else if (currX > destX) currX--
            if(currY < destY) currY++
            else if(currY > destY) currY--

            currScore += this._applyCollisionCalScore(currX, currY, trapsSeenInMove) 
        }

        this.currPos = {
            x: currX, y: currY
        }
        return currScore
    }
}


/* ---------------- Example execution ---------------- */

const game = new Game({
    subgridSize: 10,
    radius: 3,
    mapWidth: 30,
    mapHeight: 30,
    startPosition: [0, 0],
    traps: [
      [5, 5, 2],   // trap at (5,5) => -2
    ],
    rewards: [
      [5, 5, 5],   // reward at (5,5) => +5 (same cell as trap)
      [8, 8, 4],   // reward at (8,8) => +4
    ],
  })
  
  console.log("Start:", game.getCurrPos())
  
  // Move 1: go to (5,5). Along the way you’ll eventually collide with (5,5) within radius.
  // Net should include +5 and -2 (trap once), and reward removed.
  const s1 = game.moveTo(5, 5)
  console.log("After moveTo(5,5): pos =", game.getCurrPos(), "scoreDelta =", s1)
  
  // Move 2: go to (5,5) again (no movement => scoreDelta 0, rewards already removed)
  const s2 = game.moveTo(5, 5)
  console.log("After moveTo(5,5) again: pos =", game.getCurrPos(), "scoreDelta =", s2)
  
  // Move 3: go to (9,9) to collect reward at (8,8).
  const s3 = game.moveTo(9, 9)
  console.log("After moveTo(9,9): pos =", game.getCurrPos(), "scoreDelta =", s3)
  
  // Total score across moves
  console.log("Total score:", s1 + s2 + s3)






// The main performance factors are the radius, subgrid size, and object density.
// If subgrid size is too large, each bucket contains too many objects, making collision checks expensive.
// If subgrid size is too small compared to the radius, we must check many neighboring subgrids.
// The optimal choice is usually to make the subgrid size roughly equal to the collision radius so that each query only needs to inspect a constant number of nearby buckets.


// Follow-up: “What if objects move?”

// What they want: can you maintain the spatial index under updates.

// Say:
// 	•	Introduce a game tick / clock.
// 	•	Each tick:
// 	1.	update each moving object position
// 	2.	if object crosses a subgrid boundary, move it between buckets:
// 	•	remove from old subgrid set
// 	•	add to new subgrid set
// 	•	Maintain id -> object map if you need O(1) updates.

// Optional optimization from guide:
// 	•	Don’t simulate objects far away (cull updates beyond X subgrids from player / viewport).

// Pseudocode: moveObject(id,newX,newY){
//     removeFromOldSubgrid(obj)
//     insertIntoNewSubgrid(obj)
//    }



// Follow-up: “Multiplayer: reward can only be collected once”

// What they want: concurrency + consistency.

// Say:
// 	•	Server should be authoritative.
// 	•	When collisions are reported:
// 	•	the server “claims” the reward atomically:
// 	•	first request wins (or earliest timestamp wins)
// 	•	then server marks reward collected and broadcasts removal
// 	•	If two players claim at “same time”:
// 	•	resolve by ordering rules:
// 	•	earliest timestamp wins
// 	•	tie-breaker policy: grant both / grant neither / respawn / error (depends on game design)

// Nice addition:
// 	•	Client-side prediction: show reward collected immediately for responsiveness, then reconcile if server disagrees.



// Follow-up: “Walls exist: block movement and/or block collecting”

// What they want: geometry + pathfinding.

// A) Walls block movement (path)

// Say:
// 	•	Now moveTo can’t just greedily step.
// 	•	Need pathfinding:
// 	•	A* (typical) or Dijkstra
// 	•	Walls define blocked cells/edges.
// 	•	Player moves along the computed path step-by-step.

// B) Walls block collecting (line-of-sight)

// Even if within radius, a wall between player and object should prevent collision.

// Say:
// 	•	Add line-of-sight check:
// 	•	cast a ray / segment from player to object
// 	•	if intersects any wall segment → no collection
// 	•	Optimize by spatial indexing walls too (same grid idea), so you don’t test against every wall.

// Tradeoff from guide:
// 	•	Raycast each time (less memory)
// 	•	Precompute blocked collision points around objects (more memory, faster runtime)