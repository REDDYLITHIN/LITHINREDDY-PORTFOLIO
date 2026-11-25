const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = `<i class="fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}" aria-hidden="true"></i>`;
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });
  });
}

const pageSections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".navigation a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navigationLinks.forEach((link) => {
          link.classList.toggle("active", link.hash === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );

  pageSections.forEach((section) => sectionObserver.observe(section));
}

if (window.emailjs) {
  window.emailjs.init({ publicKey: "N7BPzHhQN9e5hssJW" });
}

if (form && formStatus) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    if (!window.emailjs) {
      formStatus.classList.add("error");
      formStatus.textContent = "The message service is unavailable. Please try again later.";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      await window.emailjs.sendForm("service_wsuui1i", "template_dhk6nxs", form);
      form.reset();
      formStatus.classList.add("success");
      formStatus.textContent = "Thanks! Your message has been sent.";
    } catch (error) {
      console.error("Unable to send contact form:", error);
      formStatus.classList.add("error");
      formStatus.textContent = "Your message could not be sent. Please try again later.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send message <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>';
    }
  });
}
