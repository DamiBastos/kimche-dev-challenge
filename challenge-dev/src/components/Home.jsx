import React, { useState } from "react";
import { CharacterModal } from "./CharacterModal";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

export function Home() {
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterSpecie, setFilterSpecie] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

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

  const handleInputChange = (e) => {
    setSearchText(e.target.value); // Actualiza el estado temporal mientras se escribe
  };

  const handleSearchClick = () => {
    setInputText(searchText); // Actualiza el estado principal con el texto de búsqueda
    setPage(1);
  };

  const handleImageClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const handlePastPage = () => {
    setPage(page > 1 ? page - 1 : page);
  };

  const handleNextPage = () => {
    setPage(page < data.characters.info.pages ? page + 1 : null);
  };

  const handleResetFilters = () => {
    setFilterSpecie("All");
    setFilterStatus("All");
    setFilterGender("All");
    setPage(1);
  };

  return (
    <div className="bg-gray-700 text-white">
      <h1 className="flex justify-center font-mono text-8xl p-4">
        Rick & Morty
      </h1>
      <div className="flex justify-center m-2">
        <input
          style={{
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
          className="w-3/4 rounded-s-2xl p-2 text-black"
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder="Search by name"
        />
        <button
          className="flex justify-center items-center bg-white hover:bg-gray-300 rounded-e-2xl w-10"
          onClick={handleSearchClick}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 50 50"
              className="text-white"
            >
              <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
            </svg>
          </div>
        </button>
      </div>
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
            className="bg-[#666] hover:bg-gray-300 w-3/4 h-8 bg-white rounded-md text-black "
            onClick={handleResetFilters}
          >
            Reset filters
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
            <div className="flex items-center justify-center h-full p-56">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-28 h-28 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            data.characters.results.map((character) => (
              <li
                className="border m-2 rounded-md"
                key={character.id}
                onClick={() => handleImageClick(character)}
              >
                <h3 className="text-2xl text-center">{character.name}</h3>
                <div>
                  <img src={character.image} alt={character.name} />
                </div>
              </li>
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
