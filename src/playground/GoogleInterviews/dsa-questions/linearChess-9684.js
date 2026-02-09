class LinearChess1D{

    isVaildChar(c){
        return c==='_' || c==='R' || c==='L'
    }

    canTransform(start, finish){
        if(start.length!== finish.length) return false

        const n = start.length
        let i=0, j=0

        while(i<n || j<n){
            while(i<n && start[i]==='_') i++
            while(j<n && finish[j]==='_') j++

            // if we completed the chars from above while loop for atleast one of string then the other also must be completing it.. Ex: start  = "__R_" finish = "__RR"
            if(i===n || j===n) return i===n && j===n 
            
            if(!this.isVaildChar(start[i]) || !this.isVaildChar(finish[j])) return false

            let a= start[i], b=finish[j]
            if(a!==b) return false // Order must be same

            if(a==='R' && j<i) return false // The R in finish cant be in the prev index of start
            if(a==='L' && i<j) return false // The L in finish cant be in the next index of start

            i++; j++
        }

        return true
    }
}

const chess = new LinearChess1D();

const tests = [
    ["R__L", "_R_L"],   // true
    ["_R__", "__R_"],   // true
    ["__R_", "__RR"],   // false (extra R)
    ["R_L_", "_RL_"],   // false (order mismatch)
    ["_L__", "__L_"],   // false (L moved right)
    ["__R_", "_R__"],   // false (R moved left)
];

for (const [start, finish] of tests) {
    console.log(
        `start: "${start}", finish: "${finish}" →`,
        chess.canTransform(start, finish)
    );
}