"use client"

import { useEffect } from "react"

export default function PreventBackForward() {
 useEffect(() => {
    // Push a dummy state so back has something to go to
    history.pushState(null, "", location.href)

    const onPopState = (e: PopStateEvent) => {
      // Push state again to prevent back
      history.pushState(null, "", location.href)
    }

    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  return null
}
