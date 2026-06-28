import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    booksData: [],
};

export const createBook = createAsyncThunk(
    "/books/createBook",
    async (data) => {
        console.log("incoming createBook data to the thunk", data);

        try {
            const formData = new FormData();

            const textFields = ["title", "author", "price", "category", "language", "description", "stock", "bookUrl", "coverUrl", "book_url", "cover_url"];
            textFields.forEach((key) => {
                if (data[key] !== undefined && data[key] !== null && data[key] !== '' && !(data[key] instanceof File)) {
                    formData.append(key, data[key]);
                }
            });

            const cover = data.cover_image || data.coverUrl || data.cover_url;
            if (cover instanceof File) {
                formData.append("cover_image", cover);
            }

            const bookFile = data.file_url || data.bookUrl || data.fileUrl || data.book_url;
            if (bookFile instanceof File) {
                formData.append("file_url", bookFile);
            }

            const response = axiosInstance.post("/books", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.promise(response, {
                success: (resolvedPromise) => {
                    return resolvedPromise?.data?.message || "Book created successfully";
                },
                loading: "Creating the book...",
                error: (err) => {
                    return err?.response?.data?.message || "Ohh No!, Something went wrong, cannot create the book";
                },
            });

            const apiResponse = await response;
            return apiResponse;
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
);


export const getAllBooks = createAsyncThunk(
    "/books/getAll",
    async () => {
        try {
            const apiResponse = await axiosInstance.get("/books/");
            return apiResponse.data;
        } catch (error) {
            console.log(error);
        }
    }
);


export const updateBook = createAsyncThunk(
    "/books/updateBook",
    async ({ id, data }) => {
        try {
            let payload = data;
            let config = {};

            const hasFiles = (data.cover_image instanceof File) || (data.file_url instanceof File) || (data.coverUrl instanceof File) || (data.bookUrl instanceof File);

            if (hasFiles || !(data instanceof FormData)) {
                const formData = new FormData();
                Object.keys(data).forEach((key) => {
                    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                        if (data[key] instanceof File) {
                            if (key === 'coverUrl' || key === 'cover_url') formData.append('cover_image', data[key]);
                            else if (key === 'bookUrl' || key === 'fileUrl' || key === 'book_url') formData.append('file_url', data[key]);
                            else formData.append(key, data[key]);
                        } else {
                            formData.append(key, data[key]);
                        }
                    }
                });
                payload = formData;
                config = { headers: { "Content-Type": "multipart/form-data" } };
            }

            const response = axiosInstance.put(`/books/${id}`, payload, config);

            toast.promise(response, {
                loading: "Updating book...",
                success: "Book updated successfully",
                error: (err) => {
                    return err?.response?.data?.message || "Failed to update book";
                },
            });

            const apiResponse = await response;
            return apiResponse;
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
);

export const deleteBook = createAsyncThunk(
    "/books/deleteBook",
    async (bookId) => {
        try {
            const response = axiosInstance.delete(`/books/${bookId}`);

            toast.promise(response, {
                loading: "Deleting book...",
                success: "Book deleted successfully",
                error: (err) => {
                    return err?.response?.data?.message || "Failed to delete book";
                },
            });

            const apiResponse = await response;
            return {
                bookId,
                response: apiResponse,
            };
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
);

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBooks.fulfilled, (state, action) => {
                const fetchedBooks = action?.payload?.data?.data || action?.payload?.data;
                state.booksData = Array.isArray(fetchedBooks) ? fetchedBooks : [];
            })
            .addCase(createBook.fulfilled, (state, action) => {
                const newBook = action?.payload?.data?.data || action?.payload?.data;
                if (newBook && typeof newBook === "object") {
                    state.booksData.push(newBook);
                }
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                const updatedBook = action?.payload?.data?.data || action?.payload?.data;
                if (updatedBook && updatedBook._id) {
                    state.booksData = state.booksData.map((book) =>
                        book._id === updatedBook._id ? updatedBook : book
                    );
                }
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                if (action.payload && action.payload.bookId) {
                    state.booksData = state.booksData.filter(
                        (book) => book._id !== action.payload.bookId
                    );
                }
            });
    },
});

export default bookSlice.reducer;
