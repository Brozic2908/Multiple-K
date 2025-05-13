<?php
class Product
{
    private $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    public function createProduct($data, $colors = [], $tags = [], $images = [])
    {
        $this->conn->beginTransaction();
        try {
            foreach ($data as $key => $value) {
                $data[$key] = $this->sanitize($value);
            }

            // Sanitize array color, tag
            $colors = array_map([$this, 'sanitize'], $colors);
            $tags = array_map([$this, 'sanitize'], $tags);
            $images = array_map([$this, 'sanitize'], $images);

            $query = "INSERT INTO product 
            (name,brand,price,stock,published,cpu,storage,ram,pin,graphic_card,os,screen_size,weight)
            VALUES(:name,:brand,:price,:stock,:published,:cpu,:storage,:ram,:pin,:graphic_card,:os,:screen_size,:weight)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':name' => $data['name'],
                ':brand' => $data['brand'],
                ':price' => $data['price'],
                ':stock' => $data['stock'],
                ':published' => $data['published'],
                ':cpu' => $data['cpu'],
                ':storage' => $data['storage'],
                ':ram' => $data['ram'],
                ':pin' => $data['pin'],
                ':graphic_card' => $data['graphic_card'],
                ':os' => $data['os'],
                ':screen_size' => $data['screen_size'],
                ':weight' => $data['weight'],
            ]);
            $product_id = $this->conn->lastInsertId();
            foreach ($colors as $color) {
                $stmtColor = $this->conn->prepare("INSERT INTO product_color (product_id,color_name)
                VALUES(:product_id, :color_name)");
                $stmtColor->execute([':product_id' => $product_id, ':color_name' => $color]);
            }
            foreach ($tags as $tag) {
                $stmtTag = $this->conn->prepare("INSERT INTO product_tag (product_id,tag_name)
                VALUES(:product_id,:tag_name)");
                $stmtTag->execute([':product_id' => $product_id, ':tag_name' => $tag]);
            }
            foreach ($images as $img_path) {
                $stmtImage = $this->conn->prepare("INSERT INTO product_path (product_id, img_path) VALUES (:product_id, :img_path)");
                $stmtImage->execute([
                    ':product_id' => $product_id,
                    ':img_path' => $img_path
                ]);
            }
            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }
    private function sanitize($value)
    {
        $value = trim($value);
        $value = strip_tags($value);
        $value = htmlspecialchars($value);
        return $value;
    }
    public function getTotalProducts()
    {
        $query = "SELECT COUNT(*) as total FROM product";
        $stmt = $this->conn->query($query);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'] ?? 0;
    }

    public function getProductList($sort, $page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;
        $query = "SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.img_path) AS images,
        GROUP_CONCAT(DISTINCT pt.tag_name) AS tags,
        GROUP_CONCAT(DISTINCT pc.color_name) AS colors
        FROM product p
        LEFT JOIN product_color pc ON p.id=pc.product_id
        LEFT JOIN product_tag pt ON p.id=pt.product_id
        LEFT JOIN product_path pi ON p.id=pi.product_id
        GROUP BY p.id
        ORDER BY p.$sort DESC
        LIMIT :limit OFFSET :offset
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$product) {
            if (!empty($product['images'])) {
                $paths = explode(',', $product['images']); // Tách chuỗi ảnh thành mảng

                $product['images'] = array_map(function ($path) {
                    $path = trim($path);

                    // Tách phần cuối của URL để lấy filename
                    $filename = basename($path);  // lấy img_xxx.png
                    $fullPath = __DIR__ . '/../../uploads/img/' . $filename;

                    if (file_exists($fullPath)) {
                        $mime = mime_content_type($fullPath);
                        $data = base64_encode(file_get_contents($fullPath));
                        return [
                            'name' => $filename,
                            'base64' => "data:$mime;base64,$data"
                        ];
                    }

                    return null; // Nếu ảnh không tồn tại
                }, $paths);

                // Xoá phần tử null nếu có
                $product['images'] = array_filter($product['images']);
            } else {
                $product['images'] = [];
            }

            $product['colors'] = $product['colors'] ? explode(',', $product['colors']) : [];
            $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
        }
        return $products;
    }
    public function updateProduct($product_id, $data, $colors = [], $tags = [], $images = [])
    {
        $this->conn->beginTransaction(); // Bắt đầu transaction để đảm bảo an toàn

        try {
            foreach ($data as $key => $value) {
                $data[$key] = $this->sanitize($value);
            }
            $colors = array_map([$this, 'sanitize'], $colors);
            $tags = array_map([$this, 'sanitize'], $tags);
            $images = array_map([$this, 'sanitize'], $images);
            // foreach ($data as $key => $value) {
            //     $data[$key] = is_array($value) ? array_map([$this, 'sanitize'], $value) : $this->sanitize($value);
            // }

            // $colors = $data['colors'] ?? [];
            // $tags = $data['tags'] ?? [];
            // $images = $data['images'] ?? [];

            // Update stock và price
            $query = "UPDATE product 
                      SET stock = :stock, price = :price 
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':stock' => (int)$data['stock'],
                ':price' => (float)$data['price'],
                ':id' => (int)$product_id
            ]);

            // Xóa tất cả màu cũ
            $stmtDeleteColor = $this->conn->prepare("DELETE FROM product_color WHERE product_id = :id");
            $stmtDeleteColor->execute([':id' => (int)$product_id]);

            // Xóa tất cả tag cũ
            $stmtDeleteTag = $this->conn->prepare("DELETE FROM product_tag WHERE product_id = :id");
            $stmtDeleteTag->execute([':id' => (int)$product_id]);

            // Xóa tất cả ảnh cũ
            $stmtDeleteImage = $this->conn->prepare("DELETE FROM product_path WHERE product_id = :id");
            $stmtDeleteImage->execute([':id' => (int)$product_id]);

            // Thêm lại color mới
            foreach ($colors as $color) {
                $stmtColor = $this->conn->prepare("INSERT INTO product_color (product_id, color_name) VALUES (:product_id, :color_name)");
                $stmtColor->execute([
                    ':product_id' => (int)$product_id,
                    ':color_name' => $color
                ]);
            }

            // Thêm lại tag mới
            foreach ($tags as $tag) {
                $stmtTag = $this->conn->prepare("INSERT INTO product_tag (product_id, tag_name) VALUES (:product_id, :tag_name)");
                $stmtTag->execute([
                    ':product_id' => (int)$product_id,
                    ':tag_name' => $tag
                ]);
            }

            // Thêm lại images mới
            foreach ($images as $image_path) {
                $stmtImage = $this->conn->prepare("INSERT INTO product_path (product_id, img_path) VALUES (:product_id, :img_path)");
                $stmtImage->execute([
                    ':product_id' => (int)$product_id,
                    ':img_path' => $image_path
                ]);
            }

            $this->conn->commit(); // Nếu mọi thứ OK thì commit
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack(); // Nếu có lỗi thì rollback
            return false;
        }
    }
    public function deleteProduct($product_id)
    {
        $this->conn->beginTransaction();
        try {
            $product_id = (int)$product_id;
            $query = "DELETE FROM product WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':id' => $product_id]);
            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }
    public function getDistinct()
    {
        try {
            // brand
            $stmtbrand = $this->conn->prepare("SELECT DISTINCT brand FROM product");
            $stmtbrand->execute();
            $brands = $stmtbrand->fetchAll(PDO::FETCH_COLUMN, 0);

            // cpu
            $stmtcpu = $this->conn->prepare("SELECT DISTINCT cpu FROM product");
            $stmtcpu->execute();
            $cpus = $stmtcpu->fetchAll(PDO::FETCH_COLUMN, 0);

            // storage
            $stmtstorage = $this->conn->prepare("SELECT DISTINCT storage FROM product");
            $stmtstorage->execute();
            $storages = $stmtstorage->fetchAll(PDO::FETCH_COLUMN, 0);

            // ram
            $stmtram = $this->conn->prepare("SELECT DISTINCT ram FROM product");
            $stmtram->execute();
            $rams = $stmtram->fetchAll(PDO::FETCH_COLUMN, 0);

            // graphic_card
            $stmtgraphic_card = $this->conn->prepare("SELECT DISTINCT graphic_card FROM product");
            $stmtgraphic_card->execute();
            $graphic_cards = $stmtgraphic_card->fetchAll(PDO::FETCH_COLUMN, 0);

            // os
            $stmtos = $this->conn->prepare("SELECT DISTINCT os FROM product");
            $stmtos->execute();
            $oss = $stmtos->fetchAll(PDO::FETCH_COLUMN, 0);

            // pin
            $stmtpin = $this->conn->prepare("SELECT DISTINCT pin FROM product");
            $stmtpin->execute();
            $pins = $stmtpin->fetchAll(PDO::FETCH_COLUMN, 0);

            // screen_size
            $stmtscreen = $this->conn->prepare("SELECT DISTINCT screen_size FROM product");
            $stmtscreen->execute();
            $screen_sizes = $stmtscreen->fetchAll(PDO::FETCH_COLUMN, 0);
            //name
            // Trả kết quả JSON
            return [
                'brands' => $brands,
                'cpus' => $cpus,
                'storages' => $storages,
                'rams' => $rams,
                'graphic_cards' => $graphic_cards,
                'oss' => $oss,
                'pins' => $pins,
                'screen_sizes' => $screen_sizes
            ];
        } catch (PDOException $e) {
            // Trả lỗi JSON nếu có lỗi DB
            error_log("❌ Lỗi getDistinct: " . $e->getMessage());
            return false;
        }
    }
    public function getAllProducts()
    {
        $query = "SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.img_path) AS images,
        GROUP_CONCAT(DISTINCT pt.tag_name) AS tags,
        GROUP_CONCAT(DISTINCT pc.color_name) AS colors
        FROM product p
        LEFT JOIN product_color pc ON p.id=pc.product_id
        LEFT JOIN product_tag pt ON p.id=pt.product_id
        LEFT JOIN product_path pi ON p.id=pi.product_id
        GROUP BY p.id
        ORDER BY p.id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$product) {
            if (!empty($product['images'])) {
                $paths = explode(',', $product['images']); // Tách chuỗi ảnh thành mảng

                $product['images'] = array_map(function ($path) {
                    $path = trim($path);

                    // Tách phần cuối của URL để lấy filename
                    $filename = basename($path);  // lấy img_xxx.png
                    $fullPath = __DIR__ . '/../../uploads/img/' . $filename;

                    if (file_exists($fullPath)) {
                        $mime = mime_content_type($fullPath);
                        $data = base64_encode(file_get_contents($fullPath));
                        return "data:$mime;base64,$data";
                    }

                    return null; // Nếu ảnh không tồn tại
                }, $paths);

                // Xoá phần tử null nếu có
                $product['images'] = array_filter($product['images']);
            } else {
                $product['images'] = [];
            }

            $product['colors'] = $product['colors'] ? explode(',', $product['colors']) : [];
            $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
        }
        return $products;
    }
    public function getProductById($id)
    {
        $query = "SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.img_path) AS images,
        GROUP_CONCAT(DISTINCT pt.tag_name) AS tags,
        GROUP_CONCAT(DISTINCT pc.color_name) AS colors
        FROM product p
        LEFT JOIN product_color pc ON p.id=pc.product_id
        LEFT JOIN product_tag pt ON p.id=pt.product_id
        LEFT JOIN product_path pi ON p.id=pi.product_id
        WHERE p.id = :id
        GROUP BY p.id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':id' => (int)$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($product) {
            if (!empty($product['images'])) {
                $paths = explode(',', $product['images']); // Tách chuỗi ảnh thành mảng

                $product['images'] = array_map(function ($path) {
                    $path = trim($path);

                    // Tách phần cuối của URL để lấy filename
                    $filename = basename($path);  // lấy img_xxx.png
                    $fullPath = __DIR__ . '/../../uploads/img/' . $filename;

                    if (file_exists($fullPath)) {
                        $mime = mime_content_type($fullPath);
                        $data = base64_encode(file_get_contents($fullPath));
                        return [
                            'name' => $filename,
                            'base64' => "data:$mime;base64,$data"
                        ];
                    }

                    return null; // Nếu ảnh không tồn tại
                }, $paths);

                // Xoá phần tử null nếu có
                $product['images'] = array_filter($product['images']);
            } else {
                $product['images'] = [];
            }

            $product['colors'] = $product['colors'] ? explode(',', $product['colors']) : [];
            $product['tags'] = $product['tags'] ? explode(',', $product['tags']) : [];
            return $product;
        }
        return null;
    }
}
