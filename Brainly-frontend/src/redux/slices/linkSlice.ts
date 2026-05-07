import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export interface Link {
    _id?: string;
    title: string;
    url: string;
    category: string;
    thumbnail?: string;
    tags?: string[];
    createdBy:{
        _id:string;
        name:string;
        avatar:string;
    }
    workspace?: string | null;
    createdAt?: string;
}

interface LinkState {
    byWorkspace: Record<string, Link[]>;
    personal: Link[];
    loading: boolean;
    error: string | null;
}

const initialState: LinkState = {
    byWorkspace: {},
    personal: [],
    loading: false,
    error: null,
}

export const fetchLinksByWorkspace = createAsyncThunk("links/fetchLinks", async (workspaceId: string, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BACKEND_URL}api/links/${workspaceId}`, { withCredentials: true });
        return { workspaceId, links: res.data.data };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to Fetch Links")
    }
})


export const addLink = createAsyncThunk("links/addLink", async (linkData: Partial<Link>, { rejectWithValue }) => {
    try {
        
        const res = await axios.post(`${BACKEND_URL}api/links/create`, linkData, {
            withCredentials: true
        })
        
        return res.data.data;
    } catch (error: any) {
        console.log("IN CATCH BLOCK",error)
        return rejectWithValue(error.response?.data?.message || "Failed to Add Link")
    }
})


//delete link
export const deleteLink = createAsyncThunk("links/delete", async (id: string, { rejectWithValue }) => {
    try {
        await axios.delete(`${BACKEND_URL}api/links/${id}`, {
            withCredentials: true
        });
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to Delete Link")
    }
})

const linkSlice = createSlice({
    name: "links",
    initialState,
    reducers: {
        setLinksForWorkspace: (state, action: PayloadAction<{ workspaceId: string; links: Link[] }>) => {
            const { workspaceId, links } = action.payload;
            state.byWorkspace[workspaceId] = links;
        },
        clearLinksError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch
            .addCase(fetchLinksByWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLinksByWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                const { workspaceId, links } = action.payload;
                state.byWorkspace[workspaceId] = links;
            })
            .addCase(fetchLinksByWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //add
            .addCase(addLink.pending, (state) => {
                state.loading = true;
            })

            .addCase(addLink.fulfilled, (state, action) => {
                state.loading = false;
                const link = action.payload as Link;
                const wsId = link.workspace;
                
                if (wsId) {
                    if (!state.byWorkspace[wsId]) {
                        state.byWorkspace[wsId] = [];
                    }
                    state.byWorkspace[wsId] = [link, ...state.byWorkspace[wsId]];
                } else {
                    state.personal.unshift(link);
                }
            })

            .addCase(addLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //delete

            .addCase(deleteLink.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteLink.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteLink.fulfilled, (state, action) => {
                const id = action.payload;
                Object.keys(state.byWorkspace).forEach((wsId) => {
                    state.byWorkspace[wsId] = state.byWorkspace[wsId].filter((l) => l._id !== id);
                });
                state.personal = state.personal.filter((l) => l._id !== id);
            });
    },
});
export const { clearLinksError, setLinksForWorkspace } = linkSlice.actions;
export default linkSlice.reducer;