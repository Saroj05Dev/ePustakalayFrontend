
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    ratingsData: {
        averageRating: 0,
        totalRatings: 0,
        userRating: null,
        reviews: [],
    },
};

// Create Rating
export const createRating = createAsyncThunk(
    "/ratings/createRating",
    async (data, { rejectWithValue }) => {
        try {
            const responsePromise = axiosInstance.post("/ratings", data);

            toast.promise(responsePromise, {
                loading: "Creating rating...",
                success: (res) =>
                    res?.data?.message || "Rating created successfully",
                error: (err) =>
                    err?.response?.data?.message || "Failed to create rating",
            });

            const response = await responsePromise;
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );
        }
    }
);

// Get Rating
export const getAllRating = createAsyncThunk(
    "/ratings/getAll",
    async (bookId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/ratings/${bookId}`);
            return response.data;
        } catch (error) {
            console.log(error);
            // No toast here — guest users get 401 silently (it's a public page)
            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );
        }
    }
);

// Update Rating
export const updateRating = createAsyncThunk(
    "/ratings/updateRating",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const responsePromise = axiosInstance.put(
                `/ratings/${id}`,
                data
            );

            toast.promise(responsePromise, {
                loading: "Updating rating...",
                success: (res) =>
                    res?.data?.message || "Rating updated successfully",
                error: (err) =>
                    err?.response?.data?.message || "Failed to update rating",
            });

            const response = await responsePromise;
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );
        }
    }
);

// Delete Rating
export const deleteRating = createAsyncThunk(
    "/ratings/deleteRating",
    async (id, { rejectWithValue }) => {
        try {
            const responsePromise = axiosInstance.delete(`/ratings/${id}`);

            toast.promise(responsePromise, {
                loading: "Deleting rating...",
                success: (res) =>
                    res?.data?.message || "Rating deleted successfully",
                error: (err) =>
                    err?.response?.data?.message || "Failed to delete rating",
            });

            const response = await responsePromise;
            return { id, data: response.data };
        } catch (error) {
            console.log(error);
            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );
        }
    }
);

const ratingSlice = createSlice({
    name: "ratings",
    initialState,
    reducers: {
        clearRatings: (state) => {
            state.ratingsData = {
                averageRating: 0,
                totalRatings: 0,
                userRating: null,
                reviews: [],
            };
        }
    },

    extraReducers: (builder) => {
        builder

            // Fetch rating
            .addCase(getAllRating.fulfilled, (state, action) => {
                const result = action.payload?.data;

                state.ratingsData = {
                    averageRating: result?.averageRating ?? 0,
                    totalRatings: result?.totalRatings ?? 0,
                    userRating: result?.userRating ?? null,
                    reviews: result?.reviews ?? [],
                };
            })

            // Create rating
            .addCase(createRating.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.ratingsData.userRating = action.payload.data;
                }
            })

            // Update rating
            .addCase(updateRating.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.ratingsData.userRating = action.payload.data;
                }
            })

            // Delete rating
            .addCase(deleteRating.fulfilled, (state, action) => {
                const deletedId = action.payload?.id;
                state.ratingsData.reviews = state.ratingsData.reviews.filter(
                    (r) => r._id !== deletedId
                );
                state.ratingsData.userRating = null;
                if (state.ratingsData.totalRatings > 0) {
                    state.ratingsData.totalRatings -= 1;
                }
            });
    },
});

export const { clearRatings } = ratingSlice.actions;

export default ratingSlice.reducer;

