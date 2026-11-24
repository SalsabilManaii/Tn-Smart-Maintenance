import React, { useEffect, useState } from "react";
import "./interv.css";

function Intervention({ demande }) {
    const [techniciens, setTechniciens] = useState([]);
    const [techniciensLoading, setTechniciensLoading] = useState(true);

    const [datePrevue, setDatePrevue] = useState("");
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [type, setType] = useState("Corrective");
    const [priorite, setPriorite] = useState("Moyenne");
    const [technicienId, setTechnicienId] = useState("");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        setTechniciensLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
        "http://localhost:8080/api/personnes/techniciens",
        {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      }
        );

        if (!response.ok) {
      throw new Error("Impossible de charger la liste des techniciens.");
        }

        const data = await response.json();
        setTechniciens(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTechniciensLoading(false);
      }
    };

    fetchTechniciens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!demande) {
      setError("Veuillez d'abord sélectionner une demande.");
      return;
    }

    if (!datePrevue || !heureDebut || !heureFin || !technicienId) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (heureFin <= heureDebut) {
      setError("L'heure de fin doit être après l'heure de début.");
      return;
    }

    const responsableId = Number(localStorage.getItem("userId"));

    if (!responsableId) {
      setError("Identifiant du responsable introuvable. Veuillez vous reconnecter.");
      return;
    }

    const intervention = {
      datePrevue,
      heureDebut,
      heureFin,
      type,
      priorite,
      statut: "Planifiée",
      responsableId,
      demandeId: demande.id,
      technicienId: Number(technicienId)
    };

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/interventions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(intervention)
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erreur lors de la création de l'intervention.");
      }

      setSuccess("L'intervention a été créée avec succès !");
      setDatePrevue("");
      setHeureDebut("");
      setHeureFin("");
      setTechnicienId("");
      setType("Corrective");
      setPriorite("Moyenne");

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!demande) {
    return (
      <section className="intervention-container">
        <h2>Préparer une intervention</h2>
        <p className="intervention-empty">
          Sélectionnez d'abord une demande de maintenance pour préparer une intervention.
        </p>
      </section>
    );
  }

  return (
    <section className="intervention-container">
      <h2>Préparer une intervention</h2>

      <div className="intervention-demande">
        <h3>Demande sélectionnée</h3>
        <p><strong>Numéro :</strong> {demande.id}</p>
        <p><strong>Description :</strong> {demande.description || "Non renseignée"}</p>
        <p><strong>Localisation :</strong> {demande.localisation || "Non renseignée"}</p>
        <p><strong>Client :</strong> {demande.clientId || "Non renseigné"}</p>
      </div>

      {error && <p className="intervention-error">{error}</p>}
      {success && <p className="intervention-success">{success}</p>}

    <form onSubmit={handleSubmit} className="intervention-form">
        <div className="intervention-field">
        <label htmlFor="datePrevue">Date prévue</label>
        <input
    id="datePrevue"
    type="date"
    min={new Date().toISOString().split("T")[0]}
    value={datePrevue}
    onChange={(e) => setDatePrevue(e.target.value)}
    required
/>
   </div>

        <div className="intervention-row">
          <div className="intervention-field">
            <label htmlFor="heureDebut">Heure de début</label>
            <input
              id="heureDebut"
              type="time"
              value={heureDebut}
              onChange={(e) => setHeureDebut(e.target.value)}
              required
            />
          </div>

          <div className="intervention-field">
            <label htmlFor="heureFin">Heure de fin</label>
            <input
              id="heureFin"
              type="time"
              value={heureFin}
              onChange={(e) => setHeureFin(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="intervention-field">
          <label htmlFor="type">Type d'intervention</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Corrective">Corrective</option>
            <option value="Préventive">Préventive</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>

        <div className="intervention-field">
          <label htmlFor="priorite">Priorité</label>
          <select
            id="priorite"
            value={priorite}
            onChange={(e) => setPriorite(e.target.value)}
          >
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>

        <div className="intervention-field">
          <label htmlFor="technicien">Assigner un technicien</label>

          <select
            id="technicien"
            value={technicienId}
            onChange={(e) => setTechnicienId(e.target.value)}
            required
            disabled={techniciensLoading || techniciens.length === 0}
          >
            <option value="">
              {techniciensLoading
                ? "Chargement des techniciens..."
                : techniciens.length === 0
                ? "Aucun technicien disponible"
                : "Choisir un technicien"}
            </option>

            {techniciens.map((technicien) => (
              <option key={technicien.id} value={technicien.id}>
                {technicien.prenom} {technicien.nom}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="intervention-submit"
          disabled={saving || techniciensLoading || techniciens.length === 0}
        >
          {saving ? "Création en cours..." : "Créer l'intervention"}
        </button>
      </form>
    </section>
  );
}

export default Intervention;
