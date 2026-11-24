import React, { useState, useEffect } from "react";
const API = "http://localhost:8080/api";
function Demande({ onRequestsChange }) {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newRequest, setNewRequest] = useState({
    description: "",
    localisation: "",
    typeIntervention: "",
    priorite: ""
  });

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId");


  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${API}/demandes/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load requests");
      }

      const data = await response.json();

      setRequests(data);
      onRequestsChange(data);

    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
  if (token && clientId) {
    fetchRequests();
  }
}, []);

const saveRequest = async (e) => {
  e.preventDefault();
alert("Demande ajouté avec succès");

  if (
  !newRequest.description.trim() ||
  !newRequest.localisation.trim() ||
  !newRequest.typeIntervention ||
  !newRequest.priorite
  ) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const isEditing = editingId !== null;

    const url = isEditing
      ? `${API}/demandes/${editingId}`
      : `${API}/demandes`;

    const requestData = {
      description: newRequest.description,
      localisation: newRequest.localisation,
      typeIntervention: newRequest.typeIntervention,
      priorite: newRequest.priorite,
      statut: isEditing
        ? requests.find(r => r.id === editingId)?.statut || "En attente"
        : "En attente",
      clientId: Number(clientId)
    };

    console.log("Sending request:", requestData);

    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || "Server error");
    }

    resetForm();
    await fetchRequests();

  } catch (error) {
    console.error("Save request error:", error);
    alert(error.message);
  }
};

const editRequest = (request) => {
    setNewRequest({
    description: request.description || "",
    localisation: request.localisation || "",
    typeIntervention: request.typeIntervention || "",
    priorite: request.priorite || ""
    });

    setEditingId(request.id);
    setShowForm(true);
};

const deleteRequest = async (id) => {
    if (!window.confirm("Voulez-vous annuler cette demande ?")) {
    return;
    }

    try {
    const response = await fetch(
        `${API}/demandes/${id}`,
        {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
    );

    if (!response.ok) {
        throw new Error("Erreur lors de l'annulation");
    }

    alert("Demande annulée");
    fetchRequests();

    } catch (error) {
    console.error(error);
    alert(error.message);
    }
};

const resetForm = () => {
    setNewRequest({
    description: "",
    localisation: "",
    typeIntervention: "",
    priorite: ""
    });

    setEditingId(null);
    setShowForm(false);
};

return (
    <>
    <h1>Mes Demandes </h1>
<br></br>

    <button
        className="primary-btn"
        onClick={() => {
        if (showForm) {
            resetForm();
        } else {
            setShowForm(true);
        }
        }}
    >
        + Déclarer une demande de maintenance.
      </button>

      {showForm && (
        <form
          className="form-card"
          onSubmit={saveRequest}
        >
          <h3>
            {editingId
              ? "Modifier la demande"
              : "Nouvelle demande de maintenance"}
          </h3>

          <textarea
            placeholder="Ajouter une description du problème..."
            value={newRequest.description}
            onChange={e =>
            setNewRequest({
                ...newRequest,
                description: e.target.value})
            }
            required/>

        <input
            type="text"
            placeholder="Localisation"
            value={newRequest.localisation}
            onChange={e =>setNewRequest({
                ...newRequest,
                localisation: e.target.value})
            }
            required/>

        <select
            value={newRequest.typeIntervention}
            onChange={e =>
            setNewRequest({
                ...newRequest,
                typeIntervention: e.target.value})
            }
            required>
            <option value="">Type d'intervention</option>
            <option value="Corrective">Corrective</option>
            <option value="Preventive">Préventive</option>
            <option value="Urgente">Urgente</option>
        </select>

          <select
            value={newRequest.priorite}
            onChange={e =>
              setNewRequest({
                ...newRequest,
                priorite: e.target.value
              })
            }
            required
          >
            <option value="">Choisir la priorité</option>
            <option value="Faible">Faible</option>
            <option value="Normale">Normale</option>
            <option value="Haute">Haute</option>
            <option value="Urgente">Urgente</option>
          </select>

          <button type="submit" className="primary-btn">
            {editingId ? "Enregistrer" : "Envoyer la demande"}
          </button>

          <button type="button" onClick={resetForm}>
            Annuler
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
                <th>Description</th>
                <th>Localisation</th>
                <th>Type</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.description}</td>
                <td>{request.localisation}</td>
                <td>{request.typeIntervention}</td>
                <td>{request.priorite}</td>
                <td>
                  <span className="status">
                    {request.statut}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => editRequest(request)}
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteRequest(request.id)}
                  >
                    Annuler
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
              <td colSpan="6">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Demande;
