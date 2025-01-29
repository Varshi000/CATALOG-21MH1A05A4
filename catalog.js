const fs = require('fs');

// Function to decode values based on base
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function to calculate mean of an array
function calculateMean(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

// Function to calculate standard deviation of an array
function calculateStandardDeviation(arr, mean) {
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Function to detect outliers
function detectOutliers(points) {
    const yValues = points.map(point => point.y);
    const mean = calculateMean(yValues);
    const stdDev = calculateStandardDeviation(yValues, mean);

    const threshold = 2;
    return points.filter(point => Math.abs(point.y - mean) > threshold * stdDev);
}

// Function for Lagrange Interpolation to calculate the constant term
function lagrangeInterpolation(points, k) {
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        let li = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= -xj / (xi - xj);
            }
        }

        constantTerm += yi * li;
    }

    return Math.round(constantTerm);
}

// Function to process the JSON file and find the secret
function findSecretConstant(jsonData) {
    let { n, k } = jsonData.keys;
    let points = [];

    // Parse and decode each point
    Object.keys(jsonData).forEach(key => {
        if (key !== 'keys') {
            let base = parseInt(jsonData[key].base);
            let value = jsonData[key].value;
            let x = parseInt(key);
            let y = decodeValue(base, value);
            points.push({ x, y });
        }
    });

    points.sort((a, b) => a.x - b.x);

    // Detect outliers before using Lagrange interpolation
    let outliers = detectOutliers(points);
    console.log("Outliers:", outliers.length > 0 ? outliers : "No outliers detected.");

    return lagrangeInterpolation(points, k);
}

function processTestCases(testCases) {
    testCases.forEach((testCase, index) => {
        let secret = findSecretConstant(testCase);
        console.log(`The secret constant term (c) for test case ${index + 1} is: ${secret}`);
    });
}

// Read and process test cases
const testCase1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
const testCase2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));

const testCases = [testCase1, testCase2];

processTestCases(testCases);
