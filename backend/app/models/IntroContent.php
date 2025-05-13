<?php
// app/models/IntroContent.php
class IntroContent
{
    private $conn;
    private $table = 'intro_content';

    // Properties
    public $id;
    public $section_key;
    public $title;
    public $content;
    public $image_path;
    public $updated_at;
    public $updated_by;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        try {
            $query = "SELECT * FROM " . $this->table;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function getByKey($key)
    {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE section_key = :section_key';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':section_key', $key, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt;
    }

    // Update intro content
    public function update()
    {
        $query = 'UPDATE ' . $this->table . ' SET
            title = :title,
            content = :content,
            updated_by = :updated_by
        WHERE section_key = :section_key';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->section_key = htmlspecialchars(strip_tags($this->section_key));

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':section_key', $this->section_key);
        $stmt->bindParam(':updated_by', $this->updated_by);

        if ($stmt->execute()) {
            return true;
        }
        // Print error if something goes wrong
        printf('Error: %s\n', $stmt->error);
        return false;
    }


    // Update image
    public function updateImage()
    {
        $query = 'UPDATE ' . $this->table . ' SET 
            image_path = :image_path,
            updated_by = :updated_by
            WHERE section_key = :section_key';

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->image_path = htmlspecialchars(strip_tags($this->image_path));
        $this->section_key = htmlspecialchars(strip_tags($this->section_key));

        // Bind data
        $stmt->bindParam(':image_path', $this->image_path);
        $stmt->bindParam(':section_key', $this->section_key);
        $stmt->bindParam(':updated_by', $this->updated_by);

        // Execute query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        $errorInfo = $stmt->errorInfo();
        printf('Error: %s\n', $errorInfo[2]);
        return false;
    }
}
