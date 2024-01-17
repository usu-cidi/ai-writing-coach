import { useRef } from 'react';
import {
    Button,
    ToggleGroup
} from "@instructure/ui";
import generatePDF from 'react-to-pdf';


function SaveSession({transcript}) {

    const targetRef = useRef();

    async function downloadIt() {
        await generatePDF(targetRef, {filename: 'feedback-session-summary.pdf'});
    }

    const aNumber = sessionStorage.getItem(`login_id`);

    return (
        <>
            <ToggleGroup
                summary="View and Download Session Summary"
                toggleLabel="Shows session summary and download button."
            >

                <Button
                    color="secondary"
                    margin="small"
                    onClick={() => downloadIt()}
                >Download Session Summary</Button>

                <div id="toDownload" ref={targetRef} style={{'paddingLeft': '20px'}}>
                    <p>{ aNumber }</p>
                    <h1>Writing Coach Session Summary</h1>
                    {transcript.map((object, i) => <SubmissionEvent data={object} key={i} />)}
                </div>

                <p style={{padding: '20px'}}>To submit your work, click the Download Session summary button and upload the pdf to the relevant assignment on Canvas.</p>
            </ToggleGroup>
        </>
    );
}

function SubmissionEvent({data}) {

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
            <h2>{section} - {date.toLocaleDateString()} {date.toLocaleTimeString()}</h2>
            <p style={{fontWeight: "bold"}}>Submitted Draft:</p>
            <p>&nbsp;&nbsp;&nbsp;{data.input}</p>
            <p style={{fontWeight: "bold"}}>Requested Feedback Type:</p>
            <p>&nbsp;&nbsp;&nbsp;{feedbackType}</p>
            <p style={{fontWeight: "bold"}}>Generated Feedback:</p>
            <FeedbackSection feedback={data.feedback}/>
        </>
    );
}

function FeedbackSection({feedback}) {
    try {
        feedback = JSON.parse(feedback).feedback;
    } catch(err) {
        return (
            <>
                <p>&nbsp;&nbsp;&nbsp;Error formatting feedback:</p>
                <p>&nbsp;&nbsp;&nbsp;{feedback}</p>
            </>
        );
    }

    const listItems = feedback.map((text) => <li key={text}>{text}</li>);

    return (
        <>
            <ul>{listItems}</ul>
        </>
    );
}

export default SaveSession;
