import { configureStore } from "@reduxjs/toolkit";

import {DEFAULT_FEEDBACK_MESSAGE} from './constants.js';

const initialState = {
    introText: '',
    bodyText: '',
    conclusionText: '',
    feedbackType: [],
    feedback: DEFAULT_FEEDBACK_MESSAGE,
    feedbackBody: '',
    feedbackConclusion: '',
    errorMessage: '',
    selectedAssign: '',
    allAssigns: [],
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
    if (action.type === "feedbackBodyChanged") {
        return { ...state, feedbackBody: action.payload };
    }
    if (action.type === "feedbackConclusionChanged") {
        return { ...state, feedbackConclusion: action.payload };
    }
    if (action.type === "errorMessageChanged") {
        return { ...state, errorMessage: action.payload };
    }
    if (action.type === "selectedAssignChanged") {
        return { ...state, selectedAssign: action.payload };
    }
    if (action.type === "allAssignsChanged") {
        return { ...state, allAssigns: action.payload };
    }

    return state;
}