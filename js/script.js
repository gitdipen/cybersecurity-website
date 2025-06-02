document.addEventListener('DOMContentLoaded', () => {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    const modal = document.getElementById('infoModal');
    const modalCloseButton = document.querySelector('.modal-close-button');
    const modalTitle = document.getElementById('modalTitle');
    const modalParagraph = document.getElementById('modalParagraph');
    const modalExample = document.getElementById('modalExample');

    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.dataset.title;
            const paragraph = button.dataset.paragraph;
            const example = button.dataset.example;

            modalTitle.textContent = title;
            modalParagraph.textContent = paragraph;
            modalExample.textContent = example;

            modal.classList.add('active'); // Show the modal
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Function to close the modal
    const closeAboutUsModal = () => {
        modal.classList.remove('active'); // Hide the modal
        document.body.style.overflow = ''; // Restore background scrolling
    };

    // Close button click
    modalCloseButton.addEventListener('click', closeAboutUsModal);

    // Click outside modal content to close (on the overlay itself)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Check if the click was directly on the overlay
            closeAboutUsModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeAboutUsModal();
        }
    });
});