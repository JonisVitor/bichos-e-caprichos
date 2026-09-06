const contextData = {
  estetica: {
    kicker: "Estética canina",
    copy: "Banho, tosa e cuidados especiais para deixar seu pet ainda mais feliz.",
    label: "Agendar banho e tosa",
    message: "Olá! Gostaria de agendar banho e tosa para meu pet."
  },
  veterinario: {
    kicker: "Atendimento veterinário",
    copy: "Orientação e cuidado para a saúde e a qualidade de vida do seu pet.",
    label: "Agendar atendimento",
    message: "Olá! Gostaria de agendar um atendimento veterinário."
  },
  loja: {
    kicker: "Loja & delivery",
    copy: "Produtos escolhidos com carinho para a rotina do seu pet, com praticidade para você.",
    label: "Falar com a loja",
    message: "Olá! Gostaria de saber quais produtos estão disponíveis."
  }
};

const tabs = document.querySelectorAll("[data-mode]");
const labels = document.querySelectorAll(".js-context-label");
const links = document.querySelectorAll(".js-context-link");
const kicker = document.querySelector(".js-context-kicker");
const copy = document.querySelector(".js-context-copy");
const contextTabs = document.querySelector(".context-tabs");
const contextPanel = document.querySelector(".context-panel");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMode(mode) {
  const content = contextData[mode];
  if (!content) return;
  tabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  if (contextTabs) {
    const activeIndex = Array.from(tabs).findIndex((tab) => tab.dataset.mode === mode);
    contextTabs.style.setProperty("--active-index", String(Math.max(activeIndex, 0)));
  }
  labels.forEach((label) => { label.textContent = content.label; });
  links.forEach((link) => {
    link.href = `https://wa.me/5516996018817?text=${encodeURIComponent(content.message)}`;
  });
  if (kicker) kicker.textContent = content.kicker;
  if (copy) copy.textContent = content.copy;
  if (contextPanel && !prefersReducedMotion) {
    contextPanel.animate(
      [{ opacity: .72, transform: "translateX(18px)" }, { opacity: 1, transform: "translateX(0)" }],
      { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }
}

tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode)));

const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    siteNav.classList.toggle("is-open", !open);
  });
  siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  }));
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (!prefersReducedMotion) {
            entry.target.animate(
              [{ opacity: .72, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: 680, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
            );
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll(".context-section, .proof-strip, .services, .feature-block, .gallery-section, .contact-section, .faq-section, .final-cta").forEach((element) => {
  element.classList.add("reveal");
  if (revealObserver) revealObserver.observe(element);
});

document.querySelectorAll(".faq-list details").forEach((details, index) => {
  const summary = details.querySelector("summary");
  const answerText = details.querySelector("p");
  if (!summary || !answerText) return;

  const item = document.createElement("div");
  item.className = "faq-item";
  item.setAttribute("aria-expanded", "false");

  const trigger = document.createElement("button");
  trigger.className = "faq-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", `faq-answer-${index + 1}`);
  trigger.innerHTML = summary.innerHTML;

  const answer = document.createElement("div");
  answer.className = "faq-answer";
  answer.id = `faq-answer-${index + 1}`;
  answer.appendChild(answerText);
  item.append(trigger, answer);
  details.replaceWith(item);

  trigger.addEventListener("click", () => {
    const opening = trigger.getAttribute("aria-expanded") !== "true";
    if (prefersReducedMotion) {
      trigger.setAttribute("aria-expanded", String(opening));
      item.setAttribute("aria-expanded", String(opening));
      return;
    }
    if (opening) {
      item.classList.remove("is-closing");
      trigger.setAttribute("aria-expanded", "true");
      item.setAttribute("aria-expanded", "true");
      answer.style.height = "0px";
      requestAnimationFrame(() => { answer.style.height = `${answer.scrollHeight}px`; });
      answer.addEventListener("transitionend", () => {
        answer.style.height = "auto";
      }, { once: true });
    } else {
      answer.style.height = `${answer.getBoundingClientRect().height}px`;
      item.classList.add("is-closing");
      trigger.setAttribute("aria-expanded", "false");
      requestAnimationFrame(() => { answer.style.height = "0px"; });
      answer.addEventListener("transitionend", () => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("is-closing");
        answer.style.height = "";
      }, { once: true });
    }
  });
});

setMode("estetica");
