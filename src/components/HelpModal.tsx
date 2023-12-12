import React, { useRef, useState, useEffect } from "react";
import "../css/helpPage.css";
import CloseButton from "./buttons/CloseButton";

interface Invite {
    user_id: number;
    draft_id: number;
    is_invite_read: false;
    username: string;
    team_count: number;
    scoring_type: string;
}

const HelpModal = () => {
	const modalRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
            <p className={isOpen ? 'open-help active' : 'open-help'}
            onClick={() => setIsOpen(true)}
            >
                FAQs
            </p>
			<dialog
				open={isOpen}
				ref={modalRef}
				onClick={(e) => {
					if (e.target == modalRef.current) {
						setIsOpen(false);
					}
				}}
				className="modal" 
			>
                <div className="help-page">
                    <h4>
                        <CloseButton handleOnClick={() => setIsOpen(false)} />
                        FAQs
                    </h4>
                    <div className='faqs'>
                        <p className='question'><strong>Q:</strong> How do I invite others to my draft?</p>
                        <p className='answer'>
                            <strong>A:</strong> When creating or updating your draft, press the 'Invites' button.
                            Enter your friend's username to invite them. If they are already invited, you can remove them. 
                            To join, friends can accept the invite through email or their messages by pressing the mail icon.
                        </p>

                        <p className='question'><strong>Q:</strong> What is the difference between points and category drafts?</p>
                        <p className='answer'>
                            <strong>A:</strong> Points drafts rank players based on expected performance in points leagues. 
                            Category drafts rank players based on expected performance in category leagues.
                            In points leagues, each statistical category is worth points, and the team with the most points wins. 
                            In category leagues, teams win by leading in the most categories.
                            As such, some NBA players may be more valuable in category leagues than they are in points leagues
                            and vice versa.
                        </p>

                        <p className='question'><strong>Q:</strong> What is the difference between snake and linear drafts?</p>
                        <p className='answer'>
                            <strong>A:</strong> Snake drafts have a snaking order, while linear drafts maintain a fixed order. 
                            For example, in a snake draft with 10 teams labeled 1-10,
                            the order is 1,2,3,...10,10,9,8,...3,2,1,1,2,3,... . 
                            Linear drafts have a simple order: 1,2,3,...10,1,2,3,... . 
                            Linear drafts disadvantage teams that pick later.
                        </p>

                        <p className='question'><strong>Q:</strong> What is autodrafting?</p>
                        <p className='answer'>
                            <strong>A:</strong> Teams on autodrafting mode make automatic picks if they don't make their 
                            selection in time.
                            Teams can manually activate or deactivate autodrafting.
                        </p>

                        <p className='question'><strong>Q:</strong> What is the draft queue?</p>
                        <p className='answer'>
                            <strong>A:</strong> Teams can queue players for automatic picks when available. 
                            The queue appears in the upper left corner.
                            Swap player priorities by pressing one player, then another. 
                            If a player is picked, they are removed, and the next highest player is considered.
                        </p>

                        <p className='question'><strong>Q:</strong> What is a good draft strategy?</p>
                        <p className='answer'>
                            <strong>A:</strong> A balanced approach is advisable. Drafting only one position early 
                            may limit choices later.
                            Consider the availability of good players in later rounds to avoid positional disadvantages.
                        </p>

                        <p className='question'><strong>Q:</strong> How do I view past drafts?</p>
                        <p className='answer'>
                            <strong>A:</strong> Use the droplist on the mock drafts page to filter and view specific drafts.
                        </p>

                        <p className='question'><strong>Q:</strong> How do I view other team's players?</p>
                        <p className='answer'>
                            <strong>A:</strong> Use the roster droplist in the left column of the draft to select 
                            and view other teams.
                        </p>
                    </div>
                </div>
			</dialog>
		</>
	);
};

export default HelpModal ;