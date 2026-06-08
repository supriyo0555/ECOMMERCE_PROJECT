import { useState } from "react";
import "./LocationPopup.css";

const LocationPopup = () => {
  const [show, setShow] = useState(true);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log(pos.coords.latitude, pos.coords.longitude);
          setShow(false);
        },
        () => {
          alert("Location denied");
          setShow(false);
        }
      );
    }
  };

  if (!show) return null;

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Allow location access</h2>
        <p>We need your location to show nearby products.</p>

        <button className="allow-btn" onClick={requestLocation}>
          Enable Location
        </button>

        <button className="skip-btn" onClick={() => setShow(false)}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default LocationPopup;
