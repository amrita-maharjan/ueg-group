import "@mantine/core/styles.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./page/Login";
import { useEffect } from "react";
import GroupTable from "./page/GroupTable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<GroupTable />} />
      </Routes>
    </BrowserRouter>
  );
}
