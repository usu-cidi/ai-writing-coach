<?php

include 'db_connection.php';
include 'database_funcs.php';

include 'sample_text.php';

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


//send request to OpenAI

//send response back to client


CloseCon($conn);


