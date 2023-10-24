import { useState } from 'react';
import dynamic from 'next/dynamic';

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
    <div className='card margin-y-200'>
      <strong>Skriv adress</strong>

      <div id="search">
        <div id="searchDir" className='display-flex gap-50'>
          <input type="text" name="addr" value={location} id="addr" onChange={(e) => setLocation(e.target.value)} />
          <button id="addressBtn" type="button" onClick={handleSearch}> Sök </button>
        </div>

        {/*Result of the search */}
        {results.length > 0 ? (
          results.map((result: any) => (
            <p 
              style={{margin: 0}}
              key={result.place_id}
              className="address clicky"
              title="Show Location and Coordinates"
              onClick={() => handleAddressClick(result.lat, result.lon)}
            >
              {`• ${result.display_name}`}
            </p>
          ))
        ) : (
          <p>Tyvärr, adressen hittades inte</p>
        )}
      </div>

      {/* Coordinates */}
      <strong style={{margin: "2em 0 0 0"}}>Koordinater</strong>
      <div className='display-flex gap-50'>
        <div className='flex-grow-100'>
          <label htmlFor="lat">Latitud</label>
          <input type="text" name="lat" id="lat" placeholder='Latitud' value={lat} onChange={(e) => setLat(Number(e.target.value))} />
        </div>
        <div className='flex-grow-100'>
          <label htmlFor="lon">Longitud</label>
          <input type="text" name="lon" id="lon" placeholder='Longitud' value={lon} onChange={(e) => setLon(Number(e.target.value))} />
        </div>
      </div>
    </div >
  );
};

export default dynamic(() => Promise.resolve(LeafletAddressLookup), { ssr: false })
