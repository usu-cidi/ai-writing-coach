<?php

include "./openaiAPI.php";

function getFeedback($section, $input, $feedbackType) {

    //format into prompt
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
    return requestCompletion($prompt, 400, .5);
}

function getIntroPrompt($writing, $feedbackType) {

    $prompt = "You are a writing coach. You will be provided with the introduction to a college-level argumentative
    research paper. This is just the introduction to the paper, not the whole essay- do not provide the feedback
    that the introduction should include excessive amounts of detail or evidence, like would be needed in the body
    paragraphs. ";
    if (str_contains($feedbackType, 'standards')) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    introduction, structurally and argumentatively. Focus specifically on the strength and quality of the
    student's argument and thesis statement. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."In addition to those at least 3 pieces of feedback, ";
    }
    if (str_contains($feedbackType, "grammatical")) {
        $prompt = $prompt."Provide specific feedback in which you detail any specific ways the student could improve the
    introduction grammatically, including spelling, punctuation, and sentence structure. ";
    }

    return $prompt."Do not generate any part of the actual writing, even to show as a good example.
    ".getResponseFormat()." Here is the introduction: " . $writing;
}

function getBodyPrompt($writing, $feedbackType) {
    $prompt = "You are a writing coach. You will be provided with the body paragraphs of a college-level argumentative
    research paper. ";
    if (str_contains($feedbackType, 'standards')) {
        $prompt = $prompt."Provide specific feedback in which you detail any specific ways the student could improve their
    writing, structurally and argumentatively. Focus specifically on the strength and quality of the
    student's argument and the evidence they use to back up their arguments. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."In addition to those at least 3 pieces of feedback, ";
    }
    if (str_contains($feedbackType, "grammatical")) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    body of the essay grammatically, including spelling, punctuation, and sentence structure. ";
    }

    return $prompt."Do not generate any part of the actual
    writing, even to show as an example. ".getResponseFormat()." Here is the body of the paper: " . $writing;
}

function getConclusionPrompt($writing, $feedbackType) {
    $prompt = "You are a writing coach. You will be provided with the conclusion to a college-level argumentative
    research paper. This is just the conclusion to the paper, not the whole paper- do not provide the feedback
    that the conclusion should include excessive amounts of detail or evidence, like would be needed in the body
    paragraphs. ";
    if (str_contains($feedbackType, 'standards')) {
        $prompt = $prompt."Provide specific feedback in which you detail any specific ways the student could improve the
    conclusion, structurally and argumentatively. Focus specifically on the strength and quality of the
    student's argument and their closing statements. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."In addition to those at least 3 pieces of feedback, ";
    }
    if (str_contains($feedbackType, "grammatical")) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    conclusion grammatically, including spelling, punctuation, and sentence structure. ";
    }

    return $prompt."Do not generate any part of the actual writing, even to show as
    an example. Remember that you provide advice and suggestions- use words like could or consider instead of
    should. ".getResponseFormat()." Here is the conclusion: " . $writing;
}

function getResponseFormat() {
    return 'Your response must be returned in valid JSON. Return your response in the following JSON format: {"feedback": ["your first piece of feedback", "your second piece of feedback", etc]}';
}
