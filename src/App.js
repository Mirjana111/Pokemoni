import React, { useState, useEffect } from 'react';
import './App.css';

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
      .then(response => response.json())
      .then(data => setPokemons(data.results));
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchPokemonDetails = async (pokemon) => {
    const response = await fetch(pokemon.url);
    const data = await response.json();

    return data;
  };

  return (
    <div className="App">
      <header>
        <h1>Pokemon Search</h1>
        <input type="text" id="searchInput" value={search} onChange={handleChange} placeholder="Search Pokemon" />
      </header>
      <main id="pokemonContainer">
        {pokemons.map((pokemon, index) => (
          <PokemonCard key={index} pokemon={pokemon} search={search} fetchPokemonDetails={fetchPokemonDetails} />
        ))}
      </main>
    </div>
  );
}

const PokemonCard = ({ pokemon, search, fetchPokemonDetails }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (search === '' || pokemon.name.includes(search)) {
      fetchPokemonDetails(pokemon)
        .then(data => setDetails(data));
    } else {
      setDetails(null);
    }
  }, [pokemon, search, fetchPokemonDetails]);

  return (
    details &&
    <div className={`card ${pokemon.name === search ? 'highlight' : ''}`}>
      <img src={details.sprites.front_default} alt={pokemon.name} />
      <h2>{capitalizeFirstLetter(pokemon.name)}</h2>
      <p>Nr: {details.order}</p>
      <p>Type: {details.types.map(type => type.type.name).join(', ')}</p>
      <p>Abilities: {details.abilities.map(ability => ability.ability.name).join(', ')}</p>
    </div>
  );
};

export default App;
