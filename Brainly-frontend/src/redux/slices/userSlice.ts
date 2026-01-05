import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string | null;
  email: string | null;
}


const initialState:UserState={
    name:null,
    email:null,
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserDetails(state,action:PayloadAction<{name:string;email:string}>){
            const userData=action.payload;
            state.email=userData.email;
            state.name=userData.name;
        },
        clearUserDetails(state){
            state.name=null;
            state.email=null;
        }
    }
})

export const {setUserDetails,clearUserDetails}=userSlice.actions;
export default userSlice.reducer;