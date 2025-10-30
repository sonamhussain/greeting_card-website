/**
 * Customization Workplace Logic
 * Handles switching between the Front, Back, and Inside views of the card.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    // Select all card content sections
    const cardViews = document.querySelectorAll('.card-placeholder');
    // CRITICAL: Select the wrapper to change its size
    const cardWrapper = document.getElementById('card-placeholder-wrapper');

    /**
     * Handles the click event for the card side navigation buttons.
     * @param {Event} event - The click event object.
     */
    function handleViewChange(event) {
        const targetButton = event.currentTarget;
        const viewId = targetButton.getAttribute('data-view'); // e.g., 'front', 'back', 'inside'

        // --- 1. Update Navigation Buttons ---
        navButtons.forEach(btn => {
            // Remove 'active' class from all buttons
            btn.classList.remove('active');
        });
        // Add 'active' class to the clicked button
        targetButton.classList.add('active');

        // --- 2. Update Card View Content ---
        cardViews.forEach(view => {
            // Hide all card views
            view.classList.remove('active');
        });

        // Show the corresponding card view
        const targetView = document.getElementById(`card-${viewId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // --- 3. CRITICAL: Update Card Wrapper Size ---
        if (viewId === 'inside') {
            // Apply the wider aspect ratio class
            cardWrapper.classList.add('wide-spread');
        } else {
            // Remove the wider aspect ratio class for 'front' and 'back'
            cardWrapper.classList.remove('wide-spread');
        }
    }

    // Attach the event listener to each navigation button
    navButtons.forEach(button => {
        button.addEventListener('click', handleViewChange);
    });
});
