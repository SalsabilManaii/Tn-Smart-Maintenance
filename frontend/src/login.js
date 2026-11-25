import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                mdp: password
            })
        });

        const data = await response.json();

        console.log('Login response:', data);

      if (response.ok && data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data.id);

    const role = data.role.toUpperCase().replace('ROLE_', '');

    if (role === 'CLIENT') {
        navigate('/Main');
    }
    else if (role === 'TECHNICIEN') {
        navigate('/Technicien');
    }
    else if (role === 'RESPONSABLE') {
        navigate('/Responsable');
    }
    else if (role === 'ADMIN') {
        navigate('/Admin');
    }
} else {
    setError('Email ou mot de passe incorrect.');
}
} catch (err) {
        console.error('Login error:', err);
        setError('Impossible de se connecter au serveur.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}
    >
      <Card className="p-4 shadow" style={{ width: '400px' }}>

        <div className="text-center mb-4">
          <img
            src="/logo1.jpg"
            alt="Logo"
            style={{ width: '120px' }}
          />
        </div>

        <Form onSubmit={handleLogin}>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}
              required/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && (
            <div className="text-danger mb-3">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center mt-3">
            Pas de compte? <Link to="/register">Créer un compte</Link>
          </div>

        </Form>
      </Card>
    </div>
  );
}

export default Login;
