// EcommerceStore.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EcommerceStore = ({ adminToken, setAdminToken }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart');
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setNewProduct({ ...newProduct, image: `http://localhost:5000/uploads/${data.filename}` });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken,
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: '', price: '', image: '' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': adminToken },
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': adminToken,
        },
        body: JSON.stringify(editProduct),
      });
      if (response.ok) {
        fetchProducts();
        setEditProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${productId}`, { method: 'DELETE' });
      fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItem = async (productId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">E-commerce Store</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowCart(!showCart)} className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </Button>
          {adminToken ? (
            <Button onClick={logoutAdmin}>Admin Logout</Button>
          ) : (
            <Button onClick={() => navigate('/admin/login')}>Admin Login</Button>
          )}
        </div>
      </div>

      {/* Admin Panel (if logged in) */}
      {adminToken && (
        <div className="mb-8 p-4 border rounded">
          <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <Input
                    id="image"
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                  {newProduct.image && (
                    <div className="mt-2">
                      <img
                        src={newProduct.image}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </form>
            </CardContent>
          </Card>
          {editProduct && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Product Name</Label>
                    <Input
                      id="editName"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPrice">Price</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editImage">Product Image URL</Label>
                    <Input
                      id="editImage"
                      value={editProduct.image}
                      onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="w-full">Update Product</Button>
                    <Button variant="destructive" onClick={() => setEditProduct(null)}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
              )}
              <p className="text-2xl font-bold">${product.price}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => addToCart(product)}>Add to Cart</Button>
              {adminToken && (
                <>
                  <Button onClick={() => setEditProduct(product)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <Button variant="ghost" onClick={() => setShowCart(false)}>×</Button>
          </div>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const product = products.find(p => p.id === item.product_id);
                if (!product) return null;
                return (
                  <Card key={item.id}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm">${product.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button onClick={() => updateCartItem(product.id, item.quantity - 1)}>-</Button>
                          <span>{item.quantity}</span>
                          <Button onClick={() => updateCartItem(product.id, item.quantity + 1)}>+</Button>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              <div className="pt-4 border-t">
                <p className="text-xl font-bold">
                  Total: ${cart.reduce((sum, item) => {
                    const product = products.find(p => p.id === item.product_id);
                    return sum + (product ? product.price * item.quantity : 0);
                  }, 0).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EcommerceStore;
