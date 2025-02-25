// AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = ({ setAdminToken }) => {
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const adminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials),
      });
      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        navigate('/'); // Redirect back to product page after successful login
      } else {
        alert('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="p-8 border rounded">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <form onSubmit={adminLogin} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={adminCredentials.username}
              onChange={(e) =>
                setAdminCredentials({ ...adminCredentials, username: e.target.value })
              }
              placeholder="Admin username"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={adminCredentials.password}
              onChange={(e) =>
                setAdminCredentials({ ...adminCredentials, password: e.target.value })
              }
              placeholder="Admin password"
              required
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
