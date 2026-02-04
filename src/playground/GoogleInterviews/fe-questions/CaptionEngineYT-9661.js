class CaptionEngine{
  constructor(overlayEl, videoEl, fetchedCaptions){
    this.overlay = overlayEl
    this.video = videoEl
    this.captions = fetchedCaptions

    this.maxLoadedUntilTime = 0 // Loaded captions until time
    this.preFetchTime = 5 // time to fetch new captions before the existing one ends
    this.chunkSize = 30 //30seconds of captions chunk
    this.idx = 0 //pointer to track the current captions index
    this._isRunning = false // flag for pause and play

    this._tick = this._tick.bind(this)

    this.video.addEventListener("play", ()=>this.start())
    this.video.addEventListener("pause", ()=>this.stop())
    this.video.addEventListener("seek", ()=>seek())
  }

  start(){
    if(this._isRunning) return
    this._isRunning = true

    // Coz we might need to fetch captions upon start
    this.loadUntilTime(this.video.currentTime + this.preFetchTime)
    requestAnimationFrame(this._tick)
  }

  stop(){
    this._isRunning = false
  }

  _tick(){
    if(!this._isRunning) return

    let t= this.video.currentTime
    if(t+this.preFetchTime >= this.maxLoadedUntilTime) this.loadUntilTime(this.maxLoadedUntilTime+this.chunkSize)

    this.render()
    requestAnimationFrame(this._tick)
  }

  seek(){
    let t = this.video.currentTime

    if(t>=this.maxLoadedUntilTime) this.loadUntilTime(t+this.chunkSize)
    this.idx = this.getLowerBoundStart(this.captions, t)
    this.render()
  }

  getLowerBoundStart(caps, t){
    let lo = 0, hi = caps.length-1
    let res = caps.length - 1 

    while(lo<=hi){
      let mid = lo + ((hi-lo)>>1)
      if(caps[mid].start >= t) {
        res = mid
        hi = mid-1
      }
      else lo = mid+1
    }

    return res
  }

  async loadUntilTime(tNeeded){
    while(tNeeded>this.maxLoadedUntilTime){
      let from = this.maxLoadedUntilTime
      let to = from + this.chunkSize

      let newCaps = await this.fetchCaptions(from, to)
      this.captions = this.appendNewCaptions(newCaps)

      this.maxLoadedUntilTime = to
    }
  }

  appendNewCaptions(newCaps){
    let left = this.captions
    let right = newCaps
    let res=[]
    let i=0, j=0

    while(i<left.length && j<right.length){
      if(left[i].start<=right[j].start) res.push(left[i++])
      else res.push(right[j++])
    }

    while(i<left.length) res.push(left[i++])
    while(j<right.length) res.push(right[j++])

    return res
  }

  render(){
    let t = this.video.currentTime
    let n = this.captions.length

    // skip all the completed captions
    while(this.idx < n && this.captions[this.idx].end <= t) this.idx++

    // Loop back a lil to see if there r any prev captions still being existant
    let s = this.idx
    while(s>0 && this.captions[s-1].end > t) s--

    // Get all the active captions
    let activeCaps = []
    for(let i=s; i<n; i++){
      if(this.captions[i].start<=t && this.captions[i].end>t) activeCaps.push(this.captions[i].text)
      else if (this.captions[i].start > t) break
    }
    this.overlay.textContent = activeCaps.join('\n')
  }
}