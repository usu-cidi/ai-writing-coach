<?php

include "./openaiAPI.php";

function getFeedback($section, $input, $feedbackType, $assign) {

    //format into prompt
    switch ($section) {
        case "intro":
            $prompt = getIntroPrompt($input, $feedbackType, $assign);
    break;
        case "body":
            $prompt = getBodyPrompt($input, $feedbackType, $assign);
    break;
        case "conclusion":
            $prompt = getConclusionPrompt($input, $feedbackType, $assign);
    break;
        default:
            return "Error - invalid input";
    }

    //send request to OpenAI
    return requestCompletion($prompt, 400, .5);
}

function getIntroPrompt($writing, $feedbackType, $assign) {

    $prompt = "You are a writing coach. You will be provided with the introduction to a college-level argumentative
    research paper. This is just the introduction to the paper, not the whole essay- do not provide the feedback
    that the introduction should include excessive amounts of detail or evidence, like would be needed in the body
    paragraphs. ";
    if (str_contains($feedbackType, 'grammatical')) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    introduction,  grammatically, structurally, and argumentatively. Focus specifically on the strength of the
    student's argument and thesis statement. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."In addition to those at least 3 pieces of feedback, ";
    }
    if (str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
        introduction, based on the following assignment description: ".getCriteriaFromAssn($assign)." ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."This means you should provide at least 6 pieces of feedback total. ";
    }

    return $prompt."Do not generate any part of the actual writing, even to show as a good example.
    ".getResponseFormat()." Here is the introduction: " . $writing;
}

function getBodyPrompt($writing, $feedbackType, $assign) {
    $prompt = "You are a writing coach. You will be provided with the body paragraphs of a college-level argumentative
    research paper. ";
    if (str_contains($feedbackType, 'grammatical')) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve their
    writing,  grammatically, structurally, and argumentatively. Focus specifically on the strength of the
    student's argument and the evidence they use to back up their arguments. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Additionally, ";
    }
    if (str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
        body of the essay, based on the following assignment description: ".getCriteriaFromAssn($assign)." ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."This means you should provide at least 6 pieces of feedback total. ";
    }

    return $prompt."Do not generate any part of the actual
    writing, even to show as an example. ".getResponseFormat()." Here is the body of the paper: " . $writing;
}

function getConclusionPrompt($writing, $feedbackType, $assign) {
    $prompt = "You are a writing coach. You will be provided with the conclusion to a college-level argumentative
    research paper. This is just the conclusion to the paper, not the whole paper- do not provide the feedback
    that the conclusion should include excessive amounts of detail or evidence, like would be needed in the body
    paragraphs. ";
    if (str_contains($feedbackType, 'grammatical')) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    conclusion,  grammatically, structurally, and argumentatively. Focus specifically on the strength of the
    student's argument and their closing statements. ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Additionally, ";
    }
    if (str_contains($feedbackType, "standards")) {
        $prompt = $prompt."Provide specific feedback in which you detail at least 3 specific ways the student could improve the
        conclusion, based on the following assignment description: ".getCriteriaFromAssn($assign)." ";
    }
    if (str_contains($feedbackType, 'grammatical') && str_contains($feedbackType, "standards")) {
        $prompt = $prompt."This means you should provide at least 6 pieces of feedback total. ";
    }

    return $prompt."Do not generate any part of the actual writing, even to show as
    an example. ".getResponseFormat()." Here is the conclusion: " . $writing;
}

function getResponseFormat() {
    return 'Your response must be returned in valid JSON. Return your response in the following JSON format: {"feedback": ["your first piece of feedback", "your second piece of feedback", etc]}';
}

function getCriteriaFromAssn($assnName) {
    //sample
    return "Craft a personal narrative about a pivotal cultural experience, emphasizing descriptive language. Integrate historical context, societal influences, and self-reflection. Demonstrate critical analysis by evaluating the experience's significance in shaping your understanding of cultural complexities.";
}