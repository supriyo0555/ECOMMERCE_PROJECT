import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./addresses.css";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    type: "home",
    isDefault: false,
  });

  // Load addresses
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addresses") || "[]");
    setAddresses(saved);
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      type: "home",
      isDefault: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Save address
  const saveAddress = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      alert("Please fill all fields!");
      return;
    }

    let updated;
    if (editingId) {
      updated = addresses.map(addr => 
        addr.id === editingId ? { ...formData, id: editingId } : addr
      );
    } else {
      updated = [...addresses, { ...formData, id: Date.now() }];
    }

    // If marking as default, unmark others
    if (formData.isDefault) {
      updated = updated.map(addr => ({
        ...addr,
        isDefault: addr.id === (editingId || formData.id)
      }));
    }

    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    resetForm();
  };

  // Delete address
  const deleteAddress = (id) => {
    const updated = addresses.filter(addr => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  // Edit address
  const editAddress = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  // Set as default
  const setAsDefault = (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  return (
    <div className="addresses-page">
      <div className="addresses-container">
        {/* Header */}
        <div className="addresses-header">
          <h1><FaMapMarkerAlt className="me-2" /> My Addresses</h1>
          <button 
            className="btn-add-address"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add New Address
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="address-form-wrapper">
            <form className="address-form" onSubmit={saveAddress}>
              <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="House No., Building Name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                  />
                  <label htmlFor="isDefault">Set as default address</label>
                </div>
              </div>

              <div className="form-buttons">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        <div className="addresses-list">
          {addresses.length > 0 ? (
            <div className="addresses-grid">
              {addresses.map(addr => (
                <div key={addr.id} className={`address-card ${addr.isDefault ? "default" : ""}`}>
                  <div className="address-header">
                    <h4>
                      <FaMapMarkerAlt className="me-2" />
                      {addr.type.toUpperCase()}
                      {addr.isDefault && <span className="badge-default">Default</span>}
                    </h4>
                  </div>

                  <div className="address-details">
                    <p><strong>{addr.name}</strong></p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="phone">📱 {addr.phone}</p>
                  </div>

                  <div className="address-actions">
                    {!addr.isDefault && (
                      <button 
                        className="btn-default"
                        onClick={() => setAsDefault(addr.id)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      className="btn-edit"
                      onClick={() => editAddress(addr)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="btn-delete-addr"
                      onClick={() => deleteAddress(addr.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-addresses">
              <FaMapMarkerAlt className="empty-icon" />
              <p>No addresses added yet</p>
              <button className="btn-add-first" onClick={() => setShowForm(true)}>
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;
