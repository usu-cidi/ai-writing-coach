<?php

function OpenCon() {
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "password";
    $db = "writing_coach";
    $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect
     failed: %s\n". $conn -> error);
    return $conn;
}

function CloseCon($conn) {
    $conn -> close();
}

?>