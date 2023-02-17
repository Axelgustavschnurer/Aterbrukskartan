import L from 'leaflet';

const iconPinRed = new L.Icon({
    iconUrl: ('/images/redicon.png'),
    iconRetinaUrl: ('/images/redicon.png'),
    iconSize: new L.Point(30, 30),
});

const iconPinGreen = new L.Icon({
    iconUrl: ('/images/greenicon.png'),
    iconRetinaUrl: ('/images/greenicon.png'),
    iconSize: new L.Point(20, 30),
});

const iconPinBlue = new L.Icon({
    iconUrl: ('/images/blueicon.png'),
    iconRetinaUrl: ('/images/blueicon.png'),
    iconSize: new L.Point(20, 30),
});

export { iconPinRed, iconPinGreen, iconPinBlue };