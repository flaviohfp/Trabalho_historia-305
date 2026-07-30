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

let activeSlide = 0;

function updateHeader() {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 20);
}

function closeMenu() {
  body.classList.remove("menu-open");
  if (!menuToggle) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (!menuToggle) {
    return;
  }

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
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );

  revealItems.forEach((item) => {
    if (item.scrollHeight > window.innerHeight * 1.2) {
      item.classList.add("visible");
      return;
    }

    observer.observe(item);
  });
}

function getQuestionLabel(value) {
  return value ? value.toUpperCase() : "";
}

function checkQuizCard(card) {
  if (!card) {
    return;
  }

  const answer = card.dataset.answer;
  const explanation = card.dataset.explanation || "";
  const selected = card.querySelector("input:checked");
  const feedback = card.querySelector(".quiz-feedback");

  card.classList.remove("correct", "wrong");

  if (!selected) {
    feedback.textContent = "Escolha uma alternativa antes de verificar.";
    return;
  }

  if (selected.value === answer) {
    card.classList.add("correct");
    feedback.textContent = `Correto! ${explanation}`;
    return;
  }

  card.classList.add("wrong");
  feedback.textContent = `Incorreto. Resposta certa: ${getQuestionLabel(answer)}. ${explanation}`;
}

function scoreQuiz() {
  if (!quiz) {
    return;
  }

  const cards = Array.from(quiz.querySelectorAll(".quiz-card"));
  const result = quiz.querySelector("[data-quiz-result]");
  let correct = 0;
  let unanswered = 0;

  if (!result) {
    return;
  }

  cards.forEach((card) => {
    const selected = card.querySelector("input:checked");

    if (!selected) {
      unanswered += 1;
      return;
    }

    if (selected.value === card.dataset.answer) {
      correct += 1;
    }
  });

  const total = cards.length;
  const pendingMessage = unanswered
    ? ` Ainda falta responder ${unanswered} pergunta${unanswered > 1 ? "s" : ""}.`
    : "";
  const disputeMessage =
    correct === total
      ? "Pontuação máxima! Esse grupo vai forte para o desempate."
      : "Em disputa por grupos, vence quem fizer mais pontos; empate vai para uma pergunta relâmpago.";

  result.textContent = `Pontuação: ${correct} de ${total} acertos.${pendingMessage} ${disputeMessage}`;
}

function resetQuiz() {
  if (!quiz) {
    return;
  }

  quiz.querySelectorAll(".quiz-card").forEach((card) => {
    card.classList.remove("correct", "wrong");
    card.querySelector(".quiz-feedback").textContent = "";
  });

  const result = quiz.querySelector("[data-quiz-result]");

  if (result) {
    result.textContent = "";
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (nav) {
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });
}

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
  quiz.addEventListener("click", (event) => {
    const checkButton = event.target.closest("[data-check-answer]");

    if (checkButton) {
      checkQuizCard(checkButton.closest(".quiz-card"));
    }

    if (event.target.closest("[data-score-quiz]")) {
      scoreQuiz();
    }
  });
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
