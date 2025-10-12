import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  // Define the color options/capabilities
  const colorOptions = [
    { id: "", color: "transparent", label: "Select Color" },
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

  // Create initial chassis base state (30 rows × 3 sub-columns)
  const createInitialChassisBase = () => {
    const chassisBase = {};
    for (let row = 1; row <= 30; row++) {
      for (let col = 1; col <= 3; col++) {
        chassisBase[`${row}-${col}`] = "";
      }
    }
    return chassisBase;
  };

  // Create initial week numbers state
  const createInitialWeekNumbers = () => {
    const weekNumbers = {};
    for (let week = 1; week <= 12; week++) {
      weekNumbers[week] = week.toString().padStart(2, "0");
    }
    return weekNumbers;
  };

  // Local Storage helper functions
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return defaultValue;
    }
  };

  // Initialize state with localStorage data or defaults
  const [gridData, setGridData] = useState(() =>
    loadFromLocalStorage("capabilityMatrix_gridData", createInitialGrid())
  );

  const [chassisBaseData, setChassisBaseData] = useState(() =>
    loadFromLocalStorage(
      "capabilityMatrix_chassisBase",
      createInitialChassisBase()
    )
  );

  const [weekNumbers, setWeekNumbers] = useState(() =>
    loadFromLocalStorage(
      "capabilityMatrix_weekNumbers",
      createInitialWeekNumbers()
    )
  );

  // State for update information
  const [updateInfo, setUpdateInfo] = useState(() =>
    loadFromLocalStorage("capabilityMatrix_updateInfo", {
      updatedDate: "",
      updatedTime: "",
      updatedBy: "",
    })
  );

  // State for color images
  const [colorImages, setColorImages] = useState(() =>
    loadFromLocalStorage("capabilityMatrix_colorImages", {})
  );

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage("capabilityMatrix_gridData", gridData);
  }, [gridData]);

  useEffect(() => {
    saveToLocalStorage("capabilityMatrix_chassisBase", chassisBaseData);
  }, [chassisBaseData]);

  useEffect(() => {
    saveToLocalStorage("capabilityMatrix_weekNumbers", weekNumbers);
  }, [weekNumbers]);

  useEffect(() => {
    saveToLocalStorage("capabilityMatrix_updateInfo", updateInfo);
  }, [updateInfo]);

  useEffect(() => {
    saveToLocalStorage("capabilityMatrix_colorImages", colorImages);
  }, [colorImages]);

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

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      // Clear localStorage
      localStorage.removeItem("capabilityMatrix_gridData");
      localStorage.removeItem("capabilityMatrix_chassisBase");
      localStorage.removeItem("capabilityMatrix_weekNumbers");
      localStorage.removeItem("capabilityMatrix_updateInfo");
      localStorage.removeItem("capabilityMatrix_colorImages");

      // Reset state to defaults
      setGridData(createInitialGrid());
      setChassisBaseData(createInitialChassisBase());
      setWeekNumbers(createInitialWeekNumbers());
      setUpdateInfo({
        updatedDate: "",
        updatedTime: "",
        updatedBy: "",
      });
      setColorImages({});
    }
  };

  // CSV Export function
  const exportToCSV = () => {
    const headers = [
      "Row",
      "Chassis Base 1",
      "Chassis Base 2",
      "Chassis Base 3",
    ];

    // Add week headers
    for (let week = 1; week <= 12; week++) {
      const weekNumber = weekNumbers[week];
      headers.push(
        `Week ${weekNumber}-1`,
        `Week ${weekNumber}-2`,
        `Week ${weekNumber}-3`
      );
    }

    const csvData = [headers];

    // Add data rows
    for (let row = 1; row <= 30; row++) {
      const rowData = [row];

      // Add chassis base data
      for (let col = 1; col <= 3; col++) {
        rowData.push(chassisBaseData[`${row}-${col}`] || "");
      }

      // Add grid data
      for (let week = 1; week <= 12; week++) {
        for (let col = 1; col <= 3; col++) {
          rowData.push(gridData[`${row}-${week}-${col}`] || "");
        }
      }

      csvData.push(rowData);
    }

    // Convert to CSV string
    const csvString = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Download CSV file
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `capability-matrix-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // CSV Import function
  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split("\n");

        const newGridData = {};
        const newChassisBaseData = {};

        // Process data rows (skip header)
        for (let i = 1; i < lines.length && i <= 30; i++) {
          const cells = lines[i].split(",").map((c) => c.replace(/"/g, ""));
          if (cells.length < 4) continue;

          const row = i;

          // Import chassis base data
          for (let col = 1; col <= 3; col++) {
            if (cells[col]) {
              newChassisBaseData[`${row}-${col}`] = cells[col];
            }
          }

          // Import grid data
          let cellIndex = 4; // Start after chassis base columns
          for (let week = 1; week <= 12; week++) {
            for (let col = 1; col <= 3; col++) {
              if (cells[cellIndex]) {
                newGridData[`${row}-${week}-${col}`] = cells[cellIndex];
              }
              cellIndex++;
            }
          }
        }

        // Update state
        setGridData((prevData) => ({ ...prevData, ...newGridData }));
        setChassisBaseData((prevData) => ({
          ...prevData,
          ...newChassisBaseData,
        }));

        alert("CSV data imported successfully!");
      } catch (error) {
        alert("Error importing CSV file. Please check the file format.");
        console.error("CSV import error:", error);
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = "";
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

      // Chassis base cells (3 sub-columns)
      for (let col = 1; col <= 3; col++) {
        const cellId = `${row}-${col}`;
        const selectedColorId = chassisBaseData[cellId];
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
        <div className="header-top">
          <h1>3 Month Capability Matrix</h1>
          <div className="csv-buttons">
            <button
              className="csv-button"
              onClick={exportToCSV}
              title="Export data to CSV file"
            >
              Export.csv
            </button>
            <input
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              style={{ display: "none" }}
              id="csv-import"
            />
            <button
              className="csv-button"
              onClick={() => document.getElementById("csv-import").click()}
              title="Import data from CSV file"
            >
              Import.csv
            </button>
          </div>
        </div>
        <div className="update-info">
          <div className="update-fields-row">
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
            <button
              className="clear-data-button"
              onClick={clearAllData}
              title="Clear all saved data and reset to defaults"
            >
              Clear All Data
            </button>
          </div>
        </div>
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
                  {!colorImages[color.id] ? (
                    <label
                      htmlFor={`upload-${color.id}`}
                      className="upload-button"
                    >
                      Browse
                    </label>
                  ) : (
                    <div className="uploaded-image">
                      <label
                        htmlFor={`upload-${color.id}`}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={colorImages[color.id]}
                          alt={`${color.label} representation`}
                          className="color-image"
                          title="Click to change image"
                        />
                      </label>
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
                <th className="chassis-header" colSpan={3}>
                  Chassis base
                </th>
                {generateWeekHeaders().weekHeaders}
              </tr>
              <tr>
                <th className="priority-header">Pri 1</th>
                <th className="priority-header">Prio 2</th>
                <th className="priority-header">Prio 3</th>
                {generateWeekHeaders().columnHeaders}
              </tr>
            </thead>
            <tbody>{generateGridRows()}</tbody>
          </table>
        </div>
      </div>
      <footer className="app-footer">
        <div className="powered-by">
          Powered by MAS KREEDA Balangoda - Digital
        </div>
      </footer>
    </div>
  );
};

export default App;
