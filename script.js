document.addEventListener('DOMContentLoaded', async function() {
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
                bannerImage: columns[8], // Cover banner image from column I
                id: columns[0] // Assuming column A has a unique ID
            };
        }).filter(card => card.name && card.bannerImage); // Filter out any rows without name or image

        return parsedData;
    }

    // Function to render the carousel cards
    function renderCards() {
        track.innerHTML = '';  // Clear existing cards
        cardData.forEach(card => {
            const cardElement = createCardElement(card);
            track.appendChild(cardElement);
        });
    }

    // Create individual card element for carousel
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <a href="subpage-one.html?id=${card.id}" class="card-link" target="_blank"> <!-- Link to subpage with ID -->
            <div class="card-icon">
                <img src="${card.bannerImage}" alt="${card.name}" class="circular-icon">
            </div>
            <h3 class="card-title" style="text-decoration: underline;">${card.name}</h3>
        </a>
    `;
    return cardElement;
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

    prevButton.addEventListener('click', () => moveCarousel(-1));
    nextButton.addEventListener('click', () => moveCarousel(1));

    window.addEventListener('resize', () => {
        currentIndex = 0;
        track.style.transform = 'translateX(0)';
    });

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

     // Fetch CSV data and render the carousel
     try {
        cardData = await fetchCSVData();
        renderCards();
    } catch (error) {
        console.error('Error fetching card data:', error);
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
    
    // Modify the renderCards function to pass the index
    function renderCards() {
        track.innerHTML = '';  // Clear existing cards
        cardData.forEach((card, index) => { // Pass index to createCardElement
            const cardElement = createCardElement(card, index);
            track.appendChild(cardElement);
        });
    }
});


async function submitEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim(); // Get the email input and trim whitespace

    // Regular expression for validating email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return; // Exit the function if the email is invalid
    }

    // Send a POST request to the Google Apps Script URL
    const response = await fetch('https://script.google.com/macros/s/AKfycbx_M0_ZQlKZj-_N2NZUBCMFZUmo1arXOeES7icXYu2g9Elu8Ms-Kjwh-E8B-ZcIK0bMQQ/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ email }) // Create a URLSearchParams object
    });

    const result = await response.json();
    if (result.result === 'success') {
        alert('Email submitted successfully!');
        emailInput.value = ''; // Clear the input field after successful submission
    } else {
        alert('Error submitting email.');
    }
}

// Attach the submitEmail function to your form
const form = document.getElementById('emailForm'); // Make sure this matches your form's ID
form.addEventListener('submit', submitEmail);

