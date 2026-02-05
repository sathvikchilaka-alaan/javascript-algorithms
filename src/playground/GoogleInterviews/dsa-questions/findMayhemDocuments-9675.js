/**
 * documentHistory: an object like:
 * {
 *   D1: ["q1","q2"],
 *   D2: ["q2"],
 *   ...
 * }
 *
 * isMayhemQuery: (q: string) => boolean
 * 
 * querySenders = {
 *  q1: ["u1", "u2"],
 *  q2: ["u3"],
 *  q3: ["u1"],
 *  ...
 * }
 *
 * Returns: Set of corrupt document ids
 */

const findMayhemDocuments = (documentHistory, isMayhemQuery, querySenders=null) => {
    let queryToDocMap = new Map()
    let uniqueDocs = new Set(Object.keys(documentHistory))

    for(const [doc, queries] of Object.entries(documentHistory)){
        for(const q of queries){
            if(!queryToDocMap.has(q)) queryToDocMap.set(q, [])
            queryToDocMap.get(q).push(doc)
        }
    }

    let stack = [] // It can have both query & docs, as it's a bipartitie graph
    for(const [q, _] of queryToDocMap.entries()){
        if(isMayhemQuery(q)) stack.push(q)
    }

    let visited = new Set() // It can have both docs & queries
    let corruptedDocs = new Set()
    while(stack.length){
        let curr = stack.pop()
        if(visited.has(curr)) continue
        visited.add(curr)

        if(uniqueDocs.has(curr)){ // It's a doc
            corruptedDocs.add(curr)
            const queries = documentHistory[curr] || []

            queries.forEach(q => {
                if(!visited.has(q)) stack.push(q)
            })
        } else { // It's a query
            const docs = queryToDocMap.get(curr) || []

            docs.forEach(doc=>{
                if(!visited.has(doc)) stack.push(doc)
            })
        }
    }

    let corruptedUsers = new Set()
    if(querySenders){
        for(const node of visited){ // Visited set maintains our graph traversal path
            if(uniqueDocs.has(node)) continue
            else{ // It's a query
                const users = querySenders[node] || []
                users.forEach(user=> corruptedUsers.add(user))
            }
        }
    }

    return {corruptedDocs, corruptedUsers}
}