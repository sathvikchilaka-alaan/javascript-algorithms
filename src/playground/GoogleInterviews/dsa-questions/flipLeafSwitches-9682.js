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
        this.rootValue = null
        this.ans = []
    }

    evaluateRoot(node){
        if(!node) return null
        if(node.type === NodeType.BOOLEAN) return node.val
        if(node.type === NodeType.NOT) 
            node.val = !this.evaluateRoot(node.left) // In case of NOT, it will always have only leftChild.. no rightChild

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
            if(node.left) this.dfs(node.left, isCritical)
            else this.dfs(node.right, isCritical)
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

    flipSwitches(root){
        if(!root) return []
        this.ans = []

        this.rootValue = this.evaluateRoot(root)

        this.dfs(root, true)

        return this.ans
    }
}