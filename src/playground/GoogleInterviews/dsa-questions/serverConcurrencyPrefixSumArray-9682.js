/**
 * jobs: Array<[startMinute, duration]>
 * returns: minimum number of servers needed (max concurrency)
 */

class ServerConcurrencyForJobs{
    constructor(){
        this.MAX_MINS_PER_DAY = 1440;
    }

    maxServersNeededPerDay = (jobs) => { // If the time is discrete: 0, 1, 2, 4, 5, 7, 23.... 
        let jobsContri = Array(this.MAX_MINS_PER_DAY+1).fill(0)
    
        jobs.forEach(job=>{
            const end = job[0]+job[1]
            jobsContri[job[0]]++
    
            if(end<=this.MAX_MINS_PER_DAY) jobsContri[end]--
            else{
                jobsContri[this.MAX_MINS_PER_DAY]--
                jobsContri[0]++
                jobsContri[end % this.MAX_MINS_PER_DAY]--
            }
        })
    
        let maxServers = 0
        let cSum = 0
        jobsContri.forEach(node=>{
            cSum+=node
            if(maxServers<cSum) maxServers = cSum
        })
    
        return maxServers
    }

    maxServersNeededPerDaySweepLine(jobs) { // If the time is not discrete: 0, 1.5, 2.3, 4.7, 5.1, 7, 23.... 
        if (!jobs || jobs.length === 0) return 0;

        const events = []; // [time, jobsContri]
      
        for (const [start, duration] of jobs) {
          const end = start + duration;
          events.push([start, +1]);
      
          if (end <= this.MAX_MINS_PER_DAY) {
            events.push([end, -1]);
          } else {
            events.push([this.MAX_MINS_PER_DAY, -1]);
      
            events.push([0, +1]);
            events.push([end % this.MAX_MINS_PER_DAY, -1]);
          }
        }
      
        // Sort by time, and if tie: end(-1) before start(+1) to enforce [start,end)
        events.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))

        let maxServers = 0, cSum = 0
        events.forEach(([__, d])=>{
            cSum += d
            if(maxServers<cSum) maxServers = cSum
        })
        return maxServers;
    }
}

const solver = new ServerConcurrencyForJobs()
const jobs = [[0,1],[2,4],[0,3], [2, 1440]]
const jobsNotDiscrete = [
    [1.5, 2.2],   // runs from 1.5 → 3.7
    [2.1, 1.0],   // runs from 2.1 → 3.1
    [3.6, 0.8],   // runs from 3.6 → 4.4
  ];

console.log("Max Servers needed per day", solver.maxServersNeededPerDay(jobs)) // O(N+M)
console.log("Max Servers needed per day in non-discrete times", solver.maxServersNeededPerDaySweepLine(jobsNotDiscrete)) // O(NLog(N))