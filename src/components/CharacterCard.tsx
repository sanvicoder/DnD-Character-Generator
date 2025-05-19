import { CharacterOutput } from "../types/character";
import "./CharacterCard.css";

type Props = {
  character: CharacterOutput;
};

export default function CharacterCard({ character }: Props) {
  return (
    <div className="card-container">
      <h3 className="card-name">{character.name}</h3>
      <div className="card-info">
        <p><strong>Race:</strong> {character.race}</p>
        <p><strong>Class:</strong> {character.clazz}</p>
        <p><strong>Background:</strong> {character.background}</p>
        <p><strong>Personality:</strong> {character.personality}</p>
        <p><strong>Backstory:</strong> {character.backstory}</p>
      </div>
    </div>
  );
}


