import { useContext, useState, useEffect } from "react";
import "./afterlogin.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaBox, FaHeart, FaShoppingCart, FaCog, FaSignOutAlt, FaHistory, FaTrophy, FaHeadphones, FaCreditCard, FaTrash, FaCamera } from "react-icons/fa";

const AfterLogin = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [upiMethods, setUpiMethods] = useState([]);
  const [bankMethods, setBankMethods] = useState([]);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [upiData, setUpiData] = useState({ upiId: "" });
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolder: ""
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    dp: null,
  });

  useEffect(() => {
    loadPaymentMethods();
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    setProfileData({
      name: user?.name || savedProfile.name || "",
      email: user?.email || savedProfile.email || "",
      phone: savedProfile.phone || "",
      dp: savedProfile.dp || null,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          dp: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileData = () => {
    localStorage.setItem("userProfile", JSON.stringify(profileData));
    alert("Profile updated successfully!");
    setShowProfileEdit(false);
  };

  const loadPaymentMethods = () => {
    const methods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
    setUpiMethods(methods.filter(m => m.type === "upi"));
    setBankMethods(methods.filter(m => m.type === "bank"));
  };

  const addUPIMethod = () => {
    if (!upiData.upiId.trim()) {
      alert("Please enter a valid UPI ID");
      return;
    }

    const methods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
    methods.push({
      id: Date.now(),
      type: "upi",
      upiId: upiData.upiId,
      isActive: true
    });

    localStorage.setItem("paymentMethods", JSON.stringify(methods));
    loadPaymentMethods();
    setUpiData({ upiId: "" });
    setShowUPIForm(false);
    alert("UPI added successfully!");
  };

  const addBankMethod = () => {
    if (!bankData.bankName || !bankData.accountNumber || !bankData.ifscCode || !bankData.accountHolder) {
      alert("Please fill all bank details");
      return;
    }

    const methods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
    methods.push({
      id: Date.now(),
      type: "bank",
      bankName: bankData.bankName,
      accountNumber: bankData.accountNumber,
      ifscCode: bankData.ifscCode,
      accountHolder: bankData.accountHolder,
      isActive: true
    });

    localStorage.setItem("paymentMethods", JSON.stringify(methods));
    loadPaymentMethods();
    setBankData({ bankName: "", accountNumber: "", ifscCode: "", accountHolder: "" });
    setShowBankForm(false);
    alert("Bank account added successfully!");
  };

  const deletePaymentMethod = (id) => {
    const methods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
    const updated = methods.filter(m => m.id !== id);
    localStorage.setItem("paymentMethods", JSON.stringify(updated));
    loadPaymentMethods();
    alert("Payment method deleted!");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="account-page">
      {/* PROFILE HERO SECTION */}
      <div className="profile-hero">
        <div className="profile-bg"></div>
        <div className="profile-content">
          <div className="profile-avatar-large" style={{ cursor: 'pointer' }} onClick={() => setShowProfileEdit(!showProfileEdit)}>
            {profileData.dp ? (
              <img src={profileData.dp} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="profile-info">
            <h1>{profileData.name || user?.name || "User"}</h1>
            <p className="profile-email">{profileData.email || user?.email}</p>
            <div className="member-badge">✨ Premium Member</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* PROFILE EDIT MODAL */}
      {showProfileEdit && (
        <div className="profile-edit-modal">
          <div className="profile-edit-card">
            <h3>Edit Profile</h3>
            
            <div className="dp-upload-section">
              <label htmlFor="dpInput" className="dp-upload-btn">
                <FaCamera /> Upload Profile Picture
              </label>
              <input
                type="file"
                id="dpInput"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
              {profileData.dp && (
                <img src={profileData.dp} alt="Preview" className="dp-preview" />
              )}
            </div>

            <div className="profile-form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                placeholder="Your name"
              />
            </div>

            <div className="profile-form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>

            <div className="profile-form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="10-digit phone number"
              />
            </div>

            <div className="profile-edit-buttons">
              <button className="btn-cancel" onClick={() => setShowProfileEdit(false)}>Cancel</button>
              <button className="btn-save" onClick={saveProfileData}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN ACTIONS - Orders, Wishlist, Cart */}
      <div className="actions-section">
        <h2>My Activity</h2>
        <div className="actions-grid">
          <div className="action-card main-action" onClick={() => navigate('/cart')}>
            <div className="action-icon"><FaShoppingCart /></div>
            <h3>My Cart</h3>
            <p>View & manage items</p>
          </div>
          <div className="action-card main-action" onClick={() => navigate('/wishlist')}>
            <div className="action-icon"><FaHeart /></div>
            <h3>Wishlist</h3>
            <p>Saved items</p>
          </div>
          <div className="action-card main-action" onClick={() => navigate('/order-history')}>
            <div className="action-icon"><FaBox /></div>
            <h3>Orders</h3>
            <p>Order history</p>
          </div>
        </div>
      </div>

      {/* RECENTLY VIEWED SECTION */}
      <div className="recent-section">
        <h2>Recently Viewed</h2>
        <div className="recent-grid">
          <div className="recent-card">
            <div className="recent-img">👔</div>
            <p>Men's Fashion</p>
          </div>
          <div className="recent-card">
            <div className="recent-img">👟</div>
            <p>Sports & Shoes</p>
          </div>
          <div className="recent-card">
            <div className="recent-img">📱</div>
            <p>Electronics</p>
          </div>
          <div className="recent-card">
            <div className="recent-img">🎧</div>
            <p>Accessories</p>
          </div>
        </div>
      </div>

      {/* ACCOUNT SETTINGS SECTION */}
      <div className="settings-section">
        <h2>Account Settings</h2>
        <div className="settings-list">
          <div className="setting-item" onClick={() => navigate('/profile')}>
            <div className="setting-icon"><FaUser /></div>
            <div className="setting-text">
              <h4>My Profile</h4>
              <p>Update personal information</p>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item" onClick={() => navigate('/addresses')}>
            <div className="setting-icon">📍</div>
            <div className="setting-text">
              <h4>Saved Addresses</h4>
              <p>Manage delivery addresses</p>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item" onClick={() => navigate('/seller-landing')}>
            <div className="setting-icon"><FaTrophy /></div>
            <div className="setting-text">
              <h4>Earn on ShopHub</h4>
              <p>Become a seller and earn</p>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item" onClick={() => navigate('/order-history')} style={{ cursor: 'pointer' }}>
            <div className="setting-icon"><FaHistory /></div>
            <div className="setting-text">
              <h4>My Reviews & Activity</h4>
              <p>View your product reviews</p>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item" style={{ cursor: 'pointer' }} onClick={() => alert('Customer Support: Contact us at support@shophub.com')}>
            <div className="setting-icon"><FaHeadphones /></div>
            <div className="setting-text">
              <h4>Customer Support</h4>
              <p>Get help and support</p>
            </div>
            <span className="arrow">›</span>
          </div>

          <div className="setting-item" style={{ cursor: 'pointer' }} onClick={() => alert('Account Security is managed through your profile settings')}>
            <div className="setting-icon"><FaCog /></div>
            <div className="setting-text">
              <h4>Account Settings</h4>
              <p>Security & privacy settings</p>
            </div>
            <span className="arrow">›</span>
          </div>
        </div>
      </div>

      {/* PAYMENT METHODS SECTION */}
      <div className="payment-section">
        <h2>Payment Methods</h2>
        
        {/* UPI PAYMENT */}
        <div className="payment-subsection">
          <div className="payment-header">
            <div className="payment-title">
              <span className="payment-icon">📱</span>
              <h3>UPI Payment</h3>
            </div>
            <button 
              className="add-payment-btn"
              onClick={() => setShowUPIForm(!showUPIForm)}
            >
              {showUPIForm ? "Cancel" : "+ Add UPI"}
            </button>
          </div>

          {showUPIForm && (
            <div className="payment-form">
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@bank)"
                value={upiData.upiId}
                onChange={(e) => setUpiData({ upiId: e.target.value })}
                className="form-input"
              />
              <button className="save-btn" onClick={addUPIMethod}>
                Save UPI
              </button>
            </div>
          )}

          <div className="payment-list">
            {upiMethods.length > 0 ? (
              upiMethods.map(method => (
                <div key={method.id} className="payment-item">
                  <div className="payment-details">
                    <span className="payment-method-icon">✓</span>
                    <div className="payment-info">
                      <p className="payment-method-name">{method.upiId}</p>
                      <p className="payment-method-type">UPI ID</p>
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deletePaymentMethod(method.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p className="no-payment">No UPI methods saved</p>
            )}
          </div>
        </div>

        {/* BANK ACCOUNT PAYMENT */}
        <div className="payment-subsection">
          <div className="payment-header">
            <div className="payment-title">
              <span className="payment-icon">🏦</span>
              <h3>Bank Account</h3>
            </div>
            <button 
              className="add-payment-btn"
              onClick={() => setShowBankForm(!showBankForm)}
            >
              {showBankForm ? "Cancel" : "+ Add Bank"}
            </button>
          </div>

          {showBankForm && (
            <div className="payment-form">
              <input
                type="text"
                placeholder="Bank Name"
                value={bankData.bankName}
                onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                value={bankData.accountHolder}
                onChange={(e) => setBankData({ ...bankData, accountHolder: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={bankData.accountNumber}
                onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={bankData.ifscCode}
                onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value })}
                className="form-input"
              />
              <button className="save-btn" onClick={addBankMethod}>
                Save Bank
              </button>
            </div>
          )}

          <div className="payment-list">
            {bankMethods.length > 0 ? (
              bankMethods.map(method => (
                <div key={method.id} className="payment-item">
                  <div className="payment-details">
                    <span className="payment-method-icon">✓</span>
                    <div className="payment-info">
                      <p className="payment-method-name">{method.bankName}</p>
                      <p className="payment-method-type">{method.accountHolder} - {method.accountNumber}</p>
                    </div>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => deletePaymentMethod(method.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p className="no-payment">No bank accounts saved</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterLogin;
