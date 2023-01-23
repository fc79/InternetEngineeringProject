import React, { useState } from "react";
import ResponsiveDrawer from "./Components/Drawer";
import Login from "./Components/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  const [usersList, setUsersList] = useState([]);
  const [state, setState] = useState("");

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Chat" element={<ResponsiveDrawer />} />
      </Routes>
    </>
  );
}

export default App;
