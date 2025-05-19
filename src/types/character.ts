export type CharacterInput = {
    name: string;
    race: string;
    clazz: string;
    background: string;
  };
  
  export type CharacterOutput = CharacterInput & {
    personality: string;
    backstory: string;
  };
  