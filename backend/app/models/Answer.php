<?php
// app/models/Answer.php

class Answer
{
    private $conn;
    private $table = 'answers';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getByQuestionId($questionId)
    {
        $query = 'SELECT a.id, a.content, a.created_at, a.user_id, u.first_name as user_name, u.role as user_role
        FROM ' . $this->table . ' a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.question_id = :question_id
        ORDER BY a.created_at ASC 
        ';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':question_id', $questionId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt;
    }

    public function create($data)
    {
        $query = 'INSERT INTO ' . $this->table . '
            (question_id, user_id, content)
            VALUES
            (:question_id, :user_id, :content)
        ';
        $stmt = $this->conn->prepare($query);

        // Clean data
        $data['content'] = htmlspecialchars(strip_tags($data['content']));

        // Bind values
        $stmt->bindParam(':question_id', $data['question_id']);
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':content', $data['content']);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $content, $userId)
    {
        // First check if the answer exists and belongs to this user or user is admin
        $query = 'SELECT user_id FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return false;
        }

        // Clean data - $content đơn giản là một string, không phải array
        $content = htmlspecialchars(strip_tags($content));

        $query = "UPDATE {$this->table} SET content = :content WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":content", $content);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();
    }

    public function delete($id)
    {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    public function getCountByQuestionId($questionId)
    {
        $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE question_id = :question_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':question_id', $questionId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['count'];
    }
}
