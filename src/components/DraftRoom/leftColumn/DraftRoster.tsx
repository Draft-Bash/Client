// Import the CSS file for styling
import '../../../css/draftRoom/leftColumn/draftRoster.css';

// Import the RosterPickList component
import RosterPickList from '../RosterPickList';

// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';

// Import the draft context for accessing draft-related data
import { useDraft } from '../DraftContext';

// Define the DraftRoster component
const DraftRoster = () => {
  // Access the draft context
  const draftContext = useDraft();

  // Access the roster data from the draft context
  const roster = draftContext?.roster;

  // Define abbreviations for player positions
  const positionAbbreviation = {
    "pointguard": "PG", "shootingguard": "SG",
    "guard": "G", "smallforward": "SF", "powerforward": "PF",
    "forward": "F", "center": "C", "utility": "UTIL", "bench": "BE"
  }

  return (
    <div className="draft-roster"> {/* Container for the draft roster */}
        <header>
            <b>Roster</b> {/* Header for the roster section */}
            <RosterPickList /> {/* Include the RosterPickList component */}
        </header>
        <table>
          <thead>
            <tr>
              <th>POS</th> {/* Table header for player positions */}
              <th>PLAYER</th> {/* Table header for player names */}
            </tr>
          </thead>
          <tbody>
          {roster && Object.entries(roster).map(([position, players]) => (
            players.map((player, index) => (
              <tr key={position + index}>
                <td>
                  {positionAbbreviation[position]} {/* Display the position abbreviation */}
                </td>
                <td>
                  {players[index] != null ? ( /* Check if a player exists */
                    // Display player information if player exists
                    players[index]?.first_name[0] + ". " + players[index]?.last_name
                  ) : (
                    // Display "Empty" if the spot is empty
                    <i className="empty-spot">Empty</i>
                  )}
                </td>
              </tr>
            ))
          ))}
          </tbody>
        </table>
    </div>
  )
};

export default DraftRoster; // Export the DraftRoster component as the default export
