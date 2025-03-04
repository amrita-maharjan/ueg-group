import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./page/Login";

import GroupTable from "./page/GroupTable";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<GroupTable />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
