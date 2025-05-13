<?php
class Order{
    private $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }
    public function createOrder($user_id)
    {
        $query = "INSERT INTO orders (user_id) VALUES (:user_id)";
        $stmt = $this->conn->prepare($query);
        if($stmt->execute([':user_id' => $user_id]))
        {
            return $this->conn->lastInsertId();
        }
        return false;
    }
    public function getOrderByUser($user_id)
    {
        $sql = "SELECT * FROM orders WHERE user_id = :user_id ORDER BY order_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($orders as &$order) {
            $orderItems = $this->getOrderItems($order['id']);
            $order['items'] = $orderItems;
            $order['total'] = array_reduce($orderItems, function($carry, $item) {
                return $carry + ($item['price_at_order'] * $item['quantity']);
            }, 0);
        }

        return $orders;
    }
    private function getOrderItems($orderId) {
        $sql = "SELECT oi.quantity, oi.price_at_order, p.name 
                FROM order_item oi 
                JOIN product p ON oi.product_id = p.id 
                WHERE oi.order_id  = :order_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['order_id' => $orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllOrder(){
        $query = 'SELECT orders.*,users.first_name, users.last_name, users.email, sum(order_item.price_at_order * order_item.quantity) as totalPrice from orders inner JOIN order_item on order_item.order_id = orders.id INNER JOIN users ON users.id = orders.user_id GROUP BY orders.id';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getOrderById($id){
        $query = 'select orders.*, users.first_name, users.last_name, users.email, users.region from orders inner join users on users.id = orders.user_id where orders.id = :id';
        $stmt = $this->conn->prepare($query);

        $id = htmlspecialchars(strip_tags($id));
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    } 

    public function updateStatus($id, $status){
        $query = 'update orders set status = :status where id = :id';
        $stmt = $this->conn->prepare($query);
        
        $id = htmlspecialchars(strip_tags($id));
        $status = htmlspecialchars(strip_tags($status));

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);

        if($stmt->execute()){
            return true;
        }

        printf("Error: %s.\n", $stmt->errorInfo()[2]);
        return false;
    }
}
?>