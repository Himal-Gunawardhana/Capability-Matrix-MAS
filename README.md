# 3 Month Capability Matrix

A React-based capability matrix for planning and tracking capabilities over a 3-month period (12 weeks × 3 columns = 36 columns) with dropdown-based color selection and editable week numbers that fits entirely on screen without scrolling.

## Features

- **No-Scroll Interface**: Completely eliminates scrolling - everything fits perfectly on screen
- **Fixed Viewport**: Page is locked to viewport dimensions with no horizontal or vertical scrolling
- **Dropdown Color Selection**: Each cell has a dropdown to select colors
- **Editable Week Numbers**: Each week header has an editable text box for custom week numbering
- **Two-Row Header Structure**: Week headers span 3 columns with numbered sub-columns
- **30 Rows x 36 Columns Grid**: Comprehensive matrix for detailed planning (12 weeks × 3 columns)
- **Color-coded Capabilities**: 6 different colored options representing different capability types:
  - 🟢 Green
  - 🔴 Red
  - 🟡 Yellow
  - ⚫ Black
  - 🟠 Orange
  - 🔵 Blue
- **Interactive Grid**:
  - Select colors using dropdown in each cell
  - Clear cells by selecting "None"
  - Visual color legend for reference
  - Editable week numbers in header
- **Three Columns per Week**: Each week has 3 sub-columns (numbered 1, 2, 3)
- **Hierarchical Headers**: Week headers span across 3 sub-columns
- **Custom Week Numbering**: Edit week numbers using text boxes in headers
- **Responsive Design**: Automatically scales to fit different screen sizes without scrolling
- **Scroll-Free Experience**: Absolutely no horizontal or vertical scrolling required
- **Fixed Layout**: Everything fits perfectly within the viewport dimensions
- **Viewport Locked**: Page dimensions are constrained to screen size

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:

   ```bash
   cd 3_Month_Capability_Matrix
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🌐 Live Demo

The application is hosted on GitHub Pages and can be accessed at:
**https://Himal-Gunawardhana.github.io/Capability-Matrix-MAS/**

## How to Use

1. **Adding Capabilities**: Click on any cell's dropdown and select a color
2. **Changing Capabilities**: Click on a cell's dropdown to change its color
3. **Removing Capabilities**: Select "None" from the dropdown to clear a cell
4. **Edit Week Numbers**: Click on the text boxes in the week headers to customize week numbers (2 digits max)
5. **Sub-Column Planning**: Each week has 3 numbered sub-columns (1, 2, 3) for detailed planning
6. **Header Structure**: Week headers span across their 3 sub-columns with individual column numbers below
7. **Planning**: Use different colors to represent different types of capabilities, priorities, or team assignments
8. **Reference**: Use the color legend on the left to understand color meanings

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Technology Stack

- **React 18** - Frontend framework
- **CSS3** - Styling with modern features like CSS Grid, Flexbox, and sticky positioning
- **Create React App** - Build tooling and development server

## Project Structure

```
src/
├── App.js          # Main component with dropdown logic and grid generation
├── App.css         # Styling for the fixed table and dropdown interface
├── index.js        # React app entry point
└── index.css       # Global styles

public/
└── index.html      # HTML template
```

## Customization

### Adding New Capability Types

To add new colored options, modify the `colorOptions` array in `App.js`:

```javascript
const colorOptions = [
  // ... existing options
  { id: "purple", color: "#9C27B0", label: "Purple" },
];
```

### Changing Grid Size

To modify the grid dimensions, update the constants in `App.js`:

- Change `30` to your desired number of rows
- Change `12` to your desired number of weeks
- Each week has 3 sub-columns with an editable week number

### Styling

Customize the appearance by modifying `App.css`. The CSS uses CSS custom properties for easy theming.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
