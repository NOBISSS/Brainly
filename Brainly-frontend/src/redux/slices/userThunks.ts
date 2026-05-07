// redux/slices/userThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    const res = await axios.get(BACKEND_URL+"api/v1/users/profile", {
      withCredentials: true, // if using cookies
    });
    return res.data.data;
  }
);
