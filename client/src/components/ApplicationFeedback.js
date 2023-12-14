import {Button, Text, Alert} from "@instructure/ui";
import {TICKET_LINK} from "../constants";

function ApplicationFeedback() {

    return (
        <>
            <Alert
                variant="info"
                renderCloseButtonLabel="Close"
                className="ticket"
                margin="medium">
                <Text>
                    Something not working right? Have general feedback?</Text><br/>
                <Button
                    color="secondary"
                    margin="small"
                    onClick={() => {window.open(
                        TICKET_LINK, "_blank");}}
                >Fill out a Ticket</Button>
            </Alert>
        </>
    );
}

export default ApplicationFeedback;
