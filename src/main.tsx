import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider theme={theme}>
    <React.StrictMode>
      <Notifications />
      <App />
    </React.StrictMode>
  </MantineProvider>
);
