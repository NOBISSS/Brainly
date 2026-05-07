import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./userThunks";

interface User {
    _id?:string;
    name: string;
    email: string;
    gender: string | null;
    password: string | null;
}

interface UserState {
    user: User | null;
    loading: boolean;
}
// interface UserState {
//   name: string | null;
//   email: string | null;
//   password: string | null;
//   gender: string | null;
//   loading:boolean;
// }



const initialState: UserState = {
    user: null,
    loading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails(state, action: PayloadAction<User>) {
            state.user = {
                name: action.payload.name,
                email: action.payload.email,
                password: action.payload.password,
                gender: action.payload.gender,
            };
        },

        clearUserDetails(state) {
            // state.name=null;
            // state.email=null;
            // state.gender=null;
            // state.password=null;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                console.log(action.payload);
                state.loading = false;
                if (!action.payload) {
                    state.user = null;
                    return;
                }

                state.user = {
                    _id:action.payload._id,
                    name: action.payload.name,
                    email: action.payload.email,
                    gender: action.payload.gender,
                    password:null
                };

                // state.name=action.payload.name;
                // state.email=action.payload.email;
                // state.gender=action.payload.gender;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
            });
    },
})

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;