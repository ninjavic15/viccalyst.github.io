document.addEventListener('DOMContentLoaded', () => {
    // Basic setup string for JS Interactions
    console.log('Webpage Initialized.');

    // Page Loader and Orientation Gate Logic
    const loader = document.getElementById('page-loader');
    if (loader) {
        let isPageLoaded = false;

        const checkOrientation = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            if (isLandscape) {
                loader.classList.remove('gate-mode');
                // If page already finished loading, hide the loader now
                if (isPageLoaded || document.readyState === 'complete') {
                    hideLoader();
                }
            } else {
                loader.classList.add('gate-mode');
            }
        };

        const hideLoader = () => {
            // Only hide if we are in landscape (not portrait)
            const isLandscape = window.innerWidth > window.innerHeight;
            if (isLandscape) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 600); // matches CSS opacity transition
            }
        };

        // Initial orientation check
        checkOrientation();

        // Listen for resize and orientation change events
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        // Hide loader when page is fully loaded
        window.addEventListener('load', () => {
            isPageLoaded = true;
            // Introduce a short aesthetic delay to appreciate the clean loader
            setTimeout(() => {
                checkOrientation();
                hideLoader();
            }, 800);
        });

        // Safety fallback: if load event already fired or takes too long, hide after 4s
        if (document.readyState === 'complete') {
            isPageLoaded = true;
            setTimeout(hideLoader, 800);
        } else {
            setTimeout(() => {
                isPageLoaded = true;
                checkOrientation();
                hideLoader();
            }, 4000);
        }
    }

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