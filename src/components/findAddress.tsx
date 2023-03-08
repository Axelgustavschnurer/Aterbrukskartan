import { useState } from 'react';
import dynamic from 'next/dynamic';

function LeafletAddressLookup({ setLat, setLon, lat, lon }: any) {
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);

    const handleAddressClick = (lat: any, lon: any) => {
        let latitude: any = parseFloat(lat).toFixed(6);
        setLat(latitude);
        let longitude: any = parseFloat(lon).toFixed(6);
        setLon(longitude);
    };

    const handleSearch = () => {
        const addrInput = document.getElementById('addr') as HTMLInputElement;
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${addrInput.value}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setResults(data);
            })
            .catch((error) => {
                console.error('Error fetching search results:', error);
            });
    };

    return (
        <div className="findAddressContainer">
            <b>Skriv adress</b>
            <div className="addressContent">
                <div id="search">
                    <div id='searchDir'>
                        <input type="text" name="addr" value={location} id="addr" onChange={(e) => setLocation(e.target.value)} />
                        <button id="addressBtn" type="button" onClick={handleSearch}>
                            Sök
                        </button>
                    </div>
                    <div id="results">
                        {results.length > 0 ? (
                            results.map((result) => (
                                <div
                                    key={result.place_id}
                                    className="address"
                                    title="Show Location and Coordinates"
                                    onClick={() => handleAddressClick(result.lat, result.lon)}
                                >
                                    {`• ${result.display_name}`}
                                </div>
                            ))
                        ) : (
                            <div>Tyvärr, adressen hittades inte</div>
                        )}
                    </div>
                </div>
            </div>
            <b>Koordinater</b>
            <form>
                <label htmlFor="lat" style={{ margin: "5px" }}>Latitud:</label>
                <input type="text" name="lat" id="lat" placeholder='Latitud' value={lat} onChange={(e) => setLat(Number(e.target.value))} />
                <label htmlFor="lon" style={{ margin: "5px" }}>Longitud:</label>
                <input type="text" name="lon" id="lon" placeholder='Longitud' value={lon} onChange={(e) => setLon(Number(e.target.value))} />
            </form>


            <br />
        </div >
    );
};

export default dynamic(() => Promise.resolve(LeafletAddressLookup), { ssr: false })
