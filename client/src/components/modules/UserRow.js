import React, { useEffect, useState } from "react";
import "./UserRow.css";
import { Routes, Route, Link } from "react-router-dom";

// @param {RobotRowData} data

const UserRow = (props) => {
  console.log("IM ON USER ROW");
  if (!props.rowData) {
    return <div>No data available</div>;
  }

  const rowData = props.rowData;

  return (
    <div className="UserRow-container">
      <div className="UserRow-item">{rowData.name}</div>
      <div className="UserRow-item">{rowData.role}</div>
    </div>
  );
};

export default UserRow;
