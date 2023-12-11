import {Text, Rating as CanvasRating} from "@instructure/ui";
import { Rating as ReactRating } from 'react-simple-star-rating'

/*<CanvasRating
                formatValueText={function (currentRating, maxRating) {
                    return currentRating + ' out of ' + maxRating
                }}
                label="Rate the quality of the AI-generated response"
                iconCount={5}
                valueNow={0}
                valueMax={5}
                size="small"
                onClick={(event) => handleRating(event)}
            />*/

function Rating() {

    /*function handleRating(event) {
        console.log(event.target);
    }*/

    const handleRating = (rate) => {
        //setRating(rate)
        // other logic
        console.log(rate);
    }

    const onPointerEnter = () => console.log('Enter')
    const onPointerLeave = () => console.log('Leave')
    const onPointerMove = (value, index) => console.log(value, index)

    return (
        <>
            <Text
                display="inline-block"
            >
                How would you rate this response?&nbsp;</Text>


            <ReactRating
                onClick={handleRating}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerMove={onPointerMove}
                /* Available Props */
            />

            <br/>

        </>
    );
}

export default Rating;
