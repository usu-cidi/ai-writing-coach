import { createSlice } from "@reduxjs/toolkit";

/*const initialState = {
    changed: false,
    annotation: [],
};*/

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
};

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        /*setAnnotation(state, action) {
            const { annotations } = action.payload;

            state.annotations = annotations;
            state.changed = true;
        },*/
        setIntroText(state, action) {
            state.introText = action.payload;
        },
        setBodyText(state, action) {
            state.bodyText = action.payload;
        },
        setConclusionText(state, action) {
            state.conclusionText = action.payload;
        },
        setFeedbackType(state, action) {
            state.feedbackType = action.payload;
        },
        setIntroFeedback(state, action) {
            state.introFeedback = action.payload;
        },
        setBodyFeedback(state, action) {
            state.bodyFeedback = action.payload;
        },
        setConclusionFeedback(state, action) {
            state.conFeedback = action.payload;
        },
        setErrorMessage(state, action) {
            state.errorMessage = action.payload;
        },
        setAllSaved(state, action) {
            state.allSaved = action.payload;
        },
        setTitleForSaving(state, action) {
            state.titleForSaving = action.payload;
        },
        setFeedbackError(state, action) {
            state.feedbackError = action.payload;
        },
        setTranscript(state, action) {
            state.transcript = action.payload;
        },
    },
});

export const feedbackActions = feedbackSlice.actions;
export default feedbackSlice;