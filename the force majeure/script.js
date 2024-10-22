// Global variables
const track = document.querySelector('.carousel-track');
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');
const titleBox = document.getElementById('title-box');
const signupBox = document.getElementById('signup-box');
const menuBanner = document.getElementById('menu-banner');
let cardData = [];

// Function to fetch and process CSV data
async function fetchCSVData() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTFvyHJ1fZxGvYxFOXPQ6y982w8UoFTRUpfRVoAWcSolVnErd-xsJnr7GT1VIBp9lH69_l06sGl5HPm/pub?gid=1119628772&single=true&output=csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1); // Skip the header row

    const parsedData = rows.map(row => {
        const columns = row.split(',');
        return {
            name: columns[2], // Organization name from column C
            bannerImage: columns[7], // Cover banner image from column I
            id: columns[0] // Assuming column A has a unique ID
        };
    }).filter(card => card.name && card.bannerImage); // Filter out any rows without name or image

    return parsedData;
}

// Function to create card element
function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <a href="subpage-one/subpage.html?id=${index + 1}" class="card-link" target="_blank"> <!-- Using index + 1 as the ID -->
            <div class="card-icon">
                <img src="${card.bannerImage}" alt="${card.name}" class="circular-icon">
            </div>
            <h3 class="card-title" style="text-decoration: underline;">${card.name}</h3>
        </a>
    `;
    return cardElement;
}

// Function to render the carousel cards
function renderCards() {
    track.innerHTML = '';  // Clear existing cards
    cardData.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        track.appendChild(cardElement);
    });
}

// Function to handle email sign-up
async function submitEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the email input value
    const email = document.getElementById('emailInput').value.trim();

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return; // Exit if the email is invalid
    }

    // Send a POST request to the Google Apps Script URL
    try {
        const response = await fetch('https://script.google.com/macros/u/1/s/AKfycbwf4zPsYugVBwcjGtKmtXMeTU5fr7jgF6wglIffr8r62QU2EWLiRKNol4RrA4WgPX4zVA/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ email }) // Create a URLSearchParams object
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();

        // Check if the response indicates success
        if (result.result === 'success') {
            alert('Thank you for signing up! You will receive updates.');
            // Clear the email input field after successful submission
            document.getElementById('emailForm').reset();
        } else {
            alert('Error signing up. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting email:', error);
        alert('There was an error submitting your email. Please try again later.');
    }
}


// Function to handle Contact Us form submission
async function submitContactUs(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const interest = document.getElementById('interest').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !phone || !interest || !message) {
        alert('Please fill in all the required fields.');
        return; // Exit if validation fails
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return; // Exit if the email is invalid
    }

    // Send a POST request to the Google Apps Script URL
    try {
        const response = await fetch('https://script.google.com/macros/u/1/s/AKfycbwf4zPsYugVBwcjGtKmtXMeTU5fr7jgF6wglIffr8r62QU2EWLiRKNol4RrA4WgPX4zVA/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ 
                name: name, 
                email: email, 
                phone: phone, 
                interest: interest, 
                message: message 
            }) // Create a URLSearchParams object with the form data
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();

        // Check if the response indicates success
        if (result.result === 'success') {
            alert('Thank you for reaching out! We will get back to you soon.');
            // Clear the form after successful submission
            document.getElementById('contactForm').reset();
        } else {
            alert('Error submitting the form. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your form. Please try again later.');
    }
}

// Carousel movement logic
let currentIndex = 0;
function moveCarousel(direction) {
    const cardWidth = 280; // card width + margin
    const maxIndex = cardData.length - Math.floor(track.clientWidth / cardWidth);
    currentIndex += direction;
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Initialize the application
async function init() {
    // Fetch CSV data and render the carousel
    try {
        cardData = await fetchCSVData();
        renderCards();
    } catch (error) {
        console.error('Error fetching card data:', error);
    }

    prevButton.addEventListener('click', () => moveCarousel(-1));
    nextButton.addEventListener('click', () => moveCarousel(1));

    // Scroll behavior for hiding title and sign-up boxes, showing menu
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

        if (scrollY > 200) {
            titleBox.classList.add('hide');
            signupBox.classList.add('hide');
            menuBanner.style.top = '0';  // Menu appears when scrolling down
        } else {
            titleBox.classList.remove('hide');
            signupBox.classList.remove('hide');
            menuBanner.style.top = '-60px';  // Menu hides when at the top
        }
    });
}

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', init);

// Get the modal
const modal = document.getElementById('reachUsModal');

// Get the button that opens the modal
const btn = document.getElementById('reachUsBtn');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Allow scrolling again
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow scrolling again
    }
}
