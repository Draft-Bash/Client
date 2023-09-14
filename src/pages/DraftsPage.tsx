// Import necessary modules and components
import '../css/mockDrafts.css';
import RoundedButton from '../components/buttons/RoundedButton';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../env';
import { useAuth } from '../authentication/AuthContext';
import { BsChevronDoubleLeft } from 'react-icons/bs';
import { BsChevronDoubleRight } from 'react-icons/bs';

// Define the DraftInfo interface for draft information
interface DraftInfo {
  user_id: number,
  draft_id: number,
  draft_type: string,
  user_name: string,
  team_count: number,
  scheduled_by_user_id: number,
  scoring_type: string,
  pick_time_seconds: number
}

// Define the DraftsPage component
const DraftsPage = () => {
  // Initialize the useNavigate hook for navigation
  const navigate = useNavigate();
  // Get the userId from the authentication context
  const { userId } = useAuth();
  // Initialize state variables
  const [draftId, setDraftId] = useState(-1);
  const [userDrafts, setUserDrafts] = useState<DraftInfo[]>([]);
  const [draftIndex, setDraftIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");

  // Fetch user's draft data from the API
  useEffect(() => {
    async function fetchDraftData() {
      try {
        const response = await fetch(API_URL+"/drafts?user_id="+userId);
        const draftsInfo = await response.json();
        setUserDrafts(draftsInfo);
        if (draftsInfo.length > 0) {
          setDraftId(draftsInfo[0].draft_id);
        }
      } catch(err: any) {}
    }

    fetchDraftData();
  }, []);

  // Update the draftId when draftIndex changes
  useEffect(() => {
    if (userDrafts.length > 0) {
      setDraftId(userDrafts[draftIndex].draft_id);
    }
  }, [draftIndex]);

  // Increment the draftIndex and apply slide animation
  const incrementDraftIndex = () => {
    if (draftIndex !== (userDrafts.length - 1)) {
      setDraftIndex(draftIndex + 1);
    } else {
      setDraftIndex(0);
    }
    setSlideDirection("slide-right");
    setTimeout(() => {
      setSlideDirection("");
    }, 600);
  }

  // Decrement the draftIndex and apply slide animation
  const decrementDraftIndex = () => {
    if (draftIndex !== 0) {
      setDraftIndex(draftIndex - 1);
    } else {
      setDraftIndex(userDrafts.length - 1);
    }
    setSlideDirection("slide-left");
    setTimeout(() => {
      setSlideDirection("");
    }, 600);
  }

  return (
    <div className="mock-draft-menu-container">
      <div className="mock-draft-menu">
        <div className="open-drafts">
          <h1>Drafts</h1>
          <div className="panel">
            {/* Arrow buttons to navigate between drafts */}
            <BsChevronDoubleLeft className="arrow" onClick={() => decrementDraftIndex()} />
            <div className="mock-drafts">
              {userDrafts.length > 0 && (
                <>
                {/* Draft information and join button */}
                <div className={`draft-content-container ${slideDirection}`}>
                  <h4>
                    {userDrafts[draftIndex].scheduled_by_user_id === userDrafts[draftIndex].user_id
                    ? "Your Mock Draft" : `${userDrafts[draftIndex].user_name}'s Mock Draft`}
                  </h4>
                  <div className="draft-info">
                    <p>
                      <b>Format: </b>
                      {userDrafts[draftIndex].draft_type}
                    </p>
                    <p>
                      <b>Scoring: </b>
                      {userDrafts[draftIndex].scoring_type}
                    </p>
                    <p>
                      <b>Teams: </b>
                      {userDrafts[draftIndex].team_count}
                    </p>
                    <p>
                      <b>Pick time: </b>
                      {userDrafts[draftIndex].pick_time_seconds}
                    </p>
                  </div>
                </div>
                <div className="join-button">
                  {/* Button to join the selected draft */}
                  <RoundedButton
                    color="yellow"
                    handleOnClick={() => {
                      navigate("/modules/drafts/draftroom/"+draftId);
                    }}
                  >
                    Join Draft
                  </RoundedButton>
                </div>
                </>
              )}
            </div>
            {/* Arrow buttons to navigate between drafts */}
            <BsChevronDoubleRight className="arrow" onClick={() => incrementDraftIndex()} />
          </div>
          <p>No drafts? Make your own</p>
          {/* Button to create a new draft */}
          <RoundedButton
            color="blue"
            handleOnClick={() => {
              navigate('/modules/mock-drafts/configure');
            }}
          >
            Create draft
          </RoundedButton>
        </div>
      </div>
    </div>
  );
};

export default DraftsPage;