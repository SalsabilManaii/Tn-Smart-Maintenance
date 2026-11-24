import { useState } from 'react';
import { Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

function Register() {

    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const [confirmMdp, setConfirmMdp] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Password security validation
    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&!%_*+\-]).{8,}$/;

        return passwordRegex.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        // Check password strength
        if (!validatePassword(mdp)) {
            setError(
                'Le mot de passe doit contenir au moins 8 caractères, ' +
                'une majuscule, une minuscule, un chiffre et un caractère spécial (@, #, &, _, !...).'
            );
            return;
        }

        // Check password confirmation
        if (mdp !== confirmMdp) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nom,
                    prenom,
                    email,
                    mdp
                })
            });

            const data = await response.json();

            console.log('Register response:', data);

                if (response.ok) {
            setMessage(data.message || "Compte créé avec succès !");
            setError("");
        } else {
            setError(data.message || "Erreur lors de la création du compte.");
        }

        } catch (err) {
            console.error('Register error:', err);
            setError('Erreur lors de la création du compte.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center"
             style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>

            <Card className="p-4 shadow" style={{ width: '400px' }}>

                <div className="text-center mb-4">
                    <img
                        src="/logo1.jpg"
                        alt="Logo"
                        style={{ width: '120px' }}
                    />
                </div>

                <Form onSubmit={handleRegister}>

                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Family Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your family name"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Create password"
                            value={mdp}
                            onChange={(e) => setMdp(e.target.value)}
                            required
                        />

                        <Form.Text className="text-muted">
                            Votre mot de passe doit contenir :
                            <ul className="mb-0">
                                <li>Au moins 8 caractères</li>
                                <li>Une lettre majuscule et une lettre minuscule</li>
                                <li>Un chiffre</li>
                                <li>Un caractère spécial (@, #, &, _, !...)</li>
                            </ul>
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Repeat password"
                            value={confirmMdp}
                            onChange={(e) => setConfirmMdp(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </Button>

                    <div className="text-center mt-3">
                        Vous avez déja un compte? <Link to="/">Sign In</Link>
                    </div>

                </Form>
            </Card>
        </div>
    );
}

export default Register;
