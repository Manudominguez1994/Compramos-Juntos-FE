import { useMapEvents } from "react-leaflet/hooks";

function ClickMarker({ setClickedPosition }) {
  useMapEvents({
    click: (event) => {
      // console.log(event.latlng);
      const obj = event.latlng;
      setClickedPosition([obj.lat.toFixed(5), obj.lng.toFixed(5)]);
    },
  });
  return null;
}

export default ClickMarker;