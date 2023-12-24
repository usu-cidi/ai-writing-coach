import {Button} from "@instructure/ui";

function SaveSession({downloadSession}) {

    return (
        <>
            <Button
                color="secondary"
                margin="small"
                onClick={() => downloadSession()}
                id="downloadButton"
                href="#"
            >Download Session Summary</Button>
        </>
    );
}

export default SaveSession;
