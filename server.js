const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let cvData = {
    name: 'Siyabonga Tshabalala',
    contact: '240093356@keyaka.ul.ac.za',
    bio: 'I am a computer science student in my first year of university and I am a striving developer.',
    education: [{
        degree: 'Bsc in Computer Science',
        institution: 'University of Limpopo',
        year: 2024
    }],
    experience: [{
        jobTitle: 'Teacher assistant',
        company: 'Landulwazi Comprehensive school',
        duration: '15 Feb 2021 - 20 Oct 2023'
    }],
    skills: ['Coding', 'Time Management', 'Communication Skills'],
    projects: [{
        title: 'Library management',
        description: 'Using C++ programming with help from my group members, I was able to create a library management system, though it\'s not perfect.'
    }]
};

// Get CV Data
app.get('/api/cv', (req, res) => {
    res.json(cvData);
});

// Update CV Data
app.post('/api/cv', (req, res) => {
    const newData = req.body;

    // Update each field if present in the newData
    cvData = { ...cvData, ...newData };
    res.json({ message: 'CV data updated successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

