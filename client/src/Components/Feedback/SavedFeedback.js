import {
    Heading,
    View,
    Button,
    List,
    Flex,
    Text
} from "@instructure/ui";
import instance from "../../axios";
import devInstance from "../../dev-axios";
import { LOADING_MESSAGE, SAVED_TITLE_MAX_LENGTH } from "../../constants";
import { useDispatch } from "react-redux";

const { compare } = Intl.Collator('en-US');


function SavedFeedback({setIntroFeedback, setBodyFeedback, setConclusionFeedback,
                           setIntroText, setBodyText, setConclusionText, itemsArray, updateItemsArray,
                       feedbackIntro, feedbackBody, feedbackConclusion}) {

    const dispatch = useDispatch();

    function handleButton(id) {
        if (feedbackIntro === LOADING_MESSAGE || feedbackBody === LOADING_MESSAGE || feedbackConclusion === LOADING_MESSAGE) {
            alert("Please wait until current feedback is loaded to restore a saved draft.");
            return;
        }

        const item = itemsArray.find(obj => {
            return obj.id === id;
        });

        dispatch(setIntroText(item.intro));
        dispatch(setBodyText(item.body));
        dispatch(setConclusionText(item.con));
        dispatch(setIntroFeedback(reformatFeedbackText(item.intro_feedback)));
        dispatch(setBodyFeedback(reformatFeedbackText(item.body_feedback)));
        dispatch(setConclusionFeedback(reformatFeedbackText(item.con_feedback)));
    }

    function reformatFeedbackText(original) {
        if (original) {
            return original.replaceAll('&quot;', '"').replaceAll('&#039;', "'");
        }

        return "";
    }

    function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete your saved feedback?")) {
            return devInstance.post('?task=deleteSavedEntry', JSON.stringify({id: id}))
                .then(response => {
                    return response.data;
                })
                .then(resp => {
                    return updateItemsArray(resp);
                })
                .catch(err => {
                    console.log(`Error saving to database: ${err}`);
                });
        }
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
                <Heading level="h3" margin="0 0 x-small">Saved</Heading>
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

        if (itemsArray.length === 0 || itemsArray.message === "0 results") {
            return <List.Item key={"none"}><Text size="medium" weight="light">No saved feedback.</Text></List.Item>;
        }

        let sortedArray = itemsArray.slice();
        sortedArray.sort((a, b) => compare(a.id, b.id));

        return sortedArray.reverse().map((item) =>
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
