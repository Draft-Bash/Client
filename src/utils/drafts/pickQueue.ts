import { Player } from "../draft";
export class PickQueue {

    players: Player[];

    constructor() {
        this.players = [];
    }

    public swapUsers(first_player_id: number, second_player_id: number) {
        const index1 = this.players.findIndex(player => player.player_id === first_player_id);
        const index2 = this.players.findIndex(player => player.player_id === second_player_id);
    
        if (index1 != -1 && index2 != -1) {
            [this.players[index1], this.players[index2]] = [this.players[index2], this.players[index1]];
        }
        else {
            return null;
        }
    }

    public remove(playerId: number) {
        this.players = this.players.filter((player: Player) => player.player_id!=playerId);
    }

    public enqueue(player: Player) {
        this.players.push(player);
    }

    public dequeue() {
        if (this.players.length > 0) {
            this.players = this.players.slice(1);
            return this.players[0]
        }
        return null;
    }
}