import BinaryHeap from "./BinaryHeap-datastructure";

class ManageStorageBucket{
    constructor(storageList, storageSize){
        this.storageList = storageList
        this.storageSize = storageSize
    }
    
    getLargest10Files(uri){
        if(!uri) return []
        this.bHeap = new BinaryHeap((a,b)=> a.sz < b.sz)

        let childNodes = this.storageList(uri) || []
        let queue = []
        for(const child of childNodes) queue.push(child)

        let i=0
        while(i<queue.length){
            let curr = queue[i++] // BFS
            
            let sz = this.storageSize(curr)
            if(sz !== -1){
                // It's a file
                this.bHeap.push({
                    sz,
                    path: curr
                })
                if(this.bHeap.size()>10) this.bHeap.pop()
            } else{
                // It's a sub-directory
                let children = this.storageList(curr) || []
                if(children.length)
                    for(const child of children) queue.push(child)
            }
        }

        let res = [...this.bHeap.heap].sort((a,b)=> b.sz - a.sz) // BinaryHeap is not iterable, so we are accessing heap array obj inside heap
        return res
    }

    // DFS is better than BFS here, coz in storage buckets, there'll be millions of siblings in a directory and compared to each sibling depth, 
    // the size of the sibling sub-directories is much larger, so DFS will be more efficient in this case as stack will store max-depth size
    getLargest10FilesDFS(uri) {
        if (!uri) return [];
      
        this.bHeap = new BinaryHeap((a, b) => a.sz < b.sz);
      
        let stack = [];
        let childNodes = this.storageList(uri) || [];
        for (const child of childNodes) stack.push(child);
      
        while (stack.length > 0) {
          let curr = stack.pop(); // DFS
      
          const sz = this.storageSize(curr);
          if (sz !== -1) {
            // file
            this.bHeap.push({ sz, path: curr });
            if (this.bHeap.size() > 10) this.bHeap.pop();
          } else {
            // sub-directory
            let children = this.storageList(curr) || [];
            for (const child of children) stack.push(child);
          }
        }
      
        return [...this.bHeap.heap].sort((a, b) => b.sz - a.sz);
      }

    getLargest10Directories(uri){
        if(!uri) return []
        this.bHeap = new BinaryHeap((a,b)=> a.sz < b.sz)

        const getDirectorySize = (uri)=>{
            if(!uri) return 0
            let rootSize = this.storageSize(uri)
            if(rootSize!== -1) return rootSize

            let childNodes = this.storageList(uri) || []
            let stack = []
            let total = 0
            for(const child of childNodes) stack.push(child)

            while(stack.length>0){
                let curr = stack.pop() // DFS

                let sz = this.storageSize(curr)
                if(sz !== -1) total+=sz
                else {
                    let children = this.storageList(curr) || []
                    if(children.length)
                        for(const child of children) stack.push(child)
                }
            }

            return total
        }

        let firstChildren = this.storageList(uri) || []

        for(const child of firstChildren){
            let childSize = this.storageSize(child)
            if(childSize === -1){ // It's a directory
                let directorySize = getDirectorySize(child)
                this.bHeap.push({
                    sz: directorySize,
                    path: child
                })

                if(this.bHeap.size()>10) this.bHeap.pop()
            }
        }

        return [...this.bHeap.heap].map(child => child.path) // This returns largest 10 directories in any order
    }
}