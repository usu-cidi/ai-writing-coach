import {Heading, Text, View} from "@instructure/ui";
import {DEFAULT_FEEDBACK_MESSAGE} from "./constants";

function SavedFeedback({setFeedback, setBodyFeedback, setConclusionFeedback,
                           setIntroText, setBodyText, setConclusionText}) {

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
                <Heading level="h2" margin="0 0 x-small">Saved Feedback</Heading>
                <Text size="medium" weight="light">{DEFAULT_FEEDBACK_MESSAGE}</Text>

            </View>
        </>
    );
}

export default SavedFeedback;
