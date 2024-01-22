import { feedbackActions } from "./feedback-slice";
import instance from "../axios";
import devInstance from "../dev-axios";

export const fetchSaved = (userId, filterSavedItemsByUser) => {

    return async (dispatch) => {
        const fetchData = async () => {
            try {
                const response = await devInstance.get("?task=getSavedEntries");

                return response.data;
            } catch (error) {
                throw new Error("Could not fetch source data!");
            }
        };

        try {
            const saved = await fetchData();

            if (saved.message === "0 results") {
                dispatch( feedbackActions.setAllSaved([]) );
            } else {
                dispatch( feedbackActions.setAllSaved( filterSavedItemsByUser(saved, userId) ) );
            }

        } catch (error) {
            console.log(`Error getting saved feedback: ${error}`);
        }

};

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
