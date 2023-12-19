import {Text, Heading} from "@instructure/ui";

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

    let section = "";
    if (data.section === "intro") {
        section = "Introduction";
    } else if (data.section === "body") {
        section = "Body";
    } else {
        section = "Conclusion";
    }

    return (
        <>
            <Heading level="h2" as="h1" margin="0 0 x-small">{section} - {date.toLocaleDateString()} {date.toLocaleTimeString()}</Heading>
            <Text size="medium" weight="bold">Submitted Draft:</Text><br/>
            <Text size="medium">&nbsp;&nbsp;&nbsp;{data.input}</Text><br/>
            <Text size="medium" weight="bold">Requested Feedback Type:</Text><br/>
            <Text size="medium">&nbsp;&nbsp;&nbsp;{JSON.stringify(data.feedbackType)}</Text><br/>
            <Text size="medium" weight="bold">Generated Feedback:</Text><br/>
            <Text size="medium">&nbsp;&nbsp;&nbsp;{data.feedback}</Text><br/><br/>
        </>
    );
}

export default Transcript;
