<?php

class ContactEmail{
    private $conn;
    private $table = 'contact_email';

    #props
    private $id;
    private $email;
    
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getById($id){
        $query = 'select * from ' . $this->table . ' where id = :id';
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($id));
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt;
    }

    public function getAll(){
        $query = 'select * from ' . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }


    public function update($id, $email){
        $query = 'update ' . $this->table . ' set email = :email where id = :id';
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($id));
        $this->email = htmlspecialchars(strip_tags($email));

        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->bindParam(':email', $this->email, PDO::PARAM_STR);

        if($stmt->execute()){
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}