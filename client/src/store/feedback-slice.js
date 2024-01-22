import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    introText: '',
    bodyText: '',
    conclusionText: '',
    feedbackType: [],
    feedbackIntro: '',
    feedbackBody: '',
    feedbackConclusion: '',
    errorMessage: '',
    allSaved: [],
    titleForSaving: '',
    feedbackError: '',
    transcript: [],
    courseAssns: [],
    selectedAssn: ''
};

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState: initialState,
    reducers: {
        setIntroText: (state, action) => {
            state.introText = action.payload;
        },
        setBodyText: (state, action) => {
            state.bodyText = action.payload;
        },
        setConclusionText: (state, action) => {
            state.conclusionText = action.payload;
        },
        setFeedbackType: (state, action) => {
            state.feedbackType = action.payload;
        },
        setIntroFeedback: (state, action) => {
            state.feedbackIntro = action.payload;
        },
        setBodyFeedback: (state, action) => {
            state.feedbackBody = action.payload;
        },
        setConclusionFeedback: (state, action) => {
            state.feedbackConclusion = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setAllSaved: (state, action) => {
            state.allSaved = action.payload;
        },
        setTitleForSaving: (state, action) => {
            state.titleForSaving = action.payload;
        },
        setFeedbackError: (state, action) => {
            state.feedbackError = action.payload;
        },
        setTranscript: (state, action) => {
            state.transcript = action.payload;
        },
        setCourseAssns: (state, action) => {
            state.courseAssns = action.payload;
        },
        setSelectedAssn: (state, action) => {
            state.selectedAssn = action.payload;
        },
    },
});

export const feedbackActions = feedbackSlice.actions;

export default feedbackSlice.reducer;