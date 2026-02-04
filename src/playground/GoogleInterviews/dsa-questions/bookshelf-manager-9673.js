class BookShelf{
    constructor(books=[]){
        this.books = books
        this.bookMarkIndex= -1
    }

    getBooks(){
        return [...this.books]
    }

    getBookMarkIndex(){
        return this.bookMarkIndex
    }

    setBookMarkIndex(idx){
        if (idx < -1 || idx >= this.books.length) return;
        this.bookMarkIndex = idx
    }

    removeBooks(fromIndex, toIndex){
        let n = this.books.length
        if(fromIndex < 0 || toIndex >= n || toIndex < fromIndex) return
        
        this.books.splice(fromIndex, toIndex-fromIndex+1)

        // bookmark is in the block
        if(fromIndex<= this.bookMarkIndex && toIndex>= this.bookMarkIndex) this.bookMarkIndex = -1
        else if(toIndex < this.bookMarkIndex) this.bookMarkIndex -= toIndex - fromIndex +1
    }

    addBooks(toIndex, newBooks){
        let n = this.books.length
        if(toIndex < 0 || toIndex > n || !Array.isArray(newBooks) || newBooks.length === 0) return

        this.books.splice(toIndex, 0, ...newBooks)
        if(toIndex <= this.bookMarkIndex) this.bookMarkIndex+=newBooks.length
    }

    moveBooks(fromIndex, toIndex, size){
        let n= this.books.length
    
        if(fromIndex < 0 || toIndex > n || size <= 0 || fromIndex+size > n) return 

        if(toIndex >= fromIndex && toIndex <= fromIndex+size) return
    
        // capture bookmark before edits
        const bm = this.bookMarkIndex;
    
        let movingBooks = this.books.slice(fromIndex, fromIndex+size)
        this.removeBooks(fromIndex, fromIndex+size-1)
    
        let adjustedIdx = toIndex
        if(toIndex > fromIndex) adjustedIdx -= size
        this.addBooks(adjustedIdx, movingBooks)
    
        // set bookmark if it moved with block
        if(bm !== -1 && bm >= fromIndex && bm < fromIndex + size){
            this.bookMarkIndex = adjustedIdx + (bm - fromIndex);
        }
    }
}