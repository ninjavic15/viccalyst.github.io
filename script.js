document.addEventListener('DOMContentLoaded', () => {
    // Basic setup string for JS Interactions
    console.log('Webpage Initialized.');

    const interactBtn = document.getElementById('interactiveBtn');
    
    if (interactBtn) {
        interactBtn.addEventListener('click', () => {
            // A simple subtle micro-animation response when clicked
            interactBtn.style.transform = 'scale(0.92)';
            
            setTimeout(() => {
                interactBtn.style.transform = '';
            }, 100);
            
            console.log('Interaction logged.');
        });
    }
});
