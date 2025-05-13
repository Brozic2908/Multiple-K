<?php
// core/Router.php
class Router
{
    private $routes = [];
    private $baseUrl = '/web-hk242/backend';

    public function addRoute($method, $path, $controller, $action, $middleware = null)
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controller' => $controller,
            'action' => $action,
            'middleware' => $middleware
        ];
    }

    public function handleRequest()
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Remove base URL from request
        $requestUri = str_replace($this->baseUrl, '', $requestUri);

        foreach ($this->routes as $route) {
            if ($requestMethod === $route['method'] && $this->matchPath($requestUri, $route['path'])) {
                // Handle middleware if exists
                if ($route['middleware']) {
                    $middleware = new $route['middleware']();
                    if (!$middleware->handle()) {
                        return;
                    }
                }

                // Execute controller action
                $controller = new $route['controller']();
                call_user_func([$controller, $route['action']]);
                return;
            }
        }

        // No route found
        header("HTTP/1.0 404 Not Found");
        echo json_encode(['error' => 'Route not found']);
    }

    private function matchPath($requestUri, $routePath)
    {
        $requestParts = explode('/', trim($requestUri, '/'));
        $routeParts = explode('/', trim($routePath, '/'));

        if (count($requestParts) !== count($routeParts)) {
            return false;
        }

        for ($i = 0; $i < count($routeParts); $i++) {
            if ($routeParts[$i][0] === ':') {
                // This is a parameter, store it
                $_GET[substr($routeParts[$i], 1)] = $requestParts[$i];
                continue;
            }

            if ($routeParts[$i] !== $requestParts[$i]) {
                return false;
            }
        }

        return true;
    }
}
