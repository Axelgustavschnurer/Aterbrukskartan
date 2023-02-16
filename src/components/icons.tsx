import L from 'leaflet';

const iconPinRed = new L.Icon({
    iconUrl: ('/images/redicon.png'),
    iconRetinaUrl: ('/images/redicon.png'),
    iconSize: new L.Point(25, 25),
});

const iconPinGreen = new L.Icon({
    iconUrl: ('/images/greenicon.png'),
    iconRetinaUrl: ('/images/greenicon.png'),
    iconSize: new L.Point(25, 25),
});

const iconPinBlue = new L.Icon({
    iconUrl: ('/images/blueicon.png'),
    iconRetinaUrl: ('/images/blueicon.png'),
    iconSize: new L.Point(25, 25),
});

export { iconPinRed, iconPinGreen, iconPinBlue };