import {
    Button,
    Checkbox,
    CheckboxGroup,
    Text,
    TextArea,
    View
} from "@instructure/ui";
import { INPUT_TEXT_MAX_LENGTH } from "../../constants";
import { useDispatch } from "react-redux";


function InputForm({introText, bodyText, setFeedbackType, errorMessage, conclusionText,
                       handleChange, handleButton, buttonText, handleReset, feedbackType}) {

    const dispatch = useDispatch();

    return (
        <>
            <form>
                <InputSection sectionType="Introduction" text={introText} handleChange={handleChange}/>
                <InputSection sectionType="Body" text={bodyText} handleChange={handleChange}/>
                <InputSection sectionType="Conclusion" text={conclusionText} handleChange={handleChange}/>

                <View display="block" margin="small 0 0">

                    <CheckboxGroup name="sports" size="small"
                                   layout="columns"
                                   onChange={function (value) {
                                       dispatch(setFeedbackType(value));
                                   }}
                                   description="Select type(s) of feedback to receive:"
                    >
                        <Checkbox label="Assignment Specific" value="assn"/>
                        <Checkbox label="General Best Practices" value="standards"/>
                        <Checkbox label="Grammatical" value="grammatical"/>
                    </CheckboxGroup><br/>

                    <Button margin="small" color="primary"
                            onClick={() => handleButton()}>{buttonText}</Button>
                    <Button margin="small" color="secondary"
                            onClick={() => handleReset()}>Clear</Button>
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
