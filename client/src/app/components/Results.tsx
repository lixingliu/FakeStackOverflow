'use client'

import React, { useEffect } from "react";
// import { PAYLOAD_ENDPOINT } from "../constants";

const Results = () => {
  const [questions, setQuestions] = React.useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `https://cookie-hub-server.vercel.app/api/questions`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await res.json();
        console.log(data);
        setQuestions(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center w-1/2 mx-auto text-white">
        <h1>Total Amount of Entries</h1>
        <h1>The Current Page Title</h1>
      </div>
      <div
        className="mx-auto bg-white"
        style={{ width: "90%", height: "80vh" }}
      >
        <h1>Content</h1>
      </div>
    </div>
  );
};

export default Results;
