// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';

// Import API URL from the environment configuration
import { API_URL } from '../../../env';

// Import the draft context for accessing draft-related data
import { useDraft } from '../DraftContext';

// Import utility function for capitalizing words
import { capitalizeWords } from '../../../utils/wordCapitalizer';

// Import CSS styles for styling the header
import '../../../css/draftHeader.css';
import '../../../css/chatRoom.css';

// Import the ChatRoom component
import ChatRoom from '../ChatRoom';

// Define the DraftHeader component
const DraftHeader = () => {
  // Initialize state variables for draft type, team count, and scoring type
  const [draftType, setDraftType] = useState("snake");
  const [teamCount, setTeamCount] = useState(10);
  const [scoringType, setScoringType] = useState("points");

  // Access the draft context
  const draftContext = useDraft();

  // Access the draft room ID from the draft context
  const draftRoomId = draftContext?.draftRoomId;

  // Use useEffect to fetch draft data when the draft room ID changes
  useEffect(() => {
    if (draftRoomId) {
      // Define an asynchronous function to fetch draft data
      async function fetchDraftData() {
        try {
          // Fetch draft data from the API using the draft room ID
          const response = await fetch(API_URL + "/drafts/" + draftRoomId);

          // Parse the response as JSON
          const draftData = await response.json();

          // Update state variables with draft data
          setDraftType(draftData.draft_type);
          setTeamCount(draftData.team_count);
          setScoringType(draftData.scoring_type);

        } catch (err: any) {
          // Handle any errors that occur during the fetch
        }
      }

      // Call the fetchDraftData function
      fetchDraftData();
    }
  }, [draftRoomId]);

  return (
      <header className="draft-header"> {/* Header container */}
          {/* Display draft information */}
          <p>{`${teamCount}-Team ${capitalizeWords(draftType)} ${capitalizeWords(scoringType)} Mock Draft`}</p>
          <ChatRoom /> {/* Include the ChatRoom component */}
      </header>
  )
};

export default DraftHeader; // Export the DraftHeader component as the default export