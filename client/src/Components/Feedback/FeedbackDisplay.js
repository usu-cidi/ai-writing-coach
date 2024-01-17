import {DEFAULT_FEEDBACK_MESSAGE, LOADING_MESSAGE} from "../../constants";
import {Button, Heading, List, Spinner, Text, View, TextInput, ScreenReaderContent} from "@instructure/ui";

function FeedbackDisplay({feedbackIntro, feedbackBody, feedbackConclusion, saveToLocal, setTitleForSaving, error}) {

    if (error) {
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
                    <Text size="medium" weight="light">{error}</Text>
                </View>
            </>
        );
    }

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
                ) : console.log("")}
                {feedbackBody ? (
                    <GeneratedFeedback title={"Body"} text={feedbackBody}/>
                ) : console.log("")}
                {feedbackConclusion ? (
                    <GeneratedFeedback title={"Conclusion"} text={feedbackConclusion}/>
                ) : console.log("")}

                <br/><Text
                    display="inline-block"
                >
                    Save as:&nbsp;&nbsp;</Text>
                <TextInput
                    renderLabel={<ScreenReaderContent>Saved feedback title input.</ScreenReaderContent>}
                    display="inline-block"
                    onChange={(e) => setTitleForSaving(e.target.value)}
                    size="small"
                    width="70%"
                />
                {saveButton}
                <br/><Text weight="light" side="small">
                AI generated content should be used with discretion after evaluation by a human,
                 as it may contain errors or inaccuracies.
            </Text>
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
                <Text size="medium">Error formatting feedback:</Text><br/>
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

export default FeedbackDisplay;
