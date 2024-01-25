<?php

include "./backendFunctions.php";
include 'db_interaction.php';

error_reporting(E_ALL);
session_start();
ini_set('display_errors', '1');

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

class ClassTemplate
{
    public $get;
    public $post;

    public function __construct()
    {
        $this->get = filter_input_array(INPUT_GET, FILTER_UNSAFE_RAW);
        $this->post = filter_input_array(INPUT_POST, FILTER_UNSAFE_RAW);

        if (empty($this->post)) {
            $content = trim(file_get_contents('php://input'));
            $this->post = \json_decode($content, TRUE);
        }
    }

    public function init()
    {
        $this->sectionVariableSetUp();
        if (isset($this->get['task']) && method_exists($this, $this->get['task'])) {
            $this->{$this->get['task']}();
        }
        if (isset($this->post['task']) && method_exists($this, $this->post['task'])) {
            $this->{$this->post['task']}();
        }

    }

    public function sectionVariableSetUp()
    {

        if (isset( $_POST['custom_canvas_course_id'])){
            // var_dump($_POST);
            $_SESSION['courseID'] = $_POST['custom_canvas_course_id'];
            $_SESSION['userID'] = $_POST['custom_canvas_user_id'];
            $_SESSION['login_id'] = $_POST['custom_canvas_user_login_id'];
            $_SESSION['email_primary'] = $_POST['lis_person_contact_email_primary'];
            $_SESSION['name_given'] = $_POST['lis_person_name_given'];
            $_SESSION['user_image'] = $_POST['user_image'];
            $_SESSION['domain'] = $_POST['custom_canvas_api_domain'];
            $_SESSION['canvasURL'] = 'https://'.$_SESSION['domain'];
            $_SESSION['courseName'] = $_POST['context_title'];
            $_SESSION['role'] = $_POST['roles'];
            $_SESSION['roleName'] = $_POST['lis_person_name_full'];
            $_SESSION['tutorName'] = $_POST['lis_person_name_given'];

            $lti_secret = "------------lti secret----------------";

            $context = new BLTI($lti_secret, false, false);
            if ($context->valid) {
                $_SESSION['valid'] = true;
            } else {
                echo 'Page can only be accessed through Canvas';
                exit;
            }
        }
    }

    public function retrieveFromTable(){
        $result =  DB::query("SELECT * FROM  Table  ");
        print json_encode($result);
    }

    public function receivePost(): void {
        //accept request from client
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        $section = filter_var($data->section, FILTER_SANITIZE_STRING);
        $input = filter_var($data->input, FILTER_SANITIZE_STRING);
        $feedbackType = filter_var($data->feedbackType, FILTER_SANITIZE_STRING);
        $assignment = filter_var($data->assignment, FILTER_SANITIZE_STRING);

        //obtain response
        $result = getFeedback($section, $input, $feedbackType, $assignment);

        //send response back to client
        print json_encode($result);
    }

    public function getSavedEntries(): void {
        print getSavedEntries();
    }

    public function addSavedEntry(): void {
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        $inputData = [
            "id" => $data->id,
            "body" => $data->body,
            "body_feedback" => $data->bodyFeedback,
            "con" => $data->con,
            "con_feedback" => $data->conFeedback,
            "intro" => $data->intro,
            "intro_feedback" => $data->introFeedback,
            "title" => $data->title,
            "user_id" => $data->userId
        ];

        try {
            //add the entry
            addFeedbackRecord($inputData);
            //return the new list of entries
            print getSavedEntries();
        }
        catch(Exception $e) {
            //return the error $e
            print json_encode(array("error" => $e->getMessage()));
        }
    }

    public function deleteSavedEntry(): void {
        $json = file_get_contents('php://input');
        $data = json_decode($json);
        $idToRemove = $data->id;

        try {
            //remove $idToRemove
            deleteFeedbackRecord($idToRemove);
            //return the new list of entries
            print getSavedEntries();
        }
        catch(Exception $e) {
            //return the error $e
            print json_encode(array("error" => $e->getMessage()));
        }
    }

}

$classTemplate = new ClassTemplate();

$classTemplate->init();
