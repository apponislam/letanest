"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store";
import OnlineProvider from "./OnlineProvider";

export function ReduxProviders({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <OnlineProvider>{children}</OnlineProvider>
            </PersistGate>
        </Provider>
    );
}
