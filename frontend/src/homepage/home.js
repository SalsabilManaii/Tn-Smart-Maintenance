import { Link } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Navbar,
    Nav
} from 'react-bootstrap';

import './Home.css';

function Home() {
    return (
        <div className="home-page">

            {/* NAVBAR */}
            <Navbar expand="lg" className="home-navbar" sticky="top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="brand">
                        <span className="brand-icon">⚙</span>
                        Tunisia<span>Smart</span>Maintenance
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="home-navbar" />

                    <Navbar.Collapse id="home-navbar">
                        <Nav className="mx-auto nav-menu">
                            <Nav.Link href="#home">Accueil</Nav.Link>
                            <Nav.Link href="#services">Services</Nav.Link>
                            <Nav.Link href="#about">À propos</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav>

                        <div className="nav-auth">
                            <Button
                                as={Link}
                                to="/login"
                                variant="outline-primary"
                                className="login-btn"
                            >
                                Se connecter
                            </Button>

                            <Button
                                as={Link}
                                to="/register"
                                className="register-btn"
                            >
                                S'inscrire
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


            {/* HERO SECTION */}
            <section className="hero-section" id="home">
                <Container>
                    <Row className="align-items-center">

                        <Col lg={7} className="hero-content">
                            <span className="hero-label">
                                BIENVENUE CHEZ TUNISIA SMART MAINTENANCE
                            </span>

                            <h1>
                                La maintenance devient
                                <span> plus simple !</span>
                            </h1>

                            <p>
                                Une plateforme intelligente pour gérer vos
                                demandes de maintenance, suivre vos
                                interventions et rester en contact avec
                                nos techniciens.
                            </p>

                            <div className="hero-buttons">
                                <Button
                                    as={Link}
                                    to="/register"
                                    className="hero-primary"
                                >
                                    Commencer maintenant →
                                </Button>

                                <Button
                                    href="#services"
                                    variant="outline-primary"
                                    className="hero-secondary"
                                >
                                    Découvrir nos services
                                </Button>
                            </div>

                            <div className="hero-features">
                                <span>Suivi des interventions</span>
                                <span>Gestion simplifiée</span>
                                <span>Service efficace</span>
                            </div>
                        </Col>

                        <Col lg={5} className="hero-visual">
                            <div className="visual-circle">
                                <div className="floating-card card-one">
                                    <div>
                                        <strong>Maintenance</strong>
                                        <small>Intervention technique</small>
                                    </div>
                                </div>

                                <div className="floating-card card-two">
                                    <span>✓</span>
                                    <div>
                                        <strong>Suivi facile</strong>
                                        <small>En temps réel</small>
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>


            {/* SERVICES */}
            <section className="services-section" id="services">
                <Container>
                    <div className="section-heading">
                        <span>NOS SOLUTIONS</span>
                        <h2>Nos services</h2>
                        <p>
                            Des solutions adaptées à tous vos besoins
                            de maintenance.
                        </p>
                    </div>

                    <Row className="g-4">

                        <Col md={4}>
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <Card.Title>
                                        Maintenance corrective
                                    </Card.Title>
                                    <Card.Text>
                                        Déclarez vos pannes et demandez
                                        une intervention pour réparer
                                        vos équipements.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <Card.Title>Maintenance préventive</Card.Title>
                                    <Card.Text>   Planifiez les opérations de
                                        maintenance pour éviter les
                                        pannes et les problèmes.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <Card.Title>
                                        Suivi des interventions
                                    </Card.Title>
                                    <Card.Text>
                                        Consultez le statut de vos
                                        demandes et retrouvez
                                        l'historique de vos interventions.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Container>
            </section>


            {/* ABOUT / HOW IT WORKS */}
            <section className="about-section" id="about">
                <Container>
                    <div className="section-heading">
                        <span>SIMPLE ET RAPIDE</span>
                        <h2>Comment ça marche ?</h2>
                        <p>
                            Gérez vos demandes de maintenance en
                            quelques étapes.
                        </p>
                    </div>

                    <Row className="g-4">

                        <Col md={3}>
                            <div className="step-card">
                                <div className="step-number">01</div>
                                <h5>Créer un compte</h5>
                                <p>
                                    Inscrivez-vous pour accéder
                                    à votre espace client.
                                </p>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="step-card">
                                <div className="step-number">02</div>
                                <h5>Déclarer une panne</h5>
                                <p>
                                    Décrivez votre problème et
                                    envoyez votre demande.
                                </p>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="step-card">
                                <div className="step-number">03</div>
                                <h5>Suivre l'intervention</h5>
                                <p>
                                    Consultez l'avancement de
                                    votre intervention.
                                </p>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="step-card">
                                <div className="step-number">04</div>
                                <h5>Consulter le rapport</h5>
                                <p>
                                    Retrouvez le rapport après
                                    la réalisation du travail.
                                </p>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>


            {/* CONTACT CTA */}
            <section className="contact-section" id="contact">
                <Container>
                    <div className="contact-box">
                        <h2>Besoin d'une assistance ?</h2>
                        <p>
                            Notre équipe est à votre disposition
                            pour répondre à vos questions.
                        </p>

                        <Button> Contactez-nous → </Button>
                    </div>
                </Container>
            </section>

            <footer className="home-footer">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h5>
                                ⚙ Tunisia Smart Maintenance
                            </h5>
                            <p>
                                Votre partenaire pour une maintenance
                                intelligente et efficace.
                            </p>
                        </Col>

                        <Col md={6} className="footer-links">
                            <a href="#home">Accueil</a>
                            <a href="#services">Services</a>
                            <a href="#about">À propos</a>
                            <a href="#contact">Contact</a>
                        </Col>
                    </Row>

                    <hr />

                    <p className="copyright">
                        © 2026 Tunisia Smart Maintenance. Tous droits réservés.
                    </p>
                </Container>
            </footer>

        </div>
    );
}

export default Home;
