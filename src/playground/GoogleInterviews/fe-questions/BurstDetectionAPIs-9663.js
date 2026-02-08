class BurstDetectionAPIs{

    constructor(){
        this.BASE_URL = "http://foo.nasa.gov/events";
        this.MAX_IN_FLIGHT_APIS = 5
        this.MAX_FAILURE_API_ATTEMPTS = 5
        this.INITIAL_RETRY_DELAY_MS = 100 //100ms
        this.MAX_TIME_WINDOW = 1000 //1sec
        this.MAX_EVENTS_BURST = 1000 //1000 events max
    }

    sleep(ms){
        return new Promise(res=> setTimeout(res, ms))
    }

    async getBurstEvents(t1, t2){
        const url = this.BASE_URL+`?t1=${t1}&t2=${t2}`
        let i = this.MAX_FAILURE_API_ATTEMPTS
        let retryDelay = this.INITIAL_RETRY_DELAY_MS;
        while(i--){
            const resp = await fetch(url)
            if(!resp.ok){
                if(resp.status === 503 || resp.status === 504){ // Transient Errors
                    await this.sleep(retryDelay)
                    retryDelay*=2
                    continue
                }
                throw new Error(`HTTP error: ${resp.status} ${resp.statusText}`);
            }

            const data = await resp.json()
            return data.events.map(e=>e.timestamp)
        }

        throw new Error("Maximum retries exceeded");
    }

    async callOptimizedWithMinimumBursts(t1, t2){
        let bursts = []
        let pendingRequests = new Set()

        const findBurstsRecursively = async (t1, t2) => {
            while(pendingRequests.size >= this.MAX_IN_FLIGHT_APIS){
                await Promise.any(pendingRequests) // As we are awaiting below for each req call in line 52, we might have piled up requests over time 
            }

            const req = this.getBurstEvents(t1, t2)
            pendingRequests.add(req)

            let timeStamps = []
            try{
                timeStamps = await req // We are awaiting for each of this recursive call's req to resolve, such that we can delete it finally
            } finally{
                pendingRequests.delete(req)
            }

            if(timeStamps.length < this.MAX_EVENTS_BURST) return

            const mid = Math.floor((t1+t2)/2);
            if((t2-t1) <= this.MAX_TIME_WINDOW){ // we need to add this point as burst and retreive back
                bursts.push(mid)
            }

            // Basically becoz the API is expensive, we are calling it from midpoints if there's any possibility of burst in it
            // And if any of the subset doesnt have any possibility of burst then no issues, good to go.
            return Promise.all([findBurstsRecursively(t1, mid), findBurstsRecursively(mid, t2)])
        }

        await findBurstsRecursively(t1, t2)

        return bursts
    }
}