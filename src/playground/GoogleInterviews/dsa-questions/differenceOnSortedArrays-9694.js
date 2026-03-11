class DifferenceOnSortedArraysTwoPointer{
    differenceOnSortedArrays(first, second){ // TC: O(N) & SC: O(N)
        const m = first.length, n = second.length
        if(!second.length || !first.length) return first
        let i=0, j=0, matches = 0
        const ans = []

        while(j<n && i<m){
            if(first[i] === second[j]){
                i++
                j++
                matches++
                continue
            }

            if(first[i] < second[j]) {
                ans.push(first[i])
                i++
                continue
            }
            if(first[i] > second[j]) j++
        }

        while(i<m) ans.push(first[i++])

        ans.push(...Array(matches).fill(0))

        return ans
    }

    differenceOnSortedArraysSpaceOptimised(first, second){ // TC: O(N) & SC: O(1)
        const m = first.length, n = second.length
        if(!second.length || !first.length) return first
        let i=0, j=0, write = 0

        while(j<n && i<m){
            if(first[i] < second[j]) {
                first[write++] = first[i] 
                i++
            }
            else if(first[i] > second[j]) j++
            else{
                i++
                j++
            }
        }

        while(i<m) 
            first[write++] = first[i++]

        while(write<m) first[write++] = 0

        return first
    }

}