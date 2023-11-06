import "../../css/draftRoom/draftGrade.css";
import React, { useEffect, useState, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import TranslucentButton from "../buttons/TranslucentButton";
import { useAuth } from "../../authentication/AuthContext";
import { useDraft } from "./DraftContext";
const API_URL = import.meta.env.VITE_API_URL;

interface Props {
	isOpen: boolean;
	draftGrade: string;
	draftRank: number;
	projectFanPtsTotal: number;
}

const DraftGrade = (props: Props) => {
	const modalRef = useRef(null);
	const [isDraftGradeOpen, setIsDraftGradeOpen] = useState(false);
    const {userId} = useAuth();
    const draftContext = useDraft();
    const draftId = draftContext?.draftId;

	useEffect(() => {
		setIsDraftGradeOpen(props.isOpen);
	}, [props.isOpen]);

    const sendSummaryEmail = async () => {
        const response = await fetch(API_URL+"/drafts/grades", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                draftId: draftId,
                fanPtsTotal: props.projectFanPtsTotal,
                draftRank: props.draftRank,
                draftGrade: props.draftGrade
            }),
        });
    }

	return (
		<dialog
			ref={modalRef}
			open={isDraftGradeOpen}
			onClick={(e) => {
				if (e.target == modalRef.current) {
					setIsDraftGradeOpen(false);
				}
			}}
			className="modal"
		>
			<div
				className={
					isDraftGradeOpen ? "draft-grade-area active" : "draft-grade-area"
				}
			>
				<h4>
					<RxCross1
						className="close"
						onClick={() => setIsDraftGradeOpen(false)}
					/>
					This draft is over!
				</h4>
				<h5>Summary</h5>
				<div className="summary">
					Grade: <b className={props.draftGrade}>{props.draftGrade}</b>
				</div>
				<div className="summary">
					Total Proj. Fan Pts: <b>{props.projectFanPtsTotal}</b>
				</div>
				<div className="summary">
					Rank: <b>{props.draftRank}</b>
				</div>
				<div className="send-email-summary">
					<p>Email the results to yourself.</p>
					<TranslucentButton handleOnClick={() => sendSummaryEmail()}>
						Send
					</TranslucentButton>
				</div>
			</div>
		</dialog>
	);
};

export default DraftGrade;
