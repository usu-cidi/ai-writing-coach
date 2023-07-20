<?php
    error_reporting(E_ALL);
    session_start();
    ini_set('display_errors', '1');


    class ClassTemplate
    {
        public $get;
        public $post;

        public function __construct()
        {
            $this->get = filter_input_array(INPUT_GET, FILTER_SANITIZE_STRING);
            $this->post = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

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

    }


    $slassTemplate = new ClassTemplate();

    $slassTemplate->init();
