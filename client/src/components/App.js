import { Heading, View} from '@instructure/ui';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {FEEDBACK_URL, LOADING_MESSAGE} from '../constants.js';

import InputForm from "./InputForm";
import Feedback from "./Feedback";
import SavedFeedback from "./SavedFeedback";
import ToolNavBar from "./ToolNavBar";

function App() {
    return (
        <>
            <ToolNavBar />
            <View as="div" margin="small">
                <DraftFeedback />
            </View>
        </>
    );
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
    const feedbackError = useSelector(state => state.feedbackError)

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
    function setFeedbackError(newVal) {
        dispatch({type: "feedbackErrorChanged", payload: newVal});
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

    function validateResponse(response) {

        let indexOfStart = response.indexOf('{"feedback"');
        let indexOfEnd = response.indexOf('"]}') + 3;

        if (indexOfStart === -1 || indexOfEnd === -1) {
            throw Error("Invalid response format.");
        }

        let clean = response.substring(indexOfStart, indexOfEnd);
        let newClean = '';

        for (let i = 0; i < clean.length; i++) {
            if (clean[i] === '"') {

                if (
                    //allowed double quotes:
                    (clean[i - 1] === '{' && clean[i + 1] === 'f') || //{"f
                    (clean[i - 1] === 'k' && clean[i + 1] === ':') || //k":
                    (clean[i - 1] === '[') || //["*
                    (clean[i + 1] === ',') || //*",
                    (clean[i - 2] === ',' && clean[i - 1] === ' ') || //, "*
                    (clean[i - 4] === ',' && clean[i - 3] === ' ' && clean[i - 1] === '\n') || //^^that but with a new line
                    (clean[i - 3] === ',' && clean[i - 2] === ' ' && clean[i - 1] === '\n') || //^^another variation
                    (clean[i + 1] === ']' && clean[i + 2] === '}') //*"]}
                ) {
                    newClean += clean[i];
                } else {
                    newClean += '\\\"';
                }
            } else {
                newClean += clean[i];
            }
        }

        console.log(newClean);
        return newClean;
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

        try {
            if (introText) {
                let introFeedback = await fetchFeedback({input: introText, section: "intro", feedbackType: feedbackType});
                setIntroFeedback(validateResponse(introFeedback));
            }
            if (bodyText) {
                let bodyFeedback = await fetchFeedback({input: bodyText, section: "body", feedbackType: feedbackType});
                setBodyFeedback(validateResponse(bodyFeedback));
            }
            if (conclusionText) {
                let conclusionFeedback = await fetchFeedback({input: conclusionText, section: "conclusion", feedbackType: feedbackType});
                setConclusionFeedback(validateResponse(conclusionFeedback));
            }
        } catch(err) {
            console.log(`There was an error retrieving feedback: ${err.message}`)
            console.log(err);
            setFeedbackError("There was an error retrieving feedback, please try again later.");
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
                console.log(result);
                return result.replace(/\\n|\\r|\\/g, "");
            });
    }

    let buttonText = 'Submit for Feedback';
    if (feedbackIntro !== '' || feedbackBody !== '' || feedbackConclusion !== '') {
        buttonText = 'Resubmit for Feedback';
    }

    function updateSavedItems() {
        let theArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            try {
                let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
                if (
                    item.id === undefined ||
                    item.intro === undefined ||
                    item.body === undefined ||
                    item.con === undefined ||
                    item.introFeedback === undefined ||
                    item.bodyFeedback === undefined ||
                    item.conFeedback === undefined ||
                    item.title === undefined
                ) {
                    console.log("Other local storage item found.");
                } else {
                    theArray.push(item);
                }
            } catch(err) {
                console.log("Other local storage item found.");
            }
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
                    error={feedbackError}
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
