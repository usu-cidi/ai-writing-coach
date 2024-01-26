import React, { useEffect } from 'react';
import {
    Heading,
    View,
    Alert, Text
} from '@instructure/ui';
import instance from "../../axios";
import instance1 from "../../dev-axios";
import InputForm from "./InputForm";
import FeedbackDisplay from "./FeedbackDisplay";
import SavedFeedback from "./SavedFeedback";
import ToolNavBar from "./ToolNavBar";
import ApplicationFeedback from "./ApplicationFeedback";
import SaveSession from "./SaveSession";
import SelectAssignment from "./SelectAssignment";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchSaved,
    fetchAssns
} from "../../store/feedback-actions";
import { feedbackActions } from '../../store/feedback-slice'
import {LOADING_MESSAGE} from '../../constants.js';

function getUserId() {
    //TODO: get & return userId from session information
    return '123';
}

function getCourseId() {
    //TODO: get & return courseId from session information
    return '742803';
}

function Feedback() {

    window.addEventListener('beforeunload', function (event) {
        event.preventDefault();
        return (event.returnValue = "");
    });

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

    //----- state -----

    const introText = useSelector((state) => state.feedback.introText);
    const bodyText = useSelector((state) => state.feedback.bodyText);
    const conclusionText = useSelector((state) => state.feedback.conclusionText);
    const feedbackType = useSelector((state) => state.feedback.feedbackType);
    const feedbackIntro = useSelector((state) => state.feedback.feedbackIntro);
    const feedbackBody = useSelector((state) => state.feedback.feedbackBody);
    const feedbackConclusion = useSelector((state) => state.feedback.feedbackConclusion);
    const errorMessage = useSelector((state) => state.feedback.errorMessage);
    const allSaved = useSelector((state) => state.feedback.allSaved);
    const titleForSaving = useSelector((state) => state.feedback.titleForSaving);
    const feedbackError = useSelector((state) => state.feedback.feedbackError);
    const transcript = useSelector((state) => state.feedback.transcript);
    const courseAssns = useSelector((state) => state.feedback.courseAssns);
    const selectedAssn = useSelector((state) => state.feedback.selectedAssn);

    const dispatch = useDispatch();

    //----- effects -----

    useEffect(() => {
        dispatch(fetchSaved(getUserId(), filterSavedItemsByUser));
        dispatch(fetchAssns(getCourseId()));
    }, [dispatch]);

    let buttonText = 'Submit for Feedback';
    if (feedbackIntro !== '' || feedbackBody !== '' || feedbackConclusion !== '') {
        buttonText = 'Resubmit for Feedback';
    }

    //----- ui functions -----

    function handleChange(type, newVal) {
        if (type === "Introduction") {
            dispatch(feedbackActions.setIntroText(newVal));
        } else if (type === "Body") {
            dispatch(feedbackActions.setBodyText(newVal));
        } else if (type === "Conclusion") {
            dispatch(feedbackActions.setConclusionText(newVal));
        }
    }

    function updateTranscript(intro, body, conclusion) {
        let toAdd = [];
        if (intro) {
            toAdd.push(intro);
        }
        if (body) {
            toAdd.push(body);
        }
        if (conclusion) {
            toAdd.push(conclusion);
        }
        dispatch(feedbackActions.setTranscript(transcript.concat(toAdd)));
    }

    function handleButton() {

        dispatch(feedbackActions.setErrorMessage(''));
        dispatch(feedbackActions.setIntroFeedback(''));
        dispatch(feedbackActions.setBodyFeedback(''));
        dispatch(feedbackActions.setConclusionFeedback(''));
        dispatch(feedbackActions.setFeedbackError(''));

        let error = "";

        if (!introText && !bodyText && !conclusionText) {
            error = "You must provide at least one section " +
                "(introduction, body, or conclusion) of your draft for feedback. "
        }
        if (feedbackType.length === 0) {
            error += "You must select at least one type of feedback. "
        }

        if (error) {
            dispatch(feedbackActions.setErrorMessage(error));
            return;
        }

        getFeedback();
    }

    function handleReset() {
        dispatch(feedbackActions.setIntroText(""));
        dispatch(feedbackActions.setBodyText(""));
        dispatch(feedbackActions.setConclusionText(""));
        dispatch(feedbackActions.setIntroFeedback(""));
        dispatch(feedbackActions.setBodyFeedback(""));
        dispatch(feedbackActions.setConclusionFeedback(""));
    }

    //----- database functions -----

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

        dispatch(feedbackActions.setTitleForSaving(""));

        return instance1.post('?task=addSavedEntry', JSON.stringify(dataToSave))
            .then(response => {
                return response.data;
            })
            .then(resp => {
                return updateSavedItems(resp);
            })
            .catch(err => {
                console.log(`Error saving to database: ${err}`);
            });
    }

    function filterSavedItemsByUser(saved, userId) {
        return saved.filter((item) => item.user_id === userId);
    }

    function updateSavedItems(updated=undefined) {
        if (updated) {
            if (updated.message === "0 results") {
                dispatch(feedbackActions.setAllSaved([]));
            } else {
                dispatch(feedbackActions.setAllSaved(filterSavedItemsByUser(updated, getUserId())));
            }
        } else {
            instance1.get('?task=getSavedEntries')
                .then(response => {
                    return response.data;
                })
                .then(resp => {
                    if (resp.message === "0 results") {
                        dispatch(feedbackActions.setAllSaved([]));
                    } else {
                        dispatch(feedbackActions.setAllSaved(filterSavedItemsByUser(resp, getUserId())));
                    }
                })
                .catch(err => {
                    console.log(`Unexpected item found: ${err}`);
                });
        }
    }

    //----- logic functions -----

    function validateResponse(response) {

        let indexOfStart = response.indexOf('{"feedback"');
        let indexOfEnd = response.indexOf('"]}');

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

        return newClean;
    }

    async function handleSection(text, section, feedbackType) {
        if (text) {
            return fetchFeedback({input: text, section: section, feedbackType: feedbackType, assignment: selectedAssn})
                .then(theFeedback => {
                    let validated = validateResponse(theFeedback);
                    if (section === "intro") {
                        dispatch(feedbackActions.setIntroFeedback(validated));
                    } else if (section === "body") {
                        dispatch(feedbackActions.setBodyFeedback(validated));
                    } else {
                        dispatch(feedbackActions.setConclusionFeedback(validated));
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
            dispatch(feedbackActions.setIntroFeedback(LOADING_MESSAGE));
        }
        if (bodyText) {
            dispatch(feedbackActions.setBodyFeedback(LOADING_MESSAGE));
        }
        if (conclusionText) {
            dispatch(feedbackActions.setConclusionFeedback(LOADING_MESSAGE));
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
            dispatch(feedbackActions.setFeedbackError("There was an error retrieving feedback, please try again later."));
            updateTranscript({
                error: err,
                time: Date.now()
            });
        }

    }

    async function fetchFeedback(params) {
        return instance1.post(
            '?task=receivePost',
            JSON.stringify({
                section: params.section,
                input: params.input,
                feedbackType: `"${params.feedbackType}"`,
                assignment: params.assignment
            })
        )
            .then(response => {
                return response.data;
            })
            .then(result => {
                return result.replace(/\\n|\\r|\\/g, "");
            })
            .catch(err => {
                console.log(`Error retrieving feedback: ${err}`);
            });
    }

    //----- ui -----

    if (courseAssns === undefined) {
        return (
            <>
                <Text>Loading...</Text>
            </>
        );
    }

    if (!selectedAssn) {
        return (
            <>
                <SelectAssignment
                    setSelectedAssn={feedbackActions.setSelectedAssn}
                    selectedAssn={selectedAssn}
                    courseAssns={courseAssns}
                />
            </>
        );
    }

    return (
        <>
            <Heading level="h2" margin="0 0 small" border="bottom">Draft Feedback</Heading>
            <Alert
                variant="info"
                renderCloseButtonLabel="Close"
                margin="small"
                timeout={12000}>
                Paste your draft into the corresponding box. You can also submit a partial draft.
                Assignment Specific (if available) will give you feedback based on criteria set by your instructor.
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
                            setFeedbackType={feedbackActions.setFeedbackType}
                            errorMessage={errorMessage}
                            handleChange={handleChange}
                            handleButton={handleButton}
                            buttonText={buttonText}
                            handleReset={handleReset}
                            selectedAssn={selectedAssn}
                            className="column"
                        />
                    </div>
                    <div className="column">
                        <FeedbackDisplay
                            feedbackIntro={feedbackIntro}
                            feedbackBody={feedbackBody}
                            feedbackConclusion={feedbackConclusion}
                            saveToDatabase={saveFeedbackEntryToDatabase}
                            setTitleForSaving={feedbackActions.setTitleForSaving}
                            error={feedbackError}
                        /><br/>
                        <SavedFeedback
                            setIntroFeedback={feedbackActions.setIntroFeedback}
                            setBodyFeedback={feedbackActions.setBodyFeedback}
                            setConclusionFeedback={feedbackActions.setConclusionFeedback}
                            setIntroText={feedbackActions.setIntroText}
                            setBodyText={feedbackActions.setBodyText}
                            setConclusionText={feedbackActions.setConclusionText}
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
                        selectedAssn={selectedAssn}
                    />
                    <ApplicationFeedback/>
                </div>
            </div>
        </>
    );
}


export default Feedback;
