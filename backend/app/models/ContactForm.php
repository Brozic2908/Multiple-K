<?php

class ContactForm{
    private $conn;
    private $table = 'contact_form';
    //props
    private $id;
    private $name;
    private $email;
    private $phone_number;
    private $content;
    private $status;
    private $ip_address;
    

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getNumberOfSubmit($ip_address, $base_time){
        $query = 'select count(*) from ' . $this->table . ' where ip_address = :ip_address and created_at >= :created_at';
        $stmt = $this->conn->prepare($query);

        $this->ip_address = htmlspecialchars(strip_tags($ip_address));
        $stmt->bindParam(':ip_address', $this->ip_address, PDO::PARAM_STR);
        $stmt->bindParam(':created_at',  $base_time, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    public function create($name, $email, $phone_number, $content, $ip_address){
        $query = 'insert into ' . $this->table . ' (name, email, phone_number, content, ip_address) values (:name, :email, :phone_number, :content, :ip_address)';
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($name));
        $this->email = htmlspecialchars(strip_tags($email));
        $this->phone_number = htmlspecialchars(strip_tags($phone_number));
        $this->content = htmlspecialchars(strip_tags($content));
        $this->ip_address = htmlspecialchars(strip_tags($ip_address));

        $stmt->bindParam(':name', $this->name, PDO::PARAM_STR);
        $stmt->bindParam(':email', $this->email, PDO::PARAM_STR);
        $stmt->bindParam(':phone_number', $this->phone_number, PDO::PARAM_STR);
        $stmt->bindParam(':content', $this->content, PDO::PARAM_STR);
        $stmt->bindParam(':ip_address', $this->ip_address, PDO::PARAM_STR);

        if($stmt->execute()){
            return true;
        }
        
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    public function getAll(){
        $query = 'select * from ' . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getById($id){
        $query = 'select * from ' . $this->table . ' where id = :id';
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($id));
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function updateStatus($id, $status){
        $query = 'update ' . $this->table . ' set status = :status where id = :id';
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($id));
        $this->status = htmlspecialchars(strip_tags($status));
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);

        if($stmt->execute()){
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    public function remove($id){
        $query = 'delete from ' . $this->table . ' where id = :id';
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($id));
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        if($stmt->execute()){
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}

