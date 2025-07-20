
"""
DINE24 Restaurant Management System - Configuration Settings
Mock configuration file for resume showcase
"""

import os
from datetime import timedelta

class Config:
    """Base configuration class"""
    
    # Flask App Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dine24-restaurant-secret-key-2024'
    DEBUG = False
    TESTING = False
    
    # MongoDB Database Configuration
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/dine24_restaurant'
    MONGODB_DB_NAME = 'dine24_restaurant'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-dine24'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Email Configuration (SMTP)
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'noreply@dine24.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # AI Chatbot Configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    CHATBOT_MODEL = 'gpt-3.5-turbo'
    MAX_CHAT_HISTORY = 10
    
    # SMS Configuration (Twilio)
    TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')
    
    # File Upload Configuration
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
    
    # Redis Cache Configuration
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    CACHE_TYPE = 'redis'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Restaurant Business Configuration
    RESTAURANT_NAME = 'DINE24'
    RESTAURANT_PHONE = '+91 98765 43210'
    RESTAURANT_EMAIL = 'info@dine24.com'
    RESTAURANT_ADDRESS = '123 Food Street, Gourmet City, India'
    
    # Operating Hours
    OPENING_TIME = '11:00'
    CLOSING_TIME = '23:00'
    KITCHEN_CLOSING_TIME = '22:30'
    
    # Reservation Configuration
    MAX_RESERVATION_DAYS_ADVANCE = 30
    MIN_PARTY_SIZE = 1
    MAX_PARTY_SIZE = 12
    RESERVATION_TIME_SLOTS = [
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '18:00', '18:30', '19:00', '19:30',
        '20:00', '20:30', '21:00', '21:30', '22:00'
    ]
    
    # Payment Configuration
    PAYMENT_GATEWAY = 'razorpay'  # or 'stripe', 'paytm'
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
    
    # Tax Configuration
    GST_RATE = 0.18  # 18% GST
    SERVICE_CHARGE_RATE = 0.10  # 10% Service Charge
    
    # Analytics Configuration
    ANALYTICS_RETENTION_DAYS = 365
    ENABLE_REAL_TIME_ANALYTICS = True

class DevelopmentConfig(Config):
    """Development environment configuration"""
    DEBUG = True
    TESTING = False
    
    # Development Database
    MONGODB_URI = 'mongodb://localhost:27017/dine24_dev'
    
    # Development Email (Console output)
    MAIL_SUPPRESS_SEND = True
    MAIL_DEBUG = True
    
    # Development AI (Mock responses)
    USE_MOCK_AI_RESPONSES = True
    
    # Development Cache (Simple cache)
    CACHE_TYPE = 'simple'

class ProductionConfig(Config):
    """Production environment configuration"""
    DEBUG = False
    TESTING = False
    
    # Production Database (MongoDB Atlas)
    MONGODB_URI = os.environ.get('MONGODB_URI') or 'mongodb+srv://user:pass@cluster.mongodb.net/dine24_prod'
    
    # Production Security
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    PERMANENT_SESSION_LIFETIME = timedelta(hours=2)
    
    # Production Logging
    LOG_LEVEL = 'INFO'
    LOG_FILE = '/var/log/dine24/app.log'
    
    # Production Cache (Redis)
    REDIS_URL = os.environ.get('REDIS_URL')

class TestingConfig(Config):
    """Testing environment configuration"""
    DEBUG = True
    TESTING = True
    
    # Test Database
    MONGODB_URI = 'mongodb://localhost:27017/dine24_test'
    
    # Test Configuration
    WTF_CSRF_ENABLED = False
    MAIL_SUPPRESS_SEND = True
    
    # Mock services for testing
    USE_MOCK_PAYMENT_GATEWAY = True
    USE_MOCK_SMS_SERVICE = True
    USE_MOCK_EMAIL_SERVICE = True

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

# Restaurant Tables Configuration
RESTAURANT_TABLES = [
    # Main Dining Area
    {'table_number': 'A1', 'seating_capacity': 2, 'section': 'Main Dining'},
    {'table_number': 'A2', 'seating_capacity': 4, 'section': 'Main Dining'},
    {'table_number': 'A3', 'seating_capacity': 4, 'section': 'Main Dining'},
    {'table_number': 'A4', 'seating_capacity': 6, 'section': 'Main Dining'},
    {'table_number': 'A5', 'seating_capacity': 8, 'section': 'Main Dining'},
    
    # Window Side
    {'table_number': 'B1', 'seating_capacity': 2, 'section': 'Window Side'},
    {'table_number': 'B2', 'seating_capacity': 4, 'section': 'Window Side'},
    {'table_number': 'B3', 'seating_capacity': 6, 'section': 'Window Side'},
    
    # Private Dining
    {'table_number': 'C1', 'seating_capacity': 8, 'section': 'Private Dining'},
    {'table_number': 'C2', 'seating_capacity': 10, 'section': 'Private Dining'},
    
    # Outdoor Terrace
    {'table_number': 'T1', 'seating_capacity': 4, 'section': 'Terrace'},
    {'table_number': 'T2', 'seating_capacity': 6, 'section': 'Terrace'}
]

# Menu Categories
MENU_CATEGORIES = [
    'Appetizers',
    'Soups & Salads',
    'Main Course',
    'Vegetarian',
    'Seafood',
    'Grills & BBQ',
    'Rice & Biryani',
    'Breads',
    'Desserts',
    'Beverages',
    'Mocktails',
    'Coffee & Tea'
]

# AI Chatbot Intents and Responses
CHATBOT_INTENTS = {
    'greeting': {
        'patterns': ['hello', 'hi', 'hey', 'good morning', 'good evening'],
        'responses': [
            'Hello! Welcome to DINE24. How can I help you today?',
            'Hi there! I\'m here to assist you with our menu and reservations.',
            'Good day! What would you like to know about DINE24?'
        ]
    },
    'menu_inquiry': {
        'patterns': ['menu', 'food', 'dishes', 'what do you have', 'recommendations'],
        'responses': [
            'We have a diverse menu with Indian, Continental, and Chinese cuisines. Would you like recommendations for any specific category?',
            'Our popular dishes include Butter Chicken, Biryani, and Paneer Tikka. What type of cuisine are you in the mood for?'
        ]
    },
    'reservation': {
        'patterns': ['book table', 'reservation', 'book', 'table availability'],
        'responses': [
            'I\'d be happy to help you with a reservation! You can book a table through our website or call us at +91 98765 43210.',
            'To make a reservation, please provide your preferred date, time, and number of guests.'
        ]
    },
    'hours': {
        'patterns': ['timings', 'hours', 'open', 'close', 'when are you open'],
        'responses': [
            'We\'re open daily from 11:00 AM to 11:00 PM. Our kitchen closes at 10:30 PM.',
            'DINE24 is open every day from 11 AM to 11 PM. Last orders are taken at 10:30 PM.'
        ]
    }
}

def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])
