<?php

//include 'db_connection.php';

/*$conn = OpenCon();
echo "Connected successfully<br>";*/

//Add to database
/*$data = [
    "Name" => "Liv",
    "UserID" => "2",
    "Address" => "Argentina",
];
echo addRecord($conn, "Customer", $data);*/

//Delete from database
/*$identifier = [
    "key" => "UserID",
    "value" => "3",
];
echo deleteRecord($conn, "Customer", $identifier);*/

//Edit record in database
/*$data = [
    "Address" => "Here",
];
$identifier = [
    "key" => "UserID",
    "value" => "0",
];
echo updateRecord($conn, "Customer", $data, $identifier);*/

//Read from database
/*$fields = ["Name", "UserID", "Address"];
readDatabase($conn, "Customer", $fields);

CloseCon($conn);*/

function readDatabase($conn, $tableName, $fields) {

    $theFields = "";
    foreach($fields as $field) {
        $theFields = $theFields . $field . ", ";
    }

    $sql = "SELECT " . substr($theFields, 0, -2) . " FROM " . $tableName;
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $header = "<table><tr>";
        foreach($fields as $field) {
            $header = $header . "<th>" . $field . "</th> ";
        }
        $header = $header . "</tr>";

        // output data of each row
        $allData = "";
        while($row = $result->fetch_assoc()) {
            $info = "<tr>";
            foreach($fields as $field) {
                $info = $info . "<td>" . $row[$field] . "</td> ";
            }
            $info = $info . "</tr>";
            $allData = $allData . $info;
        }
        return $header . $allData . "</table><br>";
    } else {
        return "0 results<br>";
    }
}

function updateRecord($conn, $tableName, $data, $identifier) {

    $newData = "";
    foreach($data as $key => $val) {
        $newData = $newData . $key . " = '" . $val . "' ";
    }

    $sqlQuery = "UPDATE " . $tableName . " SET " . $newData . " " . " 
WHERE " . $identifier["key"] . "=" . $identifier["value"] . ";";

    if ($conn->query($sqlQuery) === TRUE) {
        return "Record updated successfully<br>";
    } else {
        return "Error: " . $sqlQuery . "<br>" . $conn->error;
    }
}

function deleteRecord($conn, $tableName, $identifier) {
    $sqlQuery = "DELETE FROM " . $tableName . " WHERE " .
        $identifier["key"] . "=" . $identifier["value"] . ";";
    if ($conn->query($sqlQuery) === TRUE) {
        return "Record deleted successfully<br>";
    } else {
        return "Error: " . $sqlQuery . "<br>" . $conn->error;
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
        return "Record inserted successfully<br>";
    } else {
        return "Error: " . $sqlQuery . "<br>" . $conn->error;
    }
}

?>

