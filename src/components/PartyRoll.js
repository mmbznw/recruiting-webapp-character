import React, { useState, useEffect } from "react";
import { getModifier, getRandomNumber } from "../utils/helpers";
import { SKILL_LIST } from "../consts";

//calculate total skill
const calculateTotalSkill = (character) => {
    return character.skills.reduce((total, skill) => total + skill.value, 0);
  };

const PartyRoll = ({ characters }) => {

    const [characterWithMostPoints, setCharacterWithMostPoints] = useState(null);
    const [rank, setRank] = useState(0);
    const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
    const [dc, setDC] = useState(0);
    const [skillCheckResult, setSkillCheckResult] = useState(null);

    useEffect(() => {
        for (var i=0; i<characters.length; i++){
            const curr = characters[i];
            const totalPoint = getTotalPoints(curr.attributes);
            if (characterWithMostPoints == null || totalPoint > getTotalPoints(characterWithMostPoints.attributes)){
                setCharacterWithMostPoints(curr);
                setRank(i);
            }
        }

        console.log(characterWithMostPoints);
      }, [characters, setCharacterWithMostPoints]);


    const getTotalPoints = (attributes) => {
        const intelligence = getAttribute("Intelligence", attributes);
        return 10 + 4 * getModifier(intelligence.value);
    };

    const getAttribute = (attributeName, attributes) => {
        return attributes.find((attribute) => attribute.name === attributeName);
    };

    const getCharacterName = () => {
        // condition to Check if there is a 'name' property directly in the character
        if (characterWithMostPoints && characterWithMostPoints.name) {
          return characterWithMostPoints.name;
        }
        if (characterWithMostPoints && characterWithMostPoints.attributes) {
          const nameAttribute = characterWithMostPoints.attributes.find(
            (attr) => attr.name === "name"
          );
          if (nameAttribute) {
            return nameAttribute.value;
          }
        }
    
        return `Character #${rank + 1}`;
      };

  const handleSkillCheck = () => {
    const totalSkill = calculateTotalSkill(characterWithMostPoints);
    // skill check logic based on totalSkill and DC
    const randomRoll = getRandomNumber(20);
    const isSuccessful = totalSkill + randomRoll >= dc;
    console.log(randomRoll);
    setSkillCheckResult({
      randomRoll,
      isSuccessful
    });
  };

    return (<section>
        <div>
            <p>Character with Largest Skill Point: {getCharacterName()}</p>
        </div>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
        >
          {SKILL_LIST.map((skill) => (
            <option key={skill.name} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={isNaN(dc) ? "" : dc}
          onChange={(e) => setDC(Number(e.target.value))}
        />

        <button onClick={handleSkillCheck}>Roll</button>
        {skillCheckResult && (
          <div>
            <p>Random Number Generated: {skillCheckResult.randomRoll}</p>
            <p>
              Skill Check Result:{" "}
              {skillCheckResult.isSuccessful ? "Success" : "Failure"}
            </p>
            <p>Character selected: {getCharacterName()}</p>
          </div>
        )}
    </section>)
}

export default PartyRoll;