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

let lastSparkleTime = 0;

document.addEventListener("mousemove", function (e) {
  const now = Date.now();
  if (now - lastSparkleTime > 30) {
    createSparkle(e.clientX, e.clientY);
    lastSparkleTime = now;
  }
});

function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "modern-sparkle";

    sparkle.style.left = `${x + (Math.random() - 0.5) * 20}px`;
    sparkle.style.top = `${y + (Math.random() - 0.5) * 20}px`;

    const pastelColors = ["#b1cdf1ff", "#a0d8ef", "#d4eaffff", "#81c4f3ff", "#daf6ffff", "#96c8fdff"];
    sparkle.style.background = pastelColors[Math.floor(Math.random() * pastelColors.length)];

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
}



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
