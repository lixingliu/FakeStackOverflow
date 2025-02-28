import React from "react";

const Results = () => {
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
