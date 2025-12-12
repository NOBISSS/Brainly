import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export interface Member {
    _id: string;
    name: string;
    email: string;
}

export interface Workspace {
    _id: string,
    name: string;
    description?: string;
    owner: Member;
    members: Member[];
    links?: any[];
    createdAt: string;
}

interface WorkspaceState {
    list: Workspace[];
    selected: Workspace | null;
    loading: boolean;
    error: string | null;
}

const initialState: WorkspaceState = {
    list: [],
    selected: null,
    loading: false,
    error: null,
}

//fetch All Workspaces
export const fetchWorkspaces = createAsyncThunk("workspaces/fetchAll", async (_, { rejectWithValue }) => {
    try {
        console.log(localStorage.getItem('token'));
        const res = await axios.get(`${BACKEND_URL}api/workspaces`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to fetch Workspaces");
    }
})


//Create Workspace
export const createWorkspace = createAsyncThunk("workspaces/create", async ({ name, description }: { name: string, description: string }, { rejectWithValue }) => {
    console.log(name, description);
    try {
        const res = await axios.post(`${BACKEND_URL}api/workspaces`, { name, description }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return res.data.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error?.response?.data?.message || "Failed to CREATE Workspaces");
    }
})


//delete Workspace
export const deleteWorkspace = createAsyncThunk("workspace/delete", async (id: string, { rejectWithValue }) => {
    try {
        await axios.delete(`${BACKEND_URL}api/workspaces/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        return id;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to delete Workspaces");
    }
})

//get Workspace by ID
export const fetchWorkspaceById = createAsyncThunk("workspace/fetchById", async (id: string, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BACKEND_URL}api/workspace/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to FetchById Workspaces");
    }
})

export const addCollaborator = createAsyncThunk("workspace/addCollaborator", async ({ workspaceId, email }: { workspaceId: string, email: string },
    { rejectWithValue }) => {
    try {
        const res = await axios.post(BACKEND_URL + `api/workspaces/${workspaceId}/collaborators`, { email }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Failed to Add Collaborator Workspaces");
    }
})

export const removeCollaborator = createAsyncThunk("workspace/removeCollaborator", async ({ workspaceId, memeberId }: { workspaceId: string, memeberId: string }, { rejectWithValue }) => {
    try {
        const res = await axios.delete(BACKEND_URL + `api/workspaces/${workspaceId}/collaborators/${memeberId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to Remove Collaborator Workspaces");
    }
})

const workspaceSlice = createSlice({
    name: "workspaces",
    initialState,
    reducers: {
        setSelectedWorkspaces(state, action: PayloadAction<string>){
            console.log("CALLED");
            const id = action.payload;
            state.selected = state.list.find((w) => w._id === id) || null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //Create
            .addCase(createWorkspace.pending, (state) => {
                state.loading = true;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //delete
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.list = state.list.filter((w) => w._id !== action.payload);
                if (state.selected?._id === action.payload) {
                    state.selected = null;
                }
            })

            //fetch by ID
            .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
                state.selected = action.payload;
                const index = state.list.findIndex((w) => w._id === action.payload._id);
                if (index !== -1) state.list[index] = action.payload;
            })

            //Add Collaborator
            .addCase(addCollaborator.pending, (state) => {
                state.loading = true;
            })

            .addCase(addCollaborator.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.list = state.list.map((w) => w._id === updated._id ? updated : w);
                if (state.selected?._id === updated._id) {
                    state.selected = updated;
                }
            })

            .addCase(addCollaborator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(removeCollaborator.pending, (state) => {
                state.loading = true;
            })

            .addCase(removeCollaborator.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.list = state.list.map((w) => w._id === updated._id ? updated : w);
                if (state.selected?._id === updated._id) {
                    state.selected = updated;
                }
            })

            .addCase(removeCollaborator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
})
export const { setSelectedWorkspaces, clearError, Workspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;