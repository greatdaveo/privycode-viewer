import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import vierLinksReducer from "./links/viewerLinksSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    viewerLinks: vierLinksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
