    # backend/run.py
# from app import create_app

# app = create_app()

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import os
import time
from functools import wraps

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create tables
with app.app_context():
    db.create_all()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split()[1]  # Remove 'Bearer' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split()[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user.is_admin:
                return jsonify({'message': 'Admin privileges required'}), 403
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(filename):
    timestamp = time.strftime('%Y%m%d_%H%M%S_')
    return timestamp + secure_filename(filename)

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ('name', 'email', 'password')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed_password = generate_password_hash(data['password'], method='sha256')
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        is_admin=data.get('isAdmin', False)
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'isAdmin': user.is_admin
        }
    })

# Product routes
@app.route('/api/products', methods=['GET'])
@token_required
def get_products(current_user):
    products = Product.query.all()
    return jsonify([{
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'image': product.image
    } for product in products])

@app.route('/api/products', methods=['POST'])
@admin_required
def add_product(current_user):
    data = request.get_json()
    
    if not all(k in data for k in ('name', 'price')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        product = Product(
            name=data['name'],
            price=float(data['price']),
            image=data.get('image', '')
        )
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'image': product.image
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(current_user, product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    try:
        if 'name' in data:
            product.name = data['name']
        if 'price' in data:
            product.price = float(data['price'])
        if 'image' in data:
            product.image = data['image']
        
        db.session.commit()
        return jsonify({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'image': product.image
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, product_id):
    product = Product.query.get_or_404(product_id)
    try:
        db.session.delete(product)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

# Cart routes
@app.route('/api/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': item.id,
        'product_id': item.product_id,
        'quantity': item.quantity
    } for item in cart_items])

@app.route('/api/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    data = request.get_json()
    
    if 'product_id' not in data:
        return jsonify({'message': 'Product ID is required'}), 400
    
    try:
        cart_item = CartItem.query.filter_by(
            user_id=current_user.id,
            product_id=data['product_id']
        ).first()
        
        if cart_item:
            cart_item.quantity += 1
        else:
            cart_item = CartItem(
                user_id=current_user.id,
                product_id=data['product_id'],
                quantity=1
            )
            db.session.add(cart_item)
            
        db.session.commit()
        return jsonify({
            'id': cart_item.id,
            'product_id': cart_item.product_id,
            'quantity': cart_item.quantity
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/api/cart/<int:product_id>', methods=['PUT'])
@token_required
def update_cart_quantity(current_user, product_id):
    data = request.get_json()
    if 'quantity' not in data:
        return jsonify({'message': 'Quantity is required'}), 400
        
    cart_item = CartItem.query.filter_by(
        user_id=current_user.id,
        product_id=product_id
    ).first_or_404()
    
    try:
        if data['quantity'] > 0:
            cart_item.quantity = data['quantity']
            db.session.commit()
            return jsonify({
                'id': cart_item.id,
                'product_id': cart_item.product_id,
                'quantity': cart_item.quantity
            })
        else:
            db.session.delete(cart_item)
            db.session.commit()
            return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/api/cart/<int:product_id>', methods=['DELETE'])
@token_required
def remove_from_cart(current_user, product_id):
    cart_item = CartItem.query.filter_by(
        user_id=current_user.id,
        product_id=product_id
    ).first_or_404()
    
    try:
        db.session.delete(cart_item)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

# File upload route
@app.route('/api/upload', methods=['POST'])
@admin_required
def upload_file(current_user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = generate_unique_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'filename': filename}), 200
    return jsonify({'message': 'File type not allowed'}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
    
# from flask import Flask, request, jsonify, send_from_directory
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from datetime import datetime
# import os
# from werkzeug.utils import secure_filename
# import time
# from functools import wraps

# app = Flask(__name__)
# CORS(app)

# # File Upload Configuration
# UPLOAD_FOLDER = 'uploads'
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# # Database Configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# # Models
# class Product(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     price = db.Column(db.Float, nullable=False)
#     image = db.Column(db.String(500))
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

# class CartItem(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
#     quantity = db.Column(db.Integer, default=1)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def generate_unique_filename(filename):
#     timestamp = time.strftime('%Y%m%d_%H%M%S_')
#     return timestamp + secure_filename(filename)

# with app.app_context():
#     db.create_all()

# # Hard-coded admin credentials and token (for demonstration only)
# ADMIN_USERNAME = 'admin'
# ADMIN_PASSWORD = 'password'
# ADMIN_TOKEN = 'secret-admin-token'

# # Admin Login Endpoint
# @app.route('/api/admin/login', methods=['POST'])
# def admin_login():
#     data = request.get_json()
#     if data.get('username') == ADMIN_USERNAME and data.get('password') == ADMIN_PASSWORD:
#         return jsonify({'token': ADMIN_TOKEN}), 200
#     return jsonify({'error': 'Invalid credentials'}), 401

# # Decorator to protect admin routes
# def admin_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         token = request.headers.get('Authorization')
#         if token != ADMIN_TOKEN:
#             return jsonify({'error': 'Unauthorized'}), 403
#         return f(*args, **kwargs)
#     return decorated_function

# # Public Product Endpoints
# @app.route('/api/products', methods=['GET'])
# def get_products():
#     products = Product.query.all()
#     return jsonify([{
#         'id': product.id,
#         'name': product.name,
#         'price': product.price,
#         'image': product.image
#     } for product in products])

# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# @app.route('/api/upload', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
#     if file and allowed_file(file.filename):
#         filename = generate_unique_filename(file.filename)
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#         return jsonify({'filename': filename}), 200
#     return jsonify({'error': 'File type not allowed'}), 400

# # Admin Protected Product Endpoints
# @app.route('/api/products', methods=['POST'])
# @admin_required
# def add_product():
#     data = request.get_json()
#     if not data.get('name') or not data.get('price'):
#         return jsonify({'error': 'Name and price are required'}), 400
#     try:
#         product = Product(
#             name=data['name'],
#             price=float(data['price']),
#             image=data.get('image', '')
#         )
#         db.session.add(product)
#         db.session.commit()
#         return jsonify({
#             'id': product.id,
#             'name': product.name,
#             'price': product.price,
#             'image': product.image
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# @app.route('/api/products/<int:product_id>', methods=['PUT'])
# @admin_required
# def update_product(product_id):
#     product = Product.query.get_or_404(product_id)
#     data = request.get_json()
#     if not data:
#         return jsonify({'error': 'No input data provided'}), 400

#     if 'name' in data:
#         product.name = data['name']
#     if 'price' in data:
#         try:
#             product.price = float(data['price'])
#         except ValueError:
#             return jsonify({'error': 'Invalid price value'}), 400
#     if 'image' in data:
#         product.image = data['image']
    
#     try:
#         db.session.commit()
#         return jsonify({
#             'id': product.id,
#             'name': product.name,
#             'price': product.price,
#             'image': product.image
#         }), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# @app.route('/api/products/<int:product_id>', methods=['DELETE'])
# @admin_required
# def delete_product(product_id):
#     product = Product.query.get_or_404(product_id)
#     try:
#         db.session.delete(product)
#         db.session.commit()
#         return '', 204
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# # Cart Endpoints
# @app.route('/api/cart', methods=['GET'])
# def get_cart():
#     cart_items = CartItem.query.all()
#     return jsonify([{
#         'id': item.id,
#         'product_id': item.product_id,
#         'quantity': item.quantity
#     } for item in cart_items])

# @app.route('/api/cart', methods=['POST'])
# def add_to_cart():
#     data = request.get_json()
#     if not data.get('product_id'):
#         return jsonify({'error': 'Product ID is required'}), 400
#     try:
#         # Check if product exists
#         Product.query.get_or_404(data['product_id'])
#         cart_item = CartItem.query.filter_by(product_id=data['product_id']).first()
#         if cart_item:
#             cart_item.quantity += 1
#         else:
#             cart_item = CartItem(product_id=data['product_id'])
#             db.session.add(cart_item)
#         db.session.commit()
#         return jsonify({
#             'id': cart_item.id,
#             'product_id': cart_item.product_id,
#             'quantity': cart_item.quantity
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# @app.route('/api/cart/<int:product_id>', methods=['PUT'])
# def update_cart_item(product_id):
#     data = request.get_json()
#     if 'quantity' not in data:
#         return jsonify({'error': 'Quantity is required'}), 400
#     cart_item = CartItem.query.filter_by(product_id=product_id).first()
#     if not cart_item:
#         return jsonify({'error': 'Cart item not found'}), 404
#     try:
#         new_quantity = int(data['quantity'])
#         if new_quantity < 1:
#             db.session.delete(cart_item)
#             db.session.commit()
#             return jsonify({'message': 'Item removed from cart'}), 200
#         cart_item.quantity = new_quantity
#         db.session.commit()
#         return jsonify({
#             'id': cart_item.id,
#             'product_id': cart_item.product_id,
#             'quantity': cart_item.quantity
#         }), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# @app.route('/api/cart/<int:product_id>', methods=['DELETE'])
# def remove_from_cart(product_id):
#     cart_item = CartItem.query.filter_by(product_id=product_id).first_or_404()
#     try:
#         db.session.delete(cart_item)
#         db.session.commit()
#         return '', 204
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# if __name__ == '__main__':
#     app.run(debug=True)
