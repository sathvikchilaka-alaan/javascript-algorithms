class CompactPortsSummarize{
    constructor(){
        this.MAX_VISIBLE_PORTS = 200
    }

    parseResultGroup(name, from, to){
        const count = to-from +1

        return {
            group: name,
            from,
            to,
            count,
            display: (from===to) ? `${name}:${from}` : `${name}:${from}-${to}`
        }
    }

    // Example output item:
    // {
    //   group: "abc",               // base group label (for UI headers)
    //   from: 1000,
    //   to: 1002,
    //   nameSuffixFrom: undefined,  // optional followup for L5
    //   nameSuffixTo: undefined,    // optional followup for L5
    //   count: 3,
    //   display: "abc:1000-1002"
    // }

    compactPorts(ports){ // O(NlogN), It’s not N sorts of size N.
        if(!ports.length) return []
        if(ports.length === 1) return [this.parseResultGroup(ports[0].portName, ports[0].portNumber, ports[0].portNumber)]

        let portMap = new Map()
        let res= []

        ports.forEach(port=>{
            const portName = port.portName
            const portNumber = port.portNumber
            if(!portMap.has(portName)) portMap.set(portName, [])
            
            portMap.get(portName).push(portNumber)
        }) // ex: {abc, [101, 100, 102, 104, 105, 110]}

        for(let [portName, portNumbers] of portMap.entries()) {
            portNumbers = portNumbers.filter(num => Number.isFinite(num)).sort((a, b)=> a-b) // Sort by numbers and remove null/undefined/Infinite values

            if (portNumbers.length === 0) continue
            let start = portNumbers[0], end = portNumbers[0]
            for(let i=1; i<portNumbers.length; i++){
                const curr = portNumbers[i]
                if(curr !== end+1){
                    res.push(this.parseResultGroup(portName, start, end))
                    start = curr
                    // end = curr  No need as we r dng it below anyways
                }
                
                end = curr
            }

            // We need to push trailin as well, coz what if all of em r consecutive numbers?
            res.push(this.parseResultGroup(portName, start, end)) 

            // If we hit MAX_VISIBLE_PORTS in a specific port, still we will iterate over next port... so we need to have >= and also slice before returning at end
            if(res.length >= this.MAX_VISIBLE_PORTS) return res 
        }

        res.sort((a, b)=> (a.group === b.group) ? (a.from - b.from) : (a.group.localeCompare(b.group)))

        return res.slice(0, this.MAX_VISIBLE_PORTS)
    }


    // Extended Followup for L5, where the names might also have suffixes:
    // 1. Group by base name (strip trailing digits) and optionally track suffix range.
    // function parseName(name) {
    //     // "abc404" -> { base: "abc", suffix: 404 }
    //     // "abc"    -> { base: "abc", suffix: null }
    //     const m = /^(.+?)(\d+)?$/.exec(name);
    //     if (!m) return { base: name, suffix: null };
    //     return {
    //       base: m[1],
    //       suffix: m[2] != null ? Number(m[2]) : null,
    //     };
    //   }
    //
    // 2. Compact with suffix support
    // Rule to merge into the same range:
    // •	port numbers consecutive (prevPort + 1 === currPort)
    // •	base name same
    // •	and either:
    // •	suffix not being used (simple mode), OR
    // •	suffix is also consecutive (prevSuffix + 1 === currSuffix)
}