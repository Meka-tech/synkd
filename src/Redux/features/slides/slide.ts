import { createSlice } from "@reduxjs/toolkit";

interface SlideType {
  slideOpen: boolean;
  activeSlide: string;
}
const initialState: SlideType = {
  slideOpen: false,
  activeSlide: ""
};

export const slideSlice = createSlice({
  name: "slide",
  initialState,
  reducers: {
    updateSlide: (state, action) => {
      state.slideOpen = true;
      state.activeSlide = action.payload;
    },
    removeSlide: (state) => {
      state.slideOpen = false;
      state.activeSlide = "";
    }
  }
});

export const { updateSlide, removeSlide } = slideSlice.actions;

export default slideSlice.reducer;
