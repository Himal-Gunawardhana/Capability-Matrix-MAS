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
        <h1>3 Month Capability Matrix</h1>
      </header>

      <div className="main-content">
        <div className="legend">
          <h3>Color Legend</h3>
          <div className="color-legend">
            {colorOptions.slice(1).map((color) => (
              <div key={color.id} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: color.color }}
                ></div>
                <span>{color.label}</span>
              </div>
            ))}
          </div>

          <div className="instructions">
            <h4>Instructions:</h4>
            <ul>
              <li>Use the dropdown in each cell to select a color</li>
              <li>Select "None" to clear a cell</li>
              <li>Edit week numbers in the header text boxes</li>
              <li>3 columns per week, 12 weeks total</li>
              <li>No scrolling - everything fits on screen</li>
            </ul>
          </div>
        </div>

        <div className="matrix-container">
          <table className="capability-matrix">
            <thead>
              <tr>
                <th className="row-header" rowSpan={2}>No.</th>
                {generateWeekHeaders().weekHeaders}
              </tr>
              <tr>
                {generateWeekHeaders().columnHeaders}
              </tr>
            </thead>
            <tbody>{generateGridRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
