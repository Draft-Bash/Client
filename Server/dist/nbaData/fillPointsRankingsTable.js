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
const ptsRankingfs = require('fs');
const ptsRankingCsvParser = require('csv-parser');
const { Client } = require('pg');
require('dotenv').config();
// Database connection configuration
const ptsRankingDbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
};
// CSV file path
const ptsRankingCsvFilePath = 'nbaData/points_rankings.csv';
// Function to read data from CSV and insert into the database table
function insertPtsRankingData() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client(ptsRankingDbConfig);
        try {
            yield client.connect();
            console.log('Connected to the database.');
            const data = [];
            ptsRankingfs.createReadStream(ptsRankingCsvFilePath)
                .pipe(ptsRankingCsvParser())
                .on('data', (row) => {
                data.push(row);
            })
                .on('end', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    for (const row of data) {
                        // Insert each row into the database table
                        yield client.query('INSERT INTO points_draft_ranking (rank_number, player_id) VALUES ($1, $2)', [row.rank_number, row.player_id]);
                        console.log('Inserted row:', row);
                    }
                    console.log('Data insertion completed.');
                }
                catch (error) {
                    console.error('Error inserting data:', error.message);
                }
                finally {
                    // Close the database connection
                    client.end();
                }
            }));
        }
        catch (error) {
            console.error('Error connecting to the database:', error.message);
        }
    });
}
// Call the function to insert data
insertPtsRankingData();
