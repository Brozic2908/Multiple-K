# MK Laptop E-commerce Website

## Giới thiệu / Introduction

### Tiếng Việt

Dự án website thương mại điện tử MK Laptop là một nền tảng trực tuyến hiện đại dành cho việc bán laptop và phụ kiện máy tính. Website được xây dựng với giao diện người dùng thân thiện, tốc độ nhanh và các tính năng đầy đủ của một cửa hàng trực tuyến.

### English

The MK Laptop E-commerce Website project is a modern online platform for selling laptops and computer accessories. The website is built with a user-friendly interface, fast performance, and all the essential features of an online store.

## Cấu trúc dự án / Project Structure

```
web-hk242/
├── backend/               # PHP backend API
│   ├── app/               # Controllers, Models
│   ├── config/            # Database configuration
│   ├── core/              # Core framework components
│   ├── libs/              # Third-party libraries
│   ├── routes/            # API routing
│   ├── uploads/           # File uploads storage
│   ├── .htaccess          # Apache configuration
│   ├── index.php          # Entry point
│   └── mk_web.sql         # Database schema
│
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # Reusable components
│   │   ├── Context/       # React context providers
│   │   ├── layouts/       # Page layouts
│   │   ├── Mazer/         # Theme components
│   │   ├── services/      # API service connections
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Vite configuration
```

## Công nghệ sử dụng / Technologies Used

### Backend

- PHP
- MySQL
- JWT Authentication
- RESTful API

### Frontend

- React 19
- Vite
- Bootstrap 5
- React Router
- Axios
- React Context API
- FontAwesome
- Framer Motion

## Cài đặt và Chạy / Installation and Running

### Yêu cầu hệ thống / Requirements

- PHP 8.2+
- MySQL/MariaDB
- Node.js 18+
- XAMPP/WAMP/MAMP (hoặc môi trường tương tự)

### Backend Setup

```bash
# 1. Đặt thư mục backend vào htdocs trong XAMPP
# 2. Import cơ sở dữ liệu từ file mk_web.sql
# 3. Cấu hình kết nối DB trong /config/config.php
```

### Frontend Setup

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy ứng dụng ở môi trường development
npm run dev

# Build cho production
npm run build
```

## Tính năng / Features

- Đăng nhập/Đăng ký người dùng
- Xem và tìm kiếm sản phẩm
- Giỏ hàng và thanh toán
- Quản lý đơn hàng
- Blog/Tin tức
- Hệ thống Q&A
- Đánh giá sản phẩm
- Liên hệ và hỗ trợ

## Môi trường triển khai / Deployment

### Production

```bash
# Frontend
cd frontend
npm run build

# Backend
# Cấu hình XAMPP/Apache production
```

## Đóng góp / Contributing

Vui lòng gửi Pull Request để đóng góp vào dự án.

## Giấy phép / License

Dự án này được phân phối dưới giấy phép [MIT License](LICENSE).
