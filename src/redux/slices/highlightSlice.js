import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    highlightsData: [],
    isLoading: false,
};

// Create a highlight
export const createHighlight = createAsyncThunk(
    "/highlights/createHighlight",
    async (data) => {
        try {
            const response = axiosInstance.post("/highlights", data);
            toast.promise(response, {
                loading: "Saving highlight...",
                success: (res) => res?.data?.message || "Highlighted!",
                error: (err) => err?.response?.data?.message || "Failed to highlight",
            });
            return await response;
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
);

// Get highlights by bookId and chapterId
export const getHighlightsByChapter = createAsyncThunk(
    "/highlights/getHighlightsByChapter",
    async ({ bookId, chapterId }) => {
        try {
            const apiResponse = await axiosInstance.get(`/highlights/book/${bookId}/chapter/${chapterId}`);
            return apiResponse;
        } catch (error) {
        }
    }
);

// Delete a highlight
export const deleteHighlight = createAsyncThunk(
    "/highlights/deleteHighlight",
    async (highlightId) => {
        try {
            const response = axiosInstance.delete(`/highlights/${highlightId}`);
            toast.promise(response, {
                loading: "Removing highlight...",
                success: "Highlight removed!",
                error: (err) => err?.response?.data?.message || "Failed to remove highlight",
            });
            await response;
            return highlightId;
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
);

const highlightSlice = createSlice({
    name: "highlights",
    initialState,
    reducers: {
        clearHighlights(state) {
            state.highlightsData = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // getHighlightsByChapter
            .addCase(getHighlightsByChapter.pending, (state) => { state.isLoading = true; })
            .addCase(getHighlightsByChapter.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action?.payload?.data?.data || action?.payload?.data;
                state.highlightsData = Array.isArray(data) ? data : [];
            })
            .addCase(getHighlightsByChapter.rejected, (state) => { state.isLoading = false; })

            // createHighlight
            .addCase(createHighlight.fulfilled, (state, action) => {
                const newHighlight = action?.payload?.data?.data || action?.payload?.data;
                if (newHighlight && typeof newHighlight === "object") {
                    state.highlightsData.push(newHighlight);
                }
            })

            // deleteHighlight
            .addCase(deleteHighlight.fulfilled, (state, action) => {
                const highlightId = action.payload;
                if (highlightId) {
                    state.highlightsData = state.highlightsData.filter((h) => h._id !== highlightId);
                }
            });
    },
});

export const { clearHighlights } = highlightSlice.actions;
export default highlightSlice.reducer;
