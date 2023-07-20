<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once "meekrodb.2.3.class.php";
require_once __DIR__.'/ims-blti/blti.php';
require_once __DIR__.'/canvasAPI.php';
require_once __DIR__.'/action.php';

$_SESSION['tool_url'] = 'https://usu.instructure.com';

// Database connection information for Template Wizard
DB::$host ='----------------------------';
DB::$user = '-------------------';
DB::$password = '-------------------------------';
DB::$dbName = '---------------------------';


?>

