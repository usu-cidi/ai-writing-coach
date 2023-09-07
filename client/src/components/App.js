import { Heading, InstUISettingsProvider, canvas } from '@instructure/ui';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {FEEDBACK_URL, LOADING_MESSAGE} from '../constants.js';

import InputForm from "./InputForm";
import Feedback from "./Feedback";
import SavedFeedback from "./SavedFeedback";

function App() {
    return (
        <InstUISettingsProvider theme={canvas}>
            <DraftFeedback/>
        </InstUISettingsProvider>
    )
}

function DraftFeedback() {
    const introText = useSelector(state => state.introText);
    const bodyText = useSelector(state => state.bodyText);
    const conclusionText = useSelector(state => state.conclusionText);
    const feedbackType = useSelector(state => state.feedbackType);
    const feedbackIntro = useSelector(state => state.feedbackIntro);
    const feedbackBody = useSelector(state => state.feedbackBody);
    const feedbackConclusion = useSelector(state => state.feedbackConclusion);
    const errorMessage = useSelector(state => state.errorMessage);
    const allSaved = useSelector(state => state.allSaved);
    const titleForSaving = useSelector(state => state.titleForSaving)

    function setIntroText(newVal) {
        dispatch({type: "introTextChanged", payload: newVal});
    }
    function setBodyText(newVal) {
        dispatch({type: "bodyTextChanged", payload: newVal});
    }
    function setConclusionText(newVal) {
        dispatch({type: "conclusionTextChanged", payload: newVal});
    }
    function setFeedbackType(newVal) {
        dispatch({type: "feedbackTypeChanged", payload: newVal});
    }
    function setIntroFeedback(newVal) {
        dispatch({type: "feedbackChanged", payload: newVal});
    }
    function setBodyFeedback(newVal) {
        dispatch({type: "feedbackBodyChanged", payload: newVal});
    }
    function setConclusionFeedback(newVal) {
        dispatch({type: "feedbackConclusionChanged", payload: newVal});
    }
    function setErrorMessage(newVal) {
        dispatch({type: "errorMessageChanged", payload: newVal});
    }
    function setAllSaved(newVal) {
        dispatch({type: "allSavedChanged", payload: newVal});
    }
    function setTitleForSaving(newVal) {
        dispatch({type: "titleForSavingChanged", payload: newVal});
    }

    const dispatch = useDispatch();

    function handleChange(type, newVal) {
        if (type === "Introduction") {
            setIntroText(newVal);
        } else if (type === "Body") {
            setBodyText(newVal);
        } else if (type === "Conclusion") {
            setConclusionText(newVal);
        }
    }

    function saveToLocalStorage() {
        let id = Math.floor(Date.now() / 1000);
        let dataToSave = {
            id: id,
            intro: introText,
            body: bodyText,
            con: conclusionText,
            introFeedback: feedbackIntro,
            bodyFeedback: feedbackBody,
            conFeedback: feedbackConclusion,
            title: titleForSaving,
        }
        localStorage.setItem(JSON.stringify(id), JSON.stringify(dataToSave));
        updateSavedItems();
    }

    function handleButton() {

        setErrorMessage('');
        setIntroFeedback('');
        setBodyFeedback('');
        setConclusionFeedback('');

        let error = "";

        if (!introText && !bodyText && !conclusionText) {
            error = "You must provide at least one section " +
                "(introduction, body, or conclusion) of your draft for feedback. "
        }
        if (feedbackType.length === 0) {
            error += "You must select at least one type of feedback. "
        }

        if (error) {
            setErrorMessage(error);
            return;
        }

        getFeedback();
    }

    async function getFeedback() {

        if (introText) {
            setIntroFeedback(LOADING_MESSAGE);
        }
        if (bodyText) {
            setBodyFeedback(LOADING_MESSAGE);
        }
        if (conclusionText) {
            setConclusionFeedback(LOADING_MESSAGE);
        }

        if (introText) {
            let introFeedback = await fetchFeedback({input: introText, section: "intro", feedbackType: feedbackType});
            setIntroFeedback(introFeedback);
        }
        if (bodyText) {
            let bodyFeedback = await fetchFeedback({input: bodyText, section: "body", feedbackType: feedbackType});
            setBodyFeedback(bodyFeedback);
        }
        if (conclusionText) {
            let conclusionFeedback = await fetchFeedback({input: conclusionText, section: "conclusion", feedbackType: feedbackType});
            setConclusionFeedback(conclusionFeedback);
        }

    }

    async function fetchFeedback(params) {
        console.log(`Getting feedback on ${JSON.stringify(params)}`);
        return fetch(
            `${FEEDBACK_URL}&section=${params.section}&input=${params.input}&feedbackType=${params.feedbackType}`)
            .then(response => {
                return response.json();
            })
            .then(result => {
                //console.log(result);
                return result.replace(/\\n|\\r|\\/g, "");
            });
    }

    let buttonText = 'Submit for Feedback';
    if (feedbackIntro !== '') {
        buttonText = 'Resubmit for Feedback';
    }

    function updateSavedItems() {
        let theArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            theArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
        setAllSaved(theArray);
    }

    function handleReset() {
        setIntroText("");
        setBodyText("");
        setConclusionText("");
        setIntroFeedback("")
        setBodyFeedback("");
        setConclusionFeedback("");
    }


    return (
        <>
            <Heading level="h2" margin="0 0 x-small">Editing, Proofreading, & Revising</Heading>

            <div className="column">
                <InputForm
                    introText={introText}
                    bodyText={bodyText}
                    conclusionText={conclusionText}
                    setFeedbackType={setFeedbackType}
                    errorMessage={errorMessage}
                    handleChange={handleChange}
                    handleButton={handleButton}
                    buttonText={buttonText}
                    handleReset={handleReset}
                />
            </div>
            <div className="column">
                <Feedback
                    feedbackIntro={feedbackIntro}
                    feedbackBody={feedbackBody}
                    feedbackConclusion={feedbackConclusion}
                    saveToLocal={saveToLocalStorage}
                    setTitleForSaving={setTitleForSaving}
                /><br/>
                <SavedFeedback
                    setIntroFeedback = {setIntroFeedback}
                    setBodyFeedback = {setBodyFeedback}
                    setConclusionFeedback = {setConclusionFeedback}
                    setIntroText = {setIntroText}
                    setBodyText = {setBodyText}
                    setConclusionText = {setConclusionText}
                    itemsArray={allSaved}
                    updateItemsArray={updateSavedItems}
                    feedbackIntro={feedbackIntro}
                    feedbackBody={feedbackBody}
                    feedbackConclusion={feedbackConclusion}
                />
            </div>
        </>
    );
}


export default App;
