import {Text, Heading, List} from "@instructure/ui";

function Transcript({transcript}) {

    //className="hidden"
    return (
        <>
            <div>
                <Heading level="h1" as="h2" margin="0 0 x-small">Writing Coach Session Summary</Heading><br/>
                {transcript.map((object, i) => <Event data={object} key={i} />)}
            </div>
        </>
    );
}

function Event({data}) {

    const date = new Date(data.time);

    let section = data.section;
    if (data.section === "intro") {
        section = "Introduction";
    } else if (data.section === "body") {
        section = "Body";
    } else if (data.section === "conclusion") {
        section = "Conclusion";
    }

    let feedbackType = "";
    if (data.feedbackType.includes("standards")) {
        feedbackType += "General Best Practices";
    }
    if (data.feedbackType.length > 1) {
        feedbackType += ", ";
    }
    if (data.feedbackType.includes("grammatical")) {
        feedbackType += "Grammatical";
    }


    return (
        <>
            <Heading level="h2" as="h1" margin="0 0 x-small">{section} - {date.toLocaleDateString()} {date.toLocaleTimeString()}</Heading>
            <Text size="medium" weight="bold">Submitted Draft:</Text><br/>
            <Text size="medium">&nbsp;&nbsp;&nbsp;{data.input}</Text><br/><br/>
            <Text size="medium" weight="bold">Requested Feedback Type:</Text><br/>
            <Text size="medium">&nbsp;&nbsp;&nbsp;{feedbackType}</Text><br/><br/>
            <Text size="medium" weight="bold">Generated Feedback:</Text><br/>
            <FeedbackSection feedback={data.feedback}/><br/><br/>
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
                <Text size="medium">&nbsp;&nbsp;&nbsp;Error formatting feedback:</Text><br/>
                <Text size="medium">&nbsp;&nbsp;&nbsp;{feedback}</Text>
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

export default Transcript;
