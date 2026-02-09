class Node {
    constructor({ text = null, children = null }) {
      this.text = text;
      this.children = children;
    }
  
    isText() {
      return this.text !== null;
    }
  
    getText() {
      return this.text;
    }
  
    getChildren() {
      return this.children;
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

const n4 = new Node({ text: "This" });
const n5 = new Node({ text: " is very " });
const n6 = new Node({ text: "funny" });

const b = new Node({ children: [n4] });
const i = new Node({ children: [n6] });

const span = new Node({ children: [b, n5, i] });

// -------------------- Run example --------------------
const matcher = new MatchStringInTree();

const result = matcher.findMatchingString(span, "is very fun");

// Print result
console.log(
  result.map(node => node.getText())
);