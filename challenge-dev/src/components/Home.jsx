import React, { useState } from "react";
import { CharacterModal } from "./CharacterModal";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { Search } from "./Search";
import { Loading } from "./Loading";

export function Home() {
  //Estado para guardar el texto temporal
  const [inputText, setInputText] = useState("");
  //Estado para guardar el texto final
  const [searchText, setSearchText] = useState("");
  //Estados para guardar los filtros y usarlos en la consulta
  const [filterSpecie, setFilterSpecie] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  // Guardar y setear pagina para el paginado
  const [page, setPage] = useState(1);
  //Guardar 1 personaje para el manejo del modal
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Consultas Graphql
  const CHARACTERS = gql`
    {
      characters(
        page: ${page},
        filter: {
        name: "${inputText}",
        species: "${filterSpecie !== "All" ? filterSpecie : ""}",
        status: "${filterStatus !== "All" ? filterStatus : ""}",
        gender: "${filterGender !== "All" ? filterGender : ""}",
      }) {
        info {
          pages
        },
        results {
          location{
            name
          },
          origin{
            name
          },
          id
          name
          image
          gender
          status
          species
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(CHARACTERS);

  if (error) return <pre>{error.message}</pre>;

  // Actualiza el estado TEMPORAL mientras se escribe
  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  // Actualiza el estado PRINCIPAL con el texto de búsqueda
  const handleSearchClick = () => {
    setInputText(searchText);
    setPage(1);
  };

  // Guarda el personaje al hacer click y lo setea en un estado
  const handleImageClick = (character) => {
    setSelectedCharacter(character);
  };

  //Quita la seleccion de personaje para cerrar el modal
  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  //Paginado
  const handlePastPage = () => {
    setPage(page > 1 ? page - 1 : page);
  };

  const handleNextPage = () => {
    setPage(page < data.characters.info.pages ? page + 1 : null);
  };

  //Resetea los filtros seteandolos en all(quita el filtro en la consulta graphql)
  const handleResetFilters = () => {
    setFilterSpecie("All");
    setFilterStatus("All");
    setFilterGender("All");
    setPage(1);
  };

  return (
    <div className="bg-[#080650] text-white">
      <h1 className="flex justify-center p-1 h-41">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg"
          alt="logo"
        />
      </h1>
      <Search
        inputChange={handleInputChange}
        searchText={searchText}
        onSearch={handleSearchClick}
      />
      <div className="flex justify-evenly mt-5">
        <div className="w-1/3">
          <label className="text-xl m-2">Filter by specie:</label>
          <select
            className="w-2/4 text-black rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
            name="filter_specie"
            value={filterSpecie}
            onChange={(e) => {
              setFilterSpecie(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="Humanoid">Humanoid</option>
            <option value="Alien">Alien</option>
            <option value="Human">Human</option>
            <option value="Poopybutthole">Poopybutthole</option>
            <option value="Mythological Creature">Mythological Creature</option>
            <option value="Animal">Animal</option>
            <option value="Robot">Robot</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="w-1/3">
          <label className="text-xl m-2">Filter by status:</label>

          <select
            className="w-2/4 text-black rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
            name="filter_status"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="w-1/3">
          <label className="text-xl m-2">Filter by genre:</label>

          <select
            className="w-2/4 text-black rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
            name="filter_genre"
            value={filterGender}
            onChange={(e) => {
              setFilterGender(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="w-1/4">
          <button
            className="bg-[#42b4ca] rounded-md border-4 border-[#bfde42] hover:bg-[#89b0ca]  w-3/4 "
            onClick={handleResetFilters}
          >
            RESET FILTERS
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center p-2">
          <button
            className="bg-white rounded-md text-black p-1 m-2"
            onClick={() => handlePastPage()}
          >
            Prev
          </button>
          {data && data.characters && data.characters.info && (
            <p>
              Page: {page} / {data.characters.info.pages}
            </p>
          )}{" "}
          <button
            className="bg-white rounded-md text-black p-1 m-2"
            onClick={() => handleNextPage()}
          >
            Next
          </button>
        </div>
        <ul className="flex flex-wrap justify-evenly">
          {loading ? (
            <Loading />
          ) : (
            data.characters.results.map((character) => (
              <div className="bg-[#42b4ca] m-2 rounded-md p-1 border-4 border-[#bfde42] ">
                <li
                  key={character.id}
                  onClick={() => handleImageClick(character)}
                >
                  <h3 className="text-2xl text-center p-1">{character.name}</h3>
                  <div>
                    <img src={character.image} alt={character.name} />
                  </div>
                </li>
              </div>
            ))
          )}
        </ul>
      </div>
      <div className="flex justify-center items-center p-2">
        <button
          className="bg-white rounded-md text-black p-1 m-2"
          onClick={() => handlePastPage()}
        >
          Prev
        </button>
        {data && data.characters && data.characters.info && (
          <p>
            Page: {page} / {data.characters.info.pages}
          </p>
        )}{" "}
        <button
          className="bg-white rounded-md text-black p-1 m-2"
          onClick={() => handleNextPage()}
        >
          Next
        </button>
      </div>
      {/* Renderizar el modal si hay un personaje seleccionado */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
