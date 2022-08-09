import { configureStore } from '@reduxjs/toolkit';

import authSlice from './authSlice';
import questionSlice from './questionSlice';
import answerSlice from './answerSlice';
import studyTimeSlice from './studyTimeSlice';
import roomListSlice from './roomListSlice';
import roomSlice from './roomSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    question: questionSlice,
    answer: answerSlice,
    studyTime: studyTimeSlice,
    roomList: roomListSlice,
    room: roomSlice,
  },
});
