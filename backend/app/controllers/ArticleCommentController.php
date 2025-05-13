<?php
// app/controllers/ArticleCommentController.php

class ArticleCommentController
{
    private $db;
    private $comment;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->connect();
        $this->comment = new ArticleComment($this->db);
    }

    public function getByArticleId()
    {
        $articleId = isset($_GET['article_id']) ? $_GET['article_id'] : null;
        if (!$articleId) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing article_id']);
            return;
        }

        $stmt = $this->comment->getByArticleId($articleId);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['comments' => $comments]);
    }

    public function create()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (
            !isset($data['article_id']) || 
            !isset($data['user_name']) || 
            !isset($data['content']) ||
            empty(trim($data['content']))
        ) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            return;
        }

        if ($this->comment->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Comment created']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create comment']);
        }
    }

    public function delete()
    {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing comment ID']);
            return;
        }

        if ($this->comment->delete($id)) {
            echo json_encode(['message' => 'Comment deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete comment']);
        }
    }
}
