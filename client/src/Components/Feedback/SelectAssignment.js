import React, {useState} from "react";
import {
    Button,
    Select,
} from "@instructure/ui";
import {NO_ASSN_INDICATOR} from "../../constants";
import {useDispatch} from "react-redux";

function SelectAssignment({setSelectedAssn, selectedAssn, courseAssns}) {

    const [theSelected, setTheSelected] = useState(undefined);

    const dispatch = useDispatch();

    let theOptions = courseAssns.map((item) => ({id: item.id.toString(), label: item.name}));

    return (
        <>
            <SingleSelectExample
                options={theOptions}
                setTheSelected={setTheSelected}
            />
            <Button
                color="primary"
                margin="small"
                onClick={() => {dispatch(setSelectedAssn(theSelected))}}
            >Continue</Button>
            <Button
                color="secondary"
                margin="small"
                onClick={() => {dispatch(setSelectedAssn(NO_ASSN_INDICATOR))}}
            >Use without an assignment</Button>
        </>
    );
}

class SingleSelectExample extends React.Component {
    state = {
        inputValue: "Select an assignment",
        isShowingOptions: false,
        highlightedOptionId: null,
        selectedOptionId: this.props.options[0].id,
    }

    getOptionById (queryId) {
        return this.props.options.find(({ id }) => id === queryId)
    }

    handleShowOptions = (event) => {
        this.setState({
            isShowingOptions: true
        })
    }

    handleHideOptions = (event) => {
        const { selectedOptionId } = this.state
        const option = this.getOptionById(selectedOptionId).label
        this.setState({
            isShowingOptions: false,
            highlightedOptionId: null,
            inputValue: selectedOptionId ? option : '',
        })
    }

    handleBlur = (event) => {
        this.setState({
            highlightedOptionId: null
        })
    }

    handleHighlightOption = (event, { id }) => {
        event.persist()
        const option = this.getOptionById(id).label
        this.setState((state) => ({
            highlightedOptionId: id,
            inputValue: event.type === 'keydown' ? option : state.inputValue,
        }))
    }

    handleSelectOption = (event, { id }) => {
        const option = this.getOptionById(id).label
        this.setState({
            selectedOptionId: id,
            inputValue: option,
            isShowingOptions: false,
        })
        console.log(option);
        this.props.setTheSelected({id: id, name: option});
    }

    render () {
        const {
            inputValue,
            isShowingOptions,
            highlightedOptionId,
            selectedOptionId,
        } = this.state

        return (
            <div>
                <Select
                    renderLabel="Select your assignment"
                    assistiveText="Use arrow keys to navigate options."
                    inputValue={inputValue}
                    isShowingOptions={isShowingOptions}
                    onBlur={this.handleBlur}
                    onRequestShowOptions={this.handleShowOptions}
                    onRequestHideOptions={this.handleHideOptions}
                    onRequestHighlightOption={this.handleHighlightOption}
                    onRequestSelectOption={this.handleSelectOption}
                >
                    {this.props.options.map((option) => {
                        return (
                            <Select.Option
                                id={option.id}
                                key={option.id}
                                isHighlighted={option.id === highlightedOptionId}
                                isSelected={option.id === selectedOptionId}
                            >
                                { option.label }
                            </Select.Option>
                        )
                    })}
                </Select>
            </div>
        )
    }
}

export default SelectAssignment;
