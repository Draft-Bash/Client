var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var prevSeasonfs = require('fs');
var prevSeasonCsvParser = require('csv-parser');
var pgp = require('pg-promise')();
require('dotenv').config();
// Database connection configuration
var prevSeasonDbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};
// CSV file path
var prevSeasonCsvFilePath = 'nbaData/previousSeasonStats.csv';
// Create a connection to the database
var db = pgp(prevSeasonDbConfig);
// Function to insert data from CSV into the database table
function insertPrevSeasonData() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            try {
                // Read the CSV file and insert data
                prevSeasonfs.createReadStream(prevSeasonCsvFilePath)
                    .pipe(prevSeasonCsvParser())
                    .on('data', function (row) { return __awaiter(_this, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, db.none('INSERT INTO nba_player_season_totals (player_id, season_name, games_played, minutes_played, fieldgoals_made, fieldgoals_attempted, threes_made, threes_attempted, freethrows_made, freethrows_attempted, rebounds_total, assists_total, steals_total, blocks_total, turnovers_total, points_total) ' +
                                        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [
                                        row.player_id,
                                        row.season_name,
                                        row.games_played,
                                        row.minutes_played,
                                        row.fieldgoals_made,
                                        row.fieldgoals_attempted,
                                        row.threes_made,
                                        row.threes_attempted,
                                        row.freethrows_made,
                                        row.freethrows_attempted,
                                        row.rebounds_total,
                                        row.assists_total,
                                        row.steals_total,
                                        row.blocks_total,
                                        row.turnovers_total,
                                        row.points_total,
                                    ])];
                            case 1:
                                _a.sent();
                                console.log('Inserted row:', row);
                                return [3 /*break*/, 3];
                            case 2:
                                error_1 = _a.sent();
                                console.error('Error inserting row:', row);
                                console.error(error_1.message);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })
                    .on('end', function () {
                    console.log('Data insertion completed.');
                    pgp.end(); // Close the database connection
                });
            }
            catch (error) {
                console.error('Error reading CSV file:', error.message);
            }
            return [2 /*return*/];
        });
    });
}
// Call the function to insert data
insertPrevSeasonData();
