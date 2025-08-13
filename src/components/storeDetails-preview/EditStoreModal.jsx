import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  BsTrash,
  BsSave,
  BsPencil,
  BsChevronDown,
  BsChevronUp,
  BsPlusCircle,
} from "react-icons/bs";
import axios from "axios";

const durations = ["0.5", "1", "1.5", "2"];

const EditStoreModal = ({
  show,
  handleClose,
  store,
  isEditing,
  setIsEditing,
  handleDelete,
  handleUpdateStore,
}) => {
  const [form, setForm] = useState({
    ...store,
    isCafeEnabled: store?.isCafeEnabled ?? true,
    name: store.name,
    number: store.number,
    address: store.address,
    screens: JSON.parse(JSON.stringify(store.screens)),
  });
  const [openScreens, setOpenScreens] = useState({});
  const [error, setError] = useState("");

  const toggleScreen = (index) => {
    setOpenScreens((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleGameChange = (screenIdx, gameIdx, key, value) => {
    const newForm = { ...form };
    newForm.screens[screenIdx].games[gameIdx][key] = value;
    setForm(newForm);
  };

  const handlePriceChange = (screenIdx, gameIdx, duration, players, value) => {
    const newForm = { ...form };
    if (!newForm.screens[screenIdx].games[gameIdx].pricing[duration]) {
      newForm.screens[screenIdx].games[gameIdx].pricing[duration] = {};
    }
    newForm.screens[screenIdx].games[gameIdx].pricing[duration][players] = Number(value);
    setForm(newForm);
  };

const handleAddScreen = () => {
  const name = prompt("Enter new screen name:")?.trim();
  if (!name) return;

  const isDuplicate = form.screens.some(
    (screen) => screen.screenName.toLowerCase() === name.toLowerCase()
  );

  if (isDuplicate) {
    alert("⚠️ A screen with this name already exists.");
    return;
  }

  const newScreen = {
    screenName: name,
    games: [
      {
        gameName: "",
        allowedPlayers: 2,
        pricing: {
          "0.5": {},
          "1": {},
          "1.5": {},
          "2": {},
        },
      },
    ],
  };

  setForm({ ...form, screens: [...form.screens, newScreen] });
};



const handleDeleteScreen = (index) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this screen?");
  if (!confirmDelete) return;

  const updatedScreens = form.screens.filter((_, i) => i !== index);
  setForm({ ...form, screens: updatedScreens });

  setOpenScreens((prev) => {
    const updated = { ...prev };
    delete updated[index];
    return updated;
  });
};


  const handleUpdateSubmit = async () => {
    try {
      const res = await axios.put(
        `backend_path/api/admin/update-store/${store.number}`,
        form
      );
      handleUpdateStore(res.data);
      handleClose();
    } catch (err) {
      console.error("❌ Update error:", err);
      setError("❌ Update failed.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "✏️ Edit Store" : `🏪 ${store.name}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isEditing ? (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Store Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Store Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    value={form.number}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Enable Cafe</Form.Label>
                  <Form.Check
                    type="switch"
                    name="isCafeEnabled"
                    checked={form.isCafeEnabled}
                    onChange={handleInputChange}
                    label={form.isCafeEnabled ? "Enabled" : "Disabled"}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />

            {form.screens.map((screen, sIdx) => (
              <div key={sIdx} className="mb-3 border p-2 rounded bg-light-subtle">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="text-info mb-0">🎬 {screen.screenName}</h5>
                  <div>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDeleteScreen(sIdx)}
                    >
                      <BsTrash /> Delete Screen
                    </Button>
                    <Button variant="link" onClick={() => toggleScreen(sIdx)}>
                      {openScreens[sIdx] ? <BsChevronUp /> : <BsChevronDown />}
                    </Button>
                  </div>
                </div>

                {openScreens[sIdx] &&
                  screen.games.map((game, gIdx) => (
                    <div key={gIdx} className="border p-3 mb-2 rounded bg-white">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Game Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={game.gameName}
                              onChange={(e) =>
                                handleGameChange(sIdx, gIdx, "gameName", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Allowed Players</Form.Label>
                            <Form.Control
                              type="number"
                              value={game.allowedPlayers}
                              onChange={(e) =>
                                handleGameChange(
                                  sIdx,
                                  gIdx,
                                  "allowedPlayers",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <h6>Pricing</h6>
                      {durations.map((dur) => (
                        <Row key={dur} className="mb-2 align-items-center">
                          <Col md={2}>
                            <strong>{dur} hr</strong>
                          </Col>
                          {Array.from(
                            { length: parseInt(game.allowedPlayers || 0) },
                            (_, i) => i + 1
                          ).map((p) => (
                            <Col key={p} md={2} className="px-1">
                              <Form.Control
                                type="number"
                                className="text-center"
                                value={game.pricing?.[dur]?.[p] || ""}
                                onChange={(e) =>
                                  handlePriceChange(
                                    sIdx,
                                    gIdx,
                                    dur,
                                    p,
                                    e.target.value
                                  )
                                }
                              />
                            </Col>
                          ))}
                        </Row>
                      ))}
                    </div>
                  ))}
              </div>
            ))}

            <div className="text-center">
              <Button variant="outline-primary" onClick={handleAddScreen}>
                <BsPlusCircle className="me-2" />
                Add Screen
              </Button>
            </div>
          </Form>
        ) : (
          <div>
            <p>
              <strong>Store Number:</strong> {store.number}
            </p>
            <p>
              <strong>Address:</strong> {store.address}
            </p>
            {store.screens.map((screen, sIdx) => (
              <div key={sIdx} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-info">🎬 {screen.screenName}</h5>
                  <Button variant="link" onClick={() => toggleScreen(sIdx)}>
                    {openScreens[sIdx] ? <BsChevronUp /> : <BsChevronDown />}
                  </Button>
                </div>
                {openScreens[sIdx] &&
                  screen.games.map((game, gIdx) => (
                    <div key={gIdx} className="mt-2">
                      <p>
                        <strong>🎮 {game.gameName}</strong> - 👥{" "}
                        {game.allowedPlayers} players
                      </p>
                      <table className="table table-bordered table-sm text-center">
                        <thead className="table-light">
                          <tr>
                            <th>Duration</th>
                            {Array.from(
                              { length: parseInt(game.allowedPlayers || 0) },
                              (_, i) => i + 1
                            ).map((p) => (
                              <th key={p}>{p}P</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {durations.map((dur) => (
                            <tr key={dur}>
                              <td>{dur} hr</td>
                              {Array.from(
                                { length: parseInt(game.allowedPlayers || 0) },
                                (_, i) => i + 1
                              ).map((p) => (
                                <td key={p}>
                                  {game.pricing?.[dur]?.[p] ?? "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={() => handleDelete(store.number)}
        >
          <BsTrash className="me-2" /> Delete
        </Button>
        {isEditing ? (
          <Button variant="success" onClick={handleUpdateSubmit}>
            <BsSave className="me-2" /> Save
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <BsPencil className="me-2" /> Edit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditStoreModal;
