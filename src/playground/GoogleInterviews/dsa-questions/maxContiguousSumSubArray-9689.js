// HARD Question - Kadane's Algo
class MaxContiguousSumSubArray{
    constructor(){
        this._reset()
    }

    _resultantObj(i, j, v){
        return {
            i, j, sum: v
        }
    }

    _reset(){
        this.maxSum = -Infinity
        this.bestI = -1
        this.bestJ = -1
        this.maxPrefixMap = new Map() // { prevValue, { prevValuePrefixSum, preValueIndex } } }
    }

    // For each value v, I keep the minimum prefix sum seen at any earlier index where the value was v.
    // Then when I reach another v at index j, I can instantly compute the best valid subarray ending at j as prefix[j+1] - minPrefixForV.
    findMaxSumContiguousSubArray(arr){
        if(!arr.length) return null
        if(arr.length === 1) return this._resultantObj(0, 0, arr[0])

        let prefixSum = 0
        for(let i=0; i<arr.length; i++){
            const val = arr[i]

            // Find if we have that element previously and check if it's prefix is bigger than the current val's prefixSum
            if(!this.maxPrefixMap.has(val) || prefixSum < this.maxPrefixMap.get(val).prevValuePrefixSum){
                this.maxPrefixMap.set(val, {
                    prevValuePrefixSum: prefixSum, 
                    preValueIndex: i
                })
            }

            prefixSum+=val

            // Finding the currSum; Sum(i....j) = PrefixSum(j+1) - PrefixSum(i).... this also works for single element arrays
            const { prevValuePrefixSum, preValueIndex } = this.maxPrefixMap.get(val)
            const currSum = prefixSum - prevValuePrefixSum

            if(currSum > this.maxSum){
                this.maxSum = currSum
                this.bestI = preValueIndex
                this.bestJ = i
            }
        }

        const res = this._resultantObj(this.bestI, this.bestJ, this.maxSum)
        this._reset()
        return res
    }
}

const maxSum = new MaxContiguousSumSubArray();

console.log(maxSum.findMaxSumContiguousSubArray([1, 2, 3, 2, 5]));
// { i: 1, j: 3, sum: 7 }

console.log(maxSum.findMaxSumContiguousSubArray([-100, 1, -50, 1, -60]));
// { i: 1, j: 1, sum: 1 }

console.log(maxSum.findMaxSumContiguousSubArray([4, -10, 4, 3, 4]));
// { i: 2, j: 4, sum: 11 }

console.log(maxSum.findMaxSumContiguousSubArray([5, -100, 5, 4]));
// { i: 0, j: 0, sum: 5 } or { i: 2, j: 2, sum: 5 }

console.log(maxSum.findMaxSumContiguousSubArray([3, 3, 3, 3]));
// { i: 0, j: 3, sum: 12 }

console.log(maxSum.findMaxSumContiguousSubArray([1, 2, 3]));
// { i: 2, j: 2, sum: 3 }


// Follow-up 4
// My optimal solution runs in O(n) time and O(n) space. In practice, linear time is scalable, and memory depends on the number of distinct values because of the hashmap.

// Follow-up 5
// Yes, it can be parallelized by splitting the array into chunks, computing local prefix-based summaries and per-value metadata, then merging them. But the merge logic is complex because valid answers may span chunks and depend on equal endpoint values.