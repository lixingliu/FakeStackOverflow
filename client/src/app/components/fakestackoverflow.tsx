'use client'

import React from "react";
import Creatingquestionform from "./creatingquestionform.js";
import CreateAnswerForm from "./createanswerform.js";
import Navbar from "./Navbar/Navbar";
import Results from "./Results";

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
