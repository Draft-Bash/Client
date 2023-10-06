import "../css/configureMockDraft.css";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../authentication/AuthContext";
import PickList from "../components/PickList";
import OutlinedButton from "../components/buttons/OutlinedButton";
import RoundedButton from "../components/buttons/RoundedButton";
import { useNavigate } from 'react-router-dom';
import UserInviter from "../components/UserInviter";
const API_URL = import.meta.env.VITE_API_URL;

const ConfigureMockDraft = () => {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { username } = useAuth();
    const [teamCount, setTeamCount] = useState(10);
    const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
    const [pickTime, setPickTime] = useState("90 seconds");
    const [draftType, setDraftType] = useState("snake");
    const [scoringType, setScoringType] = useState("points");
    const [draftPosition, setDraftPosition] = useState(1);
    const [pointGuardCount, setPointGuardCount] = useState(1);
    const [shootingGuardCount, setShootingGuardCount] = useState(1);
    const [guardCount, setGuardCount] = useState(1);
    const [smallforwardCount, setSmallforwardCount] = useState(1);
    const [powerforwardCount, setPowerforwardCount] = useState(1);
    const [forwardCount, setForwardCount] = useState(1);
    const [centerCount, setCenterCount] = useState(1);
    const [utilityPlayerCount, setUtilityPlayerCount] = useState(3);
    const [benchSize, setBenchSize] = useState(4);
    const [draftRange, setDraftRange] = useState<number[]>([]);
    const pickTimes = ["30 seconds", "60 seconds", "90 seconds", "120 seconds", "150 seconds"];

    const randomizePickPosition = () => {
        const randomIndex = Math.floor(Math.random() * draftRange.length);
        setDraftPosition(randomIndex+1);
    }

    const handleOnSubmit = async () => {
        try {
            console.log(username);
            const response = await fetch(API_URL+"/drafts", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    draftType: draftType,
                    scoringType: scoringType,
                    pickTimeSeconds: Number(pickTime.split(" ")[0]),
                    teamCount: teamCount,
                    pointguardSlots: pointGuardCount,
                    shootingguardSlots: shootingGuardCount,
                    guardSlots: guardCount,
                    powerforwardSlots: powerforwardCount,
                    smallforwardSlots: smallforwardCount,
                    forwardSlots: forwardCount,
                    centerSlots: centerCount,
                    utilitySlots: utilityPlayerCount,
                    benchSlots: benchSize,
                    scheduledByUserId: userId,
                    scheduledByUsername: username,
                    draftPosition: draftPosition,
                    draftUserIds: invitedUserIds
                })
            });

            const draftId = await response.json();

            navigate('/modules/drafts/draftroom/'+draftId);
          } catch (error) {
            console.error('Error:', error);
          }
        
    }

    useEffect(() => {
        let positions: number[] = [];
        for (let i: number = 1; i <= teamCount; i++) {
            positions.push(i);
        }
        setDraftRange(positions);
    }, [teamCount]);

    return (
        <div className="page-container">
            <div className="mock-draft-configuration">
                <div className="configuration-header">
                    <div>
                        <h2>Draft Creation</h2>
                        <p>Set your draft settings below</p>
                    </div>
                    <UserInviter teamsCount={teamCount} setInvitedUserIds={setInvitedUserIds}/>
                </div>
                <div className="settings-container">
                    <div className="settings-group">
                        <h5>Scoring</h5>
                        <label>
                            <input type="radio" 
                                value="points" 
                                name="mock-draft-scoring-config" 
                                onChange={(event) => {setScoringType(event.target.value)}}
                                defaultChecked 
                            />
                            Points
                        </label>
                        <label>
                            <input type="radio" 
                                value="category" 
                                name="mock-draft-scoring-config" 
                                onChange={(event) => {setScoringType(event.target.value)}}
                            />
                            Category
                        </label>
                    </div>
                    <div className="settings-group">
                        <h5>Draft type</h5>
                        <label>
                            <input type="radio" 
                                value="snake" 
                                name="mock-draft-type-config" 
                                onChange={(event) => {setDraftType(event.target.value)}}
                                defaultChecked
                            />
                            Snake
                        </label>
                        <label>
                            <input type="radio" 
                                value="linear" 
                                name="mock-draft-type-config" 
                                onChange={(event) => {setDraftType(event.target.value)}}
                            />
                            Linear
                        </label>
                    </div>
                    <div className="settings-group">
                        <h5># of teams</h5>
                        <PickList setValue={(count) => setTeamCount(count as number)} 
                            itemList={[8,10,12,14]} defaultValue={10} width={40}
                        />
                    </div>
                    <div className="settings-group">
                        <h5>Pick Time</h5>
                        <PickList setValue={(time) => setPickTime(time as string)} 
                            itemList={pickTimes} defaultValue={"90 seconds"} width={95} 
                        />
                    </div>
                    <div className="settings-group">
                        <h5>Draft Position</h5>
                        <div className="pick-position-settings">
                            <PickList setValue={(position) => setDraftPosition(position as number)} 
                                itemList={draftRange} defaultValue={draftPosition} width={40} />
                            <OutlinedButton handleOnClick={randomizePickPosition}>Randomize</OutlinedButton>
                        </div>
                    </div>
                </div>
                <div className="roster-spots-settings">
                    <h3>Roster Spots</h3>
                    <div className="settings-container">
                        <div className="settings-group">
                            <label>PG</label>
                            <PickList setValue={(count) => setPointGuardCount(count as number)} 
                                itemList={[0,1]} defaultValue={pointGuardCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>SG</label>
                            <PickList setValue={(count) => setShootingGuardCount(count as number)} 
                                itemList={[0,1]} defaultValue={shootingGuardCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>G</label>
                            <PickList setValue={(count) => setGuardCount(count as number)} 
                                itemList={[0,1]} defaultValue={guardCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>SF</label>
                            <PickList setValue={(count) => setSmallforwardCount(count as number)} 
                                itemList={[0,1]} defaultValue={smallforwardCount} width={40}
                            />
                        </div>
                        <div className="settings-group">
                            <label>PF</label>
                            <PickList setValue={(count) => setPowerforwardCount(count as number)} 
                                itemList={[0,1]} defaultValue={powerforwardCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>F</label>
                            <PickList setValue={(count) => setForwardCount(count as number)} 
                                itemList={[0,1]} defaultValue={forwardCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>C</label>
                            <PickList setValue={(count) => setCenterCount(count as number)} itemList={[0,1]} 
                                defaultValue={centerCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>UTIL</label>
                            <PickList setValue={(count) => setUtilityPlayerCount(count as number)} 
                                itemList={[0,1,2,3,4]} defaultValue={utilityPlayerCount} width={40} 
                            />
                        </div>
                        <div className="settings-group">
                            <label>BE</label>
                            <PickList setValue={(benchSize) => setBenchSize(benchSize as number)} 
                                itemList={[0,1,2,3,4]} defaultValue={benchSize} width={40} 
                            />
                        </div>
                    </div>
                </div>
                <div className="create-draft">
                    <RoundedButton color="blue" handleOnClick={() => {handleOnSubmit()}}>Create Draft</RoundedButton>
                </div>
            </div>
        </div>
    );
};
 
export default ConfigureMockDraft;