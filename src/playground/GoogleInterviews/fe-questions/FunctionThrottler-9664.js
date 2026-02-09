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

// Interview placeholder code
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <title>Function Throttler</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       padding: 40px;
//     }

//     h1 {
//       text-align: center;
//     }

//     .controls {
//       display: flex;
//       justify-content: space-between;
//       margin-top: 40px;
//     }

//     button {
//       padding: 12px 20px;
//       font-size: 16px;
//       cursor: pointer;
//     }
//   </style>
// </head>
// <body>

//   <h1>Function Throttler</h1>

//   <div class="controls">
//     <button onclick="wakeup()">Wakeup</button>
//     <button onclick="callFunc()">Call</button>
//     <button onclick="terminateServer()">Terminate Server</button>
//     <button onclick="terminateQueue()">Terminate Queue</button>
//   </div>

//   <script>
//     class FunctionThrottler {
//       constructor(delay = 5000) {
//         this.delay = delay;
//         this.wokeUp = false;
//         this.terminated = false;
//         this.timerId = null;
//         this.pendingTasks = 0;

//         this.mainFunc = () => {
//           console.log("Server is called");
//         };
//       }

//       _clearTimer() {
//         if (this.timerId !== null) {
//           clearTimeout(this.timerId);
//           this.timerId = null;
//         }
//       }

//       _run() {
//         if (this.terminated || this.pendingTasks === 0) {
//           this._clearTimer();
//           return;
//         }

//         this.pendingTasks--;
//         this.mainFunc();

//         this.timerId = setTimeout(() => this._run(), this.delay);
//       }

//       wakeUp() {
//         if (this.wokeUp) return;
//         this.wokeUp = true;
//         this.terminated = false;
//         console.log("System is awake");
//       }

//       call() {
//         if (!this.wokeUp || this.terminated) {
//           console.log("System is not awake");
//           return;
//         }

//         this.pendingTasks++;

//         // Start loop only if idle
//         if (this.timerId === null) {
//           // First execution happens after delay (per problem statement)
//           this.timerId = setTimeout(() => this._run(), this.delay);
//         }
//       }

//       // Follow-up 1: terminate server connection
//       terminateServer() {
//         this.terminated = true;
//         this.wokeUp = false;
//         this.pendingTasks = 0;
//         this._clearTimer();
//         console.log("System terminated. Please wake up again.");
//       }

//       // Follow-up 2: terminate only queued calls
//       terminateQueue() {
//         if (!this.wokeUp) return;
//         this.pendingTasks = 0;
//         this._clearTimer();
//         console.log("System terminating queued calls");
//       }
//     }

//     // ----- UI wiring -----
//     const throttler = new FunctionThrottler(5000);

//     function wakeup() {
//       throttler.wakeUp();
//     }

//     function callFunc() {
//       throttler.call();
//     }

//     function terminateServer() {
//       throttler.terminateServer();
//     }

//     function terminateQueue() {
//       throttler.terminateQueue();
//     }
//   </script>

// </body>
// </html>