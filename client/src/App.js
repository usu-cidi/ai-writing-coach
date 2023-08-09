import { Button, Heading, TextArea, View, Text, CheckboxGroup, Checkbox, Spinner, List, SimpleSelect,
    InstUISettingsProvider, canvas } from '@instructure/ui';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {DEFAULT_FEEDBACK_MESSAGE, FEEDBACK_URL, ASSIGNS_URL, INPUT_TEXT_MAX_LENGTH} from './constants.js';

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
    const feedback = useSelector(state => state.feedback);
    const feedbackBody = useSelector(state => state.feedbackBody);
    const feedbackConclusion = useSelector(state => state.feedbackConclusion);
    const errorMessage = useSelector(state => state.errorMessage);
    const selectedAssign = useSelector(state => state.selectedAssign);
    const allAssigns = useSelector(state => state.allAssigns);

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
    function setFeedback(newVal) {
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

    function handleButton() {
        console.log(selectedAssign);

        setErrorMessage("");
        setFeedback(DEFAULT_FEEDBACK_MESSAGE);
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
        let hideWaitingMessage = false;

        if (introText) {
            setFeedback("Loading...");
        }
        if (bodyText) {
            setBodyFeedback("Loading...");
            hideWaitingMessage = true;
        }
        if (conclusionText) {
            setConclusionFeedback("Loading...");
            hideWaitingMessage = true;
        }

        if (hideWaitingMessage) {
            setFeedback("");
        }

        let theSelectedAssign = selectedAssign;
        if (selectedAssign === " ") {
            theSelectedAssign = "";
        }

        if (introText) {
            let introFeedback = await fetchFeedback({input: introText, section: "intro", feedbackType: feedbackType, assign: theSelectedAssign});
            setFeedback(introFeedback);
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
    if (feedback !== DEFAULT_FEEDBACK_MESSAGE) {
        buttonText = 'Resubmit for Feedback';
    }

    async function fetchAssigns() {
        console.log(`Getting assignments`);
        return fetch(ASSIGNS_URL)
            .then(response => {
                return response.json();
            })
            .then(result => {
                return JSON.parse(result).assignments;
            })

    }

    if (allAssigns.length === 0) {
        console.log("Getting assignments");
        fetchAssigns()
            .then(result => {
                setAllAssigns(result);
            })
            .catch(err => {
                console.log(`Error getting assignments: ${err}`);
            });
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
                    feedbackIntro={feedback}
                    feedbackBody={feedbackBody}
                    feedbackConclusion={feedbackConclusion}
                />
            </div>
        </>
    );
}

function InputForm({introText, bodyText, setFeedbackType, errorMessage,
                       conclusionText, handleChange, handleButton, buttonText, setAssign, allAssigns}) {

    const assignOptions = allAssigns.map((text) => <SimpleSelect.Option
        id={text}
        value={text}
        key={text}
    >{text}</SimpleSelect.Option>);

    let handleSelect = (e, { id, value }) => {
        setAssign(value);
    }

    return (
        <>
            <form>
                <InputSection sectionType="Introduction" text={introText} handleChange={handleChange} />
                <InputSection sectionType="Body" text={bodyText} handleChange={handleChange} />
                <InputSection sectionType="Conclusion" text={conclusionText} handleChange={handleChange} />

                <View display="block" margin="small 0 0">

                    <CheckboxGroup name="sports" size="small"
                                   layout="columns"
                                   onChange={function (value) {
                                       setFeedbackType(value);
                                   }}
                                   description="Select type(s) of feedback to receive:"
                    >
                        <Checkbox label="USU Standards" value="standards" />
                        <Checkbox label="General Best Practices" value="grammatical" />
                    </CheckboxGroup><br/>

                    <SimpleSelect
                        renderLabel="Assignment"
                        onChange={handleSelect}
                    >
                        <SimpleSelect.Option id="blank" value={" "} key="blank">{" "}</SimpleSelect.Option>
                        {assignOptions}
                    </SimpleSelect>

                    <Button margin="small" color="primary"
                            onClick={() => handleButton()}>{buttonText}</Button>
                </View>
            </form>
            <Text color="danger" weight="bold">{errorMessage}</Text>
        </>
    );
}

function InputSection({sectionType, text, handleChange}) {

    return (
        <>
            <View display="block" margin="small 0 0">
                <TextArea maxLength={INPUT_TEXT_MAX_LENGTH}
                    label={sectionType}
                    placeholder={`Paste your ${sectionType.toLowerCase()} paragraph(s) here`}
                    onChange={(e) => handleChange(sectionType, e.target.value)}
                    value={text}
                />
                <Text
                    color="secondary"
                    weight="light"
                    size="x-small"
                >{text.length} / {INPUT_TEXT_MAX_LENGTH} characters</Text>
            </View>
        </>
    );
}

function Feedback({feedbackIntro, feedbackBody, feedbackConclusion}) {
    if (feedbackIntro === DEFAULT_FEEDBACK_MESSAGE && !feedbackBody && !feedbackConclusion) {
        return (
            <>
                <View as="div"
                      display="inline-block"
                      margin="small"
                      padding="small"
                      background="secondary"
                      shadow="resting"
                      borderRadius="large"
                      width="85%"
                >
                    <Heading level="h2" margin="0 0 x-small">Feedback</Heading>
                    <Text size="medium" weight="light">{DEFAULT_FEEDBACK_MESSAGE}</Text>

                </View>
            </>
        );
    }

    function saveToLocalStorage() {
        console.log("Save button clicked!!");
    }

    return (
        <>
            <View as="div"
                  display="inline-block"
                  margin="small"
                  padding="small"
                  background="secondary"
                  shadow="resting"
                  borderRadius="large"
                  width="85%"
            >
                <Heading level="h2" margin="0 0 x-small">Feedback</Heading>

                {feedbackIntro ? (
                    <GeneratedFeedback title={"Introduction"} text={feedbackIntro}/>
                ) : console.log("no intro")}
                {feedbackBody ? (
                    <GeneratedFeedback title={"Body"} text={feedbackBody}/>
                ) : console.log("no body")}
                {feedbackConclusion ? (
                    <GeneratedFeedback title={"Conclusion"} text={feedbackConclusion}/>
                ) : console.log("no conclusion")}

                <Button margin="small" color="primary"
                        onClick={() => saveToLocalStorage()}>Save</Button>

            </View>
        </>
    );
}

function GeneratedFeedback({title, text}) {
    if (text === "Loading...") {
        return (
            <>
                <Heading level="h3" margin="0 0 small">{title}:</Heading>
                <Text
                    size="medium"
                    weight="light"
                >{text}</Text>
                <Spinner renderTitle="Feedback Loading." size="x-small" margin="0 0 0 small" /><br/><br/>
            </>
        );
    } else if (text === DEFAULT_FEEDBACK_MESSAGE) {
        return (
            <>
                <Text
                    size="medium"
                    weight="light"
                >{text}</Text>
            </>
        );
    }

    return (
        <>
            <Heading level="h3" margin="0 0 small">{title}:</Heading>
            <FeedbackSection feedback={text}/>
        </>
    );
}

function FeedbackSection({feedback}) {
    //console.log(feedback);
    try {
        feedback = JSON.parse(feedback).feedback;
    } catch(err) {
        console.log(err);
        return (
            <>
                <Text size="medium">Error formatting feedback. Raw text:</Text><br/>
                <Text size="medium">{feedback}</Text>
            </>
        );
    }

    const listItems = feedback.map((text) => <List.Item key={text}>{text}</List.Item>);

    return (
        <>
            <List as="ul" margin="0 0 medium">{listItems}</List>
        </>
    );
}

export default App
