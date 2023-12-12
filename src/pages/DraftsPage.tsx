import '../css/draftsPage.css';
import RoundedButton from '../components/buttons/RoundedButton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import {BsChevronDoubleLeft} from 'react-icons/bs';
import {BsChevronDoubleRight} from 'react-icons/bs';
import {BiCog} from 'react-icons/bi';
import {RiDeleteBin5Line} from 'react-icons/ri';
import RoundedPickList from "../components/RoundedPickList"
import TranslucentButton from '../components/buttons/TranslucentButton';
const API_URL = import.meta.env.VITE_API_URL;

interface DraftInfo {
  order_count: any;
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
  const [filteredUserDrafts, setFilteredUserDrafts] = useState<DraftInfo[]>([]);
  const [draftIndex, setDraftIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [draftFilter, setDraftFilter] = useState("Not Started");

  const deleteDraft = async (draftId: number) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      const response = await fetch(API_URL+"/drafts?draftId="+draftId, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: null
      });

      const currentDrafts = userDrafts.filter(userDraft => userDraft.draft_id != draftId);
      const filtered = filteredUserDrafts.filter(userDraft => userDraft.draft_id != draftId);
      setUserDrafts(currentDrafts);
      setFilteredUserDrafts(filtered);
    }
  }

  useEffect(() => {
    setDraftIndex(0);
    if (draftFilter=="All Drafts") {
      setFilteredUserDrafts(userDrafts);
    }
    else if (draftFilter=="Not Started") {
      const filtered = userDrafts.filter(draft => !draft.is_started)
      setFilteredUserDrafts(filtered);
    }
    else if (draftFilter=="In-Progress") {
      const filtered = userDrafts.filter(draft => draft.is_started && draft.order_count != 0);
      setFilteredUserDrafts(filtered);
    }
    else if (draftFilter=="Complete") {
      const filtered = userDrafts.filter(draft => draft.is_started && draft.order_count == 0);
      setFilteredUserDrafts(filtered);
    }
  }, [draftFilter]);

  useEffect(() => {
    async function fetchDraftData() {
      try {
        const response = await fetch(API_URL+"/drafts?userId="+userId);
        const draftsInfo = await response.json();
        setUserDrafts(draftsInfo);
        const filtered = draftsInfo.filter(draft => !draft.is_started);
        setFilteredUserDrafts(filtered);
        if (draftsInfo.length > 0) {
          setDraftId(draftsInfo[0].draft_id);
        }

      } catch(err: any) {}
    }

    fetchDraftData();
  }, []);

  useEffect(() => {
    
    if (filteredUserDrafts.length > 0) {
      setDraftId(filteredUserDrafts[draftIndex].draft_id);
    }

  }, [draftIndex]);

  const incrementDraftIndex = () => {
    if (draftIndex != (filteredUserDrafts.length - 1)) {
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
      setDraftIndex(filteredUserDrafts.length - 1);
    }
    setSlideDirection("slide-left");
    setTimeout(() => {
      setSlideDirection("");
    }, 600);
  }

  return (
    <div className="mock-draft-menu-container">
      <div className="mock-draft-menu">
        <div className="draft-filters">
          <RoundedPickList itemList={['All Drafts', 'Not Started', 'In-Progress', 'Complete']}
          setValue={(filter) => setDraftFilter(filter as string)}
          defaultValue={'Not Started'}
          width={100}
          />
        </div>
        <div className="open-drafts">
          <h1>Drafts</h1>
          <div className="panel">
            <BsChevronDoubleLeft className="arrow" onClick={() => decrementDraftIndex()} />
            <div className="mock-drafts">
              {filteredUserDrafts.length > 0 && (
                <>
                <div className={`draft-content-container ${slideDirection}`}>
                  <h4>
                    {filteredUserDrafts[draftIndex].scheduled_by_user_id == userId && (
                      <RiDeleteBin5Line className="delete" 
                        onClick={() => deleteDraft(filteredUserDrafts[draftIndex].draft_id)} 
                      />
                    )}
                    {filteredUserDrafts[draftIndex].scheduled_by_user_id == userId
                    ? "Your Mock Draft" : `${filteredUserDrafts[draftIndex].username}'s Mock Draft`}
                    {filteredUserDrafts[draftIndex].scheduled_by_user_id == userId && (
                      <BiCog className="update" 
                        onClick={() => {if (!filteredUserDrafts[draftIndex].is_started) {
                          navigate("/modules/mock-drafts/update/"+filteredUserDrafts[draftIndex].draft_id)
                        } else {
                          alert("Cannot update a draft in progress.")
                        }}}
                      />
                    )}
                  </h4>
                  <div className="draft-info">
                    <p>
                      <b>Format: </b>
                      {filteredUserDrafts[draftIndex].draft_type}
                    </p>
                    <p>
                      <b>Scoring: </b>
                      {filteredUserDrafts[draftIndex].scoring_type}
                    </p>
                    <p>
                      <b>Teams: </b>
                      {filteredUserDrafts[draftIndex].team_count}
                    </p>
                    <p>
                      <b>Pick time: </b>
                      {filteredUserDrafts[draftIndex].pick_time_seconds} Seconds
                    </p>
                    <p>
                      <b>Status: </b>
                      <b className={filteredUserDrafts[draftIndex].is_started ? "is-started" : "started"}>
                        {!(filteredUserDrafts[draftIndex].is_started) && ("Not Started")}
                        {(filteredUserDrafts[draftIndex].is_started && filteredUserDrafts[draftIndex].order_count > 0) && 
                        ("In Progress")}
                        {(filteredUserDrafts[draftIndex].is_started && filteredUserDrafts[draftIndex].order_count == 0) && 
                        ("Complete")}
                      </b>
                    </p>
                  </div>
                </div>
                <div className="join-btn">
                  <TranslucentButton
                    handleOnClick={() => {
                      navigate("/modules/drafts/draftroom/"+filteredUserDrafts[draftIndex].draft_id);
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