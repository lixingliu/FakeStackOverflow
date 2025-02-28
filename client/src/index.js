import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
// import FakeStackOverflow from "./components/fakestackoverflow.js";
import FakeStackOverflow from "./app/components/fakestackoverflow.tsx";
import LoginPage from "./app/components/loginpage.js";
import WelcomePage from "./app/components/welcomepage.js";
import CreateUser from "./app/components/createuser.js";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="newUser" element={<CreateUser />} />

      <Route path="user:handle">
        <Route path="loginPage" element={<LoginPage />} />
        <Route path="homePage:handle" element={<FakeStackOverflow />} />
        <Route path="questionForm:handle" element={<FakeStackOverflow />} />
        <Route path="answerForm:handle" element={<FakeStackOverflow />} />
      </Route>

      <Route path="guest">
        <Route path="homePage:handle" element={<FakeStackOverflow />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
