import L from 'leaflet';

const IconPinRed = new L.Icon({
    iconUrl: ('/images/redicon.svg'),
    iconRetinaUrl: ('/images/redicon.png'),
    iconSize: new L.Point(25, 25),
});

const IconPinGreen = new L.Icon({
    iconUrl: ('/images/greenicon.svg'),
    iconRetinaUrl: ('/images/greenicon.png'),
    iconSize: new L.Point(25, 25),
});

const IconPinBlue = new L.Icon({
    iconUrl: ('/images/blueicon.svg'),
    iconRetinaUrl: ('/images/blueicon.png'),
    iconSize: new L.Point(25, 25),
});

export { IconPinRed, IconPinGreen, IconPinBlue };