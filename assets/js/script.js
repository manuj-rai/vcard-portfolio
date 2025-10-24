'use strict';

// Register service worker with error handling and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('assets/js/service-worker.js');
      console.log('ServiceWorker registration successful:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            if (confirm('New version available! Would you like to update?')) {
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}


// function to install app
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    console.log("🔥 beforeinstallprompt fired");

    if (localStorage.getItem("installDismissed") === "true") {
        console.log("❌ Install prompt previously dismissed, skipping.");
        return;
    }

    event.preventDefault(); // Prevent the default banner
    deferredPrompt = event;

    // Add click and scroll listeners to trigger the install prompt
    document.body.addEventListener("click", showInstallPrompt, { once: true });
    document.body.addEventListener("scroll", showInstallPrompt, { once: true });
});

async function showInstallPrompt() {
    if (!deferredPrompt) return;

    console.log("📲 Triggering install prompt...");
    await deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    console.log(choiceResult.outcome === "accepted" ? "🎉 User accepted the install prompt." : "❌ User dismissed the install prompt.");

    if (choiceResult.outcome === "dismissed") {
        localStorage.setItem("installDismissed", "true"); // Prevent future prompts
    }

    deferredPrompt = null; // Reset prompt to avoid multiple triggers
}



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// Add event listeners to all form input fields using a single delegated event listener
form.addEventListener("input", (e) => {
  if (e.target.matches("[data-form-input]")) {
    // Check individual input validity and show/hide error message
    checkInputValidity(e.target);

    // Check overall form validity
    formBtn.toggleAttribute("disabled", !form.checkValidity());
  }
});


// Map fullscreen toggle
function toggleFullScreen() {
  const mapbox = document.querySelector('.mapbox');

  if (mapbox) {
    if (mapbox.classList.contains('fullscreen')) {
      mapbox.classList.remove('fullscreen');
    } else {
      mapbox.classList.add('fullscreen');
    }
  } else {
    console.error("Element with class 'mapbox' not found.");
  }
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Function to set the active page from localStorage
function setActivePage() {
  // Retrieve the saved active page from localStorage
  const savedPage = localStorage.getItem("activePage");

  if (savedPage) {
    // Iterate over the pages to find the one matching the saved page
    for (let i = 0; i < pages.length; i++) {
      if (savedPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  }
}

// Add event listener to all nav links
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    // Save the active page to localStorage
    localStorage.setItem("activePage", this.innerHTML.toLowerCase());

    // Activate the corresponding page
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// Initialize the active page from localStorage when the page loads
setActivePage();

// Blog modal variables
const blogItems = document.querySelectorAll("[data-blog-item]"); // Blog post items
const blogModalContainer = document.querySelector("[data-blog-modal-container]"); // Blog modal container
const blogModalCloseBtn = document.querySelector("[data-blog-modal-close-btn]"); // Modal close button
const blogOverlay = document.querySelector("[data-blog-overlay]"); // Modal overlay

// Modal content variables
const blogModalImg = document.querySelector("[data-blog-modal-img]"); // Blog modal image
const blogModalTitle = document.querySelector("[data-blog-modal-title]"); // Blog modal title
const blogModalDate = document.querySelector("[data-blog-modal-date]"); // Blog modal date
const blogModalText = document.querySelector("[data-blog-modal-text]"); // Blog modal content text

// Function to toggle modal visibility
const toggleBlogModal = function () {
  blogModalContainer.classList.toggle("active");
  blogOverlay.classList.toggle("active");
};

// Add click event listener to all blog items
blogItems.forEach(item => {
  item.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of the link

    // Extract content from the clicked blog post
    const blogImgSrc = this.querySelector("img").src;
    const blogTitleText = this.querySelector(".blog-item-title").textContent;
    const blogDateText = this.querySelector("time").textContent;
    const blogText = this.querySelector(".blog-text").textContent;

    // Populate the modal with the extracted data
    blogModalImg.src = blogImgSrc;
    blogModalImg.alt = blogTitleText;
    blogModalTitle.textContent = blogTitleText;
    blogModalDate.textContent = blogDateText;
    blogModalText.innerHTML = blogText;

    // Show the modal
    toggleBlogModal();
  });
});

// Close modal when close button or overlay is clicked
blogModalCloseBtn.addEventListener("click", toggleBlogModal);
blogOverlay.addEventListener("click", toggleBlogModal);

//skills
const carousel = document.getElementById('skillsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    // Carousel navigation
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -220, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 220, behavior: 'smooth' });
    });

    // Category filtering
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        skillCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        // Reset scroll
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      });
    });

    // Auto-scroll on mouse wheel
    carousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      carousel.scrollBy({ left: e.deltaY < 0 ? -220 : 220, behavior: 'smooth' });
    });

    // Enhanced touch/drag scroll with touch device support
    let isDown = false;
    let startX;
    let scrollLeft;
    let momentumID;
    let velocity = 0;
    let lastPageX = 0;

    function startDragging(e) {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        carousel.style.scrollBehavior = 'auto';
        startX = (e.pageX || e.touches[0].pageX) - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        lastPageX = e.pageX || e.touches[0].pageX;
        
        // Clear any existing momentum scrolling
        cancelAnimationFrame(momentumID);
    }

    function stopDragging() {
        if (!isDown) return;
        isDown = false;
        carousel.style.cursor = 'grab';
        carousel.style.scrollBehavior = 'smooth';
        
        // Apply momentum
        const momentumScroll = () => {
            if (Math.abs(velocity) > 0.1) {
                carousel.scrollLeft += velocity;
                velocity *= 0.95; // Decay factor
                momentumID = requestAnimationFrame(momentumScroll);
            }
        };
        momentumScroll();
    }

    function dragging(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
        
        // Calculate velocity
        const currentPageX = e.pageX || e.touches[0].pageX;
        velocity = (lastPageX - currentPageX) * 0.5;
        lastPageX = currentPageX;
    }

    // Mouse events
    carousel.addEventListener('mousedown', startDragging);
    carousel.addEventListener('mouseleave', stopDragging);
    carousel.addEventListener('mouseup', stopDragging);
    carousel.addEventListener('mousemove', dragging);

    // Touch events
    carousel.addEventListener('touchstart', startDragging);
    carousel.addEventListener('touchend', stopDragging);
    carousel.addEventListener('touchmove', dragging);