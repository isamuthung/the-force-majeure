document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        interest: document.getElementById('interest').value,
        message: document.getElementById('message').value,
    };

    // Send data to Google Sheets or your backend
    fetch('https://script.google.com/macros/s/AKfycbxoIua4m_Un2hF0IiVeHPa6wT0MgH8jbPVbxm5tB0aWuAuPeg1VaL3opxqwlBWsBpET/exec', {  // Replace with your Google Apps Script URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "Success") {
            alert('Form submitted successfully!');
            // Clear the form
            document.getElementById('contactForm').reset();
        } else {
            alert('There was an issue with your submission.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting the form.');
    });
});
