# Shift & Tip Tracker

A browser-based personal tracker for shift hours, tips, and estimated base pay. The application is contained in [index.html](index.html), with no backend or build step.

## Features

- Record, edit, and delete shifts.
- Enter hours and minutes with a decimal-hours preview.
- View monthly tips, hours, and estimated base pay.
- View a weekly summary.
- Switch between light and dark themes.
- Export the selected month to PDF using jsPDF and AutoTable.

## Run

Open `index.html` in a browser, or serve the repository with:

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`. The PDF libraries load from a CDN and need network access.

## Storage and calculation assumptions

Shift records and theme preferences use browser local storage. They are specific to the browser and site origin; clearing browser data removes them. PDF export provides a report, not an importable backup or cross-device sync.

The code uses a fixed hourly rate of **€13.90** and a **0.90 multiplier** for estimated base pay. These are application constants, not an individual payroll calculation. Tips appear separately.

Weekly summaries cover the current Monday through Sunday and exclude entries in subsequent weeks. Shift entries validate duration, minutes, and non-negative tip amounts. Time formatting rounds to whole minutes, preventing values such as 1h 60m.

## Regression checks

With Node.js installed:

```bash
node tests/tracker.test.cjs
```

These checks exercise calculations and input validation with a lightweight browser-interface stub.
