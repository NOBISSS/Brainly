import { createSlice } from "@reduxjs/toolkit";

const initialState={
    name:null,
    email:null,
    password:null

}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserDetails(state,action){
            console.log(action);
            const userData=action.payload;
            state.email=userData.email;
            state.name=userData.username;
            state.password=userData.password;
        },
        // removeUserDetails(state,action){
        //     state.userDetails=null;
        // }
    }
})

export const {setUserDetails}=userSlice.actions;
export default userSlice.reducer;