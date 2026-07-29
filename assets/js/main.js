const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const carousel = document.querySelector("[data-carousel]");
const slides = Array.from(document.querySelectorAll(".gallery-slide"));
const dots = Array.from(document.querySelectorAll(".gallery-dot"));
const thumbs = Array.from(document.querySelectorAll(".thumb"));
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const quiz = document.querySelector("[data-quiz]");
const quizResult = document.querySelector("[data-quiz-result]");

let activeSlide = 0;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, currentIndex) => {
    slide.classList.toggle("active", currentIndex === activeSlide);
  });

  dots.forEach((dot, currentIndex) => {
    dot.classList.toggle("active", currentIndex === activeSlide);
  });

  thumbs.forEach((thumb, currentIndex) => {
    thumb.classList.toggle("active", currentIndex === activeSlide);
  });
}

function startRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function getQuestionLabel(value) {
  return value ? value.toUpperCase() : "";
}

function gradeQuiz(event) {
  event.preventDefault();

  const cards = Array.from(quiz.querySelectorAll(".quiz-card"));
  let score = 0;

  cards.forEach((card) => {
    const answer = card.dataset.answer;
    const selected = card.querySelector("input:checked");
    const feedback = card.querySelector(".quiz-feedback");

    card.classList.remove("correct", "wrong");

    if (!selected) {
      feedback.textContent = "Escolha uma alternativa.";
      return;
    }

    if (selected.value === answer) {
      score += 1;
      card.classList.add("correct");
      feedback.textContent = "Resposta correta.";
      return;
    }

    card.classList.add("wrong");
    feedback.textContent = `Resposta incorreta. Gabarito: ${getQuestionLabel(answer)}.`;
  });

  quizResult.textContent = `Voce acertou ${score} de ${cards.length} perguntas.`;
}

function resetQuiz() {
  quiz.querySelectorAll(".quiz-card").forEach((card) => {
    card.classList.remove("correct", "wrong");
    card.querySelector(".quiz-feedback").textContent = "";
  });

  quizResult.textContent = "";
}

menuToggle.addEventListener("click", toggleMenu);
nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

if (prevButton && nextButton) {
  prevButton.addEventListener("click", () => showSlide(activeSlide - 1));
  nextButton.addEventListener("click", () => showSlide(activeSlide + 1));
}

if (carousel) {
  carousel.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-slide-to]");

    if (trigger) {
      showSlide(Number(trigger.dataset.slideTo));
    }
  });
}

if (quiz) {
  quiz.addEventListener("submit", gradeQuiz);
  quiz.addEventListener("reset", resetQuiz);
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }

  if (slides.length && event.key === "ArrowLeft") {
    showSlide(activeSlide - 1);
  }

  if (slides.length && event.key === "ArrowRight") {
    showSlide(activeSlide + 1);
  }
});

updateHeader();
startRevealObserver();
