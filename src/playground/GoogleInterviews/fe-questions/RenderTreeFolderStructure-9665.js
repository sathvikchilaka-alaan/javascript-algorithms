class RenderFolderTreeStructure{
    constructor(tree, mountEl){
        this.mountEl = mountEl
        this.tree = tree

        this.cachedChildrenNodes = new WeakMap() // WeakMap<node, node[]>
        this.expandedNodes = new WeakMap() // WeakMap<node, boolean>
    }

    async getChildrenNodes(node){
        const cache = this.cachedChildrenNodes.get(node)
        if(cache) return cache

        const childrenProp = node.children
        if(Array.isArray(childrenProp)){
            return childrenProp
        }

        if(typeof(childrenProp)==='function'){
            // We can have inFlightNodes WeakMap and add em to inflight and show loading text while append the children line 56-62
            const children = await node.children()
            this.cachedChildrenNodes.set(node, children)

            return children
        }

        return null
    }

    render(){
        this.mountEl.innerHTML = "" // Clear the html
        const ul = document.createElement('ul')
        this.tree.forEach(node=> ul.appendChild(this.renderNode(node)))

        this.mountEl.appendChild(ul)
    }

    renderNode(node){
        const li = document.createElement('li')
        const span = document.createElement('span')

        span.textContent = node.text
        if(typeof node.text === "string" && !node.text.includes(".")) span.style.cursor = 'pointer'
        span.addEventListener('click', async ()=>{ // Order: Click -> Fetch + Cache + Re-render + populate the items below
            const next = this.expandedNodes.get(node) || false
            this.expandedNodes.set(node, !next)

            if(this.expandedNodes.get(node)) {
                await this.getChildrenNodes(node)
            }
            // Calling this coz, after we update the expanded-status and cache the {node, children}, we need to update the children by appending it which happens in the next render
            // Just like React, which does render twice for useState prop
            this.render()
        })
        li.appendChild(span)

        if(this.expandedNodes.get(node)){ // In the second render for a children prop, this will be true as it was marked above, then we will append it in second iteration
            const childrenContainer = document.createElement('ul')
            const children = this.cachedChildrenNodes.get(node) || node.children || []
            children.forEach(child => childrenContainer.appendChild(this.renderNode(child)))

            li.appendChild(childrenContainer)
        }

        return li
    }
}


// Interview Implementation
// HTML: <div id="tree"></div>  (Plain HTML doesnt have auto-closing tags support)
const mount = document.getElementById("tree");

const data = [
  {
    text: "src",
    children: [
      { text: "app.js" },
      { text: "main.js" },
      {
        text: "big-folder",
        children: async () => {
          await new Promise(r => setTimeout(r, 500));
          return [{ text: "child-1" }, { text: "child-2" }, { text: "child-3" }, { text: "child-4" }, {
            text: "src2",
            children: [
              { text: "app.js" },
              { text: "main.js" },
              {
                text: "big-folder",
                children: async () => {
                  await new Promise(r => setTimeout(r, 500));
                  return [{ text: "child-1" }, { text: "child-2" }, { text: "child-3" }, { text: "child-4" }, ];
                }
              }
            ]
          }];
        }
      }
    ]
  }
];

const tree = new RenderFolderTreeStructure(data, mount);
tree.render();