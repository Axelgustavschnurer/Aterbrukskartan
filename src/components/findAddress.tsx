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
    <>
      <div id="search">
        <label className='block margin-top-75'>
          Adress
          <div id="searchDir" className='display-flex gap-50 margin-top-25'>
            <input type="text" name="addr" value={location} id="addr" onChange={(e) => setLocation(e.target.value)} /> {/* TODO: turn this into a select instead */}
            <button id="addressBtn" type="button" onClick={handleSearch}> Sök </button>
          </div>
        </label>

        {/*Result of the search */}
        {results.length > 0 ? (
          <ul>
            {results.map((result: any) => ( // TODO: Use radio button for this?
              <li
                className='margin-block-25'
                key={result.place_id}
                title="Show Location and Coordinates"
                onClick={() => handleAddressClick(result.lat, result.lon)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        ) : (
          <small>Tyvärr, adressen hittades inte</small>
        )}
      </div>

      {/* Coordinates */}
      <fieldset className='display-flex gap-50 margin-top-75' style={{padding: '.25rem 0 0 0', border: '0'}}>
        <legend>Koordinater</legend>
        <label className='flex-grow-100'>
          Latitud
          <input type="text" name="lat" id="lat" placeholder='Latitud' value={lat} onChange={(e) => setLat(Number(e.target.value))} />
        </label>
        <label className='flex-grow-100'>
          Longitud
          <input type="text" name="lon" id="lon" placeholder='Longitud' value={lon} onChange={(e) => setLon(Number(e.target.value))} />
        </label>
      </fieldset>
      
    </>
  );
};

export default dynamic(() => Promise.resolve(LeafletAddressLookup), { ssr: false })
