import { Heading, InstUISettingsProvider, canvas } from '@instructure/ui';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {FEEDBACK_URL, ASSIGNS_URL} from '../constants.js';

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
    const selectedAssign = useSelector(state => state.selectedAssign);
    const allAssigns = useSelector(state => state.allAssigns);
    const allSaved = useSelector(state => state.allSaved);

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
    function setSelectedAssign(newVal) {
        dispatch({type: "selectedAssignChanged", payload: newVal});
    }
    function setAllAssigns(newVal) {
        dispatch({type: "allAssignsChanged", payload: newVal});
    }
    function setAllSaved(newVal) {
        dispatch({type: "allSavedChanged", payload: newVal});
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
        }
        localStorage.setItem(JSON.stringify(id), JSON.stringify(dataToSave));
        updateSavedItems();
    }

    function handleButton() {
        console.log(selectedAssign);

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

        if (feedbackType.includes("standards") && (!selectedAssign || selectedAssign === " ")) {
            error += "To receive feedback based on USU standards you must select an assignment. "
        }
        if (error) {
            setErrorMessage(error);
            return;
        }

        getFeedback();
    }

    async function getFeedback() {

        if (introText) {
            setIntroFeedback("Loading...");
        }
        if (bodyText) {
            setBodyFeedback("Loading...");
        }
        if (conclusionText) {
            setConclusionFeedback("Loading...");
        }

        let theSelectedAssign = selectedAssign;
        if (selectedAssign === " ") {
            theSelectedAssign = "";
        }

        if (introText) {
            let introFeedback = await fetchFeedback({input: introText, section: "intro", feedbackType: feedbackType, assign: theSelectedAssign});
            setIntroFeedback(introFeedback);
        }
        if (bodyText) {
            let bodyFeedback = await fetchFeedback({input: bodyText, section: "body", feedbackType: feedbackType, assign: theSelectedAssign});
            setBodyFeedback(bodyFeedback);
        }
        if (conclusionText) {
            let conclusionFeedback = await fetchFeedback({input: conclusionText, section: "conclusion", feedbackType: feedbackType, assign: theSelectedAssign});
            setConclusionFeedback(conclusionFeedback);
        }

    }

    async function fetchFeedback(params) {
        console.log(`Getting feedback on ${JSON.stringify(params)}`);
        return fetch(
            `${FEEDBACK_URL}&section=${params.section}&input=${params.input}&feedbackType=${params.feedbackType}&assign=${params.assign}`)
            .then(response => {
                return response.json();
            })
            .then(result => {
                console.log(result);
                return result.replace(/\\n|\\r|\\/g, "");
            });
    }

    let buttonText = 'Submit for Feedback';
    if (feedbackIntro !== '') {
        buttonText = 'Resubmit for Feedback';
    }

    async function fetchAssigns() {
        return fetch(ASSIGNS_URL)
            .then(response => {
                return response.json();
            })
            .then(result => {
                return JSON.parse(result).assignments;
            })

    }

    if (allAssigns.length === 0) {
        fetchAssigns()
            .then(result => {
                setAllAssigns(result);
            })
            .catch(err => {
                console.log(`Error getting assignments: ${err}`);
            });
    }

    function updateSavedItems() {
        let theArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            theArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
        setAllSaved(theArray);
    }


    return (
        <>
            <Heading level="h1" margin="0 0 x-small">Editing, Proofreading, & Revising</Heading>

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
                    setAssign={setSelectedAssign}
                    allAssigns={allAssigns}
                />
            </div>
            <div className="column">
                <Feedback
                    feedbackIntro={feedbackIntro}
                    feedbackBody={feedbackBody}
                    feedbackConclusion={feedbackConclusion}
                    saveToLocal={saveToLocalStorage}
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
                />
            </div>
        </>
    );
}


export default App;
