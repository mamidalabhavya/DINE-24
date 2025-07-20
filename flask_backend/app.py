
"""
DINE24 Restaurant Management System - Backend API
Developer: MAMIDALA BHAVYA REDDY
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import logging
from config import Config
from database import DatabaseManager
import openai
from bson import ObjectId
import jwt

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, origins=["http://localhost:5173", "https://your-frontend-domain.com"])
mail = Mail(app)
db_manager = DatabaseManager()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI for AI chatbot
openai.api_key = os.getenv('OPENAI_API_KEY')

# Utility function to convert ObjectId to string
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

# Authentication decorator
def token_required(f):
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['user_id']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Find admin user
        admin = db_manager.find_one('users', {'username': username, 'role': 'admin'})
        
        if admin and check_password_hash(admin['password'], password):
            # Generate JWT token
            token = jwt.encode({
                'user_id': str(admin['_id']),
                'username': username,
                'role': 'admin',
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': str(admin['_id']),
                    'username': username,
                    'role': 'admin'
                }
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

# Reservation Routes
@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'phone', 'num_people', 'arrival_date', 'arrival_time']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Create reservation document
        reservation = {
            'full_name': data['full_name'],
            'email': data['email'],
            'phone': data['phone'],
            'num_people': int(data['num_people']),
            'arrival_date': data['arrival_date'],
            'arrival_time': data['arrival_time'],
            'table_number': data.get('table_number'),
            'purpose': data.get('purpose', ''),
            'status': 'confirmed',
            'total_amount': data.get('total_amount', 0),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert reservation
        result = db_manager.insert_one('reservations', reservation)
        reservation['_id'] = str(result.inserted_id)
        
        # Send confirmation email
        try:
            send_confirmation_email(reservation)
        except Exception as email_error:
            logger.warning(f"Email sending failed: {str(email_error)}")
        
        return jsonify({
            'success': True,
            'message': 'Reservation created successfully',
            'reservation': serialize_doc(reservation)
        })
        
    except Exception as e:
        logger.error(f"Reservation creation error: {str(e)}")
        return jsonify({'error': 'Failed to create reservation'}), 500

@app.route('/api/reservations', methods=['GET'])
@token_required
def get_reservations(current_user):
    try:
        # Get query parameters
        status = request.args.get('status')
        date = request.args.get('date')
        
        # Build query
        query = {}
        if status:
            query['status'] = status
        if date:
            query['arrival_date'] = date
        
        # Fetch reservations
        reservations = list(db_manager.find('reservations', query))
        return jsonify({
            'success': True,
            'reservations': serialize_docs(reservations)
        })
        
    except Exception as e:
        logger.error(f"Get reservations error: {str(e)}")
        return jsonify({'error': 'Failed to fetch reservations'}), 500

# Menu Management Routes
@app.route('/api/menu', methods=['GET'])
def get_menu():
    try:
        category = request.args.get('category')
        query = {}
        if category:
            query['category'] = category
            
        menu_items = list(db_manager.find('menu_items', query))
        return jsonify({
            'success': True,
            'menu_items': serialize_docs(menu_items)
        })
        
    except Exception as e:
        logger.error(f"Get menu error: {str(e)}")
        return jsonify({'error': 'Failed to fetch menu'}), 500

@app.route('/api/menu', methods=['POST'])
@token_required
def add_menu_item(current_user):
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Create menu item
        menu_item = {
            'name': data['name'],
            'category': data['category'],
            'price': float(data['price']),
            'offer_price': data.get('offer_price'),
            'rating': data.get('rating', 4.0),
            'is_veg': data.get('is_veg', True),
            'quantity': data.get('quantity', ''),
            'orders_placed': 0,
            'created_at': datetime.utcnow()
        }
        
        result = db_manager.insert_one('menu_items', menu_item)
        menu_item['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'message': 'Menu item added successfully',
            'menu_item': serialize_doc(menu_item)
        })
        
    except Exception as e:
        logger.error(f"Add menu item error: {str(e)}")
        return jsonify({'error': 'Failed to add menu item'}), 500

# AI Chatbot Routes
@app.route('/api/ai-chat', methods=['POST'])
def ai_chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get restaurant context
        menu_items = list(db_manager.find('menu_items', {}))
        menu_context = ", ".join([item['name'] for item in menu_items[:10]])
        
        # Create AI prompt
        system_prompt = f"""You are DINE24's AI assistant, a helpful restaurant chatbot. 
        Our menu includes: {menu_context}
        
        Help customers with:
        - Menu recommendations
        - Reservation assistance
        - Restaurant information
        - General dining queries
        
        Be friendly, professional, and focus on food and dining topics."""
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Log conversation
        chat_log = {
            'user_message': user_message,
            'ai_response': ai_response,
            'timestamp': datetime.utcnow()
        }
        db_manager.insert_one('chat_logs', chat_log)
        
        return jsonify({
            'success': True,
            'response': ai_response
        })
        
    except Exception as e:
        logger.error(f"AI chat error: {str(e)}")
        return jsonify({'error': 'AI service temporarily unavailable'}), 500

# Analytics Routes
@app.route('/api/analytics', methods=['GET'])
@token_required
def get_analytics(current_user):
    try:
        # Get basic analytics
        total_reservations = db_manager.count('reservations')
        total_menu_items = db_manager.count('menu_items')
        
        # Recent reservations
        recent_reservations = list(db_manager.find(
            'reservations', 
            {}, 
            sort=[('created_at', -1)], 
            limit=5
        ))
        
        # Popular menu items
        popular_items = list(db_manager.find(
            'menu_items', 
            {}, 
            sort=[('orders_placed', -1)], 
            limit=5
        ))
        
        return jsonify({
            'success': True,
            'analytics': {
                'total_reservations': total_reservations,
                'total_menu_items': total_menu_items,
                'recent_reservations': serialize_docs(recent_reservations),
                'popular_items': serialize_docs(popular_items)
            }
        })
        
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500

# Email utility function
def send_confirmation_email(reservation):
    try:
        msg = Message(
            subject=f"Reservation Confirmed - DINE24 Restaurant",
            sender=app.config['MAIL_USERNAME'],
            recipients=[reservation['email']]
        )
        
        msg.html = f"""
        <h2>Reservation Confirmed!</h2>
        <p>Dear {reservation['full_name']},</p>
        <p>Your table reservation has been confirmed.</p>
        
        <h3>Reservation Details:</h3>
        <ul>
            <li><strong>Date:</strong> {reservation['arrival_date']}</li>
            <li><strong>Time:</strong> {reservation['arrival_time']}</li>
            <li><strong>Table:</strong> {reservation.get('table_number', 'TBD')}</li>
            <li><strong>Guests:</strong> {reservation['num_people']}</li>
        </ul>
        
        <p>Thank you for choosing DINE24!</p>
        <p>Contact: +91 98765 43210</p>
        """
        
        mail.send(msg)
        logger.info(f"Confirmation email sent to {reservation['email']}")
        
    except Exception as e:
        logger.error(f"Email sending error: {str(e)}")
        raise

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'developer': 'MAMIDALA BHAVYA REDDY'
    })

if __name__ == '__main__':
    # Create default admin user if not exists
    try:
        admin_exists = db_manager.find_one('users', {'username': 'admin'})
        if not admin_exists:
            admin_user = {
                'username': 'admin',
                'password': generate_password_hash('admin123'),
                'role': 'admin',
                'email': 'admin@dine24.com',
                'created_at': datetime.utcnow()
            }
            db_manager.insert_one('users', admin_user)
            print("Default admin user created: admin/admin123")
    except Exception as e:
        print(f"Database initialization error: {e}")
    
    print("DINE24 Restaurant Management System")
    print("Developer: MAMIDALA BHAVYA REDDY")
    print("Starting server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
