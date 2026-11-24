import React, { useEffect, useState } from "react";

function Demandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/demandes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des demandes");
        }
        return response.json();
      })
      .then((data) => {
        setDemandes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des demandes...</p>;

  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="demandes-container">
      <h2>Demandes de maintenance</h2>

      {demandes.length === 0 ? (
        <p>Aucune demande disponible.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Localisation</th>
              <th>Type</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Client ID</th>
            </tr>
          </thead>

          <tbody>
            {demandes.map((demande) => (
              <tr key={demande.id}>
                <td>{demande.id}</td>
                <td>{demande.description}</td>
                <td>{demande.localisation}</td>
                <td>{demande.typeIntervention}</td>
                <td>{demande.priorite}</td>
                <td>{demande.statut}</td>
                <td>{demande.clientId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Demandes;