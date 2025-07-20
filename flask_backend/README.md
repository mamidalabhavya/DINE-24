
# DINE24 Restaurant Management System - Backend

**Developer:** MAMIDALA BHAVYA REDDY

## 🏗️ System Architecture & Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           DINE24 SYSTEM FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │    DATABASE     │
│   (React.js)    │────│   (Flask API)   │────│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST API      │    │ • Collections:  │
│ • Reservations  │    │ • Authentication│    │   - reservations│
│ • Menu Display  │    │ • Business Logic│    │   - menu_items  │
│ • AI Chat       │    │ • AI Integration│    │   - users       │
│ • Admin Panel   │    │ • Email Service │    │   - chat_logs   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EXTERNAL      │    │   AI SERVICES   │    │   EMAIL SERVICE │
│   SERVICES      │    │                 │    │                 │
│                 │    │ • OpenAI GPT    │    │ • Flask-Mail    │
│ • Payment Gateway│    │ • Recommendations│   │ • SMTP Config   │
│ • SMS Service   │    │ • Chat Support  │    │ • Confirmations │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features Overview

### 🍽️ Core Restaurant Features
- **Table Reservation System**: Complete booking and management
- **Dynamic Menu Management**: CRUD operations for restaurant menu
- **Real-time Analytics**: Business insights and reporting
- **Order Processing**: Handle customer orders and payments

### 🤖 AI-Powered Features
- **Intelligent Chatbot**: Customer support and food recommendations
- **Smart Recommendations**: AI-driven menu suggestions
- **Automated Responses**: 24/7 customer assistance

### 👨‍💼 Admin Features
- **Dashboard Analytics**: Comprehensive business overview
- **User Management**: Customer and staff administration
- **Menu Control**: Add, edit, delete menu items
- **Reservation Management**: View and manage all bookings

## 🛠️ Technology Stack

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) | **Web Framework** | Lightweight, flexible Python framework for rapid API development |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | **Database** | NoSQL database for flexible document storage and scalability |
| ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white) | **AI Services** | GPT integration for intelligent chatbot and recommendations |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | **Authentication** | Secure token-based authentication system |
| ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) | **Caching** | In-memory caching for improved performance |
| ![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=flat&logo=gunicorn&logoColor=white) | **WSGI Server** | Production-ready Python WSGI HTTP Server |

## 📋 API Endpoints Reference

### 🔐 Authentication
```
POST /api/auth/login        - Admin login
POST /api/auth/logout       - Admin logout
GET  /api/auth/verify       - Verify JWT token
```

### 🍽️ Reservations
```
POST /api/reservations      - Create new reservation
GET  /api/reservations      - Get all reservations (Admin)
PUT  /api/reservations/{id} - Update reservation status
DELETE /api/reservations/{id} - Cancel reservation
```

### 📖 Menu Management
```
GET    /api/menu           - Get all menu items
POST   /api/menu           - Add new menu item (Admin)
PUT    /api/menu/{id}      - Update menu item (Admin)
DELETE /api/menu/{id}      - Delete menu item (Admin)
```

### 🤖 AI Services
```
POST /api/ai-chat          - Chat with AI assistant
GET  /api/chat-logs        - Get chat history (Admin)
POST /api/recommendations  - Get AI food recommendations
```

### 📊 Analytics & Reports
```
GET /api/analytics         - Get restaurant analytics (Admin)
GET /api/reports/daily     - Generate daily reports (Admin)
GET /api/reports/monthly   - Generate monthly reports (Admin)
```

## 🗄️ Database Schema

### Reservations Collection
```json
{
  "_id": "ObjectId",
  "full_name": "string",
  "email": "string", 
  "phone": "string",
  "num_people": "number",
  "arrival_date": "date",
  "arrival_time": "time",
  "table_number": "string",
  "status": "confirmed|pending|cancelled",
  "total_amount": "number",
  "purpose": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Menu Items Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "category": "string",
  "price": "number",
  "offer_price": "number",
  "rating": "number",
  "is_veg": "boolean",
  "quantity": "string",
  "orders_placed": "number",
  "created_at": "datetime"
}
```

### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "password": "string (hashed)",
  "role": "admin|customer",
  "email": "string",
  "created_at": "datetime"
}
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- MongoDB 4.4+
- Redis (optional, for caching)

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd dine24-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=development
export MONGODB_URI=mongodb://localhost:27017/dine24
export SECRET_KEY=your-secret-key
export OPENAI_API_KEY=your-openai-key
export MAIL_USERNAME=your-email
export MAIL_PASSWORD=your-app-password

# Run application
python app.py
```

## 🔧 Configuration

### Environment Variables
```bash
FLASK_ENV=development
SECRET_KEY=your-super-secret-key
MONGODB_URI=mongodb://localhost:27017/dine24
OPENAI_API_KEY=your-openai-api-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
REDIS_URL=redis://localhost:6379
```

### Production Deployment
```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Using Docker
docker build -t dine24-backend .
docker run -p 5000:5000 dine24-backend
```

## 📊 System Monitoring

### Health Check
```bash
GET /api/health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00",
  "version": "1.0.0",
  "developer": "MAMIDALA BHAVYA REDDY"
}
```

### Logging
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Werkzeug secure password hashing
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting (production)

## 🚀 Performance Optimization

- **Database Indexing**: Optimized MongoDB indexes
- **Caching Strategy**: Redis caching for frequent queries
- **Connection Pooling**: MongoDB connection pooling
- **Async Processing**: Background task processing

## 🧪 Testing

```bash
# Run unit tests
python -m pytest tests/

# Run integration tests
python -m pytest tests/integration/

# Run with coverage
python -m pytest --cov=app tests/
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Multiple Flask instances
- MongoDB replica sets
- Redis clustering

### Performance Monitoring
- Application metrics
- Database performance
- Response time monitoring
- Error rate tracking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

### Code Standards
- Follow PEP 8 style guide
- Write comprehensive tests
- Document new features
- Update API documentation

## 📝 License
MIT License - see LICENSE file for details

## 👨‍💻 Developer Information

**Name:** MAMIDALA BHAVYA REDDY  
**Role:** Full Stack Developer  
**Specialization:** Python Backend Development, Restaurant Management Systems  
**Contact:** [LinkedIn](https://linkedin.com/in/mamidala-bhavya-reddy)

---

### 🎯 Project Goals
This system aims to provide a comprehensive restaurant management solution with modern AI integration, ensuring efficient operations and enhanced customer experience.

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Maintained by:** MAMIDALA BHAVYA REDDY
