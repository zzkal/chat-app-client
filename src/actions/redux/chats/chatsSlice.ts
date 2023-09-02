import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
  const response = await axios.get(
    'http://localhost:8000/v1/users/chats',

    {
      withCredentials: true,
    }
  );

  return response.data;
});

export const INITIAL_STATE_CHATS: {
  chats: any[];
  isLoading: boolean;
  error: null | string | undefined;
} = {
  chats: [],
  isLoading: false,
  error: null,
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState: INITIAL_STATE_CHATS,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchChats.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chats = action.payload;
    });
    builder.addCase(fetchChats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const chatsReducer = chatsSlice.reducer;
