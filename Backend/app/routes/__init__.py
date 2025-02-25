# backend/app/routes/__init__.py
from flask import Blueprint, jsonify, request
from app.models.product import Product
from app import db

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@api.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    
    if not all(key in data for key in ['name', 'price', 'image']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        product = Product(
            name=data['name'],
            price=float(data['price']),
            image=data['image']
        )
        db.session.add(product)
        db.session.commit()
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    try:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify