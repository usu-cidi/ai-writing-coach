<?php

include "./openaiAPI.php";

function getFeedback($section, $input, $feedbackType, $assignment) {

    $grammarPrompt = "Provide suggestions to correct the grammar, punctuation, and spelling of the passage. ";

    //format into prompt
    switch ($section) {
        case "intro":
            $prompt = getIntroPrompt($input, $feedbackType, $grammarPrompt, $assignment);
            break;
        case "body":
            $prompt = getBodyPrompt($input, $feedbackType, $grammarPrompt, $assignment);
            break;
        case "conclusion":
            $prompt = getConclusionPrompt($input, $feedbackType, $grammarPrompt, $assignment);
            break;
        default:
            return "Error - invalid input";
    }

    //send request to OpenAI
    return requestCompletion($prompt, 400, .3);
}

function getAssignmentPrompt($assn) {
    $id = $assn->id;

    //TODO: get the criteria input by the instructor from the admin tool for the assignment with the id $id

    $assnCriteria = "Focus on supporting your argument with evidence and appealing to ethos, logos, and pathos.";

    return 'Base your feedback on the following criteria from the instructor: '.$assnCriteria.' ';
}

function getIntroPrompt($writing, $feedbackType, $grammarPrompt, $assignment) {

    $prompt = "You are a college writing tutor. You will be provided with the introduction to a paper.
    Do not provide the feedback that the introduction should include evidence, as these are not body paragraphs. ";
    if (str_contains($feedbackType, 'standards')) {
        $prompt = $prompt."Provide specific feedback on how the student could improve
        their argument and structure. Focus specifically on the strength of the student's argument and thesis statement. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Additionally, ";
    }
    if (str_contains($feedbackType, "grammatical")) {
        $prompt = $prompt.$grammarPrompt;
    }
    if (str_contains($feedbackType, "assn")) {
        $assnPrompt = getAssignmentPrompt($assignment);
        $prompt = $prompt.$assnPrompt;
    }

    return $prompt."Do not rewrite the paper for the student as they will not learn that way.
    Remember that you provide advice and suggestions- use words like could or consider instead of
    should. ".getResponseFormat()." Do not use overly technical jargon. Here is the introduction: " . $writing;
}

function getBodyPrompt($writing, $feedbackType, $grammarPrompt, $assignment) {

    $prompt = "You are a college writing tutor. You will be provided with the body a paper. ";
    if (str_contains($feedbackType, 'standards')) {
        $prompt = $prompt."Provide specific feedback on how the student could improve their
    writing, structurally and argumentatively. Focus specifically on the strength and quality of the
    argument and the evidence they use to back up their arguments. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Additionally, ";
    }
    if (str_contains($feedbackType, "grammatical")) {
        $prompt = $prompt.$grammarPrompt;
    }
    if (str_contains($feedbackType, "assn")) {
        $assnPrompt = getAssignmentPrompt($assignment);
        $prompt = $prompt.$assnPrompt;
    }

    return $prompt."Do not rewrite the paper for the student as they will not learn that way.
    Remember that you provide advice and suggestions- use words like could or consider instead of
    should. ".getResponseFormat()." Do not use overly technical jargon. Here is the body of the paper: " . $writing;
}

function getConclusionPrompt($writing, $feedbackType, $grammarPrompt, $assignment) {

    $prompt = "You are a college writing tutor. You will be provided with the conclusion to a paper.
    Do not provide the feedback that the conclusion should include evidence, as these are not body paragraphs. ";
    if (str_contains($feedbackType, 'standards')) {
        $prompt = $prompt."Provide specific feedback on how the student could improve their
    writing, structurally and argumentatively. Focus specifically on the strength and quality of the
    student's argument and their closing statements. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Additionally, ";
    }
    if (str_contains($feedbackType, "grammatical")) {
        $prompt = $prompt.$grammarPrompt;
    }
    if (str_contains($feedbackType, "assn")) {
        $assnPrompt = getAssignmentPrompt($assignment);
        $prompt = $prompt.$assnPrompt;
    }

    return $prompt."Do not rewrite the paper for the student as they will not learn that way.
    Remember that you provide advice and suggestions- use words like could or consider instead of
    should. ".getResponseFormat()." Do not use overly technical jargon. Here is the conclusion: " . $writing;
}

function getResponseFormat() {
    return 'Your response must be returned in valid JSON. Return your response in the following JSON format: {"feedback": ["your first piece of feedback", "your second piece of feedback", "etc"]}';
}