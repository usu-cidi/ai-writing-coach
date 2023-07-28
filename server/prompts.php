<?php

function getIntroPrompt($writing, $feedbackType) {
    //TODO: apply feedback type, finish refining prompt
    return "You are a writing coach. You will be provided with the introduction to a college-level argumentative 
    research paper. This is just the introduction to the paper, not the whole essay- do not provide the feedback 
    that the introduction should include excessive amounts of detail or evidence, like would be needed in the body 
    paragraphs. Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    introduction,  grammatically, structurally, and argumentatively. Focus specifically on the strength of the
    student's argument and thesis statement. Do not generate any part of the actual writing, even as a good example.
    ".getResponseFormat()." Here is the introduction: " . $writing;
}

function getBodyPrompt($writing, $feedbackType) {
    //TODO: apply feedback type, work on prompt
    return "You are a writing coach. You will be provided with the body paragraphs of a college-level argumentative
    research paper. Provide specific feedback in which you detail at least 3 specific ways the student could improve their
    writing,  grammatically, structurally, and argumentatively. Focus specifically on the strength of the
    student's argument and the evidence they use to back up their arguments. Do not generate any part of the actual
    writing, even to show as an example. ".getResponseFormat()." Here is the body of the paper: " . $writing;
}

function getConclusionPrompt($writing, $feedbackType) {
    //TODO: apply feedback type, work on prompt
    return "You are a writing coach. You will be provided with the conclusion to a college-level argumentative
    research paper. This is just the conclusion to the paper, not the whole paper- do not provide the feedback
    that the conclusion should include excessive amounts of detail or evidence, like would be needed in the body
    paragraphs. Provide specific feedback in which you detail at least 3 specific ways the student could improve the
    conclusion,  grammatically, structurally, and argumentatively. Focus specifically on the strength of the
    student's argument and their closing statements. Do not generate any part of the actual writing, even to show as
    an example. ".getResponseFormat()." Here is the conclusion: " . $writing;
}

function getResponseFormat() {
    return 'Your response must be returned in valid JSON. Return your response in the following JSON format: {"feedback": ["your first piece of feedback", "your second piece of feedback", etc]}';
}
