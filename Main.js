import React, { useState, useEffect } from "react";
import Demande from "../components/Demande";
import "./Main.css";

const API = "http://localhost:8080/api";

function Main() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [openForm, setOpenForm] = useState(false);
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !clientId) {
      window.location.href = "/login";
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${API}/demandes/client/${clientId}`,
        { headers }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to load requests: ${response.status} ${errorText}`
        );
      }

      const responseText = await response.text();

console.log("HTTP Status:", response.status);
console.log("Backend response:", responseText);

const data = responseText ? JSON.parse(responseText) : [];

setRequests(data);

    } catch (error) {
      console.error("Error loading requests:", error);
    }
  };

  const handleMenuClick = (item) => {
    setOpenForm(false);
    setActivePage(item);
  };

  const pendingCount = requests.filter(
    (r) => r.statut === "En attente"
  ).length;

  const progressCount = requests.filter(
    (r) => r.statut === "En cours"
  ).length;

  const completedCount = requests.filter(
    (r) => r.statut === "Terminée"
  ).length;

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <p className="subtitle">
              Here's what's happening with your maintenance.
            </p>

            <div className="stats">
              <div className="stat-card">
                <h2>{requests.length}</h2>
                <p>Mes demandes</p>
              </div>

              <div className="stat-card">
                <h2>{pendingCount}</h2>
                <p>Demandes en attente</p>
              </div>

              <div className="stat-card">
                <h2>{progressCount}</h2>
                <p>Demandes en cours</p>
              </div>

              <div className="stat-card">
                <h2>{completedCount}</h2>
                <p>Demandes traitées</p>
              </div>
            </div>

            <div className="section">
              <h2>Recent Requests</h2>
              <RequestTable
                requests={requests.slice(-4).reverse()}
              />
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setOpenForm(true);
                setActivePage("Mes demandes");
              }}
            >
              + New Maintenance Request
            </button>
          </>
        );

      case "Mes demandes":
        return (
          <Demande
            onRequestsChange={setRequests}
            startWithForm={openForm}
          />
        );

      case "Historique":
        return (
          <>
            <h1>Intervention History</h1>
            <p className="subtitle">
              Your completed maintenance requests.
            </p>

            <RequestTable
              requests={requests.filter(
                (r) => r.statut === "Terminée"
              )}
            />
          </>
        );

      case "Messages":
        return (
          <>
            <h1>Messages</h1>
            <p className="subtitle">
              Communicate with your maintenance team.
            </p>

            <div className="empty-state">
              <h3>No messages yet</h3>
              <p>Your conversations will appear here.</p>
            </div>
          </>
        );

      default:
        return <h1>Page not found</h1>;
    }
  };

  const menuItems = [
    "Dashboard",
    "Mes demandes",
    "Historique",
    "Messages",
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">
          TSM<span>.</span>
        </h2>

        <p className="sidebar-label">CLIENT MENU</p>

        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className={activePage === item ? "menu-item active" : "menu-item"}
            onClick={() => handleMenuClick(item)}
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          className="logout-btn"
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

      <main className="main-content">
        <header className="topbar">
          <span>{activePage}</span>

          <div className="user-info">
            <div className="avatar">C</div>
            <span>Client</span>
          </div>
        </header>

        <div className="page-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function RequestTable({ requests }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Localisation</th>
            <th>Type</th>
            <th>Priorité</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
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
            </tr>
          ))}

          {requests.length === 0 && (
            <tr>
              <td colSpan="5">No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Main;
