import { useEffect, useState } from 'react';
import { Table, Button, Card, Badge } from 'react-bootstrap';
import { toast, Toaster } from 'react-hot-toast';
import { BsPencilSquare, BsTrash, BsPlus } from 'react-icons/bs';
import SnackFormModal from './SnackFormModal';

const API_BASE_URL = 'VITE_BACKEND_PATH/api/admin';

export default function SnacksTable() {
  const [snacks, setSnacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSnack, setEditingSnack] = useState(null);

  useEffect(() => {
    fetchSnacks();
  }, []);

  const fetchSnacks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/snacks-and-drinks`);
      const data = await res.json();
      setSnacks(data);
    } catch (err) {
      toast.error('Failed to fetch snacks');
    }
  };

  const handleSave = async (snackData) => {
    try {
      const method = editingSnack ? 'PUT' : 'POST';
      const url = editingSnack
        ? `${API_BASE_URL}/snacks-and-drinks/${editingSnack._id}`
        : `${API_BASE_URL}/snacks-and-drinks`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snackData),
      });

      if (!res.ok) throw new Error('Save failed');

      toast.success(editingSnack ? 'Item updated' : 'Item added');
      setShowModal(false);
      setEditingSnack(null);
      fetchSnacks();
    } catch (err) {
      toast.error('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/snacks-and-drinks/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');
      toast.success('Item deleted');
      fetchSnacks();
    } catch (err) {
      toast.error('Error deleting item');
    }
  };

  const handleEdit = (snack) => {
    setEditingSnack(snack);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSnack(null);
    setShowModal(true);
  };

  const categories = ['Snack', 'Drink'];

  return (
    <>
      <Toaster position="top-right" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">🍿 Snacks & 🥤 Drinks Manager</h3>
        <Button variant="success" onClick={handleAdd}>
          <BsPlus className="me-2" />
          Add New
        </Button>
      </div>

      {categories.map((category) => (
        <Card key={category} className="mb-4 shadow-sm rounded-4">
          <Card.Header className="bg-dark text-white fs-5 d-flex align-items-center justify-content-between">
            <span>
              {category === 'Snack' ? '🍪' : '🥤'} {category}s
            </span>
            <Badge bg="light" text="dark">
              {snacks.filter((s) => s.category === category).length} items
            </Badge>
          </Card.Header>

          <Card.Body className="p-0">
            <Table hover responsive className="mb-0 table-borderless">
              <thead className="bg-light">
                <tr className="text-uppercase text-secondary">
                  <th className="ps-4">Name</th>
                  <th>Price (₹)</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {snacks
                  .filter((snack) => snack.category === category)
                  .map((snack) => (
                    <tr key={snack._id} className="align-middle">
                      <td className="ps-4 fw-semibold">{snack.name}</td>
                      <td>₹{snack.price}</td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(snack)}
                        >
                          <BsPencilSquare />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(snack._id)}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}

      <SnackFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        snack={editingSnack}
      />
    </>
  );
}
