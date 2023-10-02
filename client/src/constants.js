const DEFAULT_FEEDBACK_MESSAGE = "Feedback will appear here.";
//const SERVER_URL = "http://localhost/writing-coach/action.php";
const SERVER_URL = "https://elearn.usu.edu/ludovic/writing-coach/public/action.php";
const FEEDBACK_URL = `${SERVER_URL}?task=retrieveFeedback`;
const INPUT_TEXT_MAX_LENGTH = 6000;
const LOADING_MESSAGE = "Loading...";
const SAVED_TITLE_MAX_LENGTH = 20;

export {DEFAULT_FEEDBACK_MESSAGE, FEEDBACK_URL, INPUT_TEXT_MAX_LENGTH, LOADING_MESSAGE, SAVED_TITLE_MAX_LENGTH};