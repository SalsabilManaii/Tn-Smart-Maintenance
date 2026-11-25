import React, { useState } from "react";

function Equipment({ equipment, setEquipment }) {
  const [showForm, setShowForm] = useState(false);

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    location: ""
  });

  const addEquipment = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Please log in again.");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/equipements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            description: newEquipment.name,
            categorie: newEquipment.type,
            localisation: newEquipment.location,
            statut: "Actif",
            clientId: Number(userId)
          })
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Backend error:", response.status, errorMessage);
        throw new Error(`Failed to save equipment (${response.status})`);
      }

      const savedEquipment = await response.json();

      setEquipment((prev) => [...prev, savedEquipment]);

      setNewEquipment({
        name: "",
        type: "",
        location: ""
      });

      setShowForm(false);
      alert("Equipment ajouté");

    } catch (error) {
      console.error("Erreur d'ajout", error);
      alert(error.message || "vérifiez les informations");
    }
  };

  return (
    <>
      <h1>My Equipment</h1>

      <p className="subtitle">
        Manage equipment.
      </p>

      <button
        className="primary-btn"
        onClick={() => setShowForm(!showForm)}
      >
        + ajouter un equipment
      </button>

      {showForm && (
        <form className="form-card" onSubmit={addEquipment}>

          <input  type="text" placeholder="Nom d'équipment" value={newEquipment.name}
            onChange={(e) => setNewEquipment({
                ...newEquipment,
                name: e.target.value
              })
            }
            required
          />

          <select value={newEquipment.type}  onChange={(e) => setNewEquipment({
                ...newEquipment,
                type: e.target.value
              })
            }
            required >
            <option value="">Selectionner le type d'equipment</option>
            <option value="Climatisation">Climatisation</option>
            <option value="Matériel informatique">Matériel informatique</option>
            <option value="Véhicules">Véhicules</option>
            <option value="Équipements industriels">
              Équipements industriels
            </option>
            <option value="Équipements électroménagers">
              Équipements électroménagers
            </option>
            <option value="Systèmes de sécurité">Systèmes de sécurité</option>
            <option value="Autres">Autres</option>
          </select>

          <input
            type="text"
            placeholder="Localisation de l'equipment"
            value={newEquipment.location}
            onChange={(e) =>
              setNewEquipment({
                ...newEquipment,
                location: e.target.value
              })
            }
            required
          />

          <button type="submit" className="primary-btn">
            enregister l'equipment
          </button>
        </form>
      )}

      <div className="equipment-grid">
        {equipment.map((item) => (
          <div className="equipment-card" key={item.id}>
            <h3>{item.description ?? item.name}</h3>
            <p>Type: {item.categorie ?? item.type}</p>
            <p>Localisation: {item.localisation ?? item.location}</p>
          </div>
        ))}

        {equipment.length === 0 && (
          <p className="empty-state">
            No equipment registered yet.
          </p>
        )}
      </div>
    </>
  );
}

export default Equipment;
