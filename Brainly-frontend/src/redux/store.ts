import { configureStore } from "@reduxjs/toolkit";
import linkReducer from "./slices/linkSlice";
import workspaceReducer from "./slices/workspaceSlice";
import userReducer from "./slices/userSlice";

export const store=configureStore({
    reducer:{
        links:linkReducer,
        workspaces:workspaceReducer,
        user:userReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false
        }),
        devTools:process.env.NODE_ENV!=="production",
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;