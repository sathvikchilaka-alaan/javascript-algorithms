class Node {
    constructor({ text = null, children = null }) {
      this.text = text
      this.children = children
    }
  
    isText() {
      return this.text !== null
    }
  
    getText() {
      return this.text
    }
  
    getChildren() {
      return this.children
    }
}


class MatchStringInTree{
    flattenTreeNode(root){ // O(WholeTextString)
        let wholeTextString = ""
        let charToNode = []

        const dfs=(node)=>{
            if(node.isText()){
                const text = node.getText()
                wholeTextString+=text
    
                for (let i = 0; i < text.length; i++) {
                    charToNode.push(node) // For the index of a char, we are mapping it with the node it is from
                }
            } else{
                let children = node.getChildren()
                (children || []).forEach(child=> dfs(child))
            }
        }

        dfs(root)

        return {
            wholeTextString,
            charToNode
        }
    }

    findMatchingString(root, searchStr){ // O(Length of searchStr)
        if(!root || !searchStr.length) return []

        const { wholeTextString, charToNode } = this.flattenTreeNode(root)
        const strIndex = wholeTextString.indexOf(searchStr) // TC of indexOf depends of the Engine u r running the code in like V8, SpiderMonkey... But it's fast

        if(strIndex === -1) return []
        const endIndex = strIndex + searchStr.length
        let prevNode = null
        let res = []

        for(let i=strIndex; i< endIndex; i++){
            let node = charToNode[i]

            if(node && node !== prevNode){
                res.push(node)
                prevNode = node
            }
        }

        return res
    }
}


// -------------------- Build example tree --------------------
// HTML: <span><b>This</b> is very <i>funny</i></span>

const n4 = new Node({ text: "This" })
const n5 = new Node({ text: " is very " })
const n6 = new Node({ text: "funny" })

const b = new Node({ children: [n4] })
const i = new Node({ children: [n6] })

const span = new Node({ children: [b, n5, i] })

// -------------------- Run example --------------------
const matcher = new MatchStringInTree()

const result = matcher.findMatchingString(span, "is very fun")

// Print result
console.log(
  result.map(node => node.getText())
)





// Follow-up 1: Performance Analysis (not just Big-O)

// What the interviewer is asking

// They want to know:
// 	•	What factors affect runtime?
// 	•	Do you understand tradeoffs?
// 	•	Can you reason beyond “O(n)”

// Answer
// Let:
// 	•	N = total number of characters across all text nodes
// 	•	T = number of text nodes
// 	•	M = length of the search string

// Flattening
// 	•	Time: O(N) — each character is visited once
// 	•	Space: O(N) — one entry in charToNode per character

// Searching (indexOf)
// 	•	Worst-case (theoretical): O(N × M)
// 	•	In practice: ~O(N) due to optimized string search in JS engines

// Mapping back to nodes
// 	•	Time: O(M) — we only scan the matched window

// Summary sentence (use this)

// “Runtime depends on document text size and query length. Flattening is linear in total text size, searching is near-linear in practice, and mapping back is linear in the match length.”

// ⸻

// Follow-up 2: Real-world HTML complications

// What the interviewer is testing

// Do you understand that real DOM ≠ simple tree of visible text?

// Issues to mention
// 	1.	Visibility
// 	•	display: none
// 	•	visibility: hidden
// 	•	collapsed whitespace
// 	2.	Layout vs DOM order
// 	•	absolute / fixed positioning
// 	•	columns, RTL text, writing modes
// 	3.	Generated content
// 	•	::before, ::after

// Strong answer

// “In a real browser, I wouldn’t rely purely on DOM order. I’d use the rendered text order provided by the layout or accessibility tree and filter out non-visible nodes.”

// Searchable text ≠ DOM text
// You must consider:
// 	1.	semantic exclusions (<script>, <style>, <noscript>....)
// 	2.	CSS visibility (opacity:0 is a debate on whether to consider or not as it occupies space in layout)
// 	3.	layout participation (absolute & fixed can be removed from consideration)
// 	4.	text normalization (collapsing whitespaces, breaks <br>, handling bi-directions)
// 	5.	generated content (:before & :after content differences, consider the final rendered part)
//  6.  accessibility tags (<img alt="Text to be considered searching">) 

// ⸻

// Follow-up 3: How do you highlight the match?

// Option A: Modify the DOM
// 	•	Wrap matched ranges in <span>
// 	•	Pros: simple
// 	•	Cons:
// 	•	mutates DOM
// 	•	must restore original structure
// 	•	can break scripts/styles

// Option B: Overlay highlights (what browsers do)
// 	•	Compute text ranges
// 	•	Draw highlight rectangles on top
// 	•	Handles:
// 	•	line wrapping
// 	•	fonts
// 	•	zoom
// 	•	RTL text

// Interview-grade answer

// “For production browsers, I’d avoid mutating the DOM and instead render highlights as overlays based on layout information.”

// ⸻

// Follow-up 4: Prevent freezing on large documents

// Problem

// Large documents + synchronous search = frozen UI

// Solutions
// 	•	Chunk work (requestIdleCallback, setTimeout)
// 	•	Use Web Workers
// 	•	Yield control between batches
// 	•	Add cancellation if the user types again

// Strong phrasing

// “I’d make search interruptible and incremental so the UI stays responsive, cancelling outdated searches when input changes.”

// ⸻

// Follow-up 5: Incremental search when the DOM changes

// Scenario
// 	•	User searched already
// 	•	Part of the document changes

// Naive approach (bad)
// 	•	Re-scan entire document

// Better approach
// 	•	Track which text ranges changed
// 	•	Re-search:
// 	•	changed subtree
// 	•	plus a boundary overlap of M−1 characters

// Senior-level answer

// “I’d treat the document as a set of text segments and only re-search affected regions plus a small overlap window.”

// ⸻

// Follow-up 6: Why flatten instead of “match while traversing”?

// Why not match inline?
// 	•	Multiple overlapping partial matches
// 	•	Hard backtracking
// 	•	Complex state management
// Example:
// Text: "aaaaa"
// Search: "aaaab"

// Why flattening wins
// 	•	Separation of concerns
// 	•	Simple correctness reasoning
// 	•	Reuses proven string-matching algorithms

// One-liner

// “Flattening separates traversal from matching, which avoids complex backtracking and makes correctness obvious.”

// ⸻

// Follow-up 7: Can this be optimized further?

// Yes
// 	•	Use KMP for guaranteed O(N + M)
// 	•	Reduce memory by tracking node ranges instead of per-character mapping
// 	•	Stream text nodes through a matcher

// But…

// “I’d start with the simplest correct solution and only optimize after profiling.”

// That’s the answer they want.

// ⸻

// Final “perfect interview summary”

// “I flatten the DOM into rendered text order while mapping characters back to their nodes, run a standard substring search, then convert the match back to consecutive text nodes. Performance depends on document size and query length, and in production I’d handle visibility, layout order, incremental search, and non-blocking execution.”