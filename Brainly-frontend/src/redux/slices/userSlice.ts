import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./userThunks";
interface UserState {
  name: string | null;
  email: string | null;
  loading:boolean;
}


const initialState:UserState={
    name:null,
    email:null,
    loading:false,
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserDetails(state,action){
            state.name=action.payload.name;
            state.email=action.payload.email;
        },
        clearUserDetails(state){
            state.name=null;
            state.email=null;
        }
    },
    extraReducers:(builder)=> {
        builder
        .addCase(fetchCurrentUser.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchCurrentUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.name=action.payload.name;
            state.email=action.payload.email;
        })
        .addCase(fetchCurrentUser.rejected,(state)=>{
            state.loading=false;
        });
    },
})

export const {setUserDetails,clearUserDetails}=userSlice.actions;
export default userSlice.reducer;