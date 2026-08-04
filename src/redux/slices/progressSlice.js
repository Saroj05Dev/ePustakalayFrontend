import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    currentProgress: null,
    continueReadingData: [],
    isLoading: false,
    hasFetched: false,
};

// Create reading progress
export const createReadingProgress = createAsyncThunk(
    "/progress/createReadingProgress",
    async (data) => {
        try {
            const response = await axiosInstance.post("/progress", data);
            return response;
        } catch (error) {
        }
    }
);

// Get book progress
export const getBookProgress = createAsyncThunk(
    "/progress/getBookProgress",
    async (bookId) => {
        try {
            const apiResponse = await axiosInstance.get(`/progress/${bookId}`);
            return apiResponse;
        } catch (error) {
        }
    }
);

// Update reading progress
export const updateReadingProgress = createAsyncThunk(
    "/progress/updateReadingProgress",
    async ({ progressId, data }) => {
        try {
            const response = await axiosInstance.put(`/progress/${progressId}`, data);
            return response;
        } catch (error) {
        }
    }
);

// Get all user progress for continue reading
export const getAllUserProgress = createAsyncThunk(
    "/progress/getAllUserProgress",
    async () => {
        try {
            const response = await axiosInstance.get("/progress/user/all");
            return response;
        } catch (error) {
        }
    }
);

const progressSlice = createSlice({
    name: "progress",
    initialState,
    reducers: {
        clearCurrentProgress(state) {
            state.currentProgress = null;
            state.hasFetched = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // getBookProgress
            .addCase(getBookProgress.pending, (state) => { 
                state.isLoading = true; 
                state.hasFetched = false;
            })
            .addCase(getBookProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasFetched = true;
                const data = action?.payload?.data?.data || action?.payload?.data;
                state.currentProgress = Array.isArray(data) ? (data[0] || null) : (data || null);
            })
            .addCase(getBookProgress.rejected, (state) => { 
                state.isLoading = false; 
                state.hasFetched = true;
            })

            // createReadingProgress
            .addCase(createReadingProgress.fulfilled, (state, action) => {
                const data = action?.payload?.data?.data || action?.payload?.data;
                if (data) {
                    state.currentProgress = data;
                }
            })

            // updateReadingProgress
            .addCase(updateReadingProgress.fulfilled, (state, action) => {
                const data = action?.payload?.data?.data || action?.payload?.data;
                if (data) {
                    state.currentProgress = data;
                }
            })

            // getAllUserProgress
            .addCase(getAllUserProgress.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getAllUserProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action?.payload?.data?.data || action?.payload?.data;
                state.continueReadingData = Array.isArray(data) ? data : [];
            })
            .addCase(getAllUserProgress.rejected, (state) => { 
                state.isLoading = false;
                state.continueReadingData = [];
            });
    },
});

export const { clearCurrentProgress } = progressSlice.actions;
export default progressSlice.reducer;
