// StoreDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { BsShop, BsTrash, BsPencil } from "react-icons/bs";
import EditStoreModal from "./EditStoreModal";

const StoreDetails = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await axios.get("backend_path/api/admin/get-all-stores");
      setStores(res.data);
    } catch (err) {
      setError("❌ Failed to fetch stores.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (store) => {
    setSelectedStore(store);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedStore(null);
    setShowModal(false);
  };

  const handleDelete = async (number) => {
    if (!window.confirm("Delete this store?")) return;
    try {
      await axios.delete(`backend_path/api/admin/delete-store/${number}`);
      setStores((prev) => prev.filter((s) => s.number !== number));
      handleCloseModal();
    } catch (err) {
      setError("❌ Delete failed.");
    }
  };

  const handleUpdateStore = (updatedStore) => {
    setStores((prev) => prev.map((s) => (s._id === updatedStore._id ? updatedStore : s)));
    setSelectedStore(updatedStore);
    setIsEditing(false);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-primary">🏬 Store Management</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading stores...</p>
        </div>
      ) : (
        <div className="row g-4">
          {stores.map((store) => (
            <div key={store._id} className="col-md-4">
              <div
                className="card shadow h-100 border-0"
                onClick={() => handleOpenModal(store)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded-circle p-3 me-3">
                      <BsShop size={24} />
                    </div>
                    <h5 className="card-title mb-0">{store.name}</h5>
                  </div>
                  <p className="mb-1"><strong>Number:</strong> {store.number}</p>
                  <p className="mb-1"><strong>Address:</strong> {store.address}</p>
                  <p className="mb-1"><strong>Cafe Status:</strong>{" "}
                    <span className={store.isCafeEnabled ? "text-success" : "text-danger"}>
                      {store.isCafeEnabled ? "Enabled ☕" : "Disabled"}
                    </span>
                  </p>
                  <p className="text-muted small">🎮 {store.screens.length} screen(s)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedStore && (
        <EditStoreModal
          show={showModal}
          handleClose={handleCloseModal}
          store={selectedStore}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleDelete={handleDelete}
          handleUpdateStore={handleUpdateStore}
        />
      )}
    </div>
  );
};

export default StoreDetails;
