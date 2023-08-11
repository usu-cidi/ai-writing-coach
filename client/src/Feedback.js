import {DEFAULT_FEEDBACK_MESSAGE} from "./constants";
import {Button, Heading, List, Spinner, Text, View} from "@instructure/ui";

function Feedback({feedbackIntro, feedbackBody, feedbackConclusion, saveToLocal}) {
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

                {feedbackIntro !== DEFAULT_FEEDBACK_MESSAGE ? (
                    <GeneratedFeedback title={"Introduction"} text={feedbackIntro}/>
                ) : console.log("no intro")}
                {feedbackBody ? (
                    <GeneratedFeedback title={"Body"} text={feedbackBody}/>
                ) : console.log("no body")}
                {feedbackConclusion ? (
                    <GeneratedFeedback title={"Conclusion"} text={feedbackConclusion}/>
                ) : console.log("no conclusion")}

                <Button margin="x-small" color="primary"
                        onClick={() => saveToLocal()}>Save</Button>

            </View>
        </>
    );
}

function GeneratedFeedback({title, text}) {
    console.log(title, text);
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
            <List as="ul" margin="0 0 x-small">{listItems}</List>
        </>
    );
}

export default Feedback;
