import React, { useState, useEffect } from "react";
import { useDraft } from "../DraftContext";
import "../../../css/draftRoom/draftClock.css";

const DraftClock = () => {
	const draftContext = useDraft();
	const socket = draftContext?.socket;
	const draftId = draftContext?.draftId
	const [time, setTime] = useState(0);

	const audio = new Audio("/clockTick.mp3");
	const [userInteracted, setUserInteracted] = useState(false);

	// Detect when the user interacts with the page.
	const handleUserInteraction = () => {
		setUserInteracted(true);
	};

	useEffect(() => {
		if (!userInteracted) {
			// If the user hasn't interacted, add an event listener to detect interaction.
			document.addEventListener("click", handleUserInteraction);
		}

		if (draftId) {
			socket?.on("update-clock", (remainingTime: number) => {
				setTime(remainingTime);

				// Check if the user has interacted and play the audio automatically.
				if (userInteracted && remainingTime < 10) {
					audio.currentTime = 0;
					audio.play();
				}
			});
		}

		return () => {
			// Cleanup: Remove the event listener when the component unmounts.
			document.removeEventListener("click", handleUserInteraction);
		};
	}, [draftId, userInteracted]);

	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		const formattedMinutes = String(minutes).padStart(2, "0");
		const formattedSeconds = String(remainingSeconds).padStart(2, "0");

		return `${formattedMinutes}:${formattedSeconds}`;
	}

	return (
		<div className={`draft-clock ${time <= 10 ? "turn-expiring" : ""}`}>
			{formatTime(time)}
		</div>
	);
};

export default DraftClock;