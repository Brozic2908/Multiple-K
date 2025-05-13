<?php

class ContactPhoneController{
    private $db;
    private $contactPhone;
    
    public function __construct()
    {
        $db = new Database();
        $this->db = $db->connect();
        $this->contactPhone = new ContactPhone($this->db);
    }

    public function index(){
        $result = $this->contactPhone->getAll();
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
        
        $result = $this->contactPhone->getById($id);
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

        if (strlen($data->phone_number) < 10 || strlen($data->phone_number) > 11){
            http_response_code(400);
            echo json_encode(["message" => "Hotline is invalid"]);
            return;
        }

        if ($this->contactPhone->update($data->id, $data->phone_number)){
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