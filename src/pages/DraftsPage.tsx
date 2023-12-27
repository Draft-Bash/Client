import RoundedButton from '../components/buttons/RoundedButton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {BsChevronDoubleLeft} from 'react-icons/bs';
import {BsChevronDoubleRight} from 'react-icons/bs';
import {BiCog} from 'react-icons/bi';
import {RiDeleteBin5Line} from 'react-icons/ri';
import TranslucentButton from '../components/buttons/TranslucentButton';
import RoundedPickList from '../components/lists/RoundedPickList';
import styled from 'styled-components';
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
  const { user } = useAuth();
  const [draftId, setDraftId] = useState(-1);
  const [userDrafts, setUserDrafts] = useState<DraftInfo[]>([]);
  const [filteredUserDrafts, setFilteredUserDrafts] = useState<DraftInfo[]>([]);
  const [draftIndex, setDraftIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [draftFilter, setDraftFilter] = useState("Not Started");

  const deleteDraft = async (draftId: number) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      const response = await fetch(API_URL+"/drafts/"+draftId, {
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
        if (user) {
            const response = await fetch(API_URL+"/drafts?user_id="+user.user_id);
            const draftsInfo = await response.json();
            setUserDrafts(draftsInfo);
            const filtered = draftsInfo.filter(draft => !draft.is_started);
            setFilteredUserDrafts(filtered);
            if (draftsInfo.length > 0) {
            setDraftId(draftsInfo[0].draft_id);
            }
        }
      } catch(err: any) {}
    }

    fetchDraftData();
  }, [user]);

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
    <StyledDraftMenu>
      <div className="menu">
        <div style={{"position": "absolute"}}>
          <RoundedPickList itemList={['All Drafts', 'Not Started', 'In-Progress', 'Complete']}
          setValue={(filter) => setDraftFilter(filter as string)}
          defaultValue={'Not Started'}
          width={100}
          />
        </div>
        <div className="drafts">
          <h1>Drafts</h1>
          <div className="panel">
            <BsChevronDoubleLeft className="arrow" onClick={() => decrementDraftIndex()} />
            <div className="draft">
              {filteredUserDrafts.length > 0 && (
                <>
                <div className={`content-container ${slideDirection}`}>
                  <h4>
                    {user && filteredUserDrafts[draftIndex].scheduled_by_user_id == user.user_id && (
                      <RiDeleteBin5Line className="delete" 
                        onClick={() => deleteDraft(filteredUserDrafts[draftIndex].draft_id)} 
                      />
                    )}
                    {user && filteredUserDrafts[draftIndex].scheduled_by_user_id == user.user_id
                    ? "Your Mock Draft" : `${filteredUserDrafts[draftIndex].username}'s Mock Draft`}
                    {user && filteredUserDrafts[draftIndex].scheduled_by_user_id == user.user_id && (
                      <BiCog className="update" 
                        onClick={() => {if (!filteredUserDrafts[draftIndex].is_started) {
                          navigate("/modules/mock-drafts/update/"+filteredUserDrafts[draftIndex].draft_id)
                        } else {
                          alert("Cannot update a draft in progress.")
                        }}}
                      />
                    )}
                  </h4>
                  <div className="info">
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
                      <b className={filteredUserDrafts[draftIndex].is_started ? "is-started" : "not-started"}>
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
          <p style={{"color": "var(--white)"}}>No drafts? Make your own</p>
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
    </StyledDraftMenu>
  );
};

const StyledDraftMenu = styled.div`

  height: 100%;

  .menu {
    background-color: var(--veryDarkGrey);
    height: 100%;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);
    min-width: 400px;
    min-height: 350px;
    overflow: auto;
    border: 1px solid var(--mediumDarkGrey);
    position: relative;
  }

  .drafts {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }

  .drafts h1 {
    margin-top: 25px;
    font-size: 35px;
    font-weight: 600;
    color: var(--lightBlueGrey);
  }

  .panel {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    height: 75px;
    width: 75px;
    cursor: pointer;
    color: var(--lightBlueGrey);
    transition: 0.3s;
  }
  .arrow:hover {
    opacity: 0.5;
  }

  .delete {
    color: rgb(180, 140, 135);
    background-color: rgba(125, 100, 100, 0.5);
    font-size: 30px;
    margin-left: 7px;
    padding: 5px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
    min-height: 35px;
    min-width: 35px;
  }
  .delete:hover {
    background-color: rgba(125, 100, 100, 1);
  }

  .update {
    color: var(--lightBlueGrey);
    font-size: 30px;
    margin-right: 7px;
    min-height: 35px;
    padding: 5px;
    border-radius: 8px;
    min-width: 35px;
    cursor: pointer;
    background-color: rgba(100, 100, 125, 0.5);
    transition: 0.3s;
  }
  .update:hover {
    background-color: rgba(100, 100, 125, 1);
  }

  .draft {
    border: 1px solid var(--mediumDarkGrey);
    height: 50%;
    width: 60%;
    background-color: var(--darkGrey);
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 10px;
    min-height: 280px;
    position: relative;
    overflow: hidden;
  }

  .content-container.slide-left {
    transform: translateX(-100%);
    transition: transform .3s ease-in-out;
  }
  .content-container.slide-right {
    transform: translateX(100%);
    transition: transform .3s ease-in-out;
  }

  h4 {
    text-align: center;
    font-size: 20px;
    width: 100%;
    font-weight: 600;
    display: flex;
    color: var(--coolWhite);
    justify-content: space-between;
    height: 35px;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 80px);
    padding: 10px;
  }
  .info p {
    color: var(--coolWhite);
  }
  .info .is-started {
    color: var(--red);
    font-weight: 500;
  }
  .info .not-started {
    color: var(--green);
    font-weight: 500;
  }
  .info b {
    color: var(--lightBlueGrey);
    font-size: 18px;
    font-weight: 600;
  }

  .join-btn {
    display: flex;
    margin-top: 10px;
    justify-content: center;
  }
`;

export default DraftsPage;