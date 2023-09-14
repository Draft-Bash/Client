// Define the DraftRoster interface or type
export interface DraftRoster {
  pointguard: (Player|null)[];         // Array of point guards or null
  shootingguard: (Player|null)[];      // Array of shooting guards or null
  guard: (Player|null)[];              // Array of guards or null
  smallforward: (Player|null)[];       // Array of small forwards or null
  powerforward: (Player|null)[];       // Array of power forwards or null
  forward: (Player|null)[];            // Array of forwards or null
  center: (Player|null)[];             // Array of centers or null
  utility: (Player|null)[];            // Array of utility players or null
  bench: (Player|null)[];              // Array of bench players or null
}

export interface DraftPick {
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
  rebounds_total: number;
  assists_total: number;
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
      player[`is_${position}` as keyof Player] ||  // Check if the player can be placed in this position
      position === 'bench' ||                      // Bench or utility positions
      position === 'utility' ||
      ((player.is_pointguard || player.is_shootingguard) && position === 'guard') || 
      ((player.is_smallforward || player.is_powerforward) && position === 'forward')  
    ) {
      let emptyIndex = rosterSpots[position].findIndex((slot) => slot === null);  // Find an empty slot in the position
      if (emptyIndex !== -1) {
        rosterSpots[position][emptyIndex] = player; // Place the player in the empty slot
        rosterSpots[currentSpot][currentSpotIndex] = null;  // Set the current slot to null
        return true;  // Player placement successful
      }
    }
  }
  return false;  // Player placement failed
}

// Define a function to add a player to the roster
export function addPlayer(player: Player, rosterSpots: DraftRoster) {
  for (const position of Object.keys(rosterSpots) as Array<keyof DraftRoster>) {
    if (
      player[`is_${position}` as keyof Player] ||  // Check if the player can be placed in this position
      position === 'bench' ||                    // Bench or utility positions
      position === 'utility'
    ) {
      let emptyIndex = rosterSpots[position].findIndex((slot) => slot === null);  // Find an empty slot in the position
      if (emptyIndex !== -1) {
        rosterSpots[position][emptyIndex] = player;  // Place the player in the empty slot
        return true;  // Player placement successful
      } else {
        for (let i = 0; i < rosterSpots[position].length; i++) {
          if (shiftPlayer(player, position, i, rosterSpots)) {
            return true;  // Player placement successful after shifting
          }
        }
      }
    }
  }
  return false;  // Player placement failed
}