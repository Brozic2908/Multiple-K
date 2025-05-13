<?php
class OrderItem
{
    private $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function createOrderItem($order_id, $product_id, $quantity, $price_at_order)
    {
        $query = "INSERT INTO order_item (order_id, product_id, quantity,price_at_order) VALUES (:order_id, :product_id, :quantity,:price_at_order)";
        $stmt = $this->conn->prepare($query);
        if ($stmt->execute([':order_id' => $order_id, ':product_id' => $product_id, ':quantity' => $quantity, ':price_at_order' => $price_at_order])) {
            return true;
        }
        return false;
    }

    public function getOrderItemsByOrderId($order_id)
    {
        $query = "SELECT order_item.id, order_item.quantity, order_item.price_at_order, product.name FROM order_item INNER JOIN product ON order_item.product_id = product.id WHERE order_id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':order_id' => $order_id]);
        return $stmt;
    }
}
?>