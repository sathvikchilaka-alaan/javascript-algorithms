const NodeType = {
    AND:    'AND',
    OR:    'OR',
    NOT:    'NOT',
    XOR:    'XOR',
    BOOLEAN: 'BOOLEAN'
}

class TreeNode{
    constructor(val=null, type){
        this.val = val
        this.left = null
        this.right = null
        this.type = this.fetchNodeType(type)
    }

    fetchNodeType(type){
        const isValid = Object.keys(NodeType).includes(type)
        if(!isValid) throw new Error("Invalid Node type")
        return isValid ? NodeType[type] : null
    }
}

class flipLeafSwitches{
    constructor(root = null){
        this.root = root
        this.nodeValueMap = new Map() 
        this.criticalLeafIndices = []
        this.rootValue = null
        this.ans = []
    }

    evaluateRoot(node){
        if(!node) return null
        if(node.type === NodeType.BOOLEAN) return node.val
        if(node.type === NodeType.NOT) {
            node.val = !this.evaluateRoot(node.left) // In case of NOT, it will always have only leftChild.. no rightChild
            return node.val
        }

        const leftVal = this.evaluateRoot(node.left)
        const rightVal = this.evaluateRoot(node.right)

        switch(node.type){
            case NodeType.AND:
                node.val = leftVal && rightVal
                break
            case NodeType.OR:
                node.val = leftVal || rightVal
                break
            case NodeType.XOR:
                node.val = leftVal !== rightVal
                break
        }
        
        return node.val
    }

    dfs(node, isCritical){
        if(node.type === NodeType.BOOLEAN){
            this.ans.push(isCritical ? !this.rootValue : this.rootValue)
            return
        }

        if(node.type === NodeType.NOT){
            if(node.left) this.dfs(node.left, isCritical) // NOT node has only leftChild, no rightChild
            return
        }

        switch(node.type){
            case NodeType.AND:
                this.dfs(node.left, isCritical && node.right.val === true)
                this.dfs(node.right, isCritical && node.left.val === true)
                break
            case NodeType.OR:
                this.dfs(node.left, isCritical && node.right.val === false)
                this.dfs(node.right, isCritical && node.left.val === false)
                break
            case NodeType.XOR:
                this.dfs(node.left, isCritical)
                this.dfs(node.right, isCritical)
                break
        }

        return
    }

    // Followup: To do post-order iterative approach, incase of deep trees... along with map to save values without mutating the original tree...
    iterativeTraversalEvaluateRoot(root){
        if(!root) return

        const stack = [[root, false]] // [node, isVisited]

        while(stack.length){
            const [node, isVisited] = stack.pop()

            if(isVisited){
                if(node.type === NodeType.BOOLEAN) {
                    this.nodeValueMap.set(node, node.val)
                    continue
                }

                if(node.type === NodeType.NOT){
                    this.nodeValueMap.set(node, !this.nodeValueMap.get(node.left))
                    continue
                }

                const leftChild = this.nodeValueMap.get(node.left), rightChild = this.nodeValueMap.get(node.right)

                switch(node.type){
                    case NodeType.AND:
                        this.nodeValueMap.set(node, leftChild && rightChild)
                        break
                    case NodeType.OR:
                        this.nodeValueMap.set(node, leftChild || rightChild)
                        break
                    case NodeType.XOR:
                        this.nodeValueMap.set(node, leftChild !== rightChild)
                        break
                }
            } else{
                // postorder: process children before parent
                stack.push([node, true])

                if(node.right) stack.push([node.right, false])
                if(node.left) stack.push([node.left, false])
            }
        }

        return this.nodeValueMap.get(root)
    }

    // Followup: To do post-order iterative approach, incase of deep trees... along with saving leaf indices... along with map to save values without mutating the original tree...
    iterativeTraversal(root, isCritical){
        if(!root) return

        const stack = [[root, isCritical]]
        let currentLeafIndex = 0

        while(stack.length){
            const [node, isCritical] = stack.pop()

            if(node.type === NodeType.BOOLEAN) {
                this.ans.push(isCritical ? !this.rootValue : this.rootValue)
                if(isCritical) this.criticalLeafIndices.push(currentLeafIndex)
                currentLeafIndex++
            }
            else if(node.type === NodeType.NOT) stack.push([node.left, isCritical])
            else{
                const leftChild = this.nodeValueMap.get(node.left), rightChild = this.nodeValueMap.get(node.right)

                switch(node.type){
                    case NodeType.AND:
                        stack.push([node.right, isCritical && leftChild === true])
                        stack.push([node.left, isCritical && rightChild === true])
                        break
                    case NodeType.OR:
                        stack.push([node.right, isCritical && leftChild === false])
                        stack.push([node.left, isCritical && rightChild === false])
                        break
                    case NodeType.XOR:
                        stack.push([node.right, isCritical])
                        stack.push([node.left, isCritical])
                        break
                }
            }
        }
    }

    flipSwitches(root){
        if(!root) return []
        this.ans = []

        this.rootValue = this.evaluateRoot(root)

        this.dfs(root, true)

        return this.ans
    }
}