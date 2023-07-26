import { Button, Heading, TextArea, View, Text, CheckboxGroup, Checkbox, Spinner, List,
    InstUISettingsProvider, canvas } from '@instructure/ui';

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import {DEFAULT_FEEDBACK_MESSAGE} from './constants.js';

const throttle = require('promise-ratelimit')(2000);

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
    const errorMessage = useSelector(state => state.errorMessage);

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
    function setErrorMessage(newVal) {
        dispatch({type: "errorMessageChanged", payload: newVal});
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
        setErrorMessage("");
        setFeedback(DEFAULT_FEEDBACK_MESSAGE);

        let error = "";

        if (!introText && !bodyText && !conclusionText) {
            error = "You must provide at least one section " +
                "(introduction, body, or conclusion) of your draft for feedback. "
        }
        if (feedbackType.length === 0) {
            error += "You must select at least one type of feedback."
        }
        if (error) {
            setErrorMessage(error);
            return;
        }

        getFeedback();
    }

    function getFeedback() {
        setFeedback("Loading...");
        let params = {intro: introText, body: bodyText, conclusion: conclusionText, types: feedbackType};
        getSampleFeedback(params)
            .then(feedback => {
                setFeedback(feedback + " (" + feedbackType + ")");
            })
            .catch(err => {
                console.log(err)
                setFeedback(feedbackType + ", Error :(");
            });
    }

    async function getSampleFeedback(params) {
        console.log(`Getting feedback on ${JSON.stringify(params)}`)
        /*const response = await fetch(
            `http://localhost/writing-coach/action.php?task=retrieveFeedback&section=intro&input=${params.intro}&feedbackType=grammatical`);
        console.log(response);*/

        await throttle();
        let feedback = '\n\n{"feedback": ["Consider adding a sentence to the introduction that clearly states the thesis statement of the paper.", \n"The introduction should provide a brief overview of the main points of the argument. Consider adding a sentence or two that summarizes the main points of the argument.", \n"The introduction should provide a brief overview of the main points of the argument. Consider adding a sentence or two that summarizes the main points of the argument.", \n"The introduction should provide a brief overview of the main points of the argument. Consider adding a sentence or two that summarizes the main points of the argument.", \n"The introduction should provide a brief overview of the main points of the argument. Consider adding a sentence or two that summarizes the main points of the argument."]}';
        feedback = feedback.replace(/\n|\r/g, "");
        return feedback;
    }

    let buttonText = 'Submit for Feedback';
    if (feedback !== DEFAULT_FEEDBACK_MESSAGE) {
        buttonText = 'Resubmit for Feedback';
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
                />
            </div>
            <div className="column">
                <Feedback feedback={feedback} />
            </div>
        </>
    );
}

function InputForm({introText, bodyText, setFeedbackType, errorMessage,
                       conclusionText, handleChange, handleButton, buttonText}) {

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
                                   description="Select type(s) of feedback to recieve:"
                    >
                        <Checkbox label="USU Standards" value="Standards" />
                        <Checkbox label="Grammatical" value="Grammar" />
                    </CheckboxGroup>

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
                <TextArea
                    label={sectionType}
                    placeholder={`Paste your ${sectionType.toLowerCase()} paragraph(s) here`}
                    onChange={(e) => handleChange(sectionType, e.target.value)}
                    value={text}
                />
            </View>
        </>
    );
}

function Feedback({feedback}) {
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
                <GeneratedFeedback text={feedback}/>

            </View>
        </>
    );
}

function GeneratedFeedback({text}) {
    if (text === "Loading...") {
        return (
            <>
                <Text
                    size="medium"
                    weight="light"
                >{text}</Text>
                <Spinner renderTitle="Feedback Loading." size="x-small" margin="0 0 0 small" />
            </>
        );
    } else if (text === "Feedback will appear here.") {
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
            <FeedbackSection title={"Introduction"} feedback={text}/>
        </>
    );
}

function FeedbackSection({title, feedback}) {
    feedback = JSON.parse(feedback).feedback;
    console.log(feedback);
    const listItems = feedback.map((text) =>  <List.Item key={text}>{text}</List.Item>);

    return (
        <>
            <Heading level="h3" margin="0 0 small">{title}:</Heading>
            <List as="ol" margin="0 0 medium">{listItems}</List>
        </>
    );

    /*return (
        <>
            <Heading level="h3" margin="0 0 small">{title}:</Heading>
            <List as="ol" margin="0 0 medium">
                <List.Item>{feedback}</List.Item>
                <List.Item>helloooo</List.Item>
            </List>
        </>
    );*/
}

export default App
