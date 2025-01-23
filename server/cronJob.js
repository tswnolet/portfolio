import cron from 'node-cron';
import { exec } from 'child_process';

// Run the movie fetch script at 12:01 AM daily
cron.schedule('1 0 * * *', () => {
    console.log("⏳ Running daily movie database update...");
    exec('node fetchMovies.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error updating movies: ${error.message}`);
            return;
        }
        console.log(stdout);
    });
});

console.log("Movie database update job scheduled.");