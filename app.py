#!/usr/bin/env python3
from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid

app = Flask(__name__)
app.secret_key = "lost-and-found-secret-key"

UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# In-memory data storage with sample data
lost_items = [
    {
        "id": "l1",
        "title": "Blue Hydroflask",
        "description": "Blue 32oz Hydroflask with stickers",
        "category": "Water Bottle",
        "date_lost": "2023-11-15",
        "location": "Science Building",
        "contact_name": "Alex Johnson",
        "contact_email": "alex@university.edu",
        "contact_phone": "555-123-4567",
        "status": "lost",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": "l2",
        "title": "MacBook Pro",
        "description": "13-inch MacBook Pro with coding stickers",
        "category": "Electronics",
        "date_lost": "2023-11-10",
        "location": "University Library",
        "contact_name": "Jordan Smith",
        "contact_email": "jordan@university.edu",
        "contact_phone": "555-987-6543",
        "status": "lost",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
]

found_items = [
    {
        "id": "f1",
        "title": "Calculator",
        "description": "TI-84 Plus Graphing Calculator",
        "category": "Electronics",
        "date_found": "2023-11-12",
        "location": "Math Department",
        "contact_name": "Professor Williams",
        "contact_email": "williams@university.edu",
        "contact_phone": "555-111-2222",
        "status": "found",
        "image": "https://images.pexels.com/photos/9970083/pexels-photo-9970083.jpeg",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": "f2",
        "title": "Student ID Card",
        "description": "University ID Card for Riley Thompson",
        "category": "Identification",
        "date_found": "2023-11-14",
        "location": "Campus Center",
        "contact_name": "Security Office",
        "contact_email": "security@university.edu",
        "contact_phone": "555-444-5555",
        "status": "found",
        "image": "https://images.pexels.com/photos/6045028/pexels-photo-6045028.jpeg",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
]

claim_requests = []

# Routes
@app.route('/')
def index():
    return render_template('index.html', found_items=found_items)

@app.route('/lost-items')
def view_lost_items():
    category = request.args.get('category', 'all')
    items = lost_items
    if category and category != 'all':
        items = [item for item in items if item.get('category') == category]
    return render_template('lost_items.html', items=items, current_category=category)

@app.route('/found-items')
def view_found_items():
    category = request.args.get('category', 'all')
    items = found_items
    if category and category != 'all':
        items = [item for item in items if item.get('category') == category]
    return render_template('found_items.html', items=items, current_category=category)

@app.route('/report-lost', methods=['GET', 'POST'])
def report_lost():
    if request.method == 'POST':
        new_item = {
            "id": f"l{len(lost_items) + 1}",
            "title": (request.form.get('title') or '').strip(),
            "description": (request.form.get('description') or '').strip(),
            "category": request.form.get('category'),
            "date_lost": request.form.get('date_lost'),
            "location": (request.form.get('location') or '').strip(),
            "contact_name": (request.form.get('contact_name') or '').strip(),
            "contact_email": (request.form.get('contact_email') or '').strip(),
            "contact_phone": (request.form.get('contact_phone') or '').strip(),
            "status": "lost",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        lost_items.insert(0, new_item)
        flash('Your lost item has been reported!', 'success')
        return redirect(url_for('view_lost_items'))
    return render_template('report_lost.html')

@app.route('/report-found', methods=['GET', 'POST'])
def report_found():
    if request.method == 'POST':
        image_url = "https://images.pexels.com/photos/8038906/pexels-photo-8038906.jpeg"
        
        file = request.files.get('image')
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_name = f"{uuid.uuid4().hex[:8]}_{filename}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_name))
            image_url = url_for('static', filename=f'uploads/{unique_name}')

        new_item = {
            "id": f"f{len(found_items) + 1}",
            "title": (request.form.get('title') or '').strip(),
            "description": (request.form.get('description') or '').strip(),
            "category": request.form.get('category'),
            "date_found": request.form.get('date_found'),
            "location": (request.form.get('location') or '').strip(),
            "contact_name": (request.form.get('contact_name') or '').strip(),
            "contact_email": (request.form.get('contact_email') or '').strip(),
            "contact_phone": (request.form.get('contact_phone') or '').strip(),
            "status": "found",
            "image": image_url,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        found_items.insert(0, new_item)
        flash('Thank you for reporting a found item!', 'success')
        return redirect(url_for('view_found_items'))
    return render_template('report_found.html')

@app.route('/claim/<item_id>', methods=['GET', 'POST'])
def claim_item(item_id):
    item = next((found_item for found_item in found_items if found_item['id'] == item_id), None)
    
    if not item:
        flash('The requested item was not found.', 'error')
        return redirect(url_for('view_found_items'))
    
    if request.method == 'POST':
        claim_request = {
            "id": str(uuid.uuid4()),
            "item_id": item_id,
            "claimant_name": (request.form.get('claimant_name') or '').strip(),
            "claimant_email": (request.form.get('claimant_email') or '').strip(),
            "claimant_phone": (request.form.get('claimant_phone') or '').strip(),
            "proof_description": (request.form.get('proof_description') or '').strip(),
            "status": "pending",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        claim_requests.append(claim_request)
        flash('Your claim request has been submitted!', 'success')
        return redirect(url_for('view_found_items'))
    
    return render_template('claim_form.html', item=item)

@app.route('/api/items', methods=['GET'])
def get_items():
    category = request.args.get('category', None)
    item_type = request.args.get('type', 'all')
    
    if item_type == 'lost':
        items = list(lost_items)
    elif item_type == 'found':
        items = list(found_items)
    else:
        items = list(lost_items) + list(found_items)
    
    if category and category != 'all':
        items = [item for item in items if item.get('category') == category]
        
    return jsonify({"items": items})

@app.route('/api/check-matches', methods=['POST'])
def check_matches():
    data = request.get_json(silent=True) or {}
    item_type = data.get('type')
    title = (data.get('title') or '').strip().lower()
    description = (data.get('description') or '').strip().lower()
    
    if not title and not description:
        return jsonify({"matches": []})
    
    stop_words = {'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'of', 'by', 'from', 'it', 'is', 'was', 'my', 'this', 'that'}
    desc_words = [w for w in description.split() if len(w) >= 3 and w not in stop_words]
    title_words = [w for w in title.split() if len(w) >= 3 and w not in stop_words]
    
    target_items = found_items if item_type == 'lost' else lost_items
    matches = []
    
    for item in target_items:
        item_title = item.get('title', '').lower()
        item_desc = item.get('description', '').lower()
        
        match = False
        if title and (title in item_title or item_title in title):
            match = True
        elif any(w in item_title or w in item_desc for w in title_words):
            match = True
        elif desc_words and any(w in item_title or w in item_desc for w in desc_words):
            match = True
            
        if match:
            matches.append(item)
                
    return jsonify({"matches": matches})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"\n=======================================================")
    print(f" University Lost and Found System running at:")
    print(f" http://127.0.0.1:{port}")
    print(f"=======================================================\n")
    app.run(debug=True, host='127.0.0.1', port=port)
