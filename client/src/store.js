import { configureStore } from "@reduxjs/toolkit";

import {DEFAULT_FEEDBACK_MESSAGE} from './constants.js';

const initialState = {
    introText: '',
    bodyText: '',
    conclusionText: '',
    feedbackType: [],
    feedback: DEFAULT_FEEDBACK_MESSAGE,
    errorMessage: '',
}

export const store = configureStore({
    reducer: reducer,
});

function reducer(state = initialState, action) {
    if (action.type === "introTextChanged") {
        return { ...state, introText: action.payload };
    }
    if (action.type === "bodyTextChanged") {
        return { ...state, bodyText: action.payload };
    }
    if (action.type === "conclusionTextChanged") {
        return { ...state, conclusionText: action.payload };
    }
    if (action.type === "feedbackTypeChanged") {
        return { ...state, feedbackType: action.payload };
    }
    if (action.type === "feedbackChanged") {
        return { ...state, feedback: action.payload };
    }
    if (action.type === "errorMessageChanged") {
        return { ...state, errorMessage: action.payload };
    }

    return state;
}