import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import ArcadePreview from "./ArcadePreview";
import Loader from "../../pages/Loader";
import useGameStoreManager from "./useGameStoreManager";

const durations = ["0.5", "1", "1.5", "2"];

export default function GameStoreManager() {
  const {
    storeInfo,
    setStoreInfo,
    screens,
    setScreens,
    currentScreen,
    setCurrentScreen,
    editIndex,
    setEditIndex,
    preview,
    setPreview,
    loading,
    setLoading,
    handleStoreInfoChange,
    handleSaveStore,
    handleDelete,
    handleEdit,
    saveOrUpdateScreen,
    handlePriceChange,
    handleAllowedPlayersChange,
    handleRemoveGame,
    handleScreenNameChange,
    handleGameNameChange,
    handleAddGame,
  } = useGameStoreManager();

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h3 className="text-muted">
          🎮 Manage your store, screens, games, and pricing
        </h3>
      </div>

      {/* Store Info */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white fw-bold">
          🏪 Store Information
        </div>
        <div className="card-body row g-3">
          <div className="col-md-4">
            <label className="form-label">Store Name</label>
            <input
              type="text"
              className="form-control"
              value={storeInfo.name}
              onChange={(e) => handleStoreInfoChange("name", e.target.value)}
              placeholder="e.g. PixelPlay Arena"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Store Number</label>
            <input
              type="number"
              className="form-control"
              value={storeInfo.number}
              onChange={(e) => handleStoreInfoChange("number", e.target.value)}
              placeholder="e.g. 1"
              min="1"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Store Address</label>
            <input
              type="text"
              className="form-control"
              value={storeInfo.address}
              onChange={(e) => handleStoreInfoChange("address", e.target.value)}
              placeholder="e.g. Main Street, City"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Enable Cafe</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={storeInfo.isCafeEnabled}
                onChange={(e) => handleStoreInfoChange("isCafeEnabled", e.target.checked)}
              />
              <label className="form-check-label">
                {storeInfo.isCafeEnabled ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Screens */}
      {screens.length > 0 && (
        <div className="mb-4">
          <h4 className="fw-bold text-success">📺 Saved Screens</h4>
          {screens.map((screen, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
              style={{
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                fontSize: "0.95rem",
              }}
            >
              <div>
                <strong>{screen.screenName}</strong> — {screen.games.length}{" "}
                game(s)
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEdit(index)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(index)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screen Form */}
      <div className="card shadow mb-4 border-info">
        <div className="card-header bg-info text-white fw-bold">
          {editIndex !== null
            ? `✏️ Editing: ${currentScreen.screenName}`
            : "🎬 Add New Screen"}
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Screen Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Screen 1"
              value={currentScreen.screenName}
              onChange={(e) => handleScreenNameChange(e.target.value)}
            />
          </div>

          <button
            className="btn btn-sm btn-primary mb-3"
            onClick={handleAddGame}
          >
            ➕ Add Game
          </button>

          {currentScreen.games.map((game, gIdx) => {
            const maxPlayers = parseInt(game.allowedPlayers);
            const allowedPlayers = isNaN(maxPlayers)
              ? []
              : Array.from({ length: maxPlayers }, (_, i) => i + 1);

            return (
              <div key={gIdx} className="card bg-light mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Game Name"
                      value={game.gameName}
                      onChange={(e) =>
                        handleGameNameChange(gIdx, e.target.value)
                      }
                    />
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveGame(gIdx)}
                    >
                      ❌ Remove Game
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Allowed Players (just enter number, e.g. 3)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-control"
                      placeholder="e.g. 3"
                      value={game.allowedPlayers}
                      onChange={(e) =>
                        handleAllowedPlayersChange(gIdx, e.target.value)
                      }
                    />
                  </div>

                  {allowedPlayers.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover text-center align-middle">
                        <thead className="table-dark">
                          <tr>
                            <th>Duration ↓ / Players →</th>
                            {allowedPlayers.map((p) => (
                              <th key={p}>{p}P</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {durations.map((dur) => (
                            <tr key={dur}>
                              <td className="fw-bold">{dur} hr</td>
                              {allowedPlayers.map((p) => (
                                <td key={p}>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={game.pricing?.[dur]?.[p] || ""}
                                    min="0"
                                    step="0.01"
                                    onChange={(e) =>
                                      handlePriceChange(
                                        gIdx,
                                        dur,
                                        p,
                                        e.target.value === "" ? "" : parseFloat(e.target.value)
                                      )
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="text-end">
            <button className="btn btn-success" onClick={saveOrUpdateScreen}>
              {editIndex !== null ? "💾 Update Screen" : "💾 Save Screen"}
            </button>
          </div>
        </div>
      </div>

      {/* Save Entire Store */}
      <div className="text-center mt-4">
        <button
          className="btn btn-lg btn-warning px-5"
          onClick={handleSaveStore}
        >
          🚀 Save Store Data
        </button>
      </div>
    </div>
  );
}
