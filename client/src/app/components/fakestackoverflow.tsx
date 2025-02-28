import React from "react";
import Creatingquestionform from "./creatingquestionform.js";
import CreateAnswerForm from "./createanswerform.js";
import Navbar from "./Navbar/Navbar.tsx";
import Results from "./Results.tsx";

const FakeStackOverflow = () => {
  return (
    <div>
      <Navbar />
      <Results />
      {/* <Creatingquestionform /> */}
      {/* <CreateAnswerForm /> */}
    </div>
  );
};

export default FakeStackOverflow;
