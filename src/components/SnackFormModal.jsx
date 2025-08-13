// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { toast } from 'react-hot-toast'; // ✅ Add toaster
// import Loader from '../pages/Loader';
// // 🔊 Make sure `notification.mp3` exists in your public folder

// export default function SnackFormModal({ show, onHide, onSave, snack }) {
//   const [form, setForm] = useState({ name: '', price: '', category: 'Snack' });
//   const [loading,setLoading]=useState(true)

//   useEffect(() => {
//     setLoading(true)
//     if (snack) {
//       setForm({ name: snack.name, price: snack.price, category: snack.category });
//     } else {
//       setForm({ name: '', price: '', category: 'Snack' });
//     }
//     setLoading(true)
//   }, [snack]);

//   const playSound = () => {
//     const audio = new Audio('/toast-sound.wav');
//     audio.play();
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (form.name && form.price && form.category) {
//       onSave({ ...snack, ...form, price: parseFloat(form.price) });
//       toast.success(snack ? 'Item updated successfully' : 'Item added successfully');
//       playSound();
//     } else {
//       toast.error('Please fill all fields');
//     }
//   };
//   if(loading){
//     return(
//       <Loader/>
//     )
//   }

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>{snack ? 'Edit Item' : 'Add Item'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group className="mb-2">
//             <Form.Label>Name</Form.Label>
//             <Form.Control
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Enter item name"
//             />
//           </Form.Group>
//           <Form.Group className="mb-2">
//             <Form.Label>Price (₹)</Form.Label>
//             <Form.Control
//               name="price"
//               type="number"
//               value={form.price}
//               onChange={handleChange}
//               placeholder="Enter price"
//             />
//           </Form.Group>
//           <Form.Group className="mb-2">
//             <Form.Label>Category</Form.Label>
//             <Form.Select name="category" value={form.category} onChange={handleChange}>
//               <option value="Snack">Snack</option>
//               <option value="Drink">Drink</option>
//             </Form.Select>
//           </Form.Group>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>Cancel</Button>
//         <Button variant="primary" onClick={handleSubmit}>{snack ? 'Update' : 'Add'}</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Loader from '../pages/Loader';

export default function SnackFormModal({ show, onHide, onSave, snack }) {
  const [form, setForm] = useState({ name: '', price: '', category: 'Snack' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      if (snack) {
        setForm({
          name: snack.name,
          price: snack.price,
          category: snack.category,
        });
      } else {
        setForm({ name: '', price: '', category: 'Snack' });
      }
      setLoading(false);
    }, 300); // simulate short loading time

    return () => clearTimeout(timer);
  }, [snack]);

  const playSound = () => {
    const audio = new Audio('/toast-sound.wav');
    audio.play();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.name && form.price && form.category) {
      onSave({ ...snack, ...form, price: parseFloat(form.price) });
      toast.success(snack ? 'Item updated successfully' : 'Item added successfully');
      playSound();
    } else {
      toast.error('Please fill all fields');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{snack ? 'Edit Item' : 'Add Item'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Price (₹)</Form.Label>
            <Form.Control
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Snack">Snack</option>
              <option value="Drink">Drink</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {snack ? 'Update' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
