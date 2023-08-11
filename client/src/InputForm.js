import {Button, Checkbox, CheckboxGroup, SimpleSelect, Text, TextArea, View} from "@instructure/ui";
import {INPUT_TEXT_MAX_LENGTH} from "./constants";

function InputForm({introText, bodyText, setFeedbackType, errorMessage,
                       conclusionText, handleChange, handleButton, buttonText, setAssign, allAssigns}) {

    const assignOptions = allAssigns.map((text) => <SimpleSelect.Option
        id={text}
        value={text}
        key={text}
    >{text}</SimpleSelect.Option>);

    let handleSelect = (e, { id, value }) => {
        setAssign(value);
    }

    return (
        <>
            <form>
                <InputSection sectionType="Introduction" text={introText} handleChange={handleChange} />
                <InputSection sectionType="Body" text={bodyText} handleChange={handleChange} />
                <InputSection sectionType="Conclusion" text={conclusionText} handleChange={handleChange} />

                <View display="block" margin="small 0 0">

                    <CheckboxGroup name="sports" size="small"
                                   layout="columns"
                                   onChange={function (value) {
                                       setFeedbackType(value);
                                   }}
                                   description="Select type(s) of feedback to receive:"
                    >
                        <Checkbox label="Assignment Specific" value="standards" />
                        <Checkbox label="General Best Practices" value="grammatical" />
                    </CheckboxGroup><br/>

                    <SimpleSelect
                        renderLabel="Assignment"
                        onChange={handleSelect}
                    >
                        <SimpleSelect.Option id="blank" value={" "} key="blank">{" "}</SimpleSelect.Option>
                        {assignOptions}
                    </SimpleSelect>

                    <Button margin="small" color="primary"
                            onClick={() => handleButton()}>{buttonText}</Button>
                </View>
            </form>
            <Text color="danger" weight="bold">{errorMessage}</Text>
        </>
    );
}

function InputSection({sectionType, text, handleChange}) {

    return (
        <>
            <View display="block" margin="small 0 0">
                <TextArea maxLength={INPUT_TEXT_MAX_LENGTH}
                          label={sectionType}
                          placeholder={`Paste your ${sectionType.toLowerCase()} paragraph(s) here`}
                          onChange={(e) => handleChange(sectionType, e.target.value)}
                          value={text}
                />
                <Text
                    color="secondary"
                    weight="light"
                    size="x-small"
                >{text.length} / {INPUT_TEXT_MAX_LENGTH} characters</Text>
            </View>
        </>
    );
}

export default InputForm;
