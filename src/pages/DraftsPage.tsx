import '../css/mockDrafts.css';
import RoundedButton from '../components/buttons/RoundedButton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../env';
import { useAuth } from '../authentication/AuthContext';
import {BsChevronDoubleLeft} from 'react-icons/bs';
import {BsChevronDoubleRight} from 'react-icons/bs';

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

const DraftsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { userId } = useAuth();
  const [draftId, setDraftId] = useState(-1);
  const [userDrafts, setUserDrafts] = useState<DraftInfo[]>([]);
  const [draftIndex, setDraftIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");

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

  useEffect(() => {
    
    if (userDrafts.length > 0) {
      setDraftId(userDrafts[draftIndex].draft_id);
    }

  }, [draftIndex]);

  const incrementDraftIndex = () => {
    if (draftIndex != (userDrafts.length - 1)) {
      setDraftIndex(draftIndex+1);
    }
    else {
      setDraftIndex(0);
    }
    setSlideDirection("slide-right");
    setTimeout(() => {
      setSlideDirection("");
    }, 600);
  }

  const decrementDraftIndex = () => {
    if ((draftIndex) != (0)) {
      setDraftIndex(draftIndex-1);
    }
    else {
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
            <BsChevronDoubleLeft className="arrow" onClick={() => decrementDraftIndex()} />
            <div className="mock-drafts">
              {userDrafts.length > 0 && (
                <>
                <div className={`draft-content-container ${slideDirection}`}>
                  <h4>
                    {userDrafts[draftIndex].scheduled_by_user_id == userDrafts[draftIndex].user_id
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
              )
              }
            </div>
            <BsChevronDoubleRight className="arrow" onClick={() => incrementDraftIndex()} />
          </div>
          <p>No drafts? Make your own</p>
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