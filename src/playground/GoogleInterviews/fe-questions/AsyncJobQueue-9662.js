class AsyncJobQueue{
    constructor(){
        this._tail = Promise.resolve()
        this.isClearing = false
        this.pausedPromise = null
        this.resumeThePromise = null
        this.isPaused = false
    }

    push(job){
        this._tail = this._tail
            .catch(() => {})  // swallow previous errors so chain continues, but return the promise for THIS job (which can reject)
            .then(async ()=>{
                if(this.isPaused)
                    await this.pausedPromise

                if(this.isClearing)
                    throw new Error("clearing")
                
                return job()
            })

        return this._tail
    }

    flush(){ // We are taking a snapshot of tail chain until then and once they r done, we will let other go 
        return this._tail
    }

    async clear(){
        this.isClearing = true

        try{
            await this._tail.catch(()=>{})
        } finally{
            this.isClearing = false
            this._tail = Promise.resolve()
        }
    }

    pause(){ // We are stopping the future jobs, once the existing ones complete and then wait until resume promise resolves
        if(this.isPaused) return
        this.isPaused = true

        this.pausedPromise = new Promise(res => this.resumeThePromise = res)
    }

    resume(){
        if(!this.isPaused) return

        if (this.resumeThePromise) this.resumeThePromise() // The promise we created at pause and made that awaitin for it's resolution in push() will be resolved here
        this.resumeThePromise = null
        this.isPaused = true
        this.pausedPromise = null
    }
    
}


//Execution Example
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const job = (name, ms) => async () => {
  console.log("Start", name);
  await wait(ms);
  console.log("End", name);
};

const queue = new AsyncJobQueue();

// Queue some jobs
queue.push(job("A", 1000));
queue.push(job("B", 500));

// Pause while A is running
setTimeout(() => {
  console.log("⏸ PAUSE");
  queue.pause();
}, 300);

// Add another job while paused
queue.push(job("C", 300));

// Resume later
setTimeout(() => {
  console.log("▶ RESUME");
  queue.resume();
}, 2000);

// Wait for everything queued so far
queue.flush().then(() => {
  console.log("✅ FLUSH DONE");
});

// Add another job after flush
queue.push(job("D", 500));


// Output:
//    Start A
//    ⏸ PAUSE
//    End A
//    ▶ RESUME
//    Start B
//    End B
//    Start C
//    End C
//    ✅ FLUSH DONE
//    Start C
//    End C