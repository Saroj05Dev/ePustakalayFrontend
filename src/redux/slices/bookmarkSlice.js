import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    bookmarksData: [],
    currentBookmark: null,
    isLoading: false,
};

// Create or update a bookmark
export const createBookmark = createAsyncThunk(
    "/bookmarks/createBookmark",
    async (data) => {
        try {
            const response = axiosInstance.post("/bookmarks", data);
            toast.promise(response, {
                loading: "Saving bookmark...",
                success: (res) => res?.data?.message || "Bookmark saved!",
                error: (err) => err?.response?.data?.message || "Failed to save bookmark",
            });
            return await response;
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
);

// Get all bookmarks
export const getAllBookmarks = createAsyncThunk(
    "/bookmarks/getAllBookmarks",
    async () => {
        try {
            const apiResponse = await axiosInstance.get("/bookmarks");
            return apiResponse;
        } catch (error) {
            console.log(error);
        }
    }
);

// Get bookmark by bookId
export const getBookmarkByBook = createAsyncThunk(
    "/bookmarks/getBookmarkByBook",
    async (bookId, { rejectWithValue }) => {
        try {
            const apiResponse = await axiosInstance.get(`/bookmarks/${bookId}`);
            return apiResponse;
        } catch (error) {
            if (error?.response?.status === 404) {
                return null;
            }
            console.log(error);
            return rejectWithValue(error?.response?.data);
        }
    }
);

// Delete a bookmark
export const deleteBookmark = createAsyncThunk(
    "/bookmarks/deleteBookmark",
    async (bookmarkId) => {
        try {
            const response = axiosInstance.delete(`/bookmarks/${bookmarkId}`);
            toast.promise(response, {
                loading: "Removing bookmark...",
                success: "Bookmark removed!",
                error: (err) => err?.response?.data?.message || "Failed to remove bookmark",
            });
            await response;
            return bookmarkId;
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
);

const bookmarkSlice = createSlice({
    name: "bookmarks",
    initialState,
    reducers: {
        clearCurrentBookmark(state) {
            state.currentBookmark = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // getAllBookmarks
            .addCase(getAllBookmarks.pending, (state) => { state.isLoading = true; })
            .addCase(getAllBookmarks.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action?.payload?.data?.data || action?.payload?.data;
                state.bookmarksData = Array.isArray(data) ? data : [];
            })
            .addCase(getAllBookmarks.rejected, (state) => { state.isLoading = false; })

            // getBookmarkByBook
            .addCase(getBookmarkByBook.pending, (state) => { state.isLoading = true; })
            .addCase(getBookmarkByBook.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action?.payload?.data?.data || action?.payload?.data;
                state.currentBookmark = data || null;
            })
            .addCase(getBookmarkByBook.rejected, (state) => { state.isLoading = false; })

            // createBookmark
            .addCase(createBookmark.fulfilled, (state, action) => {
                const newBookmark = action?.payload?.data?.data || action?.payload?.data;
                if (newBookmark && typeof newBookmark === "object") {
                    state.currentBookmark = newBookmark;
                    // Update in list if present
                    const exists = state.bookmarksData.some(b => b._id === newBookmark._id);
                    if (exists) {
                        state.bookmarksData = state.bookmarksData.map(b => b._id === newBookmark._id ? newBookmark : b);
                    } else {
                        state.bookmarksData.push(newBookmark);
                    }
                }
            })

            // deleteBookmark
            .addCase(deleteBookmark.fulfilled, (state, action) => {
                const bookmarkId = action.payload;
                if (bookmarkId) {
                    state.bookmarksData = state.bookmarksData.filter((b) => b._id !== bookmarkId);
                    if (state.currentBookmark && state.currentBookmark._id === bookmarkId) {
                        state.currentBookmark = null;
                    }
                }
            });
    },
});

export const { clearCurrentBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
