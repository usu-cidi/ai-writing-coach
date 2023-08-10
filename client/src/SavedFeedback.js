import {Heading, View, Button, List} from "@instructure/ui";

function SavedFeedback({setFeedback, setBodyFeedback, setConclusionFeedback,
                           setIntroText, setBodyText, setConclusionText}) {

    function updateStorage() {
        let itemsArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            itemsArray.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }

        if (itemsArray.length === 0) {
            return <List.Item key={"none"}>No saved feedback.</List.Item>;
        }

        return itemsArray.map((item) =>
            <List.Item
                key={item.id}>
                {`
            ${new Date(item.id * 1000).toLocaleDateString("en-US")} 
            ${new Date(item.id * 1000).toLocaleTimeString("en-US")}
             `}
                <Button
                    color="primary"
                    size="small"
                    margin="small"
                    id={item.id}
                    onClick={(e) => handleButton(e.currentTarget.id)}>Restore</Button>
                <Button
                    color="danger"
                    size="small"
                    margin="small"
                    id={item.id}
                    onClick={(e) => handleDelete(e.currentTarget.id)}>Remove</Button>
            </List.Item>);
    }

    let listItems = updateStorage();

    function handleButton(id) {
        const item = JSON.parse(localStorage.getItem(id));
        console.log(item);
        setIntroText(item.intro);
        setBodyText(item.body);
        setConclusionText(item.con);
        setFeedback(item.introFeedback);
        setBodyFeedback(item.bodyFeedback);
        setConclusionFeedback(item.conFeedback);
    }

    function handleDelete(id) {
        localStorage.removeItem(id);
        updateStorage();
        console.log(listItems);
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
                <List delimiter="solid" isUnstyled margin="small 0 0">{listItems}</List>

            </View>
        </>
    );
}

export default SavedFeedback;
