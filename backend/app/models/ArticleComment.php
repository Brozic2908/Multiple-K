<?php
// app/models/ArticleComment.php

class ArticleComment {
    private $conn;
    private $table = "article_comments";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByArticleId($articleId) {
        $query = "SELECT * FROM {$this->table} WHERE article_id = :article_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':article_id', $articleId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} (article_id, user_name, content) VALUES (:article_id, :user_name, :content)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':article_id', $data['article_id']);
        $stmt->bindParam(':user_name', $data['user_name']);
        $stmt->bindParam(':content', $data['content']);

        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
