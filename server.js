// server.js (or your main server file)
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors()); // Enable CORS if you're serving the frontend from a different origin
app.use(express.json()); // Middleware to parse JSON requests

// Default CV Data
const defaultCVData = {
    name: "Siyabonga Tshabalala",
    contact: "240093356@keyaka.ul.ac.za",
    bio: "I am a computer science student in my first year of university and I am a striving developer.",
    education: [
        {
            degree: "N/A",
            institution: "N/A",
            year: "N/A"
        }
    ],
    experience: [
        {
            jobTitle: "Teacher Assistant",
            company: "Landulwazi Comprehensive School",
            duration: "15 Feb 2021 - 20 Oct 2023"
        }
    ],
    skills: [
        "Coding",
        "Time Management",
        "Communication Skills"
    ],
    projects: [
        {
            title: "Library Management",
            description: "Using C++ programming with help from my group members, I was able to create a library management system, though it's not perfect."
        }
    ]
};

// Endpoint to fetch CV data
app.get('/api/cv', (req, res) => {
    res.json(defaultCVData); // Return the default CV data
});

// Endpoint to update CV data (you may need to modify it to fit your needs)
app.post('/api/cv', (req, res) => {
    // Here you would handle the logic for updating the CV data
    const updatedData = req.body;
    // You might want to save this data to a database or some other persistent storage
    console.log('Updated CV Data:', updatedData); // For debugging purposes
    res.json({ message: "CV data updated successfully!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
