// Define the DraftRoster interface or type
export interface DraftRoster {
    pointguard: (Player|null)[];
    shootingguard: (Player|null)[];
    guard: (Player|null)[];
    smallforward: (Player|null)[];
    powerforward: (Player|null)[];
    forward: (Player|null)[];
    center: (Player|null)[];
    utility: (Player|null)[];
    bench: (Player|null)[];
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
        player[`is_${position}` as keyof Player] ||
        position === 'bench' ||
        position === 'utility' ||
        ((player.is_pointguard || player.is_shootingguard) && position === 'guard') ||
        ((player.is_smallforward || player.is_powerforward) && position === 'forward')
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
    for (const position of Object.keys(rosterSpots) as Array<keyof DraftRoster>) {
      if (
        player[`is_${position}` as keyof Player] ||
        position === 'bench' ||
        position === 'utility'
      ) {
        let emptyIndex = rosterSpots[position].findIndex((slot) => slot === null);
        if (emptyIndex !== -1) {
          rosterSpots[position][emptyIndex] = player;
          return true;
        } else {
          for (let i = 0; i < rosterSpots[position].length; i++) {
            if (shiftPlayer(player, position, i, rosterSpots)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  
  
  