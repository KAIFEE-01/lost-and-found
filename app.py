from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
import json
from datetime import datetime
import os
import uuid

app = Flask(__name__)
app.secret_key = "lost-and-found-secret-key"
 
# In-memory data storage
lost_items = []
found_items = []
claim_requests = []

# Sample data for testing
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

# Routes
@app.route('/')
def index():
    return render_template('index.html', found_items=[])

@app.route('/lost-items')
def view_lost_items():
    return render_template('lost_items.html', items=lost_items)

@app.route('/found-items')
def view_found_items():
    return render_template('found_items.html', items=found_items)

@app.route('/report-lost', methods=['GET', 'POST'])
def report_lost():
    if request.method == 'POST':
        new_item = {
            "id": f"l{len(lost_items) + 1}",
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "category": request.form.get('category'),
            "date_lost": request.form.get('date_lost'),
            "location": request.form.get('location'),
            "contact_name": request.form.get('contact_name'),
            "contact_email": request.form.get('contact_email'),
            "contact_phone": request.form.get('contact_phone'),
            "status": "lost",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        lost_items.append(new_item)
        flash('Your lost item has been reported!', 'success')
        return redirect(url_for('view_lost_items'))
    return render_template('report_lost.html')

@app.route('/report-found', methods=['GET', 'POST'])
def report_found():
    if request.method == 'POST':
        image_url = "https://images.pexels.com/photos/8038906/pexels-photo-8038906.jpeg"
        
        new_item = {
            "id": f"f{len(found_items) + 1}",
            "title": request.form.get('title'),
            "description": request.form.get('description'),
            "category": request.form.get('category'),
            "date_found": request.form.get('date_found'),
            "location": request.form.get('location'),
            "contact_name": request.form.get('contact_name'),
            "contact_email": request.form.get('contact_email'),
            "contact_phone": request.form.get('contact_phone'),
            "status": "found",
            "image": image_url,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        found_items.append(new_item)
        flash('Thank you for reporting a found item!', 'success')
        return redirect(url_for('view_found_items'))
    return render_template('report_found.html')

@app.route('/claim/<item_id>', methods=['GET', 'POST'])
def claim_item(item_id):
    item = None
    for found_item in found_items:
        if found_item['id'] == item_id:
            item = found_item
            break
    
    if request.method == 'POST':
        claim_request = {
            "id": str(uuid.uuid4()),
            "item_id": item_id,
            "claimant_name": request.form.get('claimant_name'),
            "claimant_email": request.form.get('claimant_email'),
            "claimant_phone": request.form.get('claimant_phone'),
            "proof_description": request.form.get('proof_description'),
            "status": "pending"
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
        items = lost_items
    elif item_type == 'found':
        items = found_items
    else:
        items = lost_items + found_items
    
    if category and category != 'all':
        items = [item for item in items if item['category'] == category]
        
    return jsonify({"items": items})

@app.route('/api/check-matches', methods=['POST'])
def check_matches():
    data = request.get_json()
    item_type = data.get('type')
    title = data.get('title', '').lower()
    description = data.get('description', '').lower()
    
    matches = []
    
    if item_type == 'lost':
        # Look for matches in found items
        for item in found_items:
            if (title in item['title'].lower() or 
                title in item['description'].lower() or
                any(word in item['title'].lower() for word in description.split()) or
                any(word in item['description'].lower() for word in description.split())):
                matches.append(item)
    else:
        # Look for matches in lost items
        for item in lost_items:
            if (title in item['title'].lower() or 
                title in item['description'].lower() or
                any(word in item['title'].lower() for word in description.split()) or
                any(word in item['description'].lower() for word in description.split())):
                matches.append(item)
                
    return jsonify({"matches": matches})

if __name__ == '__main__':
    app.run(debug=True)