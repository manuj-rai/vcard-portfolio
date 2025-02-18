'use strict';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('assets/js/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((error) => console.log('Service Worker Registration Failed:', error));
}


// function to install app
let deferredPrompt;

// Listen for the install prompt event
window.addEventListener("beforeinstallprompt", (event) => {
    console.log("beforeinstallprompt fired");
    
    if (localStorage.getItem("installDismissed") === "true") {
        return; // Don't show the prompt if user dismissed before
    }

    event.preventDefault(); // Prevent the default prompt
    deferredPrompt = event;

    // Check if on iOS
    if (isIos()) {
        showIosInstallMessage();
    }

    // Show the custom message after some interaction (e.g., first scroll or touch)
    document.body.addEventListener("click", showCustomInstallMessage, { once: true });
    document.body.addEventListener("scroll", showCustomInstallMessage, { once: true });
});

// Function to check if it's an iOS device
function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Function to show a custom message
function showCustomInstallMessage() {
    // Create the custom pop-up
    const installPopup = document.createElement("div");
    installPopup.innerHTML = `
        <div id="installBanner" style="position: fixed; bottom: 20px; left: 50%; 
                    transform: translateX(-50%); background: black; color: white; 
                    padding: 15px; border-radius: 5px; text-align: center; z-index: 1000;">
            <p>Install our app for a better experience!</p>
            <button id="installBtn" style="margin: 5px; padding: 5px; background: green; color: white; border: none; cursor: pointer;">Install</button>
            <button id="dismissBtn" style="margin: 5px; padding: 5px; background: red; color: white; border: none; cursor: pointer;">Don't Show Again</button>
        </div>
    `;
    document.body.appendChild(installPopup);

    // Handle Install Button
    document.getElementById("installBtn").addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome === "accepted" ? 
                            "User accepted the install prompt." : 
                            "User dismissed the install prompt.");

                if (choiceResult.outcome === "dismissed") {
                    localStorage.setItem("installDismissed", "true"); // Store dismissal
                }
                
                deferredPrompt = null;
                installPopup.remove(); // Remove message after interaction
            });
        }
    });

    // Handle Dismiss Button
    document.getElementById("dismissBtn").addEventListener("click", () => {
        localStorage.setItem("installDismissed", "true"); // Store dismissal
        installPopup.remove(); // Remove message
    });
}

// Function to show a custom iOS install message
function showIosInstallMessage() {
    if (localStorage.getItem("installDismissed") === "true") {
        return; // Don't show if user dismissed before
    }

    const installPopup = document.createElement("div");
    installPopup.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                    background: black; color: white; padding: 15px; border-radius: 5px;
                    text-align: center; z-index: 1000;">
            <p>To install this app, tap the Share button and select "Add to Home Screen".</p>
            <button id="dismissIosBtn" style="margin: 5px; padding: 5px; background: red; color: white; border: none; cursor: pointer;">Don't Show Again</button>
        </div>
    `;
    document.body.appendChild(installPopup);

    document.getElementById("dismissIosBtn").addEventListener("click", () => {
        localStorage.setItem("installDismissed", "true"); // Store dismissal
        installPopup.remove();
    });

    // Remove the custom pop-up after 5 seconds
    setTimeout(() => {
        installPopup.remove();
    }, 5000);
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
