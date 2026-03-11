// Simpler approach by dng a lil unconventional DSU implementation at union func
class DSU{
    constructor(n){
        this.parent = Array.from({length: n+1}, (_, i)=> i) // We are using the last node as sentinal node, which says it's out of array parent[n] is always > R
    }

    find(x){
        if(this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x])

        return this.parent[x]
    }

    // In this question context, we can attach it to "b"
    union(a, b){
        this.parent[a] = b
    }
}

class NextUnassignedIndexDSU{
    constructor(n){
        this.n= n
        this.dsu = new DSU(this.n)
    }

    find(x){
        return this.dsu.find(x)
    }

    assignNext(x){
        this.dsu.union(x, this.find(x+1))
    }
}

function rangeAssign(arr, queries){ // O(N+Q)
    const n = arr.length

    const indexDSU = new NextUnassignedIndexDSU(n)

    // Coz the reverse queries have higher priority and we can skip the indices which have already been a part of union or already assigned
    for(let q = queries.length - 1; q >= 0; q--){
        const [L, R, V] = queries[q]
        let startIndex = indexDSU.find(L)

        while(startIndex<=R){
            arr[startIndex] = V
            // Coz [L... R] is a contiguous array, we can add L as child to R/parent[R] and make it as a union 
            indexDSU.assignNext(startIndex)
            startIndex = indexDSU.find(startIndex)
        }
    }

    return arr
}






// More Generic soln, actually an overkill but follows DSU pattern like using size & union methods strictly..
// class DSU {
//     constructor(n) {
//         this.parent = Array.from({ length: n }, (_, i) => i);
//         this.size = Array(n).fill(1);
//         this.nextAvailable = Array.from({ length: n }, (_, i) => i);
//     }

//     find(x) {
//         if (this.parent[x] !== x) {
//             this.parent[x] = this.find(this.parent[x]);
//         }
//         return this.parent[x];
//     }

//     findNext(idx) {
//         const root = this.find(idx);
//         return this.nextAvailable[root];
//     }

//     // Merge set containing y into the skip-behavior of set containing x
//     merge(x, y) {
//         let rootX = this.find(x);
//         let rootY = this.find(y);

//         if (rootX === rootY) return;

//         const targetNext = this.nextAvailable[rootX];

//         // union by size
//         let smallRoot = rootY;
//         let largeRoot = rootX;

//         if (this.size[smallRoot] > this.size[largeRoot]) {
//             [smallRoot, largeRoot] = [largeRoot, smallRoot];
//         }

//         this.parent[smallRoot] = largeRoot;
//         this.size[largeRoot] += this.size[smallRoot];

//         // propagate skip pointer
//         this.nextAvailable[largeRoot] = targetNext;
//     }
// }

// function rangeAssign(arr, queries) {
//     const n = arr.length;
//     const ans = [...arr];

//     // Need n+1 because we may do findNext(R+1) when R = n-1
//     const nextPtr = new DSU(n + 1);

//     for (let i = queries.length - 1; i >= 0; i--) {
//         const [L, R, k] = queries[i];

//         let ptr = nextPtr.findNext(L);
//         const rootBeyondR = nextPtr.findNext(R + 1);

//         while (ptr <= R) {
//             ans[ptr] = k;

//             // make current assigned block skip to beyond R
//             nextPtr.merge(rootBeyondR, ptr);

//             ptr = nextPtr.findNext(ptr + 1);
//         }
//     }

//     return ans;
// }