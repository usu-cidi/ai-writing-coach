const DEFAULT_FEEDBACK_MESSAGE = "Feedback will appear here.";
const SERVER_URL = "http://localhost/writing-coach/action.php?task=";
const FEEDBACK_URL = `${SERVER_URL}retrieveFeedback`;
const ASSIGNS_URL = `${SERVER_URL}getAssigns`;
const INPUT_TEXT_MAX_LENGTH = 6000;

export {DEFAULT_FEEDBACK_MESSAGE, FEEDBACK_URL, ASSIGNS_URL, INPUT_TEXT_MAX_LENGTH};