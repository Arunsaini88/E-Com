import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, LogIn, UserPlus, Edit, Search, Menu, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';


// -------------------------
// LoginView Component
// -------------------------
const LoginView = React.memo(({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loginError
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-red-500">{loginError}</p>}
            <Button type="submit" className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

// -------------------------
// RegisterView Component
// -------------------------
const RegisterView = React.memo(({
  registerName,
  setRegisterName,
  registerEmail,
  setRegisterEmail,
  registerPassword,
  setRegisterPassword,
  handleRegister,
  isAdmin,
  setIsAdmin
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="reg-name">Name</Label>
              <Input
                id="reg-name"
                autoComplete="name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_admin" className="text-black">Is_Admin</Label>
              <Input
                id="is_admin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Register
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

// -------------------------
// Header Component
// -------------------------
const Header = React.memo(({ user, cart, setShowCart, handleLogout }) => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* Top banner */}
      <div className="bg-gray-100 py-2 px-4 text-sm text-center border-b">
        Super Value Deals - Save more with coupons
        <div className="absolute right-4 top-2">
          <span className="flex items-center">
            <img src="/api/placeholder/16/16" alt="flag" className="w-4 h-4 mr-1" />
            English
          </span>
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-green-500 font-bold text-2xl mr-1">🛒</span>
          <span className="font-bold text-2xl">FreshCart</span>
        </div>
        
        {/* Search */}
        <div className="hidden md:flex relative w-1/3">
          <Input
            type="text"
            placeholder="Search for products..."
            className="w-full pr-10"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Button variant="outline" className="flex items-center">
              <img src="/api/placeholder/20/20" alt="location" className="w-5 h-5 mr-2" />
              Location
            </Button>
          </div>
          
          {user ? (
            <>
              <div className="hidden md:block">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/wishlist')}
                  className="relative"
                >
                  <Heart className="h-6 w-6" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-500">2</Badge>
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-500">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              </Button>
              
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>
              <LogIn className="h-5 w-5 mr-2" /> Login
            </Button>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-gray-100 border-y">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Button className="flex items-center bg-green-500 hover:bg-green-600 rounded-none py-3">
              <Menu className="h-5 w-5 mr-2" />
              All Departments
            </Button>
            
            <nav className="ml-4 flex">
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Home</a>
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Shop</a>
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Stores</a>
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Mega menu</a>
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Pages</a>
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Account</a>
              <a href="#" className="px-4 py-3 hover:text-green-500 font-medium">Docs</a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
});

// -------------------------
// Hero Banner Component
// -------------------------
const HeroBanner = () => {
  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="relative bg-green-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                Opening Sale Discount 50%
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                SuperMarket Daily
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fresh Grocery
              </h2>
              <p className="text-gray-600 mb-8">
                Introduced a new model for online grocery shopping
                <br />and convenient home delivery.
              </p>
              <div>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Shop Now
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img 
                src="/api/placeholder/500/400" 
                alt="Fresh groceries" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// Categories Component
// -------------------------
const Categories = () => {
  const categories = [
    { id: 1, name: "Dairy, Bread & Eggs", image: "/api/placeholder/120/120" },
    { id: 2, name: "Snack & Munchies", image: "/api/placeholder/120/120" },
    { id: 3, name: "Bakery & Biscuits", image: "/api/placeholder/120/120" },
    { id: 4, name: "Instant Food", image: "/api/placeholder/120/120" },
    { id: 5, name: "Tea, Coffee & Drinks", image: "/api/placeholder/120/120" },
    { id: 6, name: "Atta, Rice & Dal", image: "/api/placeholder/120/120" },
  ];
  
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Featured Categories</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <div key={category.id} className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 mb-3">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-contain border border-gray-200 rounded-lg p-2"
                />
              </div>
              <p className="text-center text-sm">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------------
// ProductCard Component
// -------------------------
const ProductCard = React.memo(({ product, addToCart }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="relative p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4 rounded-full bg-white h-8 w-8 hover:text-green-500"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <div className="h-40 flex items-center justify-center mb-4">
          <img 
            src={product.image || "/api/placeholder/200/200"} 
            alt={product.name} 
            className="h-full object-contain"
          />
        </div>
        <Badge className="absolute top-6 left-6 bg-green-500">Sale</Badge>
      </div>
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 mb-1">Category</div>
        <h3 className="font-medium mb-1 text-gray-800 truncate">{product.name}</h3>
        <div className="flex items-center mb-1">
          <div className="flex text-yellow-400">
            {"★★★★☆"}
          </div>
          <span className="text-xs text-gray-500 ml-1">4.5</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-gray-800">${parseFloat(product.price).toFixed(2)}</span>
            <span className="text-sm text-gray-500 line-through ml-2">$24.99</span>
          </div>
          <Button 
            onClick={() => addToCart(product)} 
            size="sm" 
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// -------------------------
// ProductsView Component
// -------------------------
const ProductsView = React.memo(({
  products,
  cart,
  setCart,
  user,
  showCart,
  setShowCart,
  handleLogout,
  addToCart,
  updateQuantity
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        user={user}
        cart={cart}
        setShowCart={setShowCart}
        handleLogout={handleLogout}
      />
      
      <HeroBanner />
      
      <Categories />
      
      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Popular Products</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
      
      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <Button variant="ghost" onClick={() => setShowCart(false)}>×</Button>
          </div>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button 
                onClick={() => setShowCart(false)}
                className="bg-green-500 hover:bg-green-600"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-20 h-20 mr-4">
                    <img
                      src={item.image || "/api/placeholder/80/80"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>${cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>${(cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) + 5).toFixed(2)}</span>
                </div>
                
                <Button className="w-full mt-6 bg-green-500 hover:bg-green-600">
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// -------------------------
// AdminView Component
// -------------------------
const AdminView = React.memo(({ products, setProducts, user, handleLogout }) => {
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setProdName('');
    setProdPrice('');
    setProdImage('');
    setEditingProduct(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: prodName,
          price: parseFloat(prodPrice),
          image: prodImage
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        resetForm();
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: prodName,
          price: parseFloat(prodPrice),
          image: prodImage
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p =>
          p.id === editingProduct.id ? updatedProduct : p
        ));
        setShowEditDialog(false);
        resetForm();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdPrice(product.price.toString());
    setProdImage(product.image || '');
    setShowEditDialog(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate('/products')}
            variant="outline"
          >
            View Store
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="flex justify-center items-center">
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md w-[500px]">
          <h2 className="text-2xl mb-4 text-center">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <Label htmlFor="prod-name">Product Name</Label>
              <Input
                id="prod-name"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="prod-price">Price ($)</Label>
              <Input
                id="prod-price"
                type="number"
                step="0.01"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="prod-image">Image URL</Label>
              <Input
                id="prod-image"
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </form>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex justify-center w-full">
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md w-[80%] mx-auto my-8">
          <table className="min-w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Price</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => {
                setShowEditDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});

// -------------------------
// Main App Component
// -------------------------
const App = () => {
  // Initialize user from localStorage to persist login on refresh.
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    return token && savedUser ? JSON.parse(savedUser) : null;
  });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  // Fetch products when user is available.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:5000/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/products');
        }
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      setLoginError('Network error: ' + error.message);
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setProducts([]);
    setLoginError('');
    navigate('/login');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          isAdmin: isAdmin
        }),
      });
      if (response.ok) {
        navigate('/login');
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setIsAdmin(false);
      } else {
        const data = await response.json();
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error during registration');
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginView
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            handleLogin={handleLogin}
            loginError={loginError}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterView
            registerName={registerName}
            setRegisterName={setRegisterName}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerPassword={registerPassword}
            setRegisterPassword={setRegisterPassword}
            handleRegister={handleRegister}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        }
      />
      <Route
        path="/products"
        element={
          user ? (
            <ProductsView
              products={products}
              cart={cart}
              setCart={setCart}
              user={user}
              showCart={showCart}
              setShowCart={setShowCart}
              handleLogout={handleLogout}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          user && user.isAdmin ? (
            <AdminView
              products={products}
              setProducts={setProducts}
              user={user}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

// -------------------------
// Root Component
// -------------------------
const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default Root;

