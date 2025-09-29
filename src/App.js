import React, { useState } from "react";
import "./App.css";

const App = () => {
  // Define the color options/capabilities
  const colorOptions = [
    { id: "", color: "transparent", label: "None" },
    { id: "green", color: "#4CAF50", label: "Green" },
    { id: "red", color: "#f44336", label: "Red" },
    { id: "yellow", color: "#FFEB3B", label: "Yellow" },
    { id: "black", color: "#333333", label: "Black" },
    { id: "orange", color: "#FF9800", label: "Orange" },
    { id: "blue", color: "#2196F3", label: "Blue" },
  ];

  // Create initial grid state (30 rows, 12 weeks × 3 columns = 36 columns)
  const createInitialGrid = () => {
    const grid = {};
    for (let row = 1; row <= 30; row++) {
      for (let week = 1; week <= 12; week++) {
        for (let col = 1; col <= 3; col++) {
          grid[`${row}-${week}-${col}`] = "";
        }
      }
    }
    return grid;
  };

  // Create initial week numbers state
  const createInitialWeekNumbers = () => {
    const weekNumbers = {};
    for (let week = 1; week <= 12; week++) {
      weekNumbers[week] = week.toString().padStart(2, "0");
    }
    return weekNumbers;
  };

  const [gridData, setGridData] = useState(createInitialGrid());
  const [weekNumbers, setWeekNumbers] = useState(createInitialWeekNumbers());

  // State for update information
  const [updateInfo, setUpdateInfo] = useState({
    updatedDate: "",
    updatedTime: "",
    updatedBy: "",
  });

  // State for color images
  const [colorImages, setColorImages] = useState({});

  const handleColorChange = (cellId, colorId) => {
    setGridData((prevGrid) => ({
      ...prevGrid,
      [cellId]: colorId,
    }));
  };

  const handleWeekNumberChange = (week, value) => {
    // Only allow 2 digits
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setWeekNumbers((prevWeekNumbers) => ({
        ...prevWeekNumbers,
        [week]: value,
      }));
    }
  };

  const handleUpdateInfoChange = (field, value) => {
    setUpdateInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleImageUpload = (colorId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setColorImages((prevImages) => ({
          ...prevImages,
          [colorId]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getColorById = (id) => {
    return colorOptions.find((color) => color.id === id) || colorOptions[0];
  };

  const generateWeekHeaders = () => {
    const weekHeaders = [];
    const columnHeaders = [];

    for (let week = 1; week <= 12; week++) {
      // Week header that spans 3 columns
      weekHeaders.push(
        <th key={week} className="week-header" colSpan={3}>
          <div className="header-content">
            <div className="week-input-container">
              <span className="week-label">Week No</span>
              <input
                type="text"
                className="week-number-input"
                value={weekNumbers[week]}
                onChange={(e) => handleWeekNumberChange(week, e.target.value)}
                maxLength={2}
                placeholder="00"
              />
            </div>
          </div>
        </th>
      );

      // Column headers for each week (3 columns)
      for (let col = 1; col <= 3; col++) {
        columnHeaders.push(
          <th key={`${week}-${col}`} className="column-header">
            {col}
          </th>
        );
      }
    }

    return { weekHeaders, columnHeaders };
  };

  const generateGridRows = () => {
    const rows = [];
    for (let row = 1; row <= 30; row++) {
      const cells = [];

      // Row number cell
      cells.push(
        <td key={`row-${row}`} className="row-number">
          {row}
        </td>
      );

      // Week cells (12 weeks × 3 columns = 36 cells per row)
      for (let week = 1; week <= 12; week++) {
        for (let col = 1; col <= 3; col++) {
          const cellId = `${row}-${week}-${col}`;
          const selectedColorId = gridData[cellId];
          const selectedColor = getColorById(selectedColorId);

          cells.push(
            <td key={cellId} className="grid-cell">
              <div className="cell-content">
                <select
                  className="color-dropdown"
                  value={selectedColorId}
                  onChange={(e) => handleColorChange(cellId, e.target.value)}
                  style={{
                    backgroundColor: selectedColor.color,
                    color: selectedColor.id === "yellow" ? "#333" : "#fff",
                  }}
                >
                  {colorOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          );
        }
      }

      rows.push(<tr key={row}>{cells}</tr>);
    }
    return rows;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="update-info">
          <div className="update-field">
            <label>Updated Date:</label>
            <input
              type="text"
              placeholder="Enter date"
              value={updateInfo.updatedDate}
              onChange={(e) =>
                handleUpdateInfoChange("updatedDate", e.target.value)
              }
            />
          </div>
          <div className="update-field">
            <label>Updated Time:</label>
            <input
              type="text"
              placeholder="Enter time"
              value={updateInfo.updatedTime}
              onChange={(e) =>
                handleUpdateInfoChange("updatedTime", e.target.value)
              }
            />
          </div>
          <div className="update-field">
            <label>Updated By:</label>
            <input
              type="text"
              placeholder="Enter name"
              value={updateInfo.updatedBy}
              onChange={(e) =>
                handleUpdateInfoChange("updatedBy", e.target.value)
              }
            />
          </div>
        </div>
        <h1>3 Month Capability Matrix</h1>
      </header>

      <div className="main-content">
        <div className="legend">
          <h3>Color Legend</h3>
          <div className="color-legend">
            {colorOptions.slice(1).map((color) => (
              <div key={color.id} className="legend-item">
                <div
                  className="legend-color-circle"
                  style={{ backgroundColor: color.color }}
                ></div>
                <div className="image-upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(color.id, e)}
                    className="image-upload-input"
                    id={`upload-${color.id}`}
                  />
                  <label
                    htmlFor={`upload-${color.id}`}
                    className="upload-button"
                  >
                    Browse
                  </label>
                  {colorImages[color.id] && (
                    <div className="uploaded-image">
                      <img
                        src={colorImages[color.id]}
                        alt={`${color.label} representation`}
                        className="color-image"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="matrix-container">
          <table className="capability-matrix">
            <thead>
              <tr>
                <th className="row-header" rowSpan={2}>
                  No.
                </th>
                {generateWeekHeaders().weekHeaders}
              </tr>
              <tr>{generateWeekHeaders().columnHeaders}</tr>
            </thead>
            <tbody>{generateGridRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
