<?php
session_start();
class OrderController
{
    private $orderModel;
    private $orderItemModel;
    private $productModel;
    public function __construct()
    {
        $db = (new Database())->connect();
        $this->orderModel = new Order($db);
        $this->orderItemModel = new OrderItem($db);
    }
    
    public function buy()
    {   
        AuthMiddleware::verifyToken();
        if(!isset($_SERVER['HTTP_USER_ID'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }
        $data = json_decode(file_get_contents("php://input"), true);

        $user_id = $_SERVER['HTTP_USER_ID'];
        $order_id = $this->orderModel->createOrder($user_id);
        if (!$order_id) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create order']);
            return;
        }
        foreach($data as $item){
            $this->orderItemModel->createOrderItem($order_id, $item['id'], $item['quantity'], $item['price']);
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'order_id' => $order_id]);   
     }
    // View user's order history
    public function getOrderByUser()
    {
        AuthMiddleware::verifyToken();
        if(!isset($_SERVER['HTTP_USER_ID'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }
        $user_id = $_SERVER['HTTP_USER_ID'];
        $orders = $this->orderModel->getOrderByUser($user_id);
        if (!$orders) {
            http_response_code(404);
            echo json_encode(['message' => 'No orders found']);
            return;
        }

        echo json_encode(['success' => true, 'orders' => $orders]);

    }

    public function index(){
        $result = $this->orderModel->getAllOrder();
        $numRow = $result->rowCount();

        if($numRow > 0){
            $rows = [];
            while($row = $result->fetch(PDO::FETCH_ASSOC)){
                $rows[] = $row;
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $rows]);
        } else{
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    public function getOrderById(){
        $id = $_GET['id'] ?? null;
        $id = intval($id);

        $result = $this->orderModel->getOrderById($id);
        $numRow = $result->rowCount();

        if($numRow > 0) {
            $data = $result->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    public function update () {
        $data = json_decode(file_get_contents('php://input'));

        if ($this->orderModel->updateStatus($data->id, $data->status)){
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Update successfully"
            ]);      
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Update failed"
            ]); 
        }
    }

    public function getOrderItemOfOrderId(){
        $id = $_GET['id'] ?? null;
        $id = intval($id);

        $result = $this->orderItemModel->getOrderItemsByOrderId($id);
        $numRow = $result->rowCount();
        
        if ($numRow > 0){
            $rows = [];
            while($row = $result->fetch(PDO::FETCH_ASSOC)){
                $rows[] = $row;
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $rows]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }
   
}
?>