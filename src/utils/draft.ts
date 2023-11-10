// Define the DraftRoster interface or type
export interface DraftRoster {
	pointguard: (Player | null)[];
	shootingguard: (Player | null)[];
	guard: (Player | null)[];
	smallforward: (Player | null)[];
	powerforward: (Player | null)[];
	forward: (Player | null)[];
	center: (Player | null)[];
	utility: (Player | null)[];
	bench: (Player | null)[];
}

export interface Draft {
	draft_id: number;
    draft_type: string;
    scoring_type: string;
    pick_time_seconds: number;
    team_count: number;
    pointguard_slots: number;
    shootingguard_slots: number;
    guard_slots: number;
    smallforward_slots: number;
    powerforward_slots: number;
    forward_slots: number;
    center_slots: number;
    utility_slots: number;
    bench_slots: number
    scheduled_by_user_id: number;
	is_started: boolean
}

export interface DraftPick {
	picked_by_bot_number: number;
	is_center: boolean;
	is_powerforward: boolean;
	is_smallforward: boolean;
	is_shootingguard: boolean;
	is_pointguard: boolean;
	team_abbreviation: string;
	last_name: any;
	first_name: any;
	player_id: any;
	user_draft_order_id: number;
	user_id: number;
	draft_id: number;
	bot_number: number;
	pick_number: number;
	is_picked: boolean;
	username: string;
}

// Define the Player interface
export interface Player {
	first_name: string;
	last_name: string;
	player_age: number;
	player_id: number;
	team_id: number;
	is_pointguard: boolean;
	is_shootingguard: boolean;
	is_guard: boolean;
	is_smallforward: boolean;
	is_powerforward: boolean;
	is_forward: boolean;
	is_center: boolean;
	is_utility: boolean;
}

export interface PlayerPreviousSeasonStats extends Player {
	rank_number: number;
	games_played: number;
	minutes_played: number;
	points_total: number;
	blocks_total: number;
	steals_total: number;
	turnovers_total: number;
	rebounds_total: number;
	assists_total: number;
	team_abbreviation: string;
	fieldgoals_made: number;
	fieldgoals_attempted: number;
	threes_made: number;
	threes_attempted: number;
}

export interface ProjectedSeasonStats extends Player {
	projected_games_played: number;
	projected_minutes_played: number;
	projected_points: number;
	projected_blocks: number;
	projected_steals: number;
	projected_turnovers: number;
	projected_rebounds: number;
	projected_assists: number;
	projected_fieldgoal_percentage: number;
	projected_threepointers: number;
}

// Define the function to shift a player
export function shiftPlayer(
	player: Player,
	currentSpot: keyof DraftRoster,
	currentSpotIndex: number,
	rosterSpots: DraftRoster
): boolean {
	for (const position of Object.keys(rosterSpots) as Array<keyof DraftRoster>) {
		if (
			player[`is_${position}` as keyof Player] ||
			position === "bench" ||
			position === "utility" ||
			((player.is_pointguard || player.is_shootingguard) &&
				position === "guard") ||
			((player.is_smallforward || player.is_powerforward) &&
				position === "forward")
		) {
			let emptyIndex = rosterSpots[position].findIndex((slot) => slot === null);
			if (emptyIndex !== -1) {
				rosterSpots[position][emptyIndex] = player;
				rosterSpots[currentSpot][currentSpotIndex] = null;
				return true;
			}
		}
	}
	return false;
}

export function addPlayer(player: Player, rosterSpots: DraftRoster) {
  if (!isPlayerInDraftRoster(player.player_id, rosterSpots)) {
    for (const position of Object.keys(rosterSpots) as Array<keyof DraftRoster>) {
      if (
        player[`is_${position}` as keyof Player] ||
        position === "bench" ||
        position === "utility" ||
        ((player.is_pointguard || player.is_shootingguard) &&
          position === "guard") ||
        ((player.is_smallforward || player.is_powerforward) &&
          position === "forward")
      ) {
        let emptyIndex = rosterSpots[position].findIndex((slot) => slot === null);
        if (emptyIndex !== -1) {
          rosterSpots[position][emptyIndex] = player;
          return true;
        } else {
          for (let i = 0; i < rosterSpots[position].length; i++) {
            if (
              rosterSpots[position][i] &&
              shiftPlayer(
                rosterSpots[position][i] as Player,
                position,
                i,
                rosterSpots
              )
            ) {
              rosterSpots[position][i] = player;
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function isPlayerInDraftRoster(playerId: number, draftRoster: DraftRoster) {
	// Iterate through each roster in the draftRosters data structure
	for (const roster of Object.values(draftRoster)) {
		// Check if the roster is an array (to handle possible null values)
		if (Array.isArray(roster)) {
			// Use Array.prototype.some() to check if any player in the roster matches the playerId
			const playerExists = roster.some(
				(player) => player && player.player_id === playerId
			);
			if (playerExists) {
				return true; // Player with playerId found
			}
		}
	}
	return false; // Player with playerId not found in any roster
}

export function formatPlayerPositions(
	isPointGuard: boolean, isShootingguard: boolean, isSmallforward: boolean,
	isPowerforward: boolean, isCenter: boolean, delimiter: string)
{
	let eligiblePositions = "";
	if (isPointGuard) {
		eligiblePositions+="PG";
	}
	if (isShootingguard) {
		if (eligiblePositions.length > 0) {
			eligiblePositions+=delimiter+'SG'
		}
		else {
			eligiblePositions+='SG'
		}
	}
	if (isSmallforward) {
		if (eligiblePositions.length > 0) {
			eligiblePositions+=delimiter+'SF'
		}
		else {
			eligiblePositions+='SF'
		}
	}
	if (isPowerforward) {
		if (eligiblePositions.length > 0) {
			eligiblePositions+=delimiter+'PF'
		}
		else {
			eligiblePositions+='PF'
		}
	}
	if (isCenter) {
		if (eligiblePositions.length > 0) {
			eligiblePositions+=delimiter+'C'
		}
		else {
			eligiblePositions+='C'
		}
	}
	return eligiblePositions;
}