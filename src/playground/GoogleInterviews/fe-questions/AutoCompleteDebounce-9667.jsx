import React, { useEffect, useMemo, useRef, useState } from 'react'

const useDebounceValue = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const id = setTimeout(() => setDebouncedValue(value), delay)

        return (() => clearTimeout(id))
    }, [value, delay])

    return debouncedValue
}

const URL = '/api/universities/search'

export const AutoCompleteDebounce = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [input, setInput] = useState('')
    const [country, setCountry] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)
    const [universitiesList, setUniversitiesList] = useState([])
    const debouncedInput = useDebounceValue(input, 300)

    const staleSignal = useRef(null)
    const reqCounter = useRef(0)
    const cachedLists = useRef(new Map())

    const cacheKey = useMemo(() => {
        return JSON.stringify({
            country,
            q: debouncedInput.trim()
        }).toLowerCase()
    }, [country, debouncedInput])

    useEffect(() => {
        const q = debouncedInput.trim()

        if (!q.length) {
            setError('')
            setSelectedOption(null)
            setUniversitiesList([])
            setIsLoading(false)
            return
        }

        if (cachedLists.current.has(cacheKey)) { // Cache hit
            setUniversitiesList(cachedLists.current.get(cacheKey))
            return
        }

        if (staleSignal.current) staleSignal.current.abort() // Clearing the prev signal control
        const controller = new AbortController()
        staleSignal.current = controller

        const myReq = ++reqCounter.current

        async function run() {
            let params = new URLSearchParams()
            params.set('name', q)
            if (country !== 'ALL') params.set('country', country)
            params.set("limit", "20")

            try {
                setIsLoading(true)
                // If you have auth:
                // const token = await getTokenSomehow();
                // const res = await fetch(`${URL}?${params}`, {
                //   headers: { Authorization: `Bearer ${token}` },
                //   signal: controller.signal
                // });
                const res = await fetch(`${URL}?${params.toString()}`, {
                    signal: controller.signal
                })
                if (!res.ok) throw new Error('API Fetch failed')

                const data = await res.json()

                if (myReq !== reqCounter.current) return // If multiple API have asynchronously returned values, then only update the data of latest API

                const freshList = Array.isArray(data.results) ? data.results : []
                setUniversitiesList(freshList)
                cachedLists.current.set(cacheKey, freshList)
            } catch (e) {
                if (e.name === 'AbortError') return // We abortted intentionally
                setError(e.message || "Somethin went wrong")
                setUniversitiesList([])
            } finally {
                if (myReq === reqCounter.current) setIsLoading(false) // Only when u get the lastest API's data then remove loading
            }
        }

        run()
        return (() => controller.abort())
    }, [cacheKey])

    const onPickUni = (uni) => {
        setSelectedOption(uni)
        setInput(uni.name)
        setError('')
        setIsLoading(false)
        setUniversitiesList([])
    }

    return (<>
        <div style={{ display: 'flex', padding: '2rem', marginRight: "0.5rem", gap: '1rem' }}>
            <div>
                <label htmlFor='country' style={{ marginRight: "0.5rem" }}>Country</label>
                <select value={country}
                    onChange={(e) => {
                        if (country !== e.target.value) {
                            setInput('')
                            cachedLists.current.clear()
                        }
                        setCountry(e.target.value)
                    }}
                >
                    <option value="">Select</option>
                    <option value="ALL">ALL</option>
                    <option value="IN">IND</option>
                    <option value="US">US</option>
                    <option value="UK">UK</option>
                    {/* ... */}
                </select>
            </div>
            <div>
                <label htmlFor='university' style={{ marginRight: "0.5rem" }}>
                    University
                </label>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type to search...' />
                <span>
                    {isLoading && `Loading..`}
                    {error.length && error}
                </span>
            </div>
        </div>
        {selectedOption && (
            <span>{selectedOption.name} - {selectedOption.country}</span>
        )}
        {
            universitiesList.length > 0 && (
                <ul style={{
                    display: 'block',
                    maxHeight: '520px',
                    overflowY: 'auto'
                }}>
                    {
                        universitiesList.map(uni => (
                            <li key={uni.name + uni.country} onMouseDown={() => onPickUni(uni)}>
                                {uni.name} of {uni.country}
                            </li>
                        ))
                    }
                </ul>
            )
        }
    </>)
}
