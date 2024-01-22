import { feedbackActions } from "./feedback-slice";
import instance from "../axios";
import devInstance from "../dev-axios";


export const fetchAssns = (courseId) => {

    return async (dispatch) => {
        const fetchData = async () => {
            try {
                const response = await instance.get(`?task=listAssignments&courseID=${courseId}`);

                return response.data;
            } catch (error) {
                throw new Error(`Could not fetch source data: ${error}`);
            }
        };

        try {
            const assignments = await fetchData();
            console.log(assignments);

            dispatch( feedbackActions.setCourseAssns([
                {name: 'Assn 1'},
                {name: 'Assn 2'},
                {name: 'Assn 3'},
            ]) );

        } catch (error) {
            console.log(`Error getting course assignments: ${error}`);
        }
    };
};

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
};
