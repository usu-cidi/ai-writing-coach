<?php

include "./prompts.php";
include "./openaiAPI.php";

function getFeedback($section, $input, $feedbackType) {
    //format into prompt
    $prompt = "";
    switch ($section) {
        case "intro":
            $prompt = getIntroPrompt($input, $feedbackType);
    break;
        case "body":
            $prompt = getBodyPrompt($input, $feedbackType);
    break;
        case "conclusion":
            $prompt = getConclusionPrompt($input, $feedbackType);
    break;
        default:
            return "Error - invalid input";
    }

    //send request to OpenAI
    return requestCompletion($prompt, 200, .8);
}