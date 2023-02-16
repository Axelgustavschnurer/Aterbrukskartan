import L from 'leaflet';

const iconPin = new L.Icon({
    iconUrl: ('public/images/redicon.png'),
    iconRetinaUrl: ('public/images/redicon.png'),
    // iconAnchor: null,
    // popupAnchor: null,
    // shadowUrl: null,
    // shadowSize: null,
    // shadowAnchor: null,
    iconSize: new L.Point(25, 25),
    className: 'leaflet-div-icon'
});

export { iconPin };