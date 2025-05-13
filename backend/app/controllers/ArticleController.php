<?php
// app/controllers/ArticleController.php

class ArticleController
{
    private $db;
    private $article;

    public function __construct()
    {
        $this->db = (new Database())->connect();
        $this->article = new Article($this->db);
    }

    public function index()
    {
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 9;
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $offset = ($page - 1) * $limit;

        $result = $this->article->getAll($limit, $offset, $search);
        $total = $this->article->getTotalCount($search);
        $articles = $result->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'articles' => $articles,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_items' => $total
            ]
        ]);
    }

    public function show()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing article ID']);
            return;
        }

        $stmt = $this->article->getById($id);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Article not found']);
            return;
        }

        $article = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(['article' => $article]);
    }

    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (
            !$data ||
            empty($data['title']) ||
            empty($data['description']) ||
            empty($data['content']) ||
            empty($data['image_url'])
        ) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            return;
        }

        if ($this->article->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Article created successfully', 'article' => $data]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create article']);
        }
    }


    public function delete()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing article ID']);
            return;
        }

        if ($this->article->delete($id)) {
            echo json_encode(['message' => 'Article deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete article']);
        }
    }

    public function update()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing article ID']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            !$data ||
            empty($data['title']) ||
            empty($data['description']) ||
            empty($data['content']) ||
            empty($data['image_url'])
        ) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            return;
        }

        $success = $this->article->update($id, $data);

        if ($success) {
            echo json_encode(['message' => 'Article updated successfully', 'article' => $data]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update article']);
        }
    }

}