import React, { useState, useEffect } from "react";
import axios from "axios";

const SnackSelector = ({ onChange, reset }) => {
  const [formData, setFormData] = useState({
    snackName: "",
    snackQuantity: 1,
    snackPrice: 0,
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState({ Snacks: [], Drinks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("backend_path/api/admin/snacks-and-drinks");
        const fetchedItems = res.data;

        const snacks = fetchedItems.filter((item) => item.category === "Snack");
        const drinks = fetchedItems.filter((item) => item.category === "Drink");

        setItems({ Snacks: snacks, Drinks: drinks });
      } catch (error) {
        console.error("Failed to fetch snacks and drinks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getItemUnitPrice = (name) => {
    const allItems = [...items.Snacks, ...items.Drinks];
    const found = allItems.find((item) => item.name === name);
    return found ? found.price : 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData };

    if (name === "snackName") {
      const unitPrice = getItemUnitPrice(value);
      updatedForm.snackName = value;
      updatedForm.snackPrice = unitPrice * updatedForm.snackQuantity;
    }

    if (name === "snackQuantity") {
      const quantity = parseInt(value, 10) || 1;
      const unitPrice = getItemUnitPrice(formData.snackName);
      updatedForm.snackQuantity = quantity;
      updatedForm.snackPrice = unitPrice * quantity;
    }

    setFormData(updatedForm);
  };

  const handleAddItem = () => {
    if (!formData.snackName || formData.snackQuantity <= 0) return;

    const exists = selectedItems.find((item) => item.snackName === formData.snackName);
    if (exists) return alert("Item already added.");

    setSelectedItems([...selectedItems, formData]);
    setFormData({ snackName: "", snackQuantity: 1, snackPrice: 0 });
  };

  const handleRemoveItem = (name) => {
    const filtered = selectedItems.filter((item) => item.snackName !== name);
    setSelectedItems(filtered);
  };

  const handleWheel = (e) => e.target.blur();

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.snackPrice, 0);


  useEffect(() => {
  if (onChange) {
    onChange({
      selectedItems,
      totalPrice,
    });
  }
}, [selectedItems, totalPrice]);


  useEffect(() => {
    setSelectedItems([]);
    setFormData({ snackName: "", snackQuantity: 1, snackPrice: 0 });
  }, [reset]);

  return (
    <div className="container my-4 p-3 bg-white shadow rounded">
      <h5 className="fw-bold mb-3">🎯 Select Snacks & Drinks, Optional</h5>

      {loading ? (
        <div className="text-muted">Loading options...</div>
      ) : (
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Item</label>
            <select
              name="snackName"
              value={formData.snackName}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select item</option>
              <optgroup label="Snacks">
                {items.Snacks.map((snack) => (
                  <option key={snack._id} value={snack.name}>
                    {snack.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Drinks">
                {items.Drinks.map((drink) => (
                  <option key={drink._id} value={drink.name}>
                    {drink.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Quantity</label>
            <input
              name="snackQuantity"
              type="number"
              min={1}
              value={formData.snackQuantity}
              onChange={handleInputChange}
              onWheel={handleWheel}
              className="form-control"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Price (₹)</label>
            <input
              name="snackPrice"
              type="number"
              value={formData.snackPrice}
              readOnly
              className="form-control-plaintext"
            />
          </div>

          <div className="col-md-2 d-grid">
            <button
              className="btn btn-success btn-sm"
              onClick={handleAddItem}
              disabled={!formData.snackName}
            >
              ➕ Add
            </button>
          </div>
        </div>
      )}

      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h6 className="fw-bold">🧾 Selected Items</h6>
          <ul className="list-group mb-3">
            {selectedItems.map((item, idx) => (
              <li
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{item.snackName}</strong> — {item.snackQuantity} × ₹
                  {getItemUnitPrice(item.snackName)} = ₹{item.snackPrice}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemoveItem(item.snackName)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="text-end fw-bold fs-6">
            Total: ₹{totalPrice}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnackSelector;
