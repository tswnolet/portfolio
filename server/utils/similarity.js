const getSimilarity = (input, movieTitle) => {
    input = input.toLowerCase();
    movieTitle = movieTitle.toLowerCase();
    const lenInput = input.length;
    const lenMovieTitle = movieTitle.length;
    let matrix = [];

    if (lenInput === 0) return lenMovieTitle === 0 ? 100 : 0;
    if (lenMovieTitle === 0) return 0;

    for (let i = 0; i <= lenInput; i++) matrix[i] = [i];
    for (let j = 0; j <= lenMovieTitle; j++) matrix[0][j] = j;

    for (let i = 1; i <= lenInput; i++) {
        for (let j = 1; j <= lenMovieTitle; j++) {
            if (input.charAt(i - 1) === movieTitle.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    const distance = matrix[lenInput][lenMovieTitle];
    let score = ((1 - distance / Math.max(lenInput, lenMovieTitle)) * 100);

    // Boost exact word order match
    if (movieTitle.includes(input)) score += 20;
    if (movieTitle.startsWith(input)) score += 30;

    // Penalize if query is short but doesn't match well
    if (input.length < 5 && score < 50) score -= 30;

    return score.toFixed(1);
};

/**
 * Detects phrase similarity for improved ranking.
 */
const phraseMatch = (input, title) => {
    const words = input.toLowerCase().split(" ");
    const titleWords = title.toLowerCase().split(" ");

    return words.every(word => titleWords.includes(word)) ? 1 : 0;
};

/**
 * Handles abbreviations like "LOTR" → "Lord of the Rings".
 */
const abbreviationMatch = (input, title) => {
    const acronyms = {
        "lotr": "lord of the rings",
        "hp": "harry potter",
        "gotg": "guardians of the galaxy",
        "sw": "star wars"
    };

    return acronyms[input.toLowerCase()] === title.toLowerCase() ? 1 : 0;
};

/**
 * Intelligent typo correction scoring.
 */
const typoCorrectionScore = (input, title) => {
    return input.length >= 3 && title.startsWith(input) ? 1 : 0;
};

export { getSimilarity, phraseMatch, abbreviationMatch, typoCorrectionScore };