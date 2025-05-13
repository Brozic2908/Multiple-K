<?php

class ContactFormController{
    private $db;
    private $contactForm;

    public function __construct()
    {
        $this->db = new Database();
        $this->contactForm = new ContactForm($this->db->connect());
    }

    public function index(){
        $result = $this->contactForm->getAll();
        $numCount = $result->rowCount();

        if ($numCount > 0){
            $rows = [];

            while($row = $result->fetch(PDO::FETCH_ASSOC)){
                $rows[] = $row;
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $rows]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    public function show(){
        $id = $_GET['id'] ?? null;
        $id = intval($id);
        
        $result = $this->contactForm->getById($id);
        $numCount = $result->rowCount();

        if($numCount == 1){
            $data = $result->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    public function create(){
        $data = json_decode(file_get_contents("php://input"));
        $errors = $this->validateForm($data->name, $data->email, $data->phone_number);
        //validate data
        if(!empty($errors)){
            http_response_code(400);
            echo json_encode(["errors" => $errors]);
            return;
        }
        // limit send form
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $base_time = date('Y-m-d H:i:s', strtotime('-1 hour'));
        $count = $this->contactForm->getNumberOfSubmit($ip_address, $base_time);
        if ($count >= 1){
            http_response_code(429);
            echo json_encode([
                "errors" => "Bạn đã gửi quá nhiều lần trong 1 giờ. Vui lòng thử lại sau.",
                "time" => $base_time,
                "ip" => $ip_address]);
            return;
        }

        if($this->contactForm->create($data->name, $data->email, $data->phone_number, $data->content, $ip_address)){
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "send form successfully"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "send form fail"
            ]);
        }
    }

    public function update(){
        $data = json_decode(file_get_contents("php://input"));
        
        if($this->contactForm->updateStatus($data->id, $data->status)){
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Update successfully"
            ]);   
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Update failed"
            ]); 
        }
    }

    public function delete() {
        $id = $_GET['id'] ?? null;
        $id = intval($id);

        if($this->contactForm->remove($id)){
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "delete successfully"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "delete failed"
            ]); 
        }



    }

    public function validateForm($name, $email, $phone_number){
        $errors = [];
        if(!preg_match('/^[a-zA-ZÀ-ỹ\s]+$/u', $name)){
            $errors['name'] = 'Họ tên không hợp lệ';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email không hợp lệ';
        }
        if (!preg_match('/^\d{8,15}$/', $phone_number)) {
            $errors['phone'] = 'Số điện thoại không hợp lệ';
        }

        return $errors;
    }
}