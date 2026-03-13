class RotateMatrixClockwise {
    constructor(){
        this.rowsMatrix
        this.ans = []
        this.p
        this.q
    }

    rotateRowMatrix(arr, p, q){ // TC = O(p*q) => O(N) && SC = O(p*q), with 2D matrix
        this.p = p, this.q = q
        this.ans = []
        this.rowsMatrix = Array.from({length: p}, ()=> new Array(q))
        let i =0, row = p

        while(row--){
            const rowArray = arr.slice(i, i + q)
            this.rowsMatrix[row] = rowArray
            i += q
        }

        for(let i = 0; i < this.q; i++){
            for(let j = 0; j < this.p; j++){
                this.ans.push(this.rowsMatrix[j][i])
            }
        }

        return this.ans
    }

    rotateRowMatrixSpaceOptimized(arr, p, q){ // TC = O(p*q) => O(N) && SC = O(N), but better than 2D matrix
        const calcNewIndex = (i, p, q) => {
            return (i%q)*p + ( p - 1 - Math.floor(i/q) )
        }

        this.p = p, this.q = q
        this.ans = []

        for(let i=0; i< p*q; i++)
            this.ans[calcNewIndex(i, this.p, this.q)] = arr[i]

        return this.ans
    }
}