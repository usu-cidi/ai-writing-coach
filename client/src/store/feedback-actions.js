import { feedbackActions } from "./feedback-slice";
import instance from "../axios";
import instance1 from "../dev-axios";
import {NO_ASSN_INDICATOR} from "../constants";


export const fetchAssns = (courseId) => {

    return async (dispatch) => {
        const fetchData = async () => {
            try {
                const response = await instance.get(`?task=retrieveAssignments&courseID=${courseId}`);

                return response.data;
            } catch (error) {
                throw new Error(`Could not fetch source data: ${error}`);
            }
        };

        try {
            const assignments = await fetchData();

            console.log(assignments);

            let testOptions = assignments.map((item) => ({id: item.id.toString(), label: item.name}));

            dispatch( feedbackActions.setCourseAssns(assignments) );

            if (assignments.length === 0) {
                dispatch(feedbackActions.setSelectedAssn(NO_ASSN_INDICATOR));
            }

        } catch (error) {
            console.log(`Error getting course assignments: ${error}`);
            dispatch( feedbackActions.setCourseAssns([]) );
            dispatch(feedbackActions.setSelectedAssn(NO_ASSN_INDICATOR));
        }
    };
};

export const fetchSaved = (userId, filterSavedItemsByUser) => {

    return async (dispatch) => {
        const fetchData = async () => {
            try {
                const response = await instance1.get("?task=getSavedEntries");

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
