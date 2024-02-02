import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import Character from "./components/Character";
import PartyRoll from "./components/PartyRoll";
import { API_URL, ATTRIBUTE_LIST, SKILL_LIST } from "./consts";

function App() {
  const [characters, updateCharacters] = useImmer([]);


  useEffect(() => {
    // Fetch characters from the API on component mount
    if (characters.length === 0) {
      fetch(API_URL)
        .then((response) => response.json())
        .then((response) => {
          const fetchedCharacters = response.body;
          updateCharacters((draft) => (draft = fetchedCharacters));
        })
        .catch(() => {
          alert("Something went wrong!");
        });
    }
  }, [characters, updateCharacters]);

  // handle character update
  const updateCharacter = (characterIndex, newCharacter) => {
    updateCharacters((draft) => {
      draft[characterIndex] = {
        ...draft[characterIndex],
        ...newCharacter,
      };
    });
  };

  //handle adding a new character
  const handleAddCharacter = () => {
    const newCharacter = {
      attributes: ATTRIBUTE_LIST.map((name) => ({
        name,
        value: 0,
      })),
      skills: SKILL_LIST.map((skill) => ({ ...skill, value: 0 })),
    };
    updateCharacters((draft) => {
      draft.push(newCharacter);
    });
  };

  //handle saving all characters
  const saveAllCharacters = () => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characters),
    })
      .then(() => {
        alert("Successfully saved the Characters");
      })
      .catch(() => {
        alert("An error occurred while saving the Characters");
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        {characters.map((character, index) => (
          <Character
            key={index}
            index={index + 1}
            attributes={character.attributes}
            updateCharacter={(character) => updateCharacter(index, character)}
            skills={character.skills}
          />
        ))}
        <div style={{ margin: "20px 0px 100px 0px" }}>
          <button onClick={handleAddCharacter} style={{ marginRight: 20 }}>
            Add New Character
          </button>
          <button onClick={saveAllCharacters}>Save all Characters</button>
        </div>
        <PartyRoll characters={characters}/>
      </section>
    </div>
  );
}

export default App;
