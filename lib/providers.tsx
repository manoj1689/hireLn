'use client';

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { setAuthToken } from "@/services/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const handleBeforeLift = () => {
    const state = store.getState();
    const token = state.auth?.access_token;
    setAuthToken(token);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} onBeforeLift={handleBeforeLift}>
        {children}
      </PersistGate>
    </Provider>
  );
}
