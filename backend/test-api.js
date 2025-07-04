// Test script to verify the API endpoint
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a test token for suminten@gmail.com
const testToken = jwt.sign({
        userId: '68665a494851ace577355b5e',
        role: 'student'
    },
    process.env.JWT_SECRET, { expiresIn: '1d' }
);

console.log('Test token for suminten@gmail.com:');
console.log(testToken);

// Test the API using fetch
async function testAPI() {
    try {
        const response = await fetch('http://localhost:5000/api/student/courses', {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${testToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('Response data:', data);
        } else {
            const errorText = await response.text();
            console.log('Error response:', errorText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testAPI();