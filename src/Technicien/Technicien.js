import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./Technicien.css";

function Technicien() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedMission, setSelectedMission] = useState(null);

  const [missions, setMissions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  const technicienId = localStorage.getItem("userId");
  const fetchInterventions = async () => {
    try {
      setLoading(true);
      setError("");

      const technicienId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!technicienId) {
        throw new Error("Identifiant du technicien introuvable. Veuillez vous reconnecter.");
      }

      const response = await fetch(
        `http://localhost:8080/api/interventions/technicien/${technicienId}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de charger vos interventions.");
      }

      const data = await response.json();
      console.log("Technicien ID:", technicienId);
      const formattedMissions = data.map(intervention => ({
        id: intervention.id,
        equipment: intervention.type || "Intervention",
        date: intervention.datePrevue,
        time: `${intervention.heureDebut || ""} - ${intervention.heureFin || ""}`,
        priority: intervention.priorite || "Non définie",
        status: intervention.statut,
        demandeId: intervention.demandeId
      }));

      setMissions(formattedMissions);
      console.log("Interventions reçues:", data);
      console.log("Missions formatées:", formattedMissions);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchInterventions();
}, []);
const updateStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:8080/api/interventions/${id}/statut`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          statut: newStatus
        })
      }
    );

    if (!response.ok) {
      throw new Error("Impossible de modifier le statut.");
    }

    const updatedIntervention = await response.json();

    setMissions(previousMissions =>
      previousMissions.map(mission =>
        mission.id === id
          ? { ...mission, status: updatedIntervention.statut }
          : mission
      )
    );

    setSelectedMission(previous =>
      previous && previous.id === id
        ? { ...previous, status: updatedIntervention.statut }
        : previous
    );

  } catch (error) {
    console.error(error);
    setError(error.message);
  }
};
  const pending = missions.filter(
  (m) => m.status === "Planifiée"
).length;

  const inProgress = missions.filter(
    (m) => m.status === "En cours"
  ).length;

  const completed = missions.filter(
    (m) => m.status === "Terminée"
  ).length;

  const renderStatus = (status) => (
    <span className={`status ${status.toLowerCase().replaceAll(" ", "-")}`}>
      {status}
    </span>
  );

  const renderDashboard = () => (
    <>
      <div className="welcome">
        <div>
          <h1>Bonjour, Technicien !</h1>
          <p>Voici un aperçu de vos interventions.</p>
        </div>
        <div className="today-date">
          Espace professionnel
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <span className="stat-icon">M</span>
          <div>
            <h2>{missions.length}</h2>
            <p>Missions assignées</p>
          </div>
        </div>

        <div className="stat-card orange">
          <span className="stat-icon">!</span>
          <div>
            <h2>{pending}</h2>
            <p>En attente</p>
          </div>
        </div>

        <div className="stat-card green">
          <span className="stat-icon">→</span>
          <div>
            <h2>{inProgress}</h2>
            <p>En cours</p>
          </div>
        </div>

        <div className="stat-card purple">
          <span className="stat-icon">✓</span>
          <div>
            <h2>{completed}</h2>
            <p>Terminées</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel missions-panel">
          <div className="panel-heading">
            <h2>Mes interventions</h2>
            <button
              className="text-button"
              onClick={() => setActivePage("Mes interventions")}
            >
              Voir tout →
            </button>
          </div>

          {missions.map((mission) => (
            <div className="mission-row" key={mission.id}>
              <div className="mission-placeholder">⚙</div>

              <div className="mission-info">
                <h3>{mission.equipment}</h3>
                <p>Demande #{mission.demandeId}</p>
                <small>
                  {mission.date} · {mission.time}
                </small>
              </div>

              <div className="mission-actions">
                {renderStatus(mission.status)}
                <button
                  className="details-button"
                  onClick={() => setSelectedMission(mission)}
                >
                  Détails
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="panel planning-panel">
          <div className="panel-heading">
            <h2>Planning du jour</h2>
          </div>

          {missions
            .filter((m) => m.date === "Aujourd'hui")
            .map((mission) => (
              <div className="schedule-item" key={mission.id}>
                <strong>{mission.time}</strong>
                <div>
                  <h4>{mission.equipment}</h4>
                  <p>{mission.location}</p>
                </div>
              </div>
            ))}

          <button
            className="secondary-button"
            onClick={() => setActivePage("Planning")}
          >
            Voir le planning complet
          </button>
        </section>
      </div>

      <section className="panel update-panel">
        <h2>Mise à jour rapide du statut</h2>

        {missions
          .filter((m) => m.status !== "Terminée")
          .map((mission) => (
            <div className="quick-update" key={mission.id}>
              <span>{mission.equipment}</span>

              <select
                value={mission.status}
                onChange={(e) =>
                  updateStatus(mission.id, e.target.value)
                }
              >
                <option>En attente</option>
                <option>Acceptée</option>
                <option>Planifiée</option>
                <option>En cours</option>
                <option>Terminée</option>
              </select>
            </div>
          ))}
      </section>
    </>
  );

  const renderInterventions = () => (
    <section className="panel">
      <div className="panel-heading">
        <h2>Mes interventions</h2>
      </div>

      {missions.map((mission) => (
        <div className="mission-row" key={mission.id}>
          <div className="mission-info">
            <h3>{mission.equipment}</h3>
            <p>Demande #{mission.demandeId} · {mission.date} · {mission.time}</p>
            <small>Priorité : {mission.priority}</small>
          </div>

          <div className="mission-actions">
            {renderStatus(mission.status)}
            <button
              className="details-button"
              onClick={() => setSelectedMission(mission)}
            >
              Voir détails
            </button>
          </div>
        </div>
      ))}
    </section>
  );

  const renderPlanning = () => (
    <section className="panel">
      <h2>Mon planning</h2>
      {missions.map((mission) => (
        <div className="schedule-item" key={mission.id}>
          <strong>{mission.date} · {mission.time}</strong>
          <div>
            <h4>{mission.equipment}</h4>
            <p>{mission.location}</p>
          </div>
          {renderStatus(mission.status)}
        </div>
      ))}
    </section>
  );

  const renderHistory = () => (
    <section className="panel">
      <h2>Historique des interventions</h2>
      {missions.filter((m) => m.status === "Terminée").length === 0
        ? <p>Aucune intervention terminée pour le moment.</p>
        : missions.filter((m) => m.status === "Terminée").map((mission) => (
            <div className="mission-row" key={mission.id}>
              <div className="mission-info">
                <h3>{mission.equipment}</h3>
                <p>{mission.location}</p>
              </div>
              {renderStatus(mission.status)}
            </div>
          ))}
    </section>
  );

  return (
    <div className="technicien-layout">
      <aside className="tech-sidebar">
        <div className="tech-logo">
          <h2>Tunisia</h2>
          <span>Smart Maintenance</span>
        </div>

        <nav>
          {[
            "Dashboard",
            "Mes interventions",
            "Planning",
            "Historique",
            "Mon profil",
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
          className="logout-button"
          onClick={() => navigate("/login")}
        >
          Déconnexion
        </button>
      </aside>

      <main className="tech-main">
        <header className="tech-header">
          <div>
            <h2>{activePage}</h2>
            <p>Gestion de vos missions professionnelles</p>
          </div>

          <div className="tech-user">
            <div className="user-avatar">T</div>
            <span>Technicien</span>
          </div>
        </header>

        <div className="tech-content">
          
          {activePage === "Dashboard" && renderDashboard()}
          {activePage === "Mes interventions" && renderInterventions()}
          {activePage === "Planning" && renderPlanning()}
          {activePage === "Historique" && renderHistory()}
          {activePage === "Mon profil" && (
            <section className="panel">
              <h2>Mon profil</h2>
              <p>Espace personnel du technicien.</p>
            </section>
          )}
        </div>
      </main>

      {selectedMission && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMission(null)}
        >
          <div
            className="mission-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setSelectedMission(null)}
            >
              ×
            </button>

            <h2>{selectedMission.equipment}</h2>

            <p><strong>Demande associée :</strong> #{selectedMission.demandeId}</p>
            <p><strong>Date :</strong> {selectedMission.date}</p>
            <p><strong>Horaire :</strong> {selectedMission.time}</p>
            <p><strong>Priorité :</strong> {selectedMission.priority}</p>
            <p><strong>Statut :</strong> {selectedMission.status}</p>

            {selectedMission.status === "Planifiée" && (
              <div className="modal-actions">
                <button
                  className="accept-button"
                  onClick={() => {
                    updateStatus(selectedMission.id, "Acceptée");
                    setSelectedMission(null);
                  }}
                >
                  Accepter
                </button>

                <button
                  className="refuse-button"
                  onClick={() => {
                    updateStatus(selectedMission.id, "Refusée");
                    setSelectedMission(null);
                  }}
                >
                  Refuser
                </button>
              </div>
            )}

            <button
              className="details-button"
              onClick={() => {
                updateStatus(selectedMission.id, "En cours");
                setSelectedMission(null);
              }}
              disabled={
                !["Acceptée", "Planifiée"].includes(selectedMission.status)
              }
            >
              Commencer l'intervention
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Technicien;
