import { configureStore } from "@reduxjs/toolkit";
import feedbackReducer from './store/feedback-slice'

export default configureStore({
    reducer: {
        feedback: feedbackReducer,
    },
});
