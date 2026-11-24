import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Responsable.css";
import Intervention from "../Intervention/intervention";

function Responsable() {
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("Dashboard");
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [NumDemande, setNumDemande] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tous");

   const [interventions, setInterventions] = useState([]);
    const [techniciens, setTechniciens] = useState([]);
    const [loadingInterventions, setLoadingInterventions] = useState(false);
    const [interventionError, setInterventionError] = useState("");
    const [selectedTechnicians, setSelectedTechnicians] = useState({});

    const token = localStorage.getItem("token");

    const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    useEffect(() => {
    fetch("http://localhost:8080/api/demandes", {
    headers: getHeaders()})
    .then((response) => {
    if (!response.ok) {
    throw new Error("Erreur lors du chargement des demandes");}
    return response.json();})
    .then((data) => setDemandes(data))
    .catch((err) => {
    console.error(err);
    setError("Impossible de charger les demandes.");})
    .finally(() => setLoading(false));
    }, []);

    const loadInterventions = async () => {
    setLoadingInterventions(true);
    setInterventionError("");

    try {
    const [interventionsResponse, techniciansResponse] =
    await Promise.all([
        fetch("http://localhost:8080/api/interventions", {
        headers: getHeaders()}),
        fetch("http://localhost:8080/api/personnes/techniciens", {
        headers: getHeaders()
    })
]);

    if (!interventionsResponse.ok || !techniciansResponse.ok) {
        throw new Error("Impossible de charger les données.");
    }

    const interventionsData = await interventionsResponse.json();
    const techniciansData = await techniciansResponse.json();

        setInterventions(interventionsData);
        setTechniciens(techniciansData);

    } catch (err) {
        console.error(err);
        setInterventionError(err.message);
        } finally {
            setLoadingInterventions(false);
        }
    };

    useEffect(() => {
        if (activePage === "Suivi interventions") {
            loadInterventions();
        }
    }, [activePage]);

    const reassignIntervention = async (intervention) => {
        const newTechnicianId =
            selectedTechnicians[intervention.id];

        if (!newTechnicianId) {
            alert("Veuillez sélectionner un technicien.");
            return;
        }

        const updatedIntervention = {
            datePrevue: intervention.datePrevue,
            heureDebut: intervention.heureDebut,
            heureFin: intervention.heureFin,
            statut: "Planifiée",
            type: intervention.type,
            priorite: intervention.priorite,
            responsableId: intervention.responsableId,
            demandeId: intervention.demandeId,
            technicienId: Number(newTechnicianId)
        };

        try {
            const response = await fetch(
                `http://localhost:8080/api/interventions/${intervention.id}`,
                {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify(updatedIntervention)
                }
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la réassignation.");
            }

            alert("Intervention réassignée avec succès !");
            loadInterventions();

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    
    const totalDemandes = demandes.length;

    const pending = demandes.filter(
        (d) => d.statut === "En attente"
    ).length;

    const inProgress = demandes.filter(
        (d) => d.statut === "En cours"
    ).length;

    const completed = demandes.filter(
        (d) => d.statut === "Terminée"
    ).length;

    const filteredDemandes = demandes.filter((demande) => {
        const matchesSearch =
            (demande.description || "").toLowerCase().includes(search.toLowerCase()) ||
            (demande.localisation || "").toLowerCase().includes(search.toLowerCase()) ||
            String(demande.clientId || "").includes(search);

        const matchesStatus =
        filterStatus === "Tous" || demande.statut === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const renderDashboard = () => (
        <>
            <div className="responsable-welcome">
                <div>
                <h1>Tableau de bord</h1>
                <p>Gérez les demandes et les interventions de maintenance.</p>
                </div>
                <span className="responsable-role">Responsable Maintenance</span>
            </div>

            <div className="responsable-stats">
                <div className="responsable-stat blue">
                    <span>Total des demandes</span>
                    <h2>{totalDemandes}</h2>
                </div>

                <div className="responsable-stat orange">
                    <span>En attente</span>
                    <h2>{pending}</h2>
                </div>

                <div className="responsable-stat purple">
                    <span>En cours</span>
                    <h2>{inProgress}</h2>
                </div>

                <div className="responsable-stat green">
                <span>Terminées</span>
                <h2>{completed}</h2>
                </div>
            </div>

            <section className="responsable-panel">
                <div className="responsable-panel-heading">
                    <div>
                        <h2>Demandes récentes</h2>
                        <p>Les dernières demandes envoyées par les clients.</p>
                    </div>

                    <button
                        className="responsable-link-button"
                        onClick={() => setActivePage("Demandes")}
                    >
                        Voir toutes les demandes
                    </button>
                </div>

                {loading && <p>Chargement des demandes...</p>}
                {error && <p className="responsable-error">{error}</p>}

                {!loading && !error && demandes.length === 0 && (
                    <p>Aucune demande pour le moment.</p>
                )}

                {!loading && demandes.slice(0, 5).map((demande) => (
                    <div className="responsable-request-row" key={demande.id}>
                        <div>
                        <h3>Demande {demande.id}</h3>
                        <p>{demande.localisation}</p>
                        <small>{demande.description}</small>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );

    const renderDemandes = () => (
        <section className="responsable-panel">
        <div className="responsable-panel-heading">
            <div>
                <h2>Gestion des demandes</h2>
                <p>Consultez et examinez les demandes des clients.</p>
                </div>
            </div>

            <div className="responsable-filters">
                <input
                    type="text"
                    placeholder="Rechercher une demande..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="Tous">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminée">Terminée</option>
                </select>
            </div>

            {loading && <p>Chargement des demandes...</p>}
            {error && <p className="resp-error">{error}</p>}

            {!loading && !error && filteredDemandes.length === 0 && (
                <p>Aucune demande trouvée.</p>)}

            {!loading && filteredDemandes.map((demande) => (
                <div className="request" key={demande.id}>
                    <div>
                        <h3>Demande #{demande.id}</h3>
                        <p>Client : #{demande.clientId}</p>
                        <p>Localisation : {demande.localisation}</p>
                        <small>{demande.description}</small>
                    </div>

                    <button
                        onClick={() => {
                            setNumDemande(demande);
                            setActivePage("Interventions");
                        }}
                    >
                        Préparer une intervention
                    </button>
                </div>
            ))}
        </section>
    );

    const SuiviInterventions = () => (
        <section className="responsable-panel">
        <h2>Suivi des interventions</h2>
        <p>Consultez les interventions et réassignez celles qui ont été refusées.</p>

        {loadingInterventions && <p>Chargement des interventions...</p>}

            {interventionError && (
                <p className="responsable-error">{interventionError}</p>
            )}

            {!loadingInterventions && interventions.length === 0 && (
                <p>Aucune intervention trouvée.</p>
            )}

        {!loadingInterventions && interventions.map((intervention) => (
            <div className="request" key={intervention.id}>
            <div>
            <h3>Intervention #{intervention.id}</h3>
            <p>Demande : #{intervention.demandeId}</p>
            <p>Type : {intervention.type}</p>
            <p>Date : {intervention.datePrevue}</p>
            <p>Technicien : #{intervention.technicienId}</p>
            <p>
            Statut : <strong>{intervention.statut}</strong>
            </p>
            </div>

        {intervention.statut === "Refusée" && (
                        <div>
                            <p>Choisir un nouveau technicien :</p>

                            <select
                                value={selectedTechnicians[intervention.id] || ""}
                                onChange={(e) =>
                                    setSelectedTechnicians({
                                        ...selectedTechnicians,
                                        [intervention.id]: e.target.value
                                    })
                                }
                            >
                                <option value="">Sélectionner un technicien</option>

        {techniciens .filter(
                        (tech) =>
                        tech.id !== intervention.technicienId)
                        .map((tech) => (
                        <option key={tech.id} value={tech.id}>
                        {tech.nom} {tech.prenom}
                        </option>))}
                        </select>

                            <button onClick={() => reassignIntervention(intervention)} >
                                Réassigner
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );

    return (
        <div className="responsable-layout">
            <aside className="responsable-sidebar">
                <div className="responsable-logo">
                    <h2>Tunisia</h2>
                    <span>Smart Maintenance</span>
                </div>

                <nav>
                    {[
                        "Dashboard",
                        "Demandes",
                        "Interventions",
                        "Suivi interventions",
                        "Planning",
                        "Techniciens",
                        "Rapports",
                    ].map((item) => (
                        <button
                            key={item}
                            className={activePage === item ? "active" : ""}
                            onClick={() => setActivePage(item)}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                <button
                    className="logout"
                    onClick={() => navigate("/login")} >
                    Déconnexion
                </button>
            </aside>

            <main className="responsable-main">
                <header className="responsable-header">
                    <div>
                        <h2>{activePage}</h2>
                        <p>Administration des opérations de maintenance</p>
                    </div>

                    <div className="responsable-user">
                        <div className="responsable-avatar">R</div>
                        <span>Responsable</span>
                    </div>
                </header>

                <div className="responsable-content">
                    {activePage === "Dashboard" && renderDashboard()}

                    {activePage === "Demandes" && renderDemandes()}

                    {activePage === "Interventions" && (
                        <Intervention demande={NumDemande} />
                    )}

                    {activePage === "Suivi interventions" &&
                        SuiviInterventions()}

                    {activePage === "Planning" && (
                        <section className="responsable-panel">
                            <h2>Planning</h2>
                            <p>La planification des interventions sera disponible ici.</p>
                        </section>
                    )}

                    {activePage === "Techniciens" && (
                        <section className="responsable-panel">
                            <h2>Gestion des techniciens</h2>
                            <p>La liste des techniciens sera affichée ici.</p>
                        </section>
                    )}

                    {activePage === "Rapports" && (
                        <section className="responsable-panel">
                            <h2>Rapports</h2>
                            <p>Les rapports de maintenance seront disponibles ici.</p>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Responsable;
