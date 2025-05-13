<?php
// app/models/Question.php

class Question
{
    private $conn;
    private $table = 'questions';

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function getAll($limit = 10, $offset = 0, $search = '')
    {
        $query = "
            SELECT q.id, q.title, q.content, q.created_at, q.status, q.email,
                COUNT(a.id) as answer_count,
                u.first_name as user_name
            FROM " . $this->table . " q
            LEFT JOIN answers a ON q.id = a.question_id
            LEFT JOIN users u ON q.user_id = u.id
            WHERE q.status = 'approved'
        ";

        if (!empty($search)) {
            $search = '%' . htmlspecialchars(strip_tags($search)) . '%';
            $query .= " AND (q.title LIKE :search OR q.content LIKE :search)";
        }

        $query .= "
            GROUP BY q.id
            ORDER BY q.created_at DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        if (!empty($search)) {
            $stmt->bindParam(':search', $search);
        }

        $stmt->execute();

        return $stmt;
    }

    public function getAllForAdmin($limit = 10, $offset = 0, $search = '', $status = '')
    {

        $query = "
            SELECT q.id, q.title, q.content, q.email, q.created_at, q.status,
                COUNT(a.id) as answer_count,
                u.first_name as user_name
            FROM " . $this->table . " q
            LEFT JOIN answers a ON q.id = a.question_id
            LEFT JOIN users u ON q.user_id = u.id
            WHERE 1=1
        ";

        if (!empty($status)) {
            $query .= 'AND q.status = :status';
        }

        if (!empty($search)) {
            $search = '%' . htmlspecialchars(strip_tags($search)) . '%';
            $query .= " AND (q.title LIKE :search OR q.content LIKE :search)";
        }

        $query .= "
            GROUP BY q.id
            ORDER BY q.created_at DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

        if (!empty($status)) {
            $stmt->bindParam(':status', $status);
        }

        if (!empty($search)) {
            $stmt->bindParam(':search', $search);
        }

        $stmt->execute();

        return $stmt;
    }

    public function getById($id)
    {
        $query = "
            SELECT 
                q.id, 
                q.title, 
                q.content, 
                q.email,
                q.user_id,
                q.created_at, 
                q.status,
                u.first_name as user_name
            FROM " . $this->table . " q
            LEFT JOIN users u ON q.user_id = u.id
            WHERE q.id = :id
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt;
    }

    public function create($data)
    {
        $query = "INSERT INTO " . $this->table . "
            (user_id, title, content, email, status)
            VALUES 
            (:user_id, :title, :content, :email, :status) 
        ";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $data['title'] = htmlspecialchars(strip_tags($data['title']));
        $data['content'] = htmlspecialchars(strip_tags($data['content']));
        $data['email'] = htmlspecialchars(strip_tags($data['email']));
        $status = isset($data['status']) ? $data['status'] : 'pending';

        // Bind values
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':content', $data['content']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }

        return false;
    }

    public function update($id, $data)
    {
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            if (in_array($key, ['title', 'content', 'status'])) {
                $fields[] = $key . " = :" . $key;
                $values[':' . $key] = htmlspecialchars(strip_tags($value));
            }
        }

        if (empty($fields)) {
            return false;
        }

        $query = "UPDATE " . $this->table . " SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $id);

        foreach ($values as $key => $value) {
            $stmt->bindParam($key, $value);
        }

        return $stmt->execute();
    }

    public function delete($id)
    {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        return $stmt->execute();
    }

    public function getTotalCount($search = '', $status = 'approved')
    {
        $query = "SELECT COUNT(*) as total FROM " . $this->table . " WHERE status = :status";

        if (!empty($search)) {
            $search = '%' . htmlspecialchars(strip_tags($search)) . '%';
            $query .= " AND (title LIKE :search OR content LIKE :search)";
        }

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);

        if (!empty($search)) {
            $stmt->bindParam(':search', $search);
        }

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total'];
    }

    public function getTotalCountForAdmin($search = '', $status = '')
    {
        $query = "SELECT COUNT(*) as total FROM " . $this->table . " WHERE 1=1";

        if (!empty($status)) {
            $query .= " AND status = :status";
        }

        if (!empty($search)) {
            $search = '%' . htmlspecialchars(strip_tags($search)) . '%';
            $query .= " AND (title LIKE :search OR content LIKE :search)";
        }

        $stmt = $this->conn->prepare($query);

        if (!empty($status)) {
            $stmt->bindParam(':status', $status);
        }

        if (!empty($search)) {
            $stmt->bindParam(':search', $search);
        }

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total'];
    }
}
