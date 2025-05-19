import { useState } from 'react';
import CharacterForm from './components/CharacterForm';
import CharacterCard from './components/CharacterCard';
import { CharacterInput, CharacterOutput } from './types/character';

function App() {
  const [character, setCharacter] = useState<CharacterOutput | null>(null);

  const handleGenerate = async (data: CharacterInput) => {
    const res = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    setCharacter(json);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <CharacterForm onGenerate={handleGenerate} />
      {character && <CharacterCard character={character} />}
    </div>
  );
}

export default App;
