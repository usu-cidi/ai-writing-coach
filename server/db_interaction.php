<?php

include 'db_connection.php';

const TABLE_NAME = "wc_feedback";

//Add to database
function addFeedbackRecord($data): string {
    $conn = OpenCon();
    $result = addRecord($conn, TABLE_NAME, $data);
    CloseCon($conn);
    return $result;
}

function deleteFeedbackRecord($id): string {
    $conn = OpenCon();
    $identifier = [
        "key" => "id",
        "value" => $id,
    ];
    $result = deleteRecord($conn, TABLE_NAME, $identifier);
    CloseCon($conn);
    return $result;
}

function getSavedEntries(): string|bool {
    $conn = OpenCon();
    $fields = ["id", "body", "body_feedback", "con", "con_feedback", "intro", "intro_feedback"];
    $result = readDatabase($conn, TABLE_NAME, $fields);
    CloseCon($conn);
    return $result;
}


//Edit record in database
/*$data = [
    "Address" => "Here",
];
$identifier = [
    "key" => "UserID",
    "value" => "0",
];
echo updateRecord($conn, "Customer", $data, $identifier);*/


function readDatabase($conn, $tableName, $fields) {

    $theFields = "";
    foreach($fields as $field) {
        $theFields = $theFields . $field . ", ";
    }

    $sql = "SELECT " . substr($theFields, 0, -2) . " FROM " . $tableName;
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array(); // Initialize an empty array

        // Loop through each row of the result
        while ($row = $result->fetch_assoc()) {
            $rowData = array();
            foreach ($fields as $field) {
                $rowData[$field] = $row[$field]; // Add each field to the rowData array
            }
            $data[] = $rowData; // Add the rowData to the main data array
        }

        return json_encode($data); // Convert the data array to JSON and output it
    } else {
        return json_encode(array("message" => "0 results")); // Return a JSON object indicating no results
    }
}

function updateRecord($conn, $tableName, $data, $identifier) {

    $newData = "";
    foreach($data as $key => $val) {
        $newData = $newData . $key . " = '" . $val . "' ";
    }

    $sqlQuery = "UPDATE " . $tableName . " SET " . $newData . " " . " WHERE " . $identifier["key"] . "=" . $identifier["value"] . ";";

    if ($conn->query($sqlQuery) === TRUE) {
        return "Record updated successfully";
    } else {
        return "Error: " . $sqlQuery . " " . $conn->error;
    }
}

function deleteRecord($conn, $tableName, $identifier) {
    $sqlQuery = "DELETE FROM " . $tableName . " WHERE " .
        $identifier["key"] . "=" . $identifier["value"] . ";";
    if ($conn->query($sqlQuery) === TRUE) {
        return "Record deleted successfully";
    } else {
        return "Error: " . $sqlQuery . " " . $conn->error;
    }
}

function addRecord($conn, $tableName, $data) {

    $keys = "";
    $vals = "";
    foreach($data as $key => $val) {
        $keys = $keys . $key . ", ";
        $vals = $vals . "\"" . $val . "\", ";
    }

    $sqlQuery = "INSERT INTO " . $tableName .
        " (" . substr($keys, 0, -2) . ") values (" . substr($vals, 0, -2) . ");";
    if ($conn->query($sqlQuery) === TRUE) {
        return "Record inserted successfully";
    } else {
        return "Error: " . $sqlQuery . " " . $conn->error;
    }
}

?>