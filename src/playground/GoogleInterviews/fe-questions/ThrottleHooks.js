import {useCallback, useEffect, useRef, useState} from 'react'

class ThrottleHooks{
    constructor(){
        this.delay = 300
    }

    useThrottleValue(value, delay = this.delay){
        const [throttledValue, setThrottledValue] = useState(value)
        const lastExecRef = useRef(0) // Becoz it has leading edge by default

        useEffect(()=>{
            const now = Date.now()

            if(now-lastExecRef.current >= delay){
                setThrottledValue(value)
                lastExecRef.current = now
            }
        }, [value, delay])

        return throttledValue
    }

    useThrottleCallback(fn, delay = this.delay){
        const lastExecRef = useRef(0) // Becoz it has leading edge by default but no trailing edge

        return useCallback((...args)=>{
            const now = Date.now()

            if(now-lastExecRef.current >= delay){
                fn(...args)
                lastExecRef.current = now
            }
        }, [fn, delay])
    }

    useThrottleCallbackGeneric(fn, delay = this.delay){
        const lastExecRef = useRef(0) // For leading edge
        const latestArgs = useRef(null)
        const timerRef = useRef(null)

        useEffect(() => () => clearTimeout(timerRef.current), [])

        return useCallback((...args)=>{
            latestArgs.current = args
            const now = Date.now()

            if(now-lastExecRef.current >= delay){
                // If there's any setTimeout trailing edge scheduled to run thinking that there's nothing ahead. So we will obstruct it and clear it.
                if(timerRef.current){
                    clearTimeout(timerRef.current)
                    timerRef.current = null
                }

                fn(...latestArgs.current)
                latestArgs.current = null
                lastExecRef.current = now
                return
            }

            if(!timerRef.current){
                timerRef.current = setTimeout(()=>{
                    fn(...latestArgs.current) // Trailing edge
                    timerRef.current = null
                    latestArgs.current = null
                    lastExecRef.current = Date.now()
                }, (delay - (now-lastExecRef.current)))
            }
        }, [delay, fn])
    }
}