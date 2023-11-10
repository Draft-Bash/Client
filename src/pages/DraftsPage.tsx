import '../css/draftsPage.css';
import RoundedButton from '../components/buttons/RoundedButton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import {BsChevronDoubleLeft} from 'react-icons/bs';
import {BsChevronDoubleRight} from 'react-icons/bs';
import {BiCog} from 'react-icons/bi';
import {RiDeleteBin5Line} from 'react-icons/ri';
import TranslucentButton from '../components/buttons/TranslucentButton';
const API_URL = import.meta.env.VITE_API_URL;

interface DraftInfo {
  user_id: number,
  draft_id: number,
  draft_type: string,
  username: string,
  team_count: number,
  scheduled_by_user_id: number,
  scoring_type: string,
  pick_time_seconds: number,
  is_started: number
}

const DraftsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { userId } = useAuth();
  const [draftId, setDraftId] = useState(-1);
  const [userDrafts, setUserDrafts] = useState<DraftInfo[]>([]);
  const [draftIndex, setDraftIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");

  const deleteDraft = async (draftId: number) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      const response = await fetch(API_URL+"/drafts?draftId="+draftId, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: null
      });
      const isDeleted = await response.json();
      if (!isDeleted){
        alert("Cannot delete a draft that has begun.");
      }
      else {
        const currentDrafts = userDrafts.filter(userDraft => userDraft.draft_id != draftId);
        setUserDrafts(currentDrafts);
      }
    }
  }

  useEffect(() => {
    async function fetchDraftData() {
      try {
        const response = await fetch(API_URL+"/drafts?userId="+userId);
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
                    {userDrafts[draftIndex].scheduled_by_user_id == userId && (
                      <RiDeleteBin5Line className="delete" 
                        onClick={() => deleteDraft(userDrafts[draftIndex].draft_id)} 
                      />
                    )}
                    {userDrafts[draftIndex].scheduled_by_user_id == userId
                    ? "Your Mock Draft" : `${userDrafts[draftIndex].username}'s Mock Draft`}
                    {userDrafts[draftIndex].scheduled_by_user_id == userId && (
                      <BiCog className="update" 
                        onClick={() => {if (!userDrafts[draftIndex].is_started) {
                          navigate("/modules/mock-drafts/update/"+userDrafts[draftIndex].draft_id)
                        } else {
                          alert("Cannot update a draft in progress.")
                        }}}
                      />
                    )}
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
                      {userDrafts[draftIndex].pick_time_seconds} Seconds
                    </p>
                    <p>
                      <b>Status: </b>
                      <b className={userDrafts[draftIndex].is_started ? "is-started" : "started"}>
                        {userDrafts[draftIndex].is_started ? "In Progress" : "Not Started"}
                      </b>
                    </p>
                  </div>
                </div>
                <div className="join-btn">
                  <TranslucentButton
                    handleOnClick={() => {
                      navigate("/modules/drafts/draftroom/"+userDrafts[draftIndex].draft_id);
                    }}
                  >
                    Join Draft
                  </TranslucentButton>
                </div>
                </>
              )
              }
            </div>
            <BsChevronDoubleRight className="arrow" onClick={() => incrementDraftIndex()} />
          </div>
          <p className='recommend-draft-creation'>No drafts? Make your own</p>
          <RoundedButton
            color="blue"
            handleOnClick={() => {
              navigate('/modules/mock-drafts/configure');
            }}
          >
            Create Draft
          </RoundedButton>
        </div>
      </div>
    </div>
  );
};

export default DraftsPage;