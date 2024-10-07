const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 1433;

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',          // The MySQL server (use 'localhost' for local dev)
    user: 'root',               // Your MySQL username
    password: 's1y@@',               // Your MySQL password (leave blank if none)
    database: 'my_cv_database'  // The name of your database
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// Get CV Data
app.get('/api/cv', (req, res) => {
    const query = `
        SELECT * FROM personal_info;
        SELECT * FROM education;
        SELECT * FROM experience;
        SELECT * FROM skills;
        SELECT * FROM projects;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).send('Server error');
            return;
        }

        const [personalInfo, education, experience, skills, projects] = results;
        const cvData = {
            name: personalInfo[0]?.name || 'N/A',
            contact: personalInfo[0]?.contact || 'N/A',
            bio: personalInfo[0]?.bio || 'N/A',
            education: education,
            experience: experience,
            skills: skills.map(skill => skill.skill_name), // Assuming you have a column named 'skill_name'
            projects: projects
        };
        res.json(cvData);
    });
});

// Update CV Data
app.post('/api/cv', (req, res) => {
    const newData = req.body;

    // Update each field if present in the newData
    // Example for updating personal info
    if (newData.name || newData.contact || newData.bio) {
        const { name, contact, bio } = newData;
        const query = 'UPDATE personal_info SET name = ?, contact = ?, bio = ? WHERE id = ?'; // Assuming you have a unique ID
        db.query(query, [name, contact, bio, 1], (err) => { // Update for the first entry
            if (err) {
                console.error('Error updating personal info:', err.message);
                res.status(500).send('Server error');
                return;
            }
        });
    }

    // Implement similar logic for education, experience, skills, and projects
    // Example for updating education
    if (newData.education) {
        const educationQuery = 'UPDATE education SET degree = ?, institution = ?, year = ? WHERE id = ?'; // Assuming you have a unique ID
        db.query(educationQuery, [newData.education[0].degree, newData.education[0].institution, newData.education[0].year, 1], (err) => { // Update for the first entry
            if (err) {
                console.error('Error updating education:', err.message);
                res.status(500).send('Server error');
                return;
            }
        });
    }

    // Handle other fields like experience, skills, and projects similarly...

    res.json({ message: 'CV data updated successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
