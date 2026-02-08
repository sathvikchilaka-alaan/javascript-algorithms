class FunctionThrottler{
    constructor(){
        this.wokeUp = false
        this.mainFunc = null
        this.terminated = false
        this.timerId = null
        this.pendingTasks = 0
        this.dummyFunc = () => {
            console.log("Func Called")
        }
    }

    _clear(){
        clearTimeout(this.timerId)
        this.timerId = null
    }

    _throttledFunc(delay=5000){
        if(this.terminated || this.pendingTasks===0){ // If we want to immediately terminate, even if there r any pending tasks
            this._clear()
            return
        }

        this.pendingTasks--
        this.mainFunc()

        this.timerId = setTimeout(()=>this._throttledFunc(delay), delay)
    }

    wakeUp(funcToBind = this.dummyFunc){
        if(this.wokeUp) return
        this.wokeUp = true
        this.mainFunc = funcToBind
        this.terminated = false
        console.log("System is awake");
    }

    callFun(delay=500){
        if(this.terminated || !this.wokeUp){
            console.log("Func is not available")
            return
        }

        this.pendingTasks++
        if(!this.timerId) this.timerId = setTimeout(()=>this._throttledFunc(), delay) // We want to call the first func after 5sec
    }

    terminate(onlyQueued = false) {
        if (onlyQueued) { // Follow-up2 behaviour 
          this.pendingTasks = 0;
          this._clear();
          console.log("System terminating queued calls");
          return;
        }
      
        // Follow-up 1 behavior
        this.terminated = true;
        this.mainFunc = null;
        this.wokeUp = false;
        this.pendingTasks = 0;
        this._clear();
        console.log("System terminated. Please wake up again.");
      }
}