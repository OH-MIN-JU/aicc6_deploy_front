import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalType: 'create',
  task: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.task = action.payload.task;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer; // 리듀서 내보내서 store에 등록
