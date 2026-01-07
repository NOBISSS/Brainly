// redux/slices/userThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    const res = await axios.get("/api/auth/me", {
      withCredentials: true, // if using cookies
    });
    return res.data;
  }
);
