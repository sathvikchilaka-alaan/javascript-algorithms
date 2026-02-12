import { useCallback, useEffect, useRef, useState } from 'react'

class DebounceHook {
    constructor(){
        this.delay = 300
    }

    useDebounceValue(value, delay = this.delay){ // Only trailing edge
        const [debouncedValue, setDebouncedValue] = useState(value)

        useEffect(()=>{
            const timeoutId = setTimeout(()=>{
                setDebouncedValue(value)
            }, delay)

            return(()=> clearTimeout(timeoutId))
        }, [delay, value])

        return debouncedValue
    }

    useDebounceCallback(fn, delay = this.delay){ // Only trailing edge
        const prevTimerRef = useRef(null)

        useEffect(() => () => clearTimeout(prevTimerRef.current), []) // To cleanup the last timeout which will be executing the fn below line 30

        return useCallback((...args)=>{
            clearTimeout(prevTimerRef.current)

            prevTimerRef.current = setTimeout(()=> fn(...args), delay)
        }, [fn, delay])
    }
}