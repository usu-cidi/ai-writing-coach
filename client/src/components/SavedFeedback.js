import {Heading, View, Button, List, Flex} from "@instructure/ui";
import {LOADING_MESSAGE} from "../constants";
const { compare } = Intl.Collator('en-US');

function SavedFeedback({setIntroFeedback, setBodyFeedback, setConclusionFeedback,
                           setIntroText, setBodyText, setConclusionText, itemsArray, updateItemsArray,
                       feedbackIntro, feedbackBody, feedbackConclusion}) {

    let message = "";

    function handleButton(id) {
        if (feedbackIntro === LOADING_MESSAGE || feedbackBody === LOADING_MESSAGE || feedbackConclusion === LOADING_MESSAGE) {
            alert("Please wait until current feedback is loaded to restore a saved draft.");
            return;
        }

        const item = JSON.parse(localStorage.getItem(id));
        setIntroText(item.intro);
        setBodyText(item.body);
        setConclusionText(item.con);
        setIntroFeedback(item.introFeedback);
        setBodyFeedback(item.bodyFeedback);
        setConclusionFeedback(item.conFeedback);
    }

    function handleDelete(id) {
        localStorage.removeItem(id);
        updateItemsArray();
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
                <Heading level="h2" margin="0 0 x-small">Saved</Heading>
                <SavedItems
                    itemsArray={itemsArray}
                    handleDelete={handleDelete}
                    handleButton={handleButton}
                />

            </View>
        </>
    );
}

function SavedItems({itemsArray, handleDelete, handleButton}) {

    function formatItems(itemsArray) {
        if (itemsArray.length === 0) {
            return <List.Item key={"none"}>No saved feedback.</List.Item>;
        }

        let sortedArray = itemsArray.slice();
        sortedArray.sort((a, b) => compare(a.id, b.id));

        return sortedArray.map((item) =>
            <List.Item
                key={item.id}>
                <Flex >
                    <Flex.Item padding="x-small" shouldShrink size="200px">
                        {`${new Date(item.id * 1000).toLocaleDateString("en-US")} 
                        ${new Date(item.id * 1000).toLocaleTimeString("en-US")}`}
                    </Flex.Item>
                    <Flex.Item padding="x-small">
                        <Button
                            color="primary"
                            size="small"
                            withBackground={false}
                            id={item.id}
                            onClick={(e) => handleButton(e.currentTarget.id)}>Restore</Button>
                    </Flex.Item>
                    <Flex.Item padding="x-small">
                        <Button
                            color="danger"
                            size="small"
                            withBackground={false}
                            id={item.id}
                            onClick={(e) => handleDelete(e.currentTarget.id)}>Remove</Button>
                    </Flex.Item>

                </Flex>
            </List.Item>);
    }

    let listItems = formatItems(itemsArray);

    return (
        <>
            <List delimiter="solid" isUnstyled margin="small 0 0">{listItems}</List>
        </>
    );
}

export default SavedFeedback;
