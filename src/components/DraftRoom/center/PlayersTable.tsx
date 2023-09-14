// Import the CSS file for styling
import '../../../css/draftRoom/center/playersTable.css';

// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';

// Import the draft context for accessing draft-related data
import { useDraft } from '../DraftContext';

// Import the authentication context for user-related data
import { useAuth } from '../../../authentication/AuthContext';

// Import the API URL from the environment configuration
import { API_URL } from '../../../env';

// Import utility function for adding a player to the roster
import { addPlayer, PlayerPreviousSeasonStats } from '../../../utils/draft';

// Import the OutlinedRoundedButton component for drafting players
import OutlinedRoundedButton from '../../buttons/OutlinedRoundedButton';

// Define the PlayersTable component
const PlayersTable = () => {
    // Access the draft context
    const draftContext = useDraft();

    // Access the draft room ID from the draft context
    const draftRoomId = draftContext?.draftRoomId;

    // Access the roster from the draft context
    const roster = draftContext?.roster;

    // Initialize state variables for the list of players
    const [playerList, setPlayerlist] = useState<PlayerPreviousSeasonStats[]>();

    // Access the user ID from the authentication context
    const { userId } = useAuth();

    // Use useEffect to fetch player data when the draft room ID or roster changes
    useEffect(() => {
        if (draftRoomId) {
            // Fetch player data from the API based on the draft room ID
            fetch(API_URL + "/drafts/players?draftId=" + draftRoomId)
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the fetched data
                    setPlayerlist(data); // Update the player list state
                })
                .catch(error => {
                    console.log(error); // Handle any errors that occur during the fetch
                });
        }
    }, [draftRoomId, roster]);

    // Function to handle drafting a player
    async function handleDraftClick(pickedPlayer, currentRoster) {
        const updatedRoster = { ...currentRoster };

        if (addPlayer(pickedPlayer, updatedRoster)) {
            console.log(updatedRoster); // Log the updated roster
            try {
                // Send a POST request to update the draft pick
                const response = await fetch(API_URL + "/drafts/picks", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userId,
                        playerId: pickedPlayer.player_id,
                        draftId: draftRoomId
                    })
                });

                // Update the roster in the draft context
                draftContext?.setRoster(updatedRoster);
            } catch (error) {
                console.log(error); // Handle any errors that occur during the fetch
            }
        } else {
            console.log(roster); // Log the current roster
        }
    }

    return (
        <div className="players-table">
            <table>
                <thead>
                    <tr>
                        <th>RK</th>
                        <th>PLAYER</th>
                        <th>AGE</th>
                        <th>GP</th>
                        <th>MPG</th>
                        <th>PTS</th>
                        <th>REBS</th>
                        <th>ASTS</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map and display player data */}
                    {playerList?.map((player, index) => (
                        <tr key={index}>
                            <td>{player.rank_number}</td>
                            <td className="player-cell">
                                {/* Display player image */}
                                <img
                                    src={`/images/playerImages/${player.player_id}.png`}
                                    loading="lazy"
                                    onError={(event) => {
                                        const imgElement = event.target as HTMLImageElement;
                                        imgElement.src = "/images/playerImages/defaultPlayerImage.png";
                                        imgElement.onerror = null; // Prevents future errors from being logged
                                    }}
                                />
                                {/* Display player name and draft button */}
                                {player.first_name + " " + player.last_name}
                                <OutlinedRoundedButton
                                    color="red"
                                    handleOnClick={() => handleDraftClick(player, roster)}
                                >
                                    DRAFT
                                </OutlinedRoundedButton>
                            </td>
                            <td>{player.player_age}</td>
                            <td>{player.games_played}</td>
                            <td>{(player.minutes_played / player.games_played).toFixed(1)}</td>
                            <td>{player.points_total}</td>
                            <td>{player.rebounds_total}</td>
                            <td>{player.assists_total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayersTable; // Export the PlayersTable component as the default export