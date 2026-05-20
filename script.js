/* ==========================================================================
   INTERACTIVE PORTFOLIO ENGINE (Ramón Moncholí Ros)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. State & Settings
    const state = {
        lang: localStorage.getItem("portfolio-lang") || "es",
        theme: localStorage.getItem("portfolio-theme") || "dark",
        typingIndex: 0,
        typingWordIndex: 0,
        isDeleting: false,
        typingDelay: 100,
        typingWords: {
            es: ["Desarrollador Full Stack", "Especialista Odoo ERP", "Consultor Técnico Python", "Entusiasta de la Ciberseguridad", "Creador de Soluciones IA"],
            en: ["Full Stack Developer", "Odoo ERP Specialist", "Python Technical Consultant", "Cybersecurity Enthusiast", "AI Solutions Builder"]
        }
    };

    // DOM Elements
    const body = document.body;
    const html = document.documentElement;
    const langToggle = document.getElementById("lang-toggle");
    const themeToggle = document.getElementById("theme-toggle");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileNavMenu = document.getElementById("mobile-nav-menu");
    const typingTextEl = document.getElementById("typing-text");
    const skillsTabBtns = document.querySelectorAll(".tab-btn");
    const skillCards = document.querySelectorAll(".skill-card");
    const glassCards = document.querySelectorAll(".glass");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    /* ==========================================================================
       LANGUAGE SWITCHER (Bilingual Support)
       ========================================================================== */
    function applyLanguage(lang) {
        state.lang = lang;
        localStorage.setItem("portfolio-lang", lang);
        
        // Remove existing lang classes and add current
        body.classList.remove("lang-es", "lang-en");
        body.classList.add(`lang-${lang}`);
        html.setAttribute("lang", lang);

        // Update active class on selector button text if needed
        langToggle.querySelector(".lang-es").style.fontWeight = lang === "es" ? "700" : "400";
        langToggle.querySelector(".lang-en").style.fontWeight = lang === "en" ? "700" : "400";
        
        // Restart typing animation with new language words
        state.typingIndex = 0;
        state.typingWordIndex = 0;
        state.isDeleting = false;
        if (typingTextEl) typingTextEl.textContent = "";

        // Trigger custom event for terminal language sync
        const langChangeEvent = new CustomEvent("langChange", { detail: { lang } });
        document.dispatchEvent(langChangeEvent);
    }

    // Initialize Language
    applyLanguage(state.lang);

    langToggle.addEventListener("click", () => {
        const nextLang = state.lang === "es" ? "en" : "es";
        applyLanguage(nextLang);
    });

    /* ==========================================================================
       THEME SWITCHER (Dark & Light Mode)
       ========================================================================== */
    function applyTheme(theme) {
        state.theme = theme;
        localStorage.setItem("portfolio-theme", theme);
        
        if (theme === "light") {
            body.classList.remove("dark-theme");
            body.classList.add("light-theme");
        } else {
            body.classList.remove("light-theme");
            body.classList.add("dark-theme");
        }
        
        // Trigger custom event for terminal theme sync
        const themeChangeEvent = new CustomEvent("themeChange", { detail: { theme } });
        document.dispatchEvent(themeChangeEvent);
    }

    // Initialize Theme
    applyTheme(state.theme);

    themeToggle.addEventListener("click", () => {
        const nextTheme = state.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    });

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    function toggleMobileMenu() {
        const isOpen = mobileNavMenu.classList.contains("open");
        
        if (isOpen) {
            mobileNavMenu.classList.remove("open");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
            mobileMenuBtn.querySelector(".menu-icon").style.display = "block";
            mobileMenuBtn.querySelector(".close-icon").style.display = "none";
        } else {
            mobileNavMenu.classList.add("open");
            mobileMenuBtn.setAttribute("aria-expanded", "true");
            mobileMenuBtn.querySelector(".menu-icon").style.display = "none";
            mobileMenuBtn.querySelector(".close-icon").style.display = "block";
        }
    }

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileNavMenu.classList.contains("open")) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener("click", (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNavMenu.contains(e.target) && mobileNavMenu.classList.contains("open")) {
            toggleMobileMenu();
        }
    });

    /* ==========================================================================
       TYPING EFFECT (Hero Section)
       ========================================================================== */
    function typeEffect() {
        const currentWords = state.typingWords[state.lang];
        const currentWord = currentWords[state.typingWordIndex];

        if (state.isDeleting) {
            // Deleting text
            typingTextEl.textContent = currentWord.substring(0, state.typingIndex - 1);
            state.typingIndex--;
            state.typingDelay = 50; // Deletes faster
        } else {
            // Typing text
            typingTextEl.textContent = currentWord.substring(0, state.typingIndex + 1);
            state.typingIndex++;
            state.typingDelay = 120; // Normal typing speed
        }

        // Handle word completion states
        if (!state.isDeleting && state.typingIndex === currentWord.length) {
            state.isDeleting = true;
            state.typingDelay = 2000; // Pause at the end of word
        } else if (state.isDeleting && state.typingIndex === 0) {
            state.isDeleting = false;
            state.typingWordIndex = (state.typingWordIndex + 1) % currentWords.length;
            state.typingDelay = 500; // Brief pause before typing next word
        }

        setTimeout(typeEffect, state.typingDelay);
    }

    if (typingTextEl) {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       SKILLS DISPLAY FILTER
       ========================================================================== */
    skillsTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active from all tabs
            skillsTabBtns.forEach(t => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });

            // Set current active
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            const filter = btn.getAttribute("data-tab");

            skillCards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                if (filter === "all" || category === filter) {
                    card.style.display = "flex";
                    // Brief delay to trigger entrance transition
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       DYNAMIC CARD GLOW EFFECT (Mouse Spotlight)
       ========================================================================== */
    glassCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    /* ==========================================================================
       INTERACTIVE CANVAS BACKGROUND PARTICLES
       ========================================================================== */
    const canvas = document.getElementById("bg-particles");
    const ctx = canvas.getContext("2d");
    
    let particlesArray = [];
    const maxParticles = 65;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Boundary checks
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let pColor = state.theme === "dark" ? "rgba(139, 92, 246, 0.18)" : "rgba(109, 40, 217, 0.12)";
        
        for (let i = 0; i < maxParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * (innerWidth - size * 2)) + size;
            let y = (Math.random() * (innerHeight - size * 2)) + size;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, pColor));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        let lineLimit = 120;
        let lineClr = state.theme === "dark" ? "rgba(6, 182, 212, 0.05)" : "rgba(8, 145, 178, 0.04)";

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) 
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (lineLimit * lineLimit)) {
                    opacityValue = 1 - (distance / (lineLimit * lineLimit));
                    ctx.strokeStyle = lineClr;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    // Listen to theme changes to redraw particles with current accent color
    document.addEventListener("themeChange", () => {
        initParticles();
    });

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animateParticles();

    /* ==========================================================================
       SCROLL EFFECTS & NAV HIGHLIGHT
       ========================================================================== */
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold
            if (pageYOffset >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === currentSectionId) {
                link.classList.add("active");
            }
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector("#form-submit-btn");
            const originalBtnContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = state.lang === "es" 
                ? `<i data-lucide="loader" class="animate-spin"></i> Enviando...` 
                : `<i data-lucide="loader" class="animate-spin"></i> Sending...`;
            
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Simulate server request
            setTimeout(() => {
                formStatus.style.display = "block";
                formStatus.className = "success";
                
                if (state.lang === "es") {
                    formStatus.textContent = "¡Mensaje enviado con éxito! Me pondré en contacto contigo muy pronto.";
                } else {
                    formStatus.textContent = "Message sent successfully! I will get in touch with you very soon.";
                }
                
                // Clear form inputs
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                if (typeof lucide !== 'undefined') lucide.createIcons();

                // Auto hide status after 5s
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 5000);
            }, 1500);
        });
    }
});

/* ==========================================================================
   CYBERSECURITY CLI TERMINAL CONTROLLER
   ========================================================================== */
(function() {
    let terminalInput, terminalScreen;
    let currentLang = localStorage.getItem("portfolio-lang") || "es";

    const commands = {
        help: {
            es: `Comandos disponibles:
  <span class="highlight">about</span>       - Resumen de mi perfil profesional.
  <span class="highlight">skills</span>      - Mis competencias técnicas y tecnologías.
  <span class="highlight">experience</span>  - Historial laboral detallado.
  <span class="highlight">projects</span>    - Algunos proyectos destacados.
  <span class="highlight">contact</span>     - Información de contacto y redes sociales.
  <span class="highlight">clear</span>       - Limpiar la pantalla de la terminal.
  <span class="highlight">theme</span>       - Cambiar tema de la web (claro/oscuro).
  <span class="highlight">lang</span>        - Alternar idioma de la web (es/en).`,
            en: `Available commands:
  <span class="highlight">about</span>       - Executive summary of my professional profile.
  <span class="highlight">skills</span>      - Technical core competencies & tools.
  <span class="highlight">experience</span>  - Chronological work history.
  <span class="highlight">projects</span>    - Selected showcase of development projects.
  <span class="highlight">contact</span>     - Professional contact coordinates.
  <span class="highlight">clear</span>       - Clear the terminal screen.
  <span class="highlight">theme</span>       - Toggle website theme (light/dark).
  <span class="highlight">lang</span>        - Toggle website language (es/en).`
        },
        about: {
            es: `<b>RAMÓN MONCHOLÍ ROS | DESARROLLADOR FULL STACK & CIBERSEGURIDAD</b>
----------------------------------------------------------------------------
Desarrollador software proactivo con doble titulación en DAM y DAW, especializado 
en el ecosistema Odoo ERP (Python), automatización e integración de APIs, y 
aplicaciones frontend interactivas con Angular/Ionic/TypeScript. 

Especializado además en Ciberseguridad, con conocimientos de auditoría de red, 
análisis de tráfico con Wireshark, testing web con Burp Suite y hardening de código.
Habla español nativo, valenciano nativo e inglés B2 (inmersión en Dublín, Irlanda).`,
            en: `<b>RAMON MONCHOLI ROS | FULL STACK DEVELOPER & CYBERSECURITY</b>
----------------------------------------------------------------------------
Proactive software engineer with dual higher degrees in DAM and DAW. Specialized 
in the Odoo ERP ecosystem (Python), advanced process automations, REST APIs integration, 
and building modern frontend interfaces with Angular, Ionic, and TypeScript.

Additionally specialized in Cybersecurity, including active network topologies mapping 
utilizing Nmap, traffic analysis via Wireshark, web security audits with Burp Suite, 
and secure coding principles.
Native Spanish, native Valencian, and professional B2 English (1 year Dublin immersion).`
        },
        skills: {
            es: `<b>MATRIZ DE HABILIDADES TÉCNICAS (Core Competencies)</b>
----------------------------------------------------------------------------
  • <b>Lenguajes:</b> Python, Java, JavaScript, TypeScript, SQL
  • <b>Frontend:</b> Angular, Ionic, HTML5, CSS3, UX/UI moderno
  • <b>Backend & ERP:</b> Odoo ERP Framework, REST APIs, Python ORM
  • <b>Bases de Datos:</b> PostgreSQL, MySQL
  • <b>Ciberseguridad:</b> Wireshark, Nmap, Burp Suite, Secure Development
  • <b>IA & Herramientas:</b> OpenAI API, Prompt Engineering, Git, Shell scripting`,
            en: `<b>TECHNICAL CORE COMPETENCIES MATRIX</b>
----------------------------------------------------------------------------
  • <b>Languages:</b> Python, Java, JavaScript, TypeScript, SQL
  • <b>Frontend:</b> Angular, Ionic, HTML5, CSS3, Modern UX/UI Architecture
  • <b>Backend & ERP:</b> Odoo ERP Framework, REST APIs, Python Business Logic
  • <b>Databases:</b> PostgreSQL, MySQL
  • <b>Cybersecurity:</b> Wireshark (packet analysis), Nmap (auditing), Burp Suite (pentesting)
  • <b>AI & Tools:</b> OpenAI API integration, Prompt Engineering, Git, CLI scripting`
        },
        experience: {
            es: `<b>HISTORIAL PROFESIONAL (Work History)</b>
----------------------------------------------------------------------------
<b>1. Desarrollador Odoo ERP | Bisnesmart (Consultoría IT)</b>
   <i>[ 05/2021 – 11/2021 ]</i>
   - Diseño de módulos ERP a medida en Python y base relacional PostgreSQL.
   - Scripts de migración de bases de datos de alta fiabilidad.
   - Optimización de algoritmos reduciendo un 20% el tiempo de procesos críticos.

<b>2. Desarrollador Independiente | Proyectos Freelance & Open Source</b>
   <i>[ 2022 – 2023 ]</i>
   - Creación de interfaces web reactivas con Angular y TypeScript.
   - Desarrollo de apps móviles híbridas utilizando Ionic (iOS, Android, Web).
   - Automatización de flujos de trabajo locales consumiendo APIs REST con Python.

<b>3. Inmersión Profesional / Kitchen Porter | Croke Park Hotel (Dublín, Irlanda)</b>
   <i>[ 2024 – 2025 ]</i>
   - Estancia lingüística activa para consolidar nivel B2 de inglés.
   - Coordinación de equipo en entorno multicultural de alto rendimiento.`,
            en: `<b>CHRONOLOGICAL WORK HISTORY</b>
----------------------------------------------------------------------------
<b>1. Odoo ERP Developer | Bisnesmart (IT Consulting)</b>
   <i>[ 05/2021 – 11/2021 ]</i>
   - Engineered customized enterprise ERP modules in Python and PostgreSQL.
   - Designed reliable data migration scripts and PostgreSQL queries.
   - Refactored legacy modules to decrease application loading times by 20%.

<b>2. Independent Software Developer | Freelance & Open Source</b>
   <i>[ 2022 – 2023 ]</i>
   - Built interactive single page applications (SPA) using Angular and TypeScript.
   - Created mobile apps using Ionic framework for cross-platform distribution.
   - Scripted REST API automations and integrations using Python.

<b>3. Professional Language Immersion | Croke Park Hotel (Dublin, Ireland)</b>
   <i>[ 2024 – 2025 ]</i>
   - Immersion stay to master professional business English (B2 proficiency).
   - Team coordination inside high-pressure five-star hotel operations.`
        },
        projects: {
            es: `<b>PROYECTOS DESTACADOS DE GITHUB (doliax)</b>
----------------------------------------------------------------------------
<b>• Blog_Teknologia:</b> Blog interactivo sobre tecnología y desarrollo web desarrollado 
  con Ionic y Angular. Cuenta con navegación fluida y diseño responsivo móvil-primero.
<b>• web_sushi:</b> Aplicación web temática de Sushi construida en Angular. Presenta una 
  interfaz de restaurante atractiva, menú digital y simulador de carrito de compras.
<b>• lop_web:</b> Sitio web moderno y responsivo desarrollado con React y Tailwind CSS, 
  destacando por su velocidad de renderizado y micro-animaciones fluidas.
<b>• ejercicios_ts:</b> Repositorio de código enfocado en la resolución de problemas avanzados 
  mediante TypeScript, demostrando el dominio de algoritmos y tipado fuerte.`,
            en: `<b>SELECTED GITHUB PROJECTS PORTFOLIO (doliax)</b>
----------------------------------------------------------------------------
<b>• Blog_Teknologia:</b> An interactive technology and web development blog built 
  using Ionic and Angular. Features fluid SPA routing and mobile-first design.
<b>• web_sushi:</b> A custom themed Sushi restaurant application engineered in Angular. 
  Showcases a visual interface, digital menu, and shopping cart simulation.
<b>• lop_web:</b> A sleek and modern responsive presentation website built utilizing 
  React and Tailwind CSS. Focuses on modular components and fluid UI animations.
<b>• ejercicios_ts:</b> A technical code repository dedicated to advanced algorithmic 
  problem solving using TypeScript, demonstrating strict typing and optimal design.`
        },
        contact: {
            es: `<b>INFORMACIÓN DE CONTACTO & SOCIALES</b>
----------------------------------------------------------------------------
  • <b>Email:</b>     ramon.moncholi08@gmail.com
  • <b>Teléfono:</b>  +34 634 692 908
  • <b>Ubicación:</b> Denia, Alicante, España
  • <b>LinkedIn:</b>  linkedin.com/in/ramonmonros
  • <b>GitHub:</b>    github.com/doliax
  
<i>* Si quieres enviarme un mensaje directo, puedes usar el formulario al final de la página.</i>`,
            en: `<b>PROFESSIONAL CONTACT COORDINATES</b>
----------------------------------------------------------------------------
  • <b>Email:</b>     ramon.moncholi08@gmail.com
  • <b>Phone:</b>     +34 634 692 908
  • <b>Location:</b>  Denia, Alicante, Spain
  • <b>LinkedIn:</b>  linkedin.com/in/ramonmonros
  • <b>GitHub:</b>    github.com/doliax
  
<i>* To send me a direct email inquiry, utilize the contact form at the bottom of the page.</i>`
        }
    };

    function initTerminal() {
        terminalInput = document.getElementById("terminal-input");
        terminalScreen = document.getElementById("terminal-screen");
        
        if (!terminalInput || !terminalScreen) return;

        terminalInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                const commandText = terminalInput.value.trim();
                handleCommand(commandText);
                terminalInput.value = "";
            }
        });

        // Sync language with global state
        document.addEventListener("langChange", function(e) {
            currentLang = e.detail.lang;
        });
    }

    function writeLine(text, cssClass = "") {
        const line = document.createElement("div");
        line.className = `term-line ${cssClass}`;
        line.innerHTML = text;
        terminalScreen.appendChild(line);
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }

    function handleCommand(rawCmd) {
        const cmd = rawCmd.toLowerCase().trim();
        writeLine(`<span class="prompt-symbol">guest@ramonmoncholi.sh:~$</span> ${rawCmd}`, "user-cmd");

        if (cmd === "") return;

        if (cmd === "clear") {
            terminalScreen.innerHTML = "";
            return;
        }

        if (cmd === "theme") {
            const themeBtn = document.getElementById("theme-toggle");
            if (themeBtn) themeBtn.click();
            
            const nextTheme = document.body.classList.contains("light-theme") ? "LIGHT" : "DARK";
            const themeMsg = currentLang === "es" 
                ? `Tema de la web modificado a: <span class="highlight">${nextTheme}</span>`
                : `Website theme changed to: <span class="highlight">${nextTheme}</span>`;
            writeLine(themeMsg, "term-output");
            return;
        }

        if (cmd === "lang") {
            const langBtn = document.getElementById("lang-toggle");
            if (langBtn) langBtn.click();
            
            const nextLang = currentLang === "es" ? "SPANISH" : "ENGLISH";
            const langMsg = currentLang === "es"
                ? `Idioma cambiado a: <span class="highlight">${nextLang}</span>`
                : `Language switched to: <span class="highlight">${nextLang}</span>`;
            writeLine(langMsg, "term-output");
            return;
        }

        if (commands[cmd]) {
            const output = commands[cmd][currentLang];
            writeLine(output.replace(/\n/g, "<br>"), "term-output");
        } else {
            const errorMsg = currentLang === "es"
                ? `Comando no reconocido: <span style="color:#ef4444;">'${rawCmd}'</span>. Escribe <span class="highlight">help</span> para ver comandos.`
                : `Command not found: <span style="color:#ef4444;">'${rawCmd}'</span>. Type <span class="highlight">help</span> for assistance.`;
            writeLine(errorMsg, "term-output");
        }
    }

    // Auto-focus terminal input when clicking inside the terminal window
    const termWindow = document.querySelector(".terminal-window");
    if (termWindow) {
        termWindow.addEventListener("click", () => {
            const input = document.getElementById("terminal-input");
            if (input) input.focus();
        });
    }

    document.addEventListener("DOMContentLoaded", initTerminal);
    // Safety check if DOMContentLoaded already fired
    if (document.readyState === "complete" || document.readyState === "interactive") {
        initTerminal();
    }
})();
