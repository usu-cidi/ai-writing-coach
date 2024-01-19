import { feedbackActions } from "./feedback-slice";
import instance from "../axios";
import devInstance from "../dev-axios";


export const fetchSaved = () => {
    /*return async (dispatch) => {
        const fetchData = async () => {
            try {
                const response = await instance.get("?task=retrieveMyAnnotations");

                return response.data;
            } catch (error) {
                throw new Error("Could not fetch source data!");
            }
        };

        try {
            const annotations = await fetchData();

            dispatch(
                annotationActions.setAnnotation({
                    annotations: annotations || [],
                })
            );
        } catch (error) {
            dispatch(
                uiActions.setNotification({
                    status: "error",
                    title: "Error!",
                    message: "Fetching source failed!",
                })
            );
        }
    };*/
};
