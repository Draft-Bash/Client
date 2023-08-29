const fs = require('fs');
const csvParser = require('csv-parser');
const { TeamClient } = require('pg');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
};

// CSV file path
const csvFilePath = 'nbaData/nbaTeams.csv';

// Function to read data from CSV and insert into database
async function insertData() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to the database.');

    await new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', async () => {
          try {
            // Insert all rows into the database table
            for (const row of data) {
              await client.query(
                'INSERT INTO nba_team (team_id, team_abbreviation, team_name, city_name) VALUES ($1, $2, $3, $4)',
                [row.team_id, row.team_abbreviation, row.team_name, row.city_name]
              );
              console.log('Inserted row:', row);
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        });
    });

    console.log('Data insertion completed.');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  } finally {
    // Close the database connection
    client.end();
  }
}

// Call the function to insert data
insertPlayerData();