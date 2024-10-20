// Function to fetch and parse CSV
async function fetchCSVData() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTFvyHJ1fZxGvYxFOXPQ6y982w8UoFTRUpfRVoAWcSolVnErd-xsJnr7GT1VIBp9lH69_l06sGl5HPm/pub?gid=1119628772&single=true&output=csv'); // Replace with your actual CSV file URL
    const data = await response.text();
    
    const rows = data.split('\n').slice(1); // Skip header
    return rows.map(row => {
        const columns = row.split(',');
        return {
            name: columns[2],
            latitude: columns[3],
            longitude: columns[4],
            webLink: columns[5],
            description: columns[6],
            videoLink: columns[8],
            bannerImage: columns[7]
        };
    });
}

// Function to update the page content
async function updatePageContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // Get ID from URL

    const organizations = await fetchCSVData();
    const organization = organizations[id - 1]; // Assuming ID is 1-based, adjust for 0-index

    if (organization) {
        // Update the organization name and link
        document.getElementById('orgName').textContent = organization.name;
        document.getElementById('orgLink').textContent = organization.name;
        document.getElementById('orgLink').href = organization.webLink;

        // Update the description
        document.getElementById('description').textContent = organization.description;

        // Update the banner image
        document.getElementById('banner').style.backgroundImage = `url(${organization.bannerImage})`;

        // Update the Google Drive video link
        const videoID = extractGoogleDriveID(organization.videoLink);
        document.getElementById('video').src = `https://drive.google.com/file/d/${videoID}/preview`;

        // Update the coordinates
        document.getElementById('coordinates').textContent = `Latitude: ${organization.latitude}, Longitude: ${organization.longitude}`;
    } else {
        console.error('No matching organization found');
    }
}

// Extract Google Drive ID from the provided public link
function extractGoogleDriveID(url) {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : '';
}

// Call the function when the page loads
window.onload = updatePageContent;

// Scroll behavior for the back button
const button = document.getElementById("backButton");
window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {  // When user scrolls down
        button.style.display = "block";  // Show button
    } else {
        button.style.display = "none";  // Hide button
    }
});
