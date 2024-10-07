const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 1433; // Vercel assigns PORT automatically

app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection with environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,         // MySQL host from environment variables
    user: process.env.DB_USER,         // MySQL username from environment variables
    password: process.env.DB_PASSWORD, // MySQL password from environment variables
    database: process.env.DB_NAME      // MySQL database name from environment variables
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
            skills: skills.map(skill => skill.skill_name), // Assuming column 'skill_name'
            projects: projects
        };
        res.json(cvData);
    });
});

// Update CV Data
app.post('/api/cv', (req, res) => {
    const newData = req.body;

    // Update personal info
    if (newData.name || newData.contact || newData.bio) {
        const { name, contact, bio } = newData;
        const query = 'UPDATE personal_info SET name = ?, contact = ?, bio = ? WHERE id = ?';
        db.query(query, [name, contact, bio, 1], (err) => {
            if (err) {
                console.error('Error updating personal info:', err.message);
                res.status(500).send('Server error');
                return;
            }
        });
    }

    // Update education (as an example)
    if (newData.education) {
        const educationQuery = 'UPDATE education SET degree = ?, institution = ?, year = ? WHERE id = ?';
        db.query(educationQuery, [newData.education[0].degree, newData.education[0].institution, newData.education[0].year, 1], (err) => {
            if (err) {
                console.error('Error updating education:', err.message);
                res.status(500).send('Server error');
                return;
            }
        });
    }

    res.json({ message: 'CV data updated successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
