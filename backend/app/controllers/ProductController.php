<?php
class ProductController
{
    private $db;
    private $product;
    public function __construct()
    {
        $database = new Database();
        $this->db = $database->connect();
        $this->product = new Product($this->db);
    }
    // Lấy tất cả sản phẩm (products)
    public function getAll()
    {
        $products = $this->product->getAllProducts();
        if ($products) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $products,
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'No products found'
            ]);
        }
    }
    public function getLimitOffset_Sort()
    {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $sort = $_GET['sort'] ?? 'published';
        $allowedSortFields = ['id', 'name', 'price', 'published'];
        if (!in_array($sort, $allowedSortFields)) {
            $sort = 'published';
        }
        $products = $this->product->getProductList($sort,$page, $limit);
        $total = $this->product->getTotalProducts();
        if ($products) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $products,
                'total' => $total,
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'No products found'
            ]);
        }
    }
    public function create()
    {
        if(!AuthMiddleware::handle()) return;
        $input = json_decode(file_get_contents("php://input"), true);
        if(!$input || !isset($input['product']))
        {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing product data'
            ]);
            return;
        }
        $data = $input['product'];
        $colors = isset($input['colors']) ? $input['colors'] : [];
        $tags = isset($input['tags']) ? $input['tags'] : [];
        $images = isset($input['images']) ? $input['images'] : [];
        if($this->product->createProduct($data,$colors,$tags,$images))
        {
            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Product created successfully'
            ]);
        }
        else
        {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create product'
            ]);
        }
    }
    // Cập nhật sản phẩm (chỉ admin)
    public function update()
    {
        if (!AuthMiddleware::handle()) return;

        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input || !isset($input['id']) || !isset($input['product'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing product ID or data']);
            return;
        }

        $productId = $input['id'];
        $data = $input['product'];
        $colors = $input['colors'] ?? [];
        $tags = $input['tags'] ?? [];
        $images = $input['images'] ?? [];

        if ($this->product->updateProduct($productId, $data, $colors, $tags, $images)) {
            echo json_encode(['message' => 'Product updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update product']);
        }
    }
    // Xóa sản phẩm (chỉ admin)
    public function delete()
    {
        if (!AuthMiddleware::handle()) return;
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Product ID is required']);
            return;
        }
        if ($this->product->deleteProduct($id)) {
            echo json_encode(['message' => 'Product deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete product']);
        }
    }
    public function getDistinct()
    {
        $distinct = $this->product->getDistinct();
        if ($distinct) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $distinct,
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'No products found.'
            ]);
        }
    }
    public function getById()
    {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Product ID is required']);
            return;
        }
        $product = $this->product->getProductById($id);
        if ($product) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $product,
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Product not found'
            ]);
        }
    }

}
?>