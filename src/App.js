import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  // Helper functions to create initial data
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

  const createInitialChassisBase = () => {
    const chassisBase = {};
    for (let row = 1; row <= 30; row++) {
      for (let col = 1; col <= 3; col++) {
        chassisBase[`${row}-${col}`] = "";
      }
    }
    return chassisBase;
  };

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

  // State for images list - dynamic list of images that users can add
  const [imagesList, setImagesList] = useState(() =>
    loadFromLocalStorage("capabilityMatrix_imagesList", [])
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
    saveToLocalStorage("capabilityMatrix_imagesList", imagesList);
  }, [imagesList]);

  const handleColorChange = (cellId, colorId) => {
    setGridData((prevGrid) => ({
      ...prevGrid,
      [cellId]: colorId,
    }));
  };

  const handleChassisBaseChange = (cellId, colorId) => {
    setChassisBaseData((prevData) => ({
      ...prevData,
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

  const addNewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: `img-${Date.now()}`,
          image: e.target.result,
          name: file.name.split('.')[0]
        };
        setImagesList((prevList) => [...prevList, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageId) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setImagesList((prevList) => prevList.filter(img => img.id !== imageId));
      // Clear any cells using this image
      const newGridData = { ...gridData };
      Object.keys(newGridData).forEach(key => {
        if (newGridData[key] === imageId) {
          newGridData[key] = "";
        }
      });
      setGridData(newGridData);
      
      const newChassisData = { ...chassisBaseData };
      Object.keys(newChassisData).forEach(key => {
        if (newChassisData[key] === imageId) {
          newChassisData[key] = "";
        }
      });
      setChassisBaseData(newChassisData);
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
      localStorage.removeItem("capabilityMatrix_imagesList");

      // Reset state to defaults
      setGridData(createInitialGrid());
      setChassisBaseData(createInitialChassisBase());
      setWeekNumbers(createInitialWeekNumbers());
      setUpdateInfo({
        name: "",
        role: "",
        date: "",
      });
      setImagesList([]);
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

  const getImageById = (id) => {
    if (!id) return null;
    return imagesList.find((img) => img.id === id) || null;
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
      // Add chassis base styling for highlighting the 3 sub-columns
      const chassisColStyle = {
        backgroundColor: "#037317ff", // Light blue highlight
        border: "2px solid #025e13ff", // Royal blue border
      };
      for (let col = 1; col <= 3; col++) {
        const cellId = `${row}-${col}`;
        const selectedImageId = chassisBaseData[cellId];
        const selectedImage = getImageById(selectedImageId);
        const hasImage = selectedImage && selectedImage.image;

        cells.push(
          <td
            key={cellId}
            className="grid-cell chassis-cell "
            style={chassisColStyle}
          >
            <div className="cell-content">
              <div
                className="color-dropdown"
                tabIndex={0}
                onKeyDown={(e) => {
                  const key = parseInt(e.key);
                  if (!isNaN(key) && key >= 0 && key < imagesList.length) {
                    e.preventDefault();
                    handleChassisBaseChange(cellId, imagesList[key]?.id || '');
                  }
                }}
                style={{
                  backgroundColor: hasImage ? 'transparent' : '#ddd',
                  backgroundImage: hasImage ? `url(${selectedImage.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {hasImage && (
                <button
                  className="clear-cell-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChassisBaseChange(cellId, '');
                  }}
                  title="Clear cell"
                >
                  ×
                </button>
              )}
            </div>
          </td>
        );
      }

      // Week cells (12 weeks × 3 columns = 36 cells per row)
      for (let week = 1; week <= 12; week++) {
        for (let col = 1; col <= 3; col++) {
          const cellId = `${row}-${week}-${col}`;
          const selectedImageId = gridData[cellId];
          const selectedImage = getImageById(selectedImageId);
          const hasImage = selectedImage && selectedImage.image;

          cells.push(
            <td key={cellId} className="grid-cell">
              <div className="cell-content">
                <div
                  className="color-dropdown"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    const key = parseInt(e.key);
                    if (!isNaN(key) && key >= 0 && key < imagesList.length) {
                      e.preventDefault();
                      handleColorChange(cellId, imagesList[key]?.id || '');
                    }
                  }}
                  style={{
                    backgroundColor: hasImage ? 'transparent' : '#ddd',
                    backgroundImage: hasImage ? `url(${selectedImage.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {hasImage && (
                  <button
                    className="clear-cell-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange(cellId, '');
                    }}
                    title="Clear cell"
                  >
                    ×
                  </button>
                )}
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
          <h3>Image Legend</h3>
          <div className="legend-note">
            <p><strong>Keyboard Shortcuts:</strong></p>
            <p>Click on a cell and press the number key to assign image</p>
          </div>
          <div className="color-legend">
            {imagesList.map((image, index) => (
              <div key={image.id} className="legend-item">
                <div className="legend-key-number">{index}</div>
                <div className="uploaded-image">
                  <img
                    src={image.image}
                    alt={image.name}
                    className="color-image"
                    title={image.name}
                  />
                </div>
                <div className="legend-color-name">{image.name}</div>
                <button 
                  onClick={() => removeImage(image.id)}
                  className="remove-image-btn"
                  title="Remove this image"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="legend-item add-image-item">
              <input
                type="file"
                accept="image/*"
                onChange={addNewImage}
                className="image-upload-input"
                id="add-new-image"
              />
              <label htmlFor="add-new-image" className="add-image-button">
                + Add Image
              </label>
            </div>
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
                <th className="priority-header">Prio 1</th>
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
