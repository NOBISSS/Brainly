import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

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

    createdBy: {
        _id: string;
        name: string;
        avatar?: string;
    };

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
};

export const fetchLinksByWorkspace = createAsyncThunk(
    "links/fetchLinks",
    async (
        workspaceId: string,
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.get(
                `${BACKEND_URL}api/links/${workspaceId}`,
                {
                    withCredentials: true,
                }
            );

            return {
                workspaceId,
                links: res.data.data as Link[],
            };
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to fetch links"
            );
        }
    }
);

export const addLink = createAsyncThunk(
    "links/addLink",
    async (
        linkData: Partial<Link>,
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.post(
                `${BACKEND_URL}api/links/create`,
                linkData,
                {
                    withCredentials: true,
                }
            );

            return res.data.data as Link;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to add link"
            );
        }
    }
);

export const deleteLink = createAsyncThunk(
    "links/delete",
    async (
        id: string,
        { rejectWithValue }
    ) => {
        try {
            await axios.delete(
                `${BACKEND_URL}api/links/${id}`,
                {
                    withCredentials: true,
                }
            );

            return id;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to delete link"
            );
        }
    }
);

const linkSlice = createSlice({
    name: "links",
    initialState,

    reducers: {
        linkAdded: (
            state,
            action: PayloadAction<Link>
        ) => {
            const link = action.payload;
            const workspaceId = link.workspace;

            if (workspaceId) {
                if (!state.byWorkspace[workspaceId]) {
                    state.byWorkspace[workspaceId] = [];
                }

                const exists = state.byWorkspace[
                    workspaceId
                ].some(
                    (item) => item._id === link._id
                );

                if (!exists) {
                    state.byWorkspace[workspaceId].unshift(
                        link
                    );
                }
            } else {
                const exists = state.personal.some(
                    (item) => item._id === link._id
                );

                if (!exists) {
                    state.personal.unshift(link);
                }
            }
        },

        linkRemoved: (
            state,
            action: PayloadAction<string>
        ) => {
            const linkId = action.payload;

            Object.keys(state.byWorkspace).forEach(
                (workspaceId) => {
                    state.byWorkspace[workspaceId] =
                        state.byWorkspace[workspaceId].filter(
                            (link) =>
                                link._id !== linkId
                        );
                }
            );

            state.personal = state.personal.filter(
                (link) => link._id !== linkId
            );
        },

        setLinksForWorkspace: (
            state,
            action: PayloadAction<{
                workspaceId: string;
                links: Link[];
            }>
        ) => {
            const {
                workspaceId,
                links,
            } = action.payload;

            state.byWorkspace[workspaceId] = links;
        },

        clearLinksError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(
                fetchLinksByWorkspace.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchLinksByWorkspace.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const {
                        workspaceId,
                        links,
                    } = action.payload;

                    state.byWorkspace[workspaceId] = links;
                }
            )

            .addCase(
                fetchLinksByWorkspace.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            )

            .addCase(
                addLink.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                addLink.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const link =
                        action.payload;

                    const workspaceId =
                        link.workspace;

                    if (workspaceId) {
                        if (
                            !state.byWorkspace[
                            workspaceId
                            ]
                        ) {
                            state.byWorkspace[
                                workspaceId
                            ] = [];
                        }

                        const exists =
                            state.byWorkspace[
                                workspaceId
                            ].some(
                                (item) =>
                                    item._id ===
                                    link._id
                            );

                        if (!exists) {
                            state.byWorkspace[
                                workspaceId
                            ].unshift(link);
                        }
                    } else {
                        const exists =
                            state.personal.some(
                                (item) =>
                                    item._id ===
                                    link._id
                            );

                        if (!exists) {
                            state.personal.unshift(
                                link
                            );
                        }
                    }
                }
            )

            .addCase(
                addLink.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            )

            .addCase(
                deleteLink.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                deleteLink.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const linkId =
                        action.payload;

                    Object.keys(
                        state.byWorkspace
                    ).forEach(
                        (workspaceId) => {
                            state.byWorkspace[
                                workspaceId
                            ] =
                                state.byWorkspace[
                                    workspaceId
                                ].filter(
                                    (link) =>
                                        link._id !==
                                        linkId
                                );
                        }
                    );

                    state.personal =
                        state.personal.filter(
                            (link) =>
                                link._id !== linkId
                        );
                }
            )

            .addCase(
                deleteLink.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            );
    },
});

export const {
    clearLinksError,
    linkAdded,
    linkRemoved,
    setLinksForWorkspace,
} = linkSlice.actions;

export default linkSlice.reducer;