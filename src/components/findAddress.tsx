import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/findAddress.module.css';

function LeafletAddressLookup({ setLat, setLon, lat, lon }: any) {

    // State for the address search and the results
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);

    // Gets the coordinates from the address search and sets them in the state imported from the parent component
    const handleAddressClick = (lat: any, lon: any) => {
        let latitude: any = parseFloat(lat).toFixed(6);
        setLat(latitude);
        let longitude: any = parseFloat(lon).toFixed(6);
        setLon(longitude);
    };

    // Fetches the address search results from the Nominatim API
    const handleSearch = () => {
        const addrInput = document.getElementById('addr') as HTMLInputElement;
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${addrInput.value}`;

        fetch(url)
            // Makes the response into json
            .then((response) => response.json())

            // Sets the results in the state setResults
            .then((data) => {
                setResults(data);
            })

            // If there is an error, it is logged in the console
            .catch((error) => {
                console.error('Error fetching search results:', error);
            });
    };

    return (
        <div className={styles.findAddressContainer}>
            <b>Skriv adress</b>
            <div className={styles.addressContent}>
                <div id={styles.search}>
                    <div id={styles.searchDir}>
                        <input type="text" name="addr" value={location} id="addr" onChange={(e) => setLocation(e.target.value)} />
                        <button id={styles.addressBtn} type="button" onClick={handleSearch}> Sök </button>
                    </div>

                    {/*Result of the search */}
                    <div id={styles.results}>
                        {results.length > 0 ? (
                            results.map((result: any) => (
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

            {/* Coordinates */}
            <b>Koordinater</b>
            <div className={styles.container}>
                <div className={styles.latLon}>
                    <label htmlFor="lat" style={{ margin: "5px" }}>Latitud:</label>
                    <input type="text" name="lat" id={styles.lat} placeholder='Latitud' value={lat} onChange={(e) => setLat(Number(e.target.value))} />
                </div>
                <div className={styles.latLon}>
                    <label htmlFor="lon" style={{ margin: "5px" }}>Longitud:</label>
                    <input type="text" name="lon" id={styles.lon} placeholder='Longitud' value={lon} onChange={(e) => setLon(Number(e.target.value))} />
                </div>
            </div>



            <br />
        </div >
    );
};

export default dynamic(() => Promise.resolve(LeafletAddressLookup), { ssr: false })
