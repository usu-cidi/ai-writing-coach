<?php

include 'db_connection.php';
include 'database_funcs.php';
include 'sampleText.php';
include 'prompts.php';

require __DIR__ . '/vendor/autoload.php';

$conn = OpenCon();

$fields = ["Name", "UserID", "Address"];
echo readDatabase($conn, "Customer", $fields);

//accept request from client

//  data: introduction, body, conclusion, feedback type
$introInput = getShortIntro();
$bodyInput = getShortBody();
$conclusionInput = getShortConclusion();
$feedbackType = "grammatical";

//format into prompt
$introPrompt = getIntroPrompt($introInput, $feedbackType);
$bodyPrompt = getBodyPrompt($bodyInput, $feedbackType);
$conclusionPrompt = getConclusionPrompt($conclusionInput, $feedbackType);

//send request to OpenAI
$yourApiKey = "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";
$client = OpenAI::client($yourApiKey);

$resultIntro = $client->completions()->create([
    'model' => 'text-davinci-003',
    'prompt' => $introPrompt,
    'max_tokens' => 200,
    'temperature' => 0
]);
echo $resultIntro['choices'][0]['text'] . "<br><br>";

$resultBody = $client->completions()->create([
    'model' => 'text-davinci-003',
    'prompt' => $bodyPrompt,
    'max_tokens' => 200,
    'temperature' => 0
]);
echo $resultBody['choices'][0]['text'] . "<br><br>";

$resultConclusion = $client->completions()->create([
    'model' => 'text-davinci-003',
    'prompt' => $conclusionPrompt,
    'max_tokens' => 200,
    'temperature' => 0
]);
echo $resultConclusion['choices'][0]['text'] . "<br><br>";

//send response back to client


CloseCon($conn);


