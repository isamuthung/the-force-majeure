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
                bannerImage: columns[7], // Cover banner image from column I
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
// Function to submit the email sign-up form
async function submitEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the email input value
    const email = document.getElementById('emailInput').value.trim();

    // Check if the email field is filled
    if (!email) {
        alert('Please enter your email address.');
        return; // Exit if the email field is empty
    }

    // Send a POST request to the Google Apps Script URL
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw6FkpUYgqP-ZDIl7R7lowJ-EP3_4GjuFLKKhN7NYUlWpKZGTlg83W23pWC92SdXfFg/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ email }) // Create a URLSearchParams object
        });

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

// Function to submit the contact us form
async function submitContactUs(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect input values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const interest = document.getElementById('interest').value;
    const message = document.getElementById('message').value.trim();

    // Check if all fields are filled
    if (!name || !email || !phone || !interest || !message) {
        alert('Please fill in all fields.');
        return; // Exit if any field is empty
    }

    // Send a POST request to the Google Apps Script URL
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw6FkpUYgqP-ZDIl7R7lowJ-EP3_4GjuFLKKhN7NYUlWpKZGTlg83W23pWC92SdXfFg/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ name, email, phone, interest, message }) // Create a URLSearchParams object
        });

        const result = await response.json();

        // Check if the response indicates success
        if (result.result === 'success') {
            alert('Your message has been sent successfully!');
            // Clear the input fields after successful submission
            document.getElementById('contactForm').reset();
        } else {
            alert('Error sending message. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('There was an error sending your message. Please try again later.');
    }
}

// Attach event listeners to the forms
document.getElementById('emailForm').addEventListener('submit', submitEmail);
document.getElementById('contactForm').addEventListener('submit', submitContactUs);
