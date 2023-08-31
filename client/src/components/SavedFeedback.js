import {Heading, View, Button, List, Flex, Text} from "@instructure/ui";
import {LOADING_MESSAGE, SAVED_TITLE_MAX_LENGTH} from "../constants";
const { compare } = Intl.Collator('en-US');

function SavedFeedback({setIntroFeedback, setBodyFeedback, setConclusionFeedback,
                           setIntroText, setBodyText, setConclusionText, itemsArray, updateItemsArray,
                       feedbackIntro, feedbackBody, feedbackConclusion}) {

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

    function editTitle(item, title) {
        console.log("Editing title " + item.id);
        item.title = title;
        localStorage.setItem(JSON.stringify(item.id), JSON.stringify(item));
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
                    editTitle={editTitle}
                />
            </View>
        </>
    );
}

function SavedItems({itemsArray, handleDelete, handleButton, editTitle}) {

    function getTitle(item) {
        if (item.title) {
            return item.title;
        }
        if (item.intro) {
            if (item.intro.length <= SAVED_TITLE_MAX_LENGTH) {
                return item.intro;
            } else {
                return `${item.intro.substring(0, SAVED_TITLE_MAX_LENGTH)}...`;
            }
        }
        if (item.body) {
            if (item.body.length <= SAVED_TITLE_MAX_LENGTH) {
                return item.body;
            } else {
                return `${item.body.substring(0, SAVED_TITLE_MAX_LENGTH)}...`;
            }
        }
        if (item.con) {
            if (item.con.length <= SAVED_TITLE_MAX_LENGTH) {
                return item.con;
            } else {
                return `${item.con.substring(0, SAVED_TITLE_MAX_LENGTH)}...`;
            }
        }
        return "...";
    }

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
                    <Flex.Item padding="x-small" shouldShrink size="275px">
                        <Text>{getTitle(item)}&nbsp;&nbsp;&nbsp;</Text>
                        <Text weight="light">{`${new Date(item.id * 1000).toLocaleDateString("en-US")}`}</Text>
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
