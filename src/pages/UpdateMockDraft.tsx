import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import PickList from '../components/lists/PickList';
import LoadingScreen from '../components/pages/LoadingScreen';
import RoundedButton from '../components/buttons/RoundedButton';
import DraftInviter from '../components/pages/drafts/DraftInviter';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const UpdateMockDraft = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft_id } = useParams();
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [teamCount, setTeamCount] = useState(10);
  const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
  const [pickTime, setPickTime] = useState('90 seconds');
  const [draftType, setDraftType] = useState('snake');
  const [scoringType, setScoringType] = useState('points');
  const [pointGuardCount, setPointGuardCount] = useState(1);
  const [shootingGuardCount, setShootingGuardCount] = useState(1);
  const [guardCount, setGuardCount] = useState(1);
  const [smallforwardCount, setSmallforwardCount] = useState(1);
  const [powerforwardCount, setPowerforwardCount] = useState(1);
  const [forwardCount, setForwardCount] = useState(1);
  const [centerCount, setCenterCount] = useState(1);
  const [utilityPlayerCount, setUtilityPlayerCount] = useState(3);
  const [benchSize, setBenchSize] = useState(4);
  const pickTimes = ['30 seconds', '60 seconds', '90 seconds', '120 seconds', '150 seconds'];

  const handleOnSubmit = async () => {
    setIsLoadingScreen(true);
    try {
      const response = await fetch(API_URL + '/drafts/'+draft_id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draft_type: draftType,
          scoring_type: scoringType,
          pick_time_seconds: Number(pickTime.split(' ')[0]),
          team_count: teamCount,
          pointguard_slots: pointGuardCount,
          shootingguard_slots: shootingGuardCount,
          guard_slots: guardCount,
          powerforward_slots: powerforwardCount,
          smallforward_slots: smallforwardCount,
          forward_slots: forwardCount,
          center_slots: centerCount,
          utility_slots: utilityPlayerCount,
          bench_slots: benchSize,
          scheduled_by_user_id: user?.user_id,
          scheduled_by_username: user?.username,
          draft_user_ids: invitedUserIds,
        }),
      });

      const result = await response.json();

      navigate('/modules/drafts/draftroom/' + result.draft_id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetch(API_URL + '/drafts/' + draft_id)
      .then((response) => {
        return response.json();
      })
      .then((draftSettings) => {
        setTeamCount(draftSettings.team_count);
        setPickTime(draftSettings.pick_time_seconds + ' seconds');
        setDraftType(draftSettings.draft_type);
        setScoringType(draftSettings.scoring_type);
        setPointGuardCount(draftSettings.pointguard_slots);
        setShootingGuardCount(draftSettings.shootingguard_slots);
        setGuardCount(draftSettings.guard_slots);
        setSmallforwardCount(draftSettings.smallforward_slots);
        setPowerforwardCount(draftSettings.powerforward_slots);
        setForwardCount(draftSettings.forward_slots);
        setCenterCount(draftSettings.center_slots);
        setUtilityPlayerCount(draftSettings.utility_slots);
        setBenchSize(draftSettings.bench_slots);
      });
  }, [draft_id]);

  return (
    <>
      {isLoadingScreen && <LoadingScreen />}
      <MockDraftConfiguration>
        <div className="mock-draft-configuration">
          <div className="configuration-header">
            <div>
              <h2>Draft Creation</h2>
              <p>Set your draft settings below</p>
            </div>
            <DraftInviter teamsCount={teamCount} setInvitedUserIds={setInvitedUserIds} />
          </div>
          <div className="settings-container">
            <div className="settings-group">
              <h5>Scoring</h5>
              <label>
                <input
                  type="radio"
                  value="points"
                  name="mock-draft-scoring-config"
                  onChange={(event) => {
                    setScoringType(event.target.value);
                  }}
                  defaultChecked
                />
                Points
              </label>
              <label>
                <input
                  type="radio"
                  value="category"
                  name="mock-draft-scoring-config"
                  onChange={(event) => {
                    setScoringType(event.target.value);
                  }}
                />
                Category
              </label>
            </div>
            <div className="settings-group">
              <h5>Draft type</h5>
              <label>
                <input
                  type="radio"
                  value="snake"
                  name="mock-draft-type-config"
                  onChange={(event) => {
                    setDraftType(event.target.value);
                  }}
                  defaultChecked
                />
                Snake
              </label>
              <label>
                <input
                  type="radio"
                  value="linear"
                  name="mock-draft-type-config"
                  onChange={(event) => {
                    setDraftType(event.target.value);
                  }}
                />
                Linear
              </label>
            </div>
            <div className="settings-group">
              <h5># of teams</h5>
              <PickList
                setValue={(count) => setTeamCount(count as number)}
                itemList={[8, 10, 12, 14]}
                value={teamCount}
                width={40}
                key={teamCount} // Added key prop
              />
            </div>
            <div className="settings-group">
              <h5>Pick Time</h5>
              <PickList
                setValue={(time) => setPickTime(time as string)}
                itemList={pickTimes}
                value={pickTime}
                width={95}
                key={pickTime} // Added key prop
              />
            </div>
          </div>
          <div className="roster-spots-settings">
            <h3>Roster Spots</h3>
            <div className="settings-container">
              <div className="settings-group">
                <label>PG</label>
                <PickList
                  setValue={(count) => setPointGuardCount(count as number)}
                  itemList={[0, 1]}
                  value={pointGuardCount}
                  width={40}
                  key={pointGuardCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>SG</label>
                <PickList
                  setValue={(count) => setShootingGuardCount(count as number)}
                  itemList={[0, 1]}
                  value={shootingGuardCount}
                  width={40}
                  key={shootingGuardCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>G</label>
                <PickList
                  setValue={(count) => setGuardCount(count as number)}
                  itemList={[0, 1]}
                  value={guardCount}
                  width={40}
                  key={guardCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>SF</label>
                <PickList
                  setValue={(count) => setSmallforwardCount(count as number)}
                  itemList={[0, 1]}
                  value={smallforwardCount}
                  width={40}
                  key={smallforwardCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>PF</label>
                <PickList
                  setValue={(count) => setPowerforwardCount(count as number)}
                  itemList={[0, 1]}
                  value={powerforwardCount}
                  width={40}
                  key={powerforwardCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>F</label>
                <PickList
                  setValue={(count) => setForwardCount(count as number)}
                  itemList={[0, 1]}
                  value={forwardCount}
                  width={40}
                  key={forwardCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>C</label>
                <PickList
                  setValue={(count) => setCenterCount(count as number)}
                  itemList={[0, 1]}
                  value={centerCount}
                  width={40}
                  key={centerCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>UTIL</label>
                <PickList
                  setValue={(count) => setUtilityPlayerCount(count as number)}
                  itemList={[0, 1, 2, 3, 4]}
                  value={utilityPlayerCount}
                  width={40}
                  key={utilityPlayerCount} // Added key prop
                />
              </div>
              <div className="settings-group">
                <label>BE</label>
                <PickList
                  setValue={(benchSize) => setBenchSize(benchSize as number)}
                  itemList={[0, 1, 2, 3, 4]}
                  value={benchSize}
                  width={40}
                  key={benchSize} // Added key prop
                />
              </div>
            </div>
          </div>
          <div className="create-draft">
            <RoundedButton color="blue" handleOnClick={() => { handleOnSubmit() }}>
              Update Draft
            </RoundedButton>
          </div>
        </div>
      </MockDraftConfiguration>
    </>
  );
};

const MockDraftConfiguration = styled.div`
    background-color: var(--coolWhite);
    height: 100%;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);
    overflow: auto;
    border: 1px solid var(--mediumDarkGrey);

    .configuration-header {
        border-bottom: 2px solid var(--lightGrey);
        padding-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .configuration-header h2 {
        font-size: 25px;
    }

    .settings-container {
        display: flex;
        padding: 20px 0px 20px 0px;
        column-gap: 40px;
        border-bottom: 2px solid var(--lightGrey);
        flex-wrap: wrap;
    }

    .settings-group {
        display: flex;
        flex-direction: column;
    }

    .roster-spots-settings {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-bottom: 20px;
        padding-top: 20px;
        border-bottom: 2px solid var(--lightGrey);
    }

    .roster-spots-settings .settings-container {
        padding: 0px;
        border: none;
        width: 65%;
        column-gap: 20px;
        row-gap: 10px;
    }

    .roster-spots-settings .settings-group {
        display: flex;
        flex-direction: row;
        align-items: space-between;
        justify-content: space-between;
        width: 110px;
    }

    .roster-spots-settings .settings-group label {
        text-align: right;
        font-weight: 600;
        padding-right: 5px;
        width: 100%;
    }

    .create-draft {
        display: flex;
        justify-content: center;
        margin-top: 25px;
    }
`;

export default UpdateMockDraft;