document.addEventListener("DOMContentLoaded", function() {
    const nameText = document.getElementById("nameText");
    const words = nameText.getElementsByClassName("word");

    Array.from(words).forEach((word, wordIndex) => {
        const text = word.innerText;
        word.innerHTML = ""; // Clear the inner HTML for animation

        text.split("").forEach((letter, letterIndex) => {
            const span = document.createElement("span");

            if (letter === " ") {
                span.innerHTML = "&nbsp;"; // Keep spaces intact
            } else {
                span.innerText = letter; // Set letter text
            }

            // Adding delay for animation
            const totalDelay = (wordIndex * 0.4) + (letterIndex * 0.2);
            span.style.animationDelay = `${totalDelay}s`;
            word.appendChild(span); // Append letter to the word
        });
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('aboutLink').addEventListener('click', function(event) {
    event.preventDefault();
    showSection('aboutMe');
});

document.getElementById('projectsLink').addEventListener('click', function(event) {
    event.preventDefault();
    showSection('projects');
});

document.getElementById('contactLink').addEventListener('click', function(event) {
    event.preventDefault();
    showSection('contact');
});

const buttons = document.querySelectorAll('#navBar button');

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        // Remove 'active' class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked button
        button.classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const projects = document.querySelectorAll(".project");
    let currentProjectIndex = 0;

    function showProject(index) {
        projects.forEach((project, i) => {
            project.classList.remove("active");
            if (i === index) {
                project.classList.add("active");
            }
        });
    }

    document.getElementById("prevBtn").addEventListener("click", function () {
        currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
        showProject(currentProjectIndex);
    });

    document.getElementById("nextBtn").addEventListener("click", function () {
        currentProjectIndex = (currentProjectIndex + 1) % projects.length;
        showProject(currentProjectIndex);
    });

    // Initialize with the first project
    showProject(currentProjectIndex);
});
