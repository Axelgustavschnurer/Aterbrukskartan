import { useState } from 'react';

export const LeafletAddressLookup = () => {
    const [lat, setLat] = useState(40.75637123);
    const [lon, setLon] = useState(-73.98545321);
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);

    const handleAddressClick = (lat: any, lon: any) => {
        let latitude: any = parseFloat(lat).toFixed(8);
        setLat(latitude);
        let longitude: any = parseFloat(lon).toFixed(8);
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
        <div className="container">
            <b>Coordinates</b>
            <form>
                <input type="text" name="lat" id="lat" size={12} value={lat} onChange={(e) => setLat(Number(e.target.value))} />
                <input type="text" name="lon" id="lon" size={12} value={lon} onChange={(e) => setLon(Number(e.target.value))} />
            </form>

            <b>Address Lookup</b>
            <div id="search">
                <input type="text" name="addr" value={location} id="addr" size={58} onChange={(e) => setLocation(e.target.value)} />
                <button type="button" onClick={handleSearch}>
                    Search
                </button>
                <div id="results">
                    {results.length > 0 ? (
                        results.map((result) => (
                            <div
                                key={result.place_id}
                                className="address"
                                title="Show Location and Coordinates"
                                onClick={() => handleAddressClick(result.lat, result.lon)}
                            >
                                {result.display_name}
                            </div>
                        ))
                    ) : (
                        <div>Sorry, no results...</div>
                    )}
                </div>
            </div>

            <br />
        </div>
    );
};