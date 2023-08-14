import { configureStore } from "@reduxjs/toolkit";

const initialState = {
    introText: '',
    bodyText: '',
    conclusionText: '',
    feedbackType: [],
    feedbackIntro: '',
    feedbackBody: '',
    feedbackConclusion: '',
    errorMessage: '',
    selectedAssign: '',
    allAssigns: [],
    allSaved: (function() {
        let theArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            theArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
        return theArray;
        })(),
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
        return { ...state, feedbackIntro: action.payload };
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
    if (action.type === "allSavedChanged") {
        return { ...state, allSaved: action.payload };
    }

    return state;
}