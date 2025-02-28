// "use client";

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import FakeStackOverflow from "./components/fakestackoverflow";
// import LoginPage from "./components/loginpage.js";
// import WelcomePage from "./components/welcomepage.js";
// import CreateUser from "./components/createuser.js";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<WelcomePage />} />
//         <Route path="newUser" element={<CreateUser />} />

//         <Route path="user/:handle">
//           <Route path="loginPage" element={<LoginPage />} />
//           <Route path="homePage/:handle" element={<FakeStackOverflow />} />
//           <Route path="questionForm/:handle" element={<FakeStackOverflow />} />
//           <Route path="answerForm/:handle" element={<FakeStackOverflow />} />
//         </Route>

//         <Route path="guest">
//           <Route path="homePage/:handle" element={<FakeStackOverflow />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

"use client";

import React from "react";
import FakeStackOverflow from "@/app/components/fakestackoverflow";

export default function Home() {
  return <FakeStackOverflow />;
}
