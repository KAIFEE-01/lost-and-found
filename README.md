# 🔍 University Lost & Found Management System

A web-based application designed to simplify the process of reporting, finding, and recovering lost belongings within a university environment.

The platform provides a centralized interface where users can report lost or found items, browse available listings, filter items by category, receive potential match suggestions, and submit ownership claims.

## 🌐 Live Demo

🚀 **Live Application:** [Lost & Found Management System](https://lost-and-found-gold-tau.vercel.app/)

📂 **GitHub Repository:** [View Source Code](https://github.com/KAIFEE-01/lost-and-found)

---

## 📌 Project Overview

Losing personal belongings in universities and other shared spaces is a common problem. Similarly, people who find misplaced belongings often struggle to identify their rightful owners.

The University Lost & Found Management System aims to address this problem through a simple and organized web application.

Users can report missing belongings, submit details of items they have found, browse listings, discover potential matches, and submit claim requests with ownership information.

## ✨ Key Features

- **Report Lost Items:** Submit item details, including title, description, category, date, location, and contact information.
- **Report Found Items:** Report recovered belongings with descriptions and optional image uploads.
- **Browse Listings:** Explore separate listings for lost and found items.
- **Category Filtering:** Filter listings based on item categories.
- **Smart Match Suggestions:** Identify potential matches using keyword-based comparison of item titles and descriptions.
- **Claim Request System:** Submit ownership claims with contact information and proof descriptions.
- **Responsive Interface:** Access the application through desktop and mobile-friendly layouts.
- **Interactive UI:** Includes dynamic item filtering, notifications, and animated statistics.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, Flask |
| Frontend | HTML5, CSS3, JavaScript (Vanilla ES6+) |
| Templates | Jinja2 |
| Data Exchange | JSON, Fetch API |
| Data Storage | Python Lists and Dictionaries (In-memory) |
| Deployment | Vercel |

## 🏗️ Application Architecture

The application follows a client-server architecture.

```text
              USER
                |
                v
       FRONTEND INTERFACE
       HTML / CSS / JavaScript
                |
                v
          HTTP REQUEST
                |
                v
          FLASK BACKEND
             (Python)
                |
                v
       APPLICATION LOGIC
                |
          +-----+------+
          |            |
          v            v
      ITEM DATA    CLAIM DATA
       (Lists)       (Lists)
          |            |
          +-----+------+
                |
                v
         HTTP RESPONSE
          JSON / HTML
                |
                v
       FRONTEND DISPLAY
```

## ⚙️ How It Works

1. Users access the application through the web interface.
2. Users can report a lost item or submit details of a found item.
3. The frontend sends form data to the Flask backend using HTTP requests.
4. Flask processes the submitted information and stores it in Python data structures.
5. Users can browse lost and found listings and filter items by category.
6. The matching functionality compares item titles and descriptions to identify potential matches.
7. Users can submit claim requests for found items by providing their contact details and ownership information.
8. The application displays notifications to indicate successful submissions.

## 🧠 Matching Logic

The application implements a basic keyword-based matching mechanism.

- Converts item titles and descriptions to lowercase.
- Removes common stop words.
- Extracts meaningful words from the submitted item details.
- Compares those words with existing items of the opposite type.
- Returns potential matches when relevant keywords overlap.

For example, reporting a lost blue water bottle may produce a suggestion for an already reported found water bottle if their titles or descriptions contain matching keywords.

**Note:** This is a basic matching approach, not an AI or machine-learning-based matching system.

## 📂 Project Structure

```text
lost-and-found/
│
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── vercel.json             # Vercel deployment configuration
│
├── templates/              # Jinja2 HTML templates
│   ├── layout.html
│   ├── index.html
│   ├── lost_items.html
│   ├── found_items.html
│   ├── report_lost.html
│   ├── report_found.html
│   └── claim_form.html
│
├── static/
│   ├── css/
│   │   └── styles.css      # Application styling
│   ├── js/
│   │   └── main.js         # Frontend interactions and logic
│   └── uploads/            # Item image uploads
│
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/KAIFEE-01/lost-and-found.git
```

**2. Navigate to the project directory**

```bash
cd lost-and-found
```

**3. Create and activate a virtual environment (recommended)**

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux / macOS:

```bash
source venv/bin/activate
```

**4. Install dependencies**

```bash
pip install -r requirements.txt
```

**5. Run the application**

```bash
python app.py
```

**6. Open the application**

Visit:

```text
http://127.0.0.1:5001
```

## ⚠️ Current Limitations

- Application records are currently stored in memory using Python lists and dictionaries.
- Data is not permanently persisted in a database.
- Sample records are included for demonstration purposes.
- The matching mechanism uses basic keyword comparison.
- Claim requests are recorded, but there is no complete administrator approval workflow.
- Uploaded files and in-memory records are not backed by persistent storage in the current deployment.

## 🔮 Future Enhancements

- Database integration using MySQL or MongoDB.
- User registration and secure authentication.
- Persistent image storage.
- Advanced item-matching algorithms.
- Email notifications for potential matches and claim requests.
- Admin dashboard for reviewing and approving claims.
- Improved validation and security.

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Developing web applications using Python Flask.
- Integrating frontend and backend components.
- Working with Flask routes and HTTP methods.
- Handling form submissions and JSON responses.
- Implementing REST-style API endpoints.
- Using JavaScript Fetch API for asynchronous communication.
- Working with Python data structures.
- Implementing basic keyword-based matching logic.
- Deploying a Flask application using Vercel.

## 👨‍💻 Author

**Kaifee Kamran Khan**

B.Tech – Artificial Intelligence & Data Science

GitHub: [KAIFEE-01](https://github.com/KAIFEE-01)

---

⭐ If you find this project useful, feel free to explore the repository and share your feedback.
