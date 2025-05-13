<?php

class ContactEmailController{
    private $db;
    private $contactEmail;
    
    public function __construct()
    {
        $this->db = new Database();
        $this->contactEmail = new ContactEmail($this->db->connect());
    }

    public function index(){
        $result = $this->contactEmail->getAll();
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
        
        $result = $this->contactEmail->getById($id);
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


    public function update(){
        $data = json_decode(file_get_contents('php://input'));

        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)){
            http_response_code(400);
            echo json_encode(["message" => "Email is invalid"]);
            return;
        }

        if ($this->contactEmail->update($data->id, $data->email)){
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

    
}