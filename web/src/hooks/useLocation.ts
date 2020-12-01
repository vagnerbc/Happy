import { useEffect, useState } from "react";
// import api from "../services/api";

function useLocation() {
  const [latitude, setLatitude] = useState(-1);
  const [longitude, setLongitude] = useState(-1);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
        }
      );
    }
  }, []);

  // useEffect(() => {
  //   if (!latitude || !longitude) return;

  //   async function getCity() {
  //     const response = await api.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_KEY}`
  //     );
  //     console.log({ response });
  //   }

  //   getCity();
  // }, [latitude, longitude]);

  return { latitude, longitude, setLatitude, setLongitude };
}

export default useLocation;
