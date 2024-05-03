import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <div className="flex h-screen items-center justify-center text-4xl text-center">- 404 -<br/>PAGE NOT FOUND!</div>,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      }
    ]
  },
]);

export default router;