# University Lost and Found System

A web application for managing lost and found items at a university. The system allows users to report lost items, report found items, browse through listings with filters, and submit claims for items.

## Features

- **Lost item submission**: Report lost items with category, description, location, date, and contact information
- **Found item submission**: Report found items with optional photo upload or automatic placeholder
- **Browse and filter**: Real-time filtering by item type (lost / found / all) and category (electronics, books, ID cards, etc.)
- **Smart match suggestions**: Automatically checks for potential matches when typing an item report
- **Claim request system**: Submit verified claims with proof of ownership for found items
- **Responsive design**: Clean, mobile-friendly UI with statistics counter animations

## Technology Stack

- **Backend**: Flask 3 (Python)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Data Storage**: In-memory data store with sample seed items

## Getting Started

### Prerequisites

- Python 3.8 or higher (and/or Node.js if using npm)

### Installation

1. Install the required dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```
   *(or create and activate a virtual environment first: `python3 -m venv venv && source venv/bin/activate`)*

2. Run the application:
   ```bash
   python3 app.py
   ```
   *Alternatively, you can run using npm:*
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://127.0.0.1:5001
   ```
   *(Note: Default port is set to `5001` to avoid macOS AirPlay Receiver conflicts on port 5000. You can customize the port with `PORT=8000 python3 app.py`.)*

## Project Structure

- `app.py`: Main Flask application with API endpoints and routes
- `templates/`: Jinja2 HTML templates
  - `layout.html`: Base template with responsive navigation, notifications, and footer
  - `index.html`: Home page featuring hero banner, stats, and recent items
  - `lost_items.html`: Filterable directory of lost items
  - `found_items.html`: Filterable directory of found items with claim links
  - `report_lost.html`: Lost item reporting form with match detection
  - `report_found.html`: Found item reporting form with image upload
  - `claim_form.html`: Verification claim submission form
- `static/`: Static assets
  - `css/styles.css`: Custom CSS styling and responsive layout
  - `js/main.js`: Dynamic client-side filtering, form validation, and matching logic
  - `uploads/`: Uploaded item photos

## Credits

Created by KAIFEE KAMRAN
