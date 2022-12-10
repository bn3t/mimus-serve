import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import HomePage from "$containers/HomePage";
import MappingsPage from "$containers/MappingsPage";
import SettingsPage from "$containers/SettingsPage";
import Root from "$containers/Root";

const router = createBrowserRouter(
  [
    {
      path: "",
      element: <Root />,
      children: [
        {
          index: true,

          element: <HomePage />,
        },
        {
          path: "settings",

          element: <SettingsPage />,
        },
        {
          path: "mappings",

          element: <MappingsPage />,
        },
      ],
    },
  ],
  { basename: "/ui/" },
);

const queryClient = new QueryClient();

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#FA8C16",
          colorSuccess: "#96d278",
          colorInfo: "#1790ff",
          colorWarning: "#d86e0c",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
