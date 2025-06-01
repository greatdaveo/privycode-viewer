import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import viewerLinksService from "./viewerLinksService";
import { toast } from "react-toastify";

export interface ViewerLink {
  ID: number;
  token: string;
  repo_name: string;
  max_views: number;
  expires_at: string;
  create_at: string;
  deleted_at: string | null;
  view_count: number;
}

export interface ViewerLinksState {
  links: ViewerLink[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: ViewerLinksState = {
  links: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const fetchViewerLinksSlice = createAsyncThunk(
  "viewer-links/fetch",
  async (_, thunkAPI) => {
    try {
      return await viewerLinksService.getViewerLinks();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createViewerLinkSlice = createAsyncThunk(
  "viewer-links/create",
  async (
    payload: { repo_name: string; expires_in_days: number; max_views: number },
    thunkAPI
  ) => {
    try {
      return await viewerLinksService.createViewerLink(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateViewerLinkSlice = createAsyncThunk(
  "viewer-links/update",
  async (
    data: { id: number; max_views: number; expires_in_days: number },
    thunkAPI
  ) => {
    try {
      return await viewerLinksService.updateViewerLink(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteViewerLinkSlice = createAsyncThunk(
  "viewer-links/delete",
  async (id: number, thunkAPI) => {
    try {
      await viewerLinksService.deleteViewerLink(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const viewerLinksSlice = createSlice({
  name: "viewerLinks",
  initialState,
  reducers: {
    resetViewerLinksState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchViewerLinksSlice.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchViewerLinksSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.links = action.payload;
      })

      .addCase(fetchViewerLinksSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(createViewerLinkSlice.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createViewerLinkSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.links.push(action.payload);
        toast.success("Viewer link created successfully!");
      })

      .addCase(createViewerLinkSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(updateViewerLinkSlice.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(updateViewerLinkSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        state.links = state.links.map((link) =>
          link.ID === updated.id ? updated : link
        );
        // toast.success("Viewer link updated!");
      })

      .addCase(updateViewerLinkSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(deleteViewerLinkSlice.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteViewerLinkSlice.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.links = state.links.filter((link) => {
          link.ID !== deletedId;
        });
      })

      .addCase(deleteViewerLinkSlice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { resetViewerLinksState } = viewerLinksSlice.actions;
export default viewerLinksSlice.reducer;
