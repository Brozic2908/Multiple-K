import React, { useEffect, useState } from "react";
import {
  Container,
  Accordion,
  Spinner,
  Badge
} from "react-bootstrap";
import { format } from "date-fns";

export default function HistoryCart() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost/web-hk242/backend/historycart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container className="py-5">
      <h3 className="text-black mb-4">🧾 Lịch sử đơn hàng của bạn</h3>

      {loading ? (
        <div className="text-center text-white">
          <Spinner animation="border" variant="light" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-white">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <Accordion defaultActiveKey="0" alwaysOpen>
          {orders.map((order, idx) => (
            <Accordion.Item
              eventKey={idx.toString()}
              key={order.id}
              className="mb-3 bg-dark text-white border border-secondary rounded"
            >
              <Accordion.Header>
                <div className="d-flex flex-column flex-md-row justify-content-between w-100">
                  <div>
                    <strong>🧾 Mã đơn: #{order.id}</strong> —{" "}
                    <span>Ngày: {format(new Date(order.order_at), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <Badge
                      bg={order.status === "completed" ? "success" : "warning"}
                      className="me-md-3 mt-2 mt-md-0"
                    >
                      {order.status === "completed" ? "Hoàn tất" : "Đang xử lý"}
                    </Badge>
                    <span className="ms-md-3 mt-2 mt-md-0">
                      <strong>Tổng tiền:</strong> {order.total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </Accordion.Header>

              <Accordion.Body className="bg-secondary text-white">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between py-2 border-bottom border-secondary"
                  >
                    <span>
                      🛍 {item.name} × {item.quantity}
                    </span>
                    <span>
                      {(item.price_at_order * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
}
