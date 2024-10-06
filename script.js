// Function to show the specified section
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
      section.classList.add('hidden');
      section.classList.remove('active');
  });

  const activeSection = document.getElementById(sectionId);
  activeSection.classList.remove('hidden');
  activeSection.classList.add('active');
}

// Toggle visibility of the edit section
function toggleEdit(section) {
  const editSection = document.querySelector(`#${section} .edit-section`);
  editSection.classList.toggle('hidden');
}

// Fetch CV Data from the Backend
async function getCVData() {
  try {
      const response = await fetch('http://localhost:3000/api/cv');
      if (!response.ok) throw new Error('Network response was not ok');
      const cvData = await response.json();
      displayCVData(cvData);
  } catch (error) {
      console.error('Error fetching CV data:', error);
  }
}

// Display CV Data in the HTML
function displayCVData(cvData) {
  document.querySelector('#about p:nth-child(2)').textContent = `Name: ${cvData.name}`;
  document.querySelector('#about p:nth-child(3)').textContent = `Contact: ${cvData.contact}`;
  document.querySelector('#about p:nth-child(4)').textContent = `Short Bio: ${cvData.bio}`;

  // For education, experience, skills, and projects
  document.querySelector('#education p:nth-child(2)').textContent = `Degree: ${cvData.education[0]?.degree || ''}`;
  document.querySelector('#education p:nth-child(3)').textContent = `Institution: ${cvData.education[0]?.institution || ''}`;
  document.querySelector('#education p:nth-child(4)').textContent = `Year: ${cvData.education[0]?.year || ''}`;

  document.querySelector('#experience p:nth-child(2)').textContent = `Job Title: ${cvData.experience[0]?.jobTitle || ''}`;
  document.querySelector('#experience p:nth-child(3)').textContent = `Company: ${cvData.experience[0]?.company || ''}`;
  document.querySelector('#experience p:nth-child(4)').textContent = `Duration: ${cvData.experience[0]?.duration || ''}`;

  const skillsList = document.getElementById('skillsList');
  skillsList.innerHTML = ''; // Clear existing skills
  cvData.skills.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      skillsList.appendChild(li);
  });

  document.querySelector('#projects p:nth-child(2)').textContent = `Project Title: ${cvData.projects[0]?.title || ''}`;
  document.querySelector('#projects p:nth-child(3)').textContent = `Description: ${cvData.projects[0]?.description || ''}`;
}

// Update CV Data in the Backend
async function updateCVData(newData) {
  try {
      // Fetch existing data
      const existingDataResponse = await fetch('http://localhost:3000/api/cv');
      const existingData = await existingDataResponse.json();

      // Merge existing data with new data
      const updatedData = {
          ...existingData,
          ...newData
      };

      const response = await fetch('http://localhost:3000/api/cv', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      console.log(result.message);
      getCVData(); // Refresh data after updating
  } catch (error) {
      console.error('Error updating CV data:', error);
  }
}

// Save functions for editing sections
function saveAbout() {
  const name = document.getElementById('aboutName').value;
  const email = document.getElementById('aboutEmail').value;
  const bio = document.getElementById('aboutBio').value;

  updateCVData({ name, contact: email, bio });
  toggleEdit('about');
}

function saveEducation() {
  const degree = document.getElementById('educationDegree').value;
  const institution = document.getElementById('educationInstitution').value;
  const year = document.getElementById('educationYear').value;

  updateCVData({ education: [{ degree, institution, year }] });
  toggleEdit('education');
}

function saveExperience() {
  const jobTitle = document.getElementById('experienceJobTitle').value;
  const company = document.getElementById('experienceCompany').value;
  const duration = document.getElementById('experienceDuration').value;

  updateCVData({ experience: [{ jobTitle, company, duration }] });
  toggleEdit('experience');
}

function addSkill() {
  const newSkill = document.getElementById('newSkill').value;
  if (newSkill) {
      const skillsList = document.getElementById('skillsList');
      const li = document.createElement('li');
      li.textContent = newSkill;
      skillsList.appendChild(li);

      // Update skills in the backend
      const skills = [...skillsList.children].map(li => li.textContent);
      updateCVData({ skills });
      document.getElementById('newSkill').value = '';
  }
}

function saveProject() {
  const title = document.getElementById('projectTitle').value;
  const description = document.getElementById('projectDescription').value;

  updateCVData({ projects: [{ title, description }] });
  toggleEdit('projects');
}

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  alert('Your message has been sent!');
  this.reset(); // Reset the form after submission
});

// Call getCVData when the page loads
window.onload = getCVData;
