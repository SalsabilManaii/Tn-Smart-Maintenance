import React, { useState, useEffect } from "react";
import "./admin.css";

const API = "http://localhost:8080/api/admin";

function Admin() {
const [activePage, setActivePage] = useState("Dashboard");
const [users, setUsers] = useState([]);
const [statistics, setStatistics] = useState({
    total: 0,
    administrateurs: 0,
    techniciens: 0,
    clients: 0,
    responsables: 0
});

const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);

const token = localStorage.getItem("token");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
};

useEffect(() => {
    if (!token) {
    window.location.href = "/login";
    return;
    }

    fetchUsers();
    fetchStatistics();
  }, []);

const fetchUsers = async () => {
    try {
    const response = await fetch(`${API}/users`, {
        headers
    });

    if (!response.ok) {
        throw new Error("Failed to load users");
    }

    const data = await response.json();
    setUsers(data);

    } catch (error) {
    console.error("Error loading users:", error);
    alert(error.message);
    } finally {
    setLoading(false);
    }
};

const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API}/statistics`, {
        headers
      });

      if (!response.ok) {
        throw new Error("Failed to load statistics");
      }

      const data = await response.json();
      setStatistics(data);

    } catch (error) {
      console.error("Statistics error:", error);
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      const response = await fetch(
        `${API}/users/${id}/role`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            role: newRole
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      const updatedUser = await response.json();

      setUsers(prev =>
        prev.map(user =>
          user.id === id ? updatedUser : user
        )
      );

      fetchStatistics();

      alert("Rôle modifié avec succès !");

    } catch (error) {
      console.error("Role update error:", error);
      alert(error.message);
    }
  };

  const deleteUser = async (id) => {

    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/users/${id}`,
        {
          method: "DELETE",
          headers
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(prev =>
        prev.filter(user => user.id !== id)
      );

      fetchStatistics();

      alert("Utilisateur supprimé avec succès !");

    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName =
      `${user.nom} ${user.prenom}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const menuItems = [
    "Dashboard",
    "Gestion des utilisateurs"
  ];

  const handleMenuClick = (item) => {
    setActivePage(item);
  };

  const renderDashboard = () => (
    <>
      <h1>Dashboard</h1>

      <p className="admin-subtitle">
        Bienvenue dans votre espace administrateur.
      </p>

      <div className="admin-stats">

        <div className="admin-stat-card">
          <h2>{statistics.total}</h2>
          <p>Total utilisateurs</p>
        </div>

        <div className="admin-stat-card">
          <h2>{statistics.administrateurs}</h2>
          <p>Administrateurs</p>
        </div>

        <div className="admin-stat-card">
          <h2>{statistics.clients}</h2>
          <p>Clients</p>
        </div>

        <div className="admin-stat-card">
          <h2>{statistics.techniciens}</h2>
          <p>Techniciens</p>
        </div>

        <div className="admin-stat-card">
          <h2>{statistics.responsables}</h2>
          <p>Responsables maintenance</p>
        </div>

      </div>

      <div className="admin-section">
        <h2>Utilisateurs récents</h2>

        <UserTable
          users={users.slice(-5).reverse()}
          onRoleChange={changeRole}
          onDelete={deleteUser}
        />
      </div>

      <button
        className="admin-primary-btn"
        onClick={() =>
          setActivePage("Gestion des utilisateurs")
        }
      >
        Gérer les utilisateurs
      </button>
    </>
  );

  const renderUsers = () => (
    <>
      <h1>Gestion des utilisateurs</h1>

      <p className="admin-subtitle">
        Consulter et gérer les comptes et les rôles.
      </p>

      <input
        type="text"
        className="admin-search"
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : (
        <UserTable
        users={filteredUsers}
        onRoleChange={changeRole}
    onDelete={deleteUser}
        />
      )}
    </>
  );

  return (
    <div className="admin-container">

    <aside className="admin-sidebar">

        <h2 className="admin-logo">
          TSM<span>.</span>
        </h2>

        <p className="admin-sidebar-label">
          ADMIN MENU
        </p>

        {menuItems.map(item => {
  let buttonClass = "admin-menu-item";
  let buttonText = "";

  if (activePage === item) {
    buttonClass = "admin-menu-item active";
  }

  if (item === "Dashboard") {
    buttonText = "Dashboard";
  } else {
    buttonText = " Gestion des utilisateurs";
  }

  return (
    <button
    key={item}
    className={buttonClass}
    onClick={() => handleMenuClick(item)}
    >
      {buttonText}
    </button>
  );
})}

        <button
          className="admin-logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>

      </aside>

      <main className="admin-main">

        <header className="admin-topbar">
          <span>{activePage}</span>

          <div className="admin-user-info">
            <div className="admin-avatar">A</div>
            <span>Administrateur</span>
          </div>
        </header>

        <div className="admin-page-content">
        {(() => {
            if (activePage === "Dashboard") {
            return renderDashboard();
            } else {
            return renderUsers();
            }
        })()}
</div>

    </main>
    </div>
  );
}

// USER TABLE COMPONENT
function UserTable({ users, onRoleChange, onDelete }) {

  const roles = [
    "Administrateur",
    "Technicien",
    "Client",
    "ResponsableMaintenance"
  ];

  return (
    <div className="admin-table-container">

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map(user => (

            <tr key={user.id}>

              <td>{user.id}</td>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>

              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    onRoleChange(user.id, e.target.value)
                  }
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <button
                  className="admin-delete-btn"
                  onClick={() => onDelete(user.id)}
                >
                  Supprimer
                </button>
              </td>

            </tr>

          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="6">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Admin;
