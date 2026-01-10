import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./userThunks";
interface UserState {
  name: string | null;
  email: string | null;
  password: string | null;
  gender: string | null;
  loading:boolean;
}


const initialState:UserState={
    name:null,
    email:null,
    password:null,
    gender:null,
    loading:false,
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserDetails(state,action){
            state.name=action.payload.name;
            state.email=action.payload.email;
            state.password=action.payload.password;
            state.gender=action.payload.gender;
        },
        clearUserDetails(state){
            state.name=null;
            state.email=null;
            state.gender=null;
            state.password=null;
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
            state.gender=action.payload.gender;
        })
        .addCase(fetchCurrentUser.rejected,(state)=>{
            state.loading=false;
        });
    },
})

export const {setUserDetails,clearUserDetails}=userSlice.actions;
export default userSlice.reducer;