import {DEFAULT_FEEDBACK_MESSAGE, LOADING_MESSAGE} from "../constants";
import {Button, Heading, List, Spinner, Text, View, TextInput, ScreenReaderContent} from "@instructure/ui";

function Feedback({feedbackIntro, feedbackBody, feedbackConclusion, saveToLocal, setTitleForSaving}) {
    if (!feedbackIntro && !feedbackBody && !feedbackConclusion) {
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
                    <Heading level="h3" margin="0 0 x-small">Feedback</Heading>
                    <Text size="medium" weight="light">{DEFAULT_FEEDBACK_MESSAGE}</Text>
                </View>
            </>
        );
    }

    let saveButton = <Button margin="x-small" color="primary" display="inline-block" size="small"
                             onClick={() => saveToLocal()}>Save</Button>;
    if (feedbackIntro === LOADING_MESSAGE || feedbackBody === LOADING_MESSAGE || feedbackConclusion === LOADING_MESSAGE) {
        saveButton = <Button margin="x-small" color="primary" display="inline-block" size="small"
                             onClick={() => saveToLocal()} disabled>Save</Button>;
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
                <Heading level="h3" margin="0 0 x-small">Feedback</Heading>

                {feedbackIntro ? (
                    <GeneratedFeedback title={"Introduction"} text={feedbackIntro}/>
                ) : console.log("no intro")}
                {feedbackBody ? (
                    <GeneratedFeedback title={"Body"} text={feedbackBody}/>
                ) : console.log("no body")}
                {feedbackConclusion ? (
                    <GeneratedFeedback title={"Conclusion"} text={feedbackConclusion}/>
                ) : console.log("no conclusion")}

                <br/><Text
                    display="inline-block"
                >
                    Save feedback with title:&nbsp;&nbsp;</Text>
                <TextInput
                    renderLabel={<ScreenReaderContent>Saved feedback title input.</ScreenReaderContent>}
                    display="inline-block"
                    onChange={(e) => setTitleForSaving(e.target.value)}
                    size="small"
                />
                {saveButton}
            </View>
        </>
    );
}

function GeneratedFeedback({title, text}) {
    if (text === LOADING_MESSAGE) {
        return (
            <>
                <Heading level="h4" margin="0 0 small">{title}:</Heading>
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
            <Heading level="h4" margin="0 0 small">{title}:</Heading>
            <FeedbackSection feedback={text}/>
        </>
    );
}

function FeedbackSection({feedback}) {
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
            <List as="ul" margin="0 0 x-small">{listItems}</List>
        </>
    );
}

export default Feedback;
