import L from 'leaflet';

const IconPinRed = new L.Icon({
    iconUrl: ('/images/redicon.png'),
    iconRetinaUrl: ('/images/redicon.png'),
    iconSize: new L.Point(30, 30),
});

const IconPinGreen = new L.Icon({
    iconUrl: ('/images/greenicon.png'),
    iconRetinaUrl: ('/images/greenicon.png'),
    iconSize: new L.Point(20, 30),
});

const IconPinBlue = new L.Icon({
    iconUrl: ('/images/blueicon.png'),
    iconRetinaUrl: ('/images/blueicon.png'),
    iconSize: new L.Point(20, 30),
});

export { IconPinRed, IconPinGreen, IconPinBlue };