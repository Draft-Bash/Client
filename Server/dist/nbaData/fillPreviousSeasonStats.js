"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const prevSeasonfs = require('fs');
const prevSeasonCsvParser = require('csv-parser');
const pgp = require('pg-promise')();
require('dotenv').config();
// Database connection configuration
const prevSeasonDbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};
// CSV file path
const prevSeasonCsvFilePath = 'nbaData/previousSeasonStats.csv';
// Create a connection to the database
const db = pgp(prevSeasonDbConfig);
// Function to insert data from CSV into the database table
function insertPrevSeasonData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rows = []; // Store rows for batch insert
            yield new Promise((resolve, reject) => {
                prevSeasonfs.createReadStream(prevSeasonCsvFilePath)
                    .pipe(prevSeasonCsvParser())
                    .on('data', (row) => {
                    rows.push(row);
                })
                    .on('end', () => {
                    resolve();
                })
                    .on('error', (error) => {
                    reject(error);
                });
            });
            if (rows.length > 0) {
                // Batch insert
                yield db.tx((t) => __awaiter(this, void 0, void 0, function* () {
                    const insertQueries = rows.map((row) => {
                        return t.none('INSERT INTO nba_player_season_totals (player_id, season_name, games_played, minutes_played, fieldgoals_made, fieldgoals_attempted, threes_made, threes_attempted, freethrows_made, freethrows_attempted, rebounds_total, assists_total, steals_total, blocks_total, turnovers_total, points_total) ' +
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
                        ]);
                    });
                    yield t.batch(insertQueries);
                }));
                console.log('Data insertion completed.');
                console.log('Total rows processed:', rows.length);
            }
            pgp.end(); // Close the database connection
        }
        catch (error) {
            console.error('Error:', error.message);
        }
    });
}
// Call the function to insert data
insertPrevSeasonData();
