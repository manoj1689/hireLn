"use client"

import { useEffect } from "react"
import { Provider, useSelector } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor, RootState } from "./store"
import { setAuthToken } from "@/services/api"

// 🔁 A bridge component to hook into rehydration and set auth token
function RehydrateAuthToken() {
  const access_token = useSelector((state: RootState) => state.auth.access_token)
  const rehydrated = useSelector((state: any) => state._persist?.rehydrated)

  useEffect(() => {
    if (rehydrated && access_token) {
      setAuthToken(access_token)
    }
  }, [rehydrated, access_token])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Auth token is set after rehydration here */}
        <RehydrateAuthToken />
        {children}
      </PersistGate>
    </Provider>
  )
}
