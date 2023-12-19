import {Button} from "@instructure/ui";

function SaveSession({downloadSession}) {

    return (
        <>
            <Button
                color="secondary"
                margin="small"
                onClick={() => downloadSession()}
            >Download Session</Button>
        </>
    );
}

export default SaveSession;
