<?php
// app/models/Article.php

class Article
{
    private $conn;
    private $table = 'articles';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll($limit = 10, $offset = 0, $search = '')
    {
        $query = "SELECT * FROM {$this->table} WHERE title LIKE :search ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);

        $search = '%' . $search . '%';
        $stmt->bindParam(':search', $search);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt;
    }

    public function getTotalCount($search = '')
    {
        $query = "SELECT COUNT(*) as total FROM {$this->table} WHERE title LIKE :search";
        $stmt = $this->conn->prepare($query);

        $search = '%' . $search . '%';
        $stmt->bindParam(':search', $search);

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public function getById($id)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt;
    }


    public function create($data)
    {
        $query = "INSERT INTO articles (title, description, content, image_url) VALUES (:title, :description, :content, :image_url)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':content', $data['content']);
        $stmt->bindParam(':image_url', $data['image_url']);
        return $stmt->execute();
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function update($id, $data)
    {
        $query = "UPDATE articles 
                SET title = :title, description = :description, content = :content, image_url = :image_url 
                WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':content', $data['content']);
        $stmt->bindParam(':image_url', $data['image_url']);
        return $stmt->execute();
    }

}