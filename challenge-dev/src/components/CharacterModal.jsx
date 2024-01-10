// Modal Component
export const CharacterModal = ({ character, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-[#42b4ca] m-2 rounded-md border-4 border-[#bfde42] bg-opacity-90 p-4 rounded-md text-black">
      <button
        className="absolute top-2 right-2 bg-[#bfde42] hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center"
        onClick={onClose}
      >
        x
      </button>
      <h2 className="text-2xl text-center font-bold mb-1">{character.name}</h2>
      <img src={character.image} alt={character.name} />
      <div className="font-bold">
        <p>Specie: {character.species}</p>
        <p>Status: {character.status}</p>
        <p>Gender: {character.gender}</p>
        <p>Location: {character.location.name}</p>
        <p>Origin: {character.origin.name}</p>
      </div>
    </div>
  </div>
);
