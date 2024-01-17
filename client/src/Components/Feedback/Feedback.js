import {Heading, View, Alert} from '@instructure/ui';

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';

import {FEEDBACK_URL, LOADING_MESSAGE, SERVER_URL} from '../../constants.js';

import InputForm from "./InputForm";
import FeedbackDisplay from "./FeedbackDisplay";
import SavedFeedback from "./SavedFeedback";
import ToolNavBar from "./ToolNavBar";
import ApplicationFeedback from "./ApplicationFeedback";
import SaveSession from "./SaveSession";

function Feedback() {

    /*TODO: window.addEventListener('beforeunload', function (event) {
        event.preventDefault();
        return (event.returnValue = "");
    });*/

    return (
        <>
            <View as="div" margin="small">
                <DraftFeedback />
            </View>
        </>
    );
}

function getUserId() {
    return '123';
}


/*function Feedback() {
    return (
        <>
            <ToolNavBar />
            <View as="div" margin="small">
                <DraftFeedback />
            </View>
        </>
    );
}*/

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
    const transcript = useSelector(state => state.transcript)

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
    function setTranscript(newVal) {
        dispatch({type: "transcriptChanged", payload: newVal});
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

    function saveFeedbackEntryToDatabase() {
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
            userId: getUserId()
        };

        console.log(`Trying to save ${JSON.stringify(dataToSave)}`);

        setTitleForSaving("");

        return fetch(`${SERVER_URL}?task=addSavedEntry`,
            {
                method: 'POST',
                body: JSON.stringify(dataToSave)
            })
            .then(response => {
                return response.text();
            })
            .then(resp => {
                return updateSavedItems();
            })
            .catch(err => {
                console.log(`Error saving to database: ${err}`);
            });
    }

    function handleButton() {

        setErrorMessage('');
        setIntroFeedback('');
        setBodyFeedback('');
        setConclusionFeedback('');
        setFeedbackError('');

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
        let indexOfEnd = response.indexOf('"]}');

        console.log(indexOfStart, indexOfEnd);

        if (indexOfStart === -1) {
            console.log("Invalid response format.");
            return response;
        }
        if (indexOfEnd === -1) {
            console.log("Invalid response format.");

            if (response.indexOf('"]') !== -1) {
                response.replace('"]', '"]}')
            } else {
                response += '"]}';
            }

            indexOfEnd = response.indexOf('"]}');
            if (indexOfEnd === -1) {
                console.log("Invalid response format.");
                return response;
            }
        }

        let clean = response.substring(indexOfStart, indexOfEnd + 3);
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
                    // eslint-disable-next-line
                    newClean += '\\\"';
                }
            } else {
                newClean += clean[i];
            }
        }

        console.log(newClean);
        return newClean;
    }

    async function handleSection(text, section, feedbackType) {
        if (text) {
            return fetchFeedback({input: text, section: section, feedbackType: feedbackType})
                .then(theFeedback => {
                    let validated = validateResponse(theFeedback);
                    if (section === "intro") {
                        setIntroFeedback(validated);
                    } else if (section === "body") {
                        setBodyFeedback(validated);
                    } else {
                        setConclusionFeedback(validated);
                    }
                    return {
                        input: text,
                        section: section,
                        feedbackType: feedbackType,
                        feedback: validated,
                        time: Date.now(),
                    };
                });
        }
        return false;
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

        let introTranscript;
        let bodyTranscript;
        let conclusionTranscript;

        try {
            handleSection(introText, "intro", feedbackType)
                .then(res => {
                    introTranscript = res;
                    return handleSection(bodyText, "body", feedbackType);
                })
                .then(res => {
                    bodyTranscript = res;
                    return handleSection(conclusionText, "conclusion", feedbackType);
                })
                .then(res => {
                    conclusionTranscript = res;

                    updateTranscript(introTranscript, bodyTranscript, conclusionTranscript);
                });
        } catch(err) {
            console.log(`There was an error retrieving feedback: ${err.message}`)
            console.log(err);
            setFeedbackError("There was an error retrieving feedback, please try again later.");
            updateTranscript({
                error: err,
                time: Date.now()
            });
        }

    }

    function updateTranscript(intro, body, conclusion) {
        let toAdd = [];
        if (intro) {
            //console.log(`Adding ${JSON.stringify(intro)}!`);
            toAdd.push(intro);
        }
        if (body) {
            //console.log(`Adding ${JSON.stringify(body)}!`);
            toAdd.push(body);
        }
        if (conclusion) {
            //console.log(`Adding ${JSON.stringify(conclusion)}!`);
            toAdd.push(conclusion);
        }
        setTranscript(transcript.concat(toAdd));
    }

    async function fetchFeedback(params) {
        console.log(`Getting feedback on ${JSON.stringify(params)}`);
        return fetch(
            FEEDBACK_URL,
            {
                method: 'POST',
                body: JSON.stringify({
                    section: params.section,
                    input: params.input,
                    feedbackType: `"${params.feedbackType}"`
                })
            })
            .then(response => {
                return response.text();
            })
            .then(result => {
                console.log(result);
                return result.replace(/\\n|\\r|\\/g, "");
            })
            .catch(err => {
                console.log(`Error retrieving feedback: ${err}`);
            });
    }

    let buttonText = 'Submit for Feedback';
    if (feedbackIntro !== '' || feedbackBody !== '' || feedbackConclusion !== '') {
        buttonText = 'Resubmit for Feedback';
    }

    function filterSavedItemsByUser(saved, userId) {
        return saved.filter((item) => item.user_id === userId);
    }

    function updateSavedItems() {
        fetch(`${SERVER_URL}?task=getSavedEntries`)
            .then(response => {
                return response.text();
            })
            .then(resp => {
                if (resp.message === "0 results") {
                    setAllSaved([]);
                } else {
                    setAllSaved(filterSavedItemsByUser(JSON.parse(resp), getUserId()));
                }
            })
            .catch(err => {
                console.log(`Unexpected item found: ${err}`);
            });
    }

    function handleReset() {
        setIntroText("");
        setBodyText("");
        setConclusionText("");
        setIntroFeedback("")
        setBodyFeedback("");
        setConclusionFeedback("");
    }

    let didInit = false;

    useEffect(() => {
        if (!didInit) {
            didInit = true;
            // ✅ Only runs once per app load
            updateSavedItems();
        }
    }, []);

    return (
        <>
            <Heading level="h2" margin="0 0 small" border="bottom">Draft Feedback</Heading>
            <Alert
                variant="info"
                renderCloseButtonLabel="Close"
                margin="small"
                timeout={12000}>
                Paste your draft into the corresponding box. You can also submit a partial draft.
                General Best Practices will give you feedback relating to the strength of the argument or structure of your paper.
                Grammatical will give you feedback on your spelling and grammar.
            </Alert>

            <div className="grid-container">
                <div className="item0">

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
                            className="column"
                        />
                    </div>
                    <div className="column">
                        <FeedbackDisplay
                            feedbackIntro={feedbackIntro}
                            feedbackBody={feedbackBody}
                            feedbackConclusion={feedbackConclusion}
                            saveToLocal={saveFeedbackEntryToDatabase}
                            setTitleForSaving={setTitleForSaving}
                            error={feedbackError}
                        /><br/>
                        <SavedFeedback
                            setIntroFeedback={setIntroFeedback}
                            setBodyFeedback={setBodyFeedback}
                            setConclusionFeedback={setConclusionFeedback}
                            setIntroText={setIntroText}
                            setBodyText={setBodyText}
                            setConclusionText={setConclusionText}
                            itemsArray={allSaved}
                            updateItemsArray={updateSavedItems}
                            feedbackIntro={feedbackIntro}
                            feedbackBody={feedbackBody}
                            feedbackConclusion={feedbackConclusion}
                        /><br/>
                    </div>
                </div>

                <div className="item1">
                    <SaveSession
                        transcript={transcript}
                    />
                    <ApplicationFeedback/>
                </div>
            </div>
        </>
    );
}


export default Feedback;
