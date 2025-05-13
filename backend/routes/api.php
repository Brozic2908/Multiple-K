<?php
// routes/api.php: Define routes
// Auth routes
$router->addRoute('POST', '/auth/register', 'AuthController', 'register');
$router->addRoute('POST', '/auth/login', 'AuthController', 'login');


// Intro routes
$router->addRoute('GET', '/intro', 'IntroContentController', 'index');
$router->addRoute('GET', '/intro/:key', 'IntroContentController', 'show');

// Intro routes for admin
$router->addRoute('PUT', '/admin/intro', 'IntroContentController', 'update', 'AuthMiddleware');
$router->addRoute('POST', '/admin/intro/image', 'IntroContentController', 'uploadImage', 'AuthMiddleware');

// Question routes for public
$router->addRoute('GET', '/questions', 'QuestionController', 'index');
$router->addRoute('GET', '/admin/questions', 'QuestionController', 'adminIndex', 'AuthMiddleware'); // Chỉ Admin
$router->addRoute('GET', '/questions/:id', 'QuestionController', 'show');
$router->addRoute('GET', '/admin/questions/:id', 'QuestionController', 'showAdmin', 'AuthMiddleware');
$router->addRoute('POST', '/questions', 'QuestionController', 'create');
$router->addRoute('PUT', '/admin/questions/:id', 'QuestionController', 'update', "AuthMiddleware"); // Chỉ Admin
$router->addRoute('DELETE', '/admin/questions/:id', 'QuestionController', 'delete', 'AuthMiddleware'); // Chỉ Admin
$router->addRoute('PATCH', '/admin/questions/:id/status', 'QuestionController', 'updateStatus', 'AuthMiddleware'); // Chỉ Admin

// Answer routes
$router->addRoute('GET', 'answers', 'AnswerController', 'getByQuestionId');
$router->addRoute('POST', 'answers', 'AnswerController', 'create'); // Yêu cầu đăng nhập (trong controller)
$router->addRoute('PUT', 'answers/:id', 'AnswerController', 'update'); // Yêu cầu đăng nhập (trong controller)
$router->addRoute('DELETE', 'answers/:id', 'AnswerController', 'delete', 'AuthMiddleware');

// Product routes
$router->addRoute('GET', '/products/distinct', 'ProductController', 'getDistinct'); // công khai
$router->addRoute('GET', '/products/:page/:limit', 'ProductController', 'getLimitOffset_Sort', 'AuthMiddleware');
$router->addRoute('GET', '/products', 'ProductController', 'getAll'); // công khai
$router->addRoute('GET', '/products/:id', 'ProductController', 'getById'); // công khai
$router->addRoute('POST', '/products', 'ProductController', 'create', 'AuthMiddleware'); // chỉ admin
$router->addRoute('PUT', '/products', 'ProductController', 'update', 'AuthMiddleware'); // chỉ admin
$router->addRoute('DELETE', '/products/:id', 'ProductController', 'delete', 'AuthMiddleware'); // chỉ admin
//Img
$router->addRoute('POST', '/products/image', 'ImageController', 'upload', 'AuthMiddleware'); // chỉ admin
$router->addRoute('POST', '/products/image/delete', 'ImageController', 'delete', 'AuthMiddleware'); // chỉ admin
// Create order, store into db, requires login first
$router->addRoute('POST', '/cart/buy', 'OrderController', 'buy');
$router->addRoute('GET', '/cart', 'OrderController', 'getOrderByUser', 'AuthMiddleware');
$router->addRoute('GET', '/historycart', 'OrderController', 'getOrderByUser');


$router->addRoute("GET", '/orders', 'OrderController', 'index');
$router->addRoute("GET", '/orders/:id', 'OrderController', 'getOrderById');
$router->addRoute("GET", '/orders/items/:id', 'OrderController', 'getOrderItemOfOrderId');
$router->addRoute('PUT', '/orders', 'OrderController', 'update');

//contact email
$router->addRoute('GET', '/contact-email', 'ContactEmailController', 'index');
$router->addRoute('GET', '/contact-email/:id', 'ContactEmailController', 'show');
$router->addRoute('PUT', '/contact-email', 'ContactEmailController', 'update');

//ContactPhone route
$router->addRoute('GET', '/contact-phone', 'ContactPhoneController', 'index');
$router->addRoute('GET', '/contact-phone/:id', 'ContactPhoneController', 'show');
$router->addRoute('PUT', '/contact-phone', 'ContactPhoneController', 'update');

//contactForm route
$router->addRoute('GET', '/contact-form', 'ContactFormController', 'index');
$router->addRoute('GET', '/contact-form/:id', 'ContactFormController', 'show');
$router->addRoute('PUT', '/contact-form', 'ContactFormController', 'update');
$router->addRoute('POST', '/contact-form', 'ContactFormController', 'create');
$router->addRoute('DELETE', '/contact-form/:id', 'ContactFormController', 'delete');

//Article route
$router->addRoute('GET', '/articles', 'ArticleController', 'index');
$router->addRoute('GET', '/articles/:id', 'ArticleController', 'show');
$router->addRoute('POST', '/articles', 'ArticleController', 'create', 'AuthMiddleware');
$router->addRoute('PUT', '/articles/:id', 'ArticleController', 'update', 'AuthMiddleware');
$router->addRoute('DELETE', '/articles/:id', 'ArticleController', 'delete', 'AuthMiddleware');

// Article comment routes
$router->addRoute('GET', '/article-comments', 'ArticleCommentController', 'getByArticleId');
$router->addRoute('POST', '/article-comments', 'ArticleCommentController', 'create');
$router->addRoute('DELETE', '/article-comments/:id', 'ArticleCommentController', 'delete', 'AuthMiddleware');

// Users for admin routes
// User routes
$router->addRoute('GET', '/user/me', 'UserController', 'profile');
$router->addRoute('GET', 'admin/users', 'UserController', 'index', 'AuthMiddleware');
$router->addRoute('GET', 'admin/users/:id', 'UserController', 'show', 'AuthMiddleware');
$router->addRoute('PUT', 'admin/users/:id', 'UserController', 'update', 'AuthMiddleware');
$router->addRoute('DELETE', 'admin/users/:id', 'UserController', 'delete', 'AuthMiddleware');
$router->addRoute('PUT', '/user/update-avatar', 'UserController', 'updateAvatar', 'AuthMiddleware');
$router->addRoute('PUT', '/user/change-password', 'UserController', 'changePassword');

