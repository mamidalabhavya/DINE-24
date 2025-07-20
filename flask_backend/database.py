
"""
DINE24 Restaurant Management System - MongoDB Database Configuration
Mock implementation for resume showcase
"""

from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from bson.objectid import ObjectId

class DatabaseManager:
    def __init__(self):
        # MongoDB connection (mock for resume showcase)
        self.connection_string = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
        self.database_name = 'dine24_restaurant'
        
        # Mock connection (in production would be actual MongoDB)
        self.client = None  # MongoClient(self.connection_string)
        self.db = None      # self.client[self.database_name]
        
        # Initialize collections
        self.collections = {
            'reservations': 'reservations',
            'menu_items': 'menu_items',
            'customers': 'customers',
            'orders': 'orders',
            'reviews': 'reviews',
            'analytics': 'analytics',
            'chat_logs': 'chat_logs',
            'admin_users': 'admin_users',
            'tables': 'restaurant_tables',
            'specials': 'todays_specials'
        }
        
        print("📊 MongoDB Database Manager initialized for DINE24")
    
    def connect(self):
        """Establish database connection"""
        try:
            # Mock connection (in production would connect to actual MongoDB)
            print("🔗 Connected to MongoDB successfully")
            return True
        except Exception as e:
            print(f"❌ Database connection failed: {str(e)}")
            return False
    
    def create_indexes(self):
        """Create database indexes for optimized queries"""
        indexes = {
            'reservations': [
                {'email': 1},
                {'arrival_date': 1},
                {'status': 1},
                {'created_at': -1}
            ],
            'menu_items': [
                {'category': 1},
                {'name': 1},
                {'rating': -1},
                {'orders_placed': -1}
            ],
            'customers': [
                {'email': 1},
                {'phone': 1}
            ],
            'orders': [
                {'reservation_id': 1},
                {'created_at': -1}
            ]
        }
        
        print("📋 Database indexes created successfully")
        return indexes
    
    # Reservation Management
    def create_reservation(self, reservation_data):
        """Insert new reservation into database"""
        try:
            reservation = {
                '_id': ObjectId(),
                'full_name': reservation_data['full_name'],
                'email': reservation_data['email'],
                'phone': reservation_data['phone'],
                'num_people': int(reservation_data['num_people']),
                'arrival_date': reservation_data['arrival_date'],
                'arrival_time': reservation_data['arrival_time'],
                'purpose': reservation_data.get('purpose', 'dining'),
                'table_number': reservation_data.get('table_number'),
                'table_capacity': reservation_data.get('table_capacity'),
                'status': 'confirmed',
                'total_amount': reservation_data.get('total_amount', 0),
                'order_type': reservation_data.get('order_type', 'dine-in'),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            # Mock insert (in production: self.db.reservations.insert_one(reservation))
            print(f"✅ Reservation created for {reservation['full_name']}")
            return str(reservation['_id'])
            
        except Exception as e:
            print(f"❌ Error creating reservation: {str(e)}")
            return None
    
    def get_reservations(self, filters=None, limit=None):
        """Retrieve reservations with optional filters"""
        try:
            query = filters or {}
            
            # Mock query (in production: self.db.reservations.find(query))
            mock_reservations = [
                {
                    '_id': ObjectId(),
                    'full_name': 'John Doe',
                    'email': 'john@example.com',
                    'phone': '+91 9876543210',
                    'num_people': 4,
                    'arrival_date': '2024-07-20',
                    'arrival_time': '19:30',
                    'table_number': 'A3',
                    'status': 'confirmed',
                    'total_amount': 1200,
                    'created_at': datetime.utcnow()
                }
            ]
            
            print(f"📋 Retrieved {len(mock_reservations)} reservations")
            return mock_reservations
            
        except Exception as e:
            print(f"❌ Error retrieving reservations: {str(e)}")
            return []
    
    # Menu Management
    def add_menu_item(self, item_data):
        """Add new menu item to database"""
        try:
            menu_item = {
                '_id': ObjectId(),
                'name': item_data['name'],
                'category': item_data['category'],
                'price': float(item_data['price']),
                'offer_price': item_data.get('offer_price'),
                'quantity': item_data['quantity'],
                'rating': item_data.get('rating', 0),
                'is_veg': item_data.get('is_veg', True),
                'orders_placed': 0,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            # Mock insert (in production: self.db.menu_items.insert_one(menu_item))
            print(f"🍽️ Menu item '{menu_item['name']}' added successfully")
            return str(menu_item['_id'])
            
        except Exception as e:
            print(f"❌ Error adding menu item: {str(e)}")
            return None
    
    def get_menu_items(self, category=None):
        """Retrieve menu items by category"""
        try:
            query = {'category': category} if category else {}
            
            # Mock query (in production: self.db.menu_items.find(query))
            mock_menu = [
                {
                    '_id': ObjectId(),
                    'name': 'Butter Chicken',
                    'category': 'Main Course',
                    'price': 450,
                    'quantity': '1 plate',
                    'rating': 4.5,
                    'is_veg': False,
                    'orders_placed': 45
                },
                {
                    '_id': ObjectId(),
                    'name': 'Paneer Tikka',
                    'category': 'Appetizers',
                    'price': 320,
                    'quantity': '6 pieces',
                    'rating': 4.3,
                    'is_veg': True,
                    'orders_placed': 32
                }
            ]
            
            print(f"🍽️ Retrieved {len(mock_menu)} menu items")
            return mock_menu
            
        except Exception as e:
            print(f"❌ Error retrieving menu items: {str(e)}")
            return []
    
    # Analytics and Reporting
    def get_analytics_data(self, date_range=None):
        """Generate analytics data for admin dashboard"""
        try:
            # Mock analytics data
            analytics = {
                'total_reservations': 150,
                'total_revenue': 75000,
                'average_order_value': 500,
                'popular_dishes': [
                    {'name': 'Butter Chicken', 'orders': 45},
                    {'name': 'Biryani', 'orders': 38},
                    {'name': 'Paneer Tikka', 'orders': 32}
                ],
                'peak_hours': {
                    '19:00-20:00': 25,
                    '20:00-21:00': 30,
                    '21:00-22:00': 22
                },
                'customer_satisfaction': 4.5,
                'table_utilization': 78.5,
                'generated_at': datetime.utcnow()
            }
            
            print("📊 Analytics data generated successfully")
            return analytics
            
        except Exception as e:
            print(f"❌ Error generating analytics: {str(e)}")
            return {}
    
    # Chat and AI Logs
    def log_chat_interaction(self, user_message, bot_response, metadata=None):
        """Log AI chatbot interactions for analysis"""
        try:
            chat_log = {
                '_id': ObjectId(),
                'user_message': user_message,
                'bot_response': bot_response,
                'metadata': metadata or {},
                'timestamp': datetime.utcnow(),
                'session_id': metadata.get('session_id') if metadata else None
            }
            
            # Mock insert (in production: self.db.chat_logs.insert_one(chat_log))
            print("💬 Chat interaction logged successfully")
            return str(chat_log['_id'])
            
        except Exception as e:
            print(f"❌ Error logging chat interaction: {str(e)}")
            return None
    
    # Table Management
    def get_available_tables(self, date, time, party_size):
        """Find available tables for given date, time, and party size"""
        try:
            # Mock table availability check
            available_tables = [
                {
                    '_id': ObjectId(),
                    'table_number': 'A3',
                    'seating_capacity': 4,
                    'section': 'Main Dining',
                    'is_available': True
                },
                {
                    '_id': ObjectId(),
                    'table_number': 'B2',
                    'seating_capacity': 6,
                    'section': 'Window Side',
                    'is_available': True
                }
            ]
            
            # Filter by party size
            suitable_tables = [
                table for table in available_tables 
                if table['seating_capacity'] >= party_size
            ]
            
            print(f"🪑 Found {len(suitable_tables)} available tables")
            return suitable_tables
            
        except Exception as e:
            print(f"❌ Error checking table availability: {str(e)}")
            return []
    
    def close_connection(self):
        """Close database connection"""
        try:
            # Mock close (in production: self.client.close())
            print("🔐 Database connection closed successfully")
            return True
        except Exception as e:
            print(f"❌ Error closing database connection: {str(e)}")
            return False

# Database instance
database = DatabaseManager()

# Database initialization function
def init_database():
    """Initialize database with sample data"""
    print("🚀 Initializing DINE24 Database...")
    
    if database.connect():
        database.create_indexes()
        print("✅ Database initialization completed successfully")
        return True
    else:
        print("❌ Database initialization failed")
        return False

if __name__ == '__main__':
    # Initialize database when run directly
    init_database()
    
    # Sample usage
    print("\n🧪 Testing Database Operations...")
    
    # Test reservation creation
    sample_reservation = {
        'full_name': 'Test Customer',
        'email': 'test@example.com',
        'phone': '+91 9876543210',
        'num_people': 2,
        'arrival_date': '2024-07-20',
        'arrival_time': '19:30',
        'purpose': 'dinner'
    }
    
    reservation_id = database.create_reservation(sample_reservation)
    print(f"Created reservation: {reservation_id}")
    
    # Test menu item addition
    sample_menu_item = {
        'name': 'Test Dish',
        'category': 'Main Course',
        'price': 299,
        'quantity': '1 plate',
        'is_veg': True
    }
    
    menu_id = database.add_menu_item(sample_menu_item)
    print(f"Added menu item: {menu_id}")
    
    # Test analytics
    analytics = database.get_analytics_data()
    print(f"Analytics generated: {analytics['total_reservations']} reservations")
    
    database.close_connection()
