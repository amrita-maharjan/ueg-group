import "@mantine/core/styles.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import GroupTable from "./page/GroupTable";
import { Login } from "./page/Login";

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
