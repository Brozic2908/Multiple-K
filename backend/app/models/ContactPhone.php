<?php 

class ContactPhone{
    private $conn;
    private $table = 'contact_phone';
    //props
    private $id;
    private $phone_number;
    
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

    public function update($id, $phone_number){
        $query = 'update ' . $this->table . ' set phone_number = :phone_number where id = :id';
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($id));
        $this->phone_number = htmlspecialchars(strip_tags($phone_number));

        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
        $stmt->bindParam(':phone_number', $this->phone_number, PDO::PARAM_STR);

        if($stmt->execute()){
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;  
    }
}