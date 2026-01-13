(() => {
    "use strict";

    const flsModules = {};

    const blogs = [
        {
            id: "01",
            date: "Oct 09, 2025",
            title: "The Rise of No-Code + Low-Code: Should Developers Be Worried?",
            category: "Developer Career & Growth",
            tags: "#no-code, #low-code, #software-development, #AI, #futureofcoding",
            description: "This article examines the fast-growing rise of no-code...",
            link: "https://rutvi-dhameliya.hashnode.dev/the-rise-of-no-code-low-code-should-developers-be-worried"
        },
        {
            id: "02",
            date: "Oct 09, 2025",
            title: "MVC in the Age of Microservices: Is It Still Useful?",
            category: "System Design & Architecture",
            tags: "#mvc, #software-architecture, #microservices, #webdev, #programming, #backend",
            description: "This article examines the relevance of the MVC...",
            link: "https://rutvi-dhameliya.hashnode.dev/mvc-in-the-age-of-microservices-is-it-still-useful"
        },
        {
            id: "03",
            date: "Oct 09, 2025",
            title: "Why I Still Use CodeIgniter 3 (And Why That's Okay)",
            category: "Frameworks & Legacy Systems",
            tags: "#codeigniter3, #php, #webdev, #productivity, #legacy-code",
            description: "This article explains why CodeIgniter 3 remains relevant...",
            link: "https://rutvi-dhameliya.hashnode.dev/still-using-codeigniter-3"
        },
        {
            id: "04",
            date: "Oct 02, 2025",
            title: "How to Stay Updated in the Fast-Moving Tech World",
            category: "Developer Career & Growth",
            tags: "#programming, #tech-trends, #webdev, #learning-resources",
            description: "This article provides practical strategies for staying current...",
            link: "https://rutvi-dhameliya.hashnode.dev/stay-updated-in-tech"
        },
        {
            id: "05",
            date: "AUG 20, 2025",
            title: "Why My Portfolio Doesn't Have a Contact Form",
            category: "Portfolio & Personal Branding",
            tags: "#portfoliowebsite, #developerportfolio, #personalbrand",
            description: "This article explains why a contact form isn't always necessary...",
            link: "https://rutvi-dhameliya.hashnode.dev/why-my-portfolio-doesnt-have-a-contact-form"
        },
        {
            id: "06",
            date: "AUG 12, 2025",
            title: "Prompt Engineering for Developers: Turning AI into a Backend Teammate",
            category: "AI for Developers",
            tags: "#promptengineering, #ai, #developertips",
            description: "This article explores how developers can leverage prompt engineering...",
            link: "https://rutvi-dhameliya.hashnode.dev/prompt-engineering-for-developers-turning-ai-into-a-backend-teammate"
        },
        {
            id: "07",
            date: "AUG 07, 2025",
            title: "Versioning Your 100+ Controllers in CI3 Without Changing a Single Route",
            category: "Backend Development",
            tags: "#php, #codeigniter, #legacy-code, #refactoring, #webdev",
            description: "This article demonstrates a practical method for refactoring...",
            link: "https://rutvi-dhameliya.hashnode.dev/versioning-your-100-controllers-in-ci3-without-changing-a-single-route"
        }
    ];

    // 2. DYNAMIC RENDERING (Must happen before ScrollWatcher and Animations)
    const listElement = document.querySelector(".cases-list");
    if (listElement) {
        let blogHTML = "";
        blogs.forEach(b => {
            blogHTML += `
                <li class="cases-list__item relative">
                    <div class="line left bottom width"></div>
                    <a href="${b.link}" data-hover-target class="cases-list__link" target="_blank">
                        <span data-opacity-text data-hover-content>${b.title}</span>
                    </a>
                </li>`;
        });
        listElement.innerHTML = blogHTML;
    }

    /**
     * ScrollWatcher Class
     * Observes elements as they enter/exit the viewport using IntersectionObserver.
     */
    class ScrollWatcher {
        constructor(config) {
            this.config = Object.assign({
                logging: true
            }, config);
            this.observer;
            
            // Only run if the watcher hasn't been initialized on the document yet
            if (!document.documentElement.classList.contains("watcher")) {
                this.scrollWatcherRun();
            }
        }

        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }

        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }

        scrollWatcherConstructor(elements) {
            if (elements.length) {
                this.scrollWatcherLogging(`Woke up, watching objects (${elements.length})...`);
                
                // Group unique observer configurations
                const uniqueConfigs = uniqArray(Array.from(elements).map(function(el) {
                    return `${el.dataset.watchRoot ? el.dataset.watchRoot : null}|${el.dataset.watchMargin ? el.dataset.watchMargin : "0px"}|${el.dataset.watchThreshold ? el.dataset.watchThreshold : 0}`;
                }));

                uniqueConfigs.forEach(configStr => {
                    let parts = configStr.split("|");
                    let configObj = {
                        root: parts[0],
                        margin: parts[1],
                        threshold: parts[2]
                    };

                    // Filter elements matching this specific config
                    let targets = Array.from(elements).filter(function(el) {
                        let elRoot = el.dataset.watchRoot ? el.dataset.watchRoot : null;
                        let elMargin = el.dataset.watchMargin ? el.dataset.watchMargin : "0px";
                        let elThreshold = el.dataset.watchThreshold ? el.dataset.watchThreshold : 0;
                        
                        if (String(elRoot) === configObj.root && String(elMargin) === configObj.margin && String(elThreshold) === configObj.threshold) {
                            return el;
                        }
                    });

                    let observerOptions = this.getScrollWatcherConfig(configObj);
                    this.scrollWatcherInit(targets, observerOptions);
                });
            } else {
                this.scrollWatcherLogging("Sleeping, no objects to watch. ZzzZZzz");
            }
        }

        getScrollWatcherConfig(configObj) {
            let options = {};
            
            if (document.querySelector(configObj.root)) {
                options.root = document.querySelector(configObj.root);
            } else if (configObj.root !== "null") {
                this.scrollWatcherLogging(`Hmm... root object ${configObj.root} not found on page`);
            }

            options.rootMargin = configObj.margin;

            if (configObj.margin.indexOf("px") < 0 && configObj.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging("Error: data-watch-margin must be in PX or %");
                return;
            }

            // Special threshold "prx" creates an array of steps for parallax effects
            if (configObj.threshold === "prx") {
                configObj.threshold = [];
                for (let i = 0; i <= 1; i += 0.005) {
                    configObj.threshold.push(i);
                }
            } else {
                configObj.threshold = configObj.threshold.split(",");
            }

            options.threshold = configObj.threshold;
            return options;
        }

        scrollWatcherCreate(options) {
            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    this.scrollWatcherCallback(entry, observer);
                });
            }, options);
        }

        scrollWatcherInit(targets, options) {
            this.scrollWatcherCreate(options);
            targets.forEach(target => this.observer.observe(target));
        }

        scrollWatcherIntersecting(entry, target) {
            if (entry.isIntersecting) {
                if (!target.classList.contains("_watcher-view")) {
                    target.classList.add("_watcher-view");
                }
                this.scrollWatcherLogging(`I see ${target.classList}, added class _watcher-view`);
            } else {
                if (target.classList.contains("_watcher-view")) {
                    target.classList.remove("_watcher-view");
                }
                this.scrollWatcherLogging(`I don't see ${target.classList}, removed class _watcher-view`);
            }
        }

        scrollWatcherOff(target, observer) {
            observer.unobserve(target);
            this.scrollWatcherLogging(`Stopped watching ${target.classList}`);
        }

        scrollWatcherLogging(message) {
            if (this.config.logging) {
                const log = (msg) => {
                    setTimeout(() => {
                        if (window.FLS) console.log(msg);
                    }, 0);
                };
                log(`[Watcher]: ${message}`);
            }
        }

        scrollWatcherCallback(entry, observer) {
            const target = entry.target;
            this.scrollWatcherIntersecting(entry, target);

            // If data-watch-once is present, stop watching after first intersect
            if (target.hasAttribute("data-watch-once") && entry.isIntersecting) {
                this.scrollWatcherOff(target, observer);
            }

            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: { entry: entry }
            }));
        }
    }

    // Device Detection
    let isMobile = {
        Android: () => navigator.userAgent.match(/Android/i),
        BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
        iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
        Opera: () => navigator.userAgent.match(/Opera Mini/i),
        Windows: () => navigator.userAgent.match(/IEMobile/i),
        any: () => (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
    };

    // Body Lock/Unlock functions (to prevent scroll when menu is open)
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lockPadding = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
                for (let i = 0; i < lockPadding.length; i++) {
                    lockPadding[i].style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }, delay);
            bodyLockStatus = false;
            setTimeout(() => { bodyLockStatus = true; }, delay);
        }
    };

    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lockPadding = document.querySelectorAll("[data-lp]");
            const scrollWidth = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            for (let i = 0; i < lockPadding.length; i++) {
                lockPadding[i].style.paddingRight = scrollWidth;
            }
            body.style.paddingRight = scrollWidth;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout(() => { bodyLockStatus = true; }, delay);
        }
    };

    function uniqArray(array) {
        return array.filter((item, index, self) => self.indexOf(item) === index);
    }

    // Scroll Event Dispatcher
    let isScrollReady = false;
    setTimeout(() => {
        if (isScrollReady) {
            let scrollEvent = new Event("windowScroll");
            window.addEventListener("scroll", (e) => {
                document.dispatchEvent(scrollEvent);
            });
        }
    }, 0);

    // Visual: Staggered Line Animation
    const animatedLines = document.querySelectorAll(".line");
    const wrapper = document.querySelector(".wrapper");
    if (wrapper && wrapper.classList.contains("wrapper_full") && animatedLines.length !== 0) {
        let delay = 0;
        animatedLines.forEach(line => {
            line.style.transitionDelay = (delay + 0.1) + "s";
            delay += 0.05;
        });
    }

    // Visual: Opacity Text Animation
    const opacityTexts = document.querySelectorAll("[data-opacity-text]");
    if (opacityTexts.length > 0) {
        let textDelay = 0.3;
        opacityTexts.forEach(el => {
            let currentDelay = Number(textDelay.toFixed(1));
            const content = el.textContent;
            el.innerHTML = `<span class="animation"><span style="transition-delay:${currentDelay + 0.1}s;">${content}</span></span>`;
            textDelay += 0.1;
        });
    }

    // Menu Link Hover Effect
    document.querySelectorAll(".menu__link").forEach(link => {
        if (!link.classList.contains("_active")) {
            let innerText = link.querySelector("span>span>span").innerHTML;
            link.insertAdjacentHTML("beforeend", `<span class="_link-hover"><span>${innerText}</span></span>`);
            let hoverSpan = link.querySelector("._link-hover");
            let innerHoverSpan = link.querySelector("._link-hover span");
            
            hoverSpan.style.cssText = "transform: translate3d(0px, 105%, 0px);";
            innerHoverSpan.style.cssText = "transform: translate3d(0px,-105%, 0px);";
            
            link.addEventListener("mouseenter", () => {
                hoverSpan.style.cssText = "transform: translate3d(0px, 0%, 0px);";
                innerHoverSpan.style.cssText = "transform: translate3d(0px, 0%, 0px);";
            });
            link.addEventListener("mouseleave", () => {
                hoverSpan.style.cssText = "transform: translate3d(0px, 105%, 0px);";
                innerHoverSpan.style.cssText = "transform: translate3d(0px,-105%, 0px);";
            });
        }
    });

    // Cases List Hover Effect (Dynamic Slide Direction)
    document.querySelectorAll(".cases-list__link").forEach(link => {
        if (!link.classList.contains("_active")) {
            let innerText = link.querySelector("span>span>span").innerHTML;
            link.insertAdjacentHTML("beforeend", `<span class="_link-hover"><span>${innerText}</span></span>`);
            let hoverContainer = link.querySelector("._link-hover");
            let hoverInner = link.querySelector("._link-hover span");

            hoverContainer.style.cssText = "transform: translate3d(0px, -105%, 0px);";
            hoverInner.style.cssText = "transform: translate3d(0px, 105%, 0px);";

            link.addEventListener("mouseenter", (e) => {
                let midPoint = link.offsetHeight / 2;
                // Check if mouse entered from top or bottom
                if (e.pageY - (link.getBoundingClientRect().top + scrollY) > midPoint) {
                    hoverContainer.style.cssText = "transform: translate3d(0px, 105%, 0px);";
                    hoverInner.style.cssText = "transform: translate3d(0px,-105%, 0px);";
                } else {
                    hoverContainer.style.cssText = "transform: translate3d(0px, -105%, 0px);";
                    hoverInner.style.cssText = "transform: translate3d(0px, 105%, 0px);";
                }
                setTimeout(() => {
                    hoverContainer.style.cssText = "transform: translate3d(0px, 0%, 0px); transition: all 0.4s ease 0s;";
                    hoverInner.style.cssText = "transform: translate3d(0px, 0%, 0px); transition: all 0.4s ease 0s;";
                }, 5);
            });

            link.addEventListener("mouseleave", (e) => {
                let midPoint = link.offsetHeight / 2;
                if (e.pageY - (link.getBoundingClientRect().top + scrollY) > midPoint) {
                    hoverContainer.style.cssText = "transform: translate3d(0px, 105%, 0px); transition: all 0.4s ease 0s;";
                    hoverInner.style.cssText = "transform: translate3d(0px,-105%, 0px); transition: all 0.4s ease 0s;";
                } else {
                    hoverContainer.style.cssText = "transform: translate3d(0px, -105%, 0px); transition: all 0.4s ease 0s;";
                    hoverInner.style.cssText = "transform: translate3d(0px,105%, 0px); transition: all 0.4s ease 0s;";
                }
            });
        }
    });

    // Desktop Image Preview on Hover (Cases)
    const casesList = document.querySelector(".cases-list");
    if (casesList && !isMobile.any()) {
        const imageContainer = casesList.closest(".content-block").querySelector(".content-block__image");
        const links = casesList.querySelectorAll(".cases-list__link");
        
        if (links.length > 0) {
            const addImage = (src, container) => {
                const img = new Image();
                img.style.cssText = "opacity:1;";
                img.src = src;
                container.prepend(img);
            };
            const removeImage = (container) => {
                const img = container.querySelector("img");
                if (img) {
                    img.style.cssText = "opacity:0;";
                    img.remove();
                }
            };

            links.forEach(link => {
                link.addEventListener("mouseenter", () => {
                    addImage(link.querySelector("img").src, imageContainer);
                });
                link.addEventListener("mouseleave", () => {
                    removeImage(imageContainer);
                });
            });
        }
    }

    // Custom Cursor Logic
    const cursor = document.querySelector(".cursor");
    const anchors = document.querySelectorAll("a");
    
    document.querySelector("body").addEventListener("mouseleave", () => {
        cursor.classList.add("hidden");
    });

    document.addEventListener("mousemove", (e) => {
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
        cursor.classList.remove("hidden");
    });

    document.addEventListener("mousedown", () => cursor.classList.add("click"));
    document.addEventListener("mouseup", () => cursor.classList.remove("click"));

    anchors.forEach(a => {
        a.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        a.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });

    // Display current location and live clock
    function updateLocationTime() {
        const dateElement = document.querySelector(".menu__date");
        if (dateElement) {
            const now = new Date();
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: true 
            };
            const timeString = now.toLocaleTimeString('en-US', timeOptions);
            
            // This replaces the "© 2026" with "SURAT, IN — 12:00:00 PM"
            dateElement.innerHTML = `SURAT, IN — ${timeString}`;
        }
    }
    updateLocationTime();
    setInterval(updateLocationTime, 1000);

    // WebP support detection
    window.FLS = false;
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = () => {
            callback(webP.height === 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP((support) => {
        let className = support === true ? "webp" : "no-webp";
        document.documentElement.classList.add(className);
    });

    if (isMobile.any()) document.documentElement.classList.add("touch");

    // Preloader Logic
    (function loader() {
        const images = document.images;
        const totalImages = images.length;
        const percentEl = document.querySelector("#loaderPrecent");
        let loadedCount = 0;

        for (let i = 0; i < totalImages; i++) {
            const imgClone = new Image();
            imgClone.onload = onImageLoad;
            imgClone.onerror = onImageLoad;
            imgClone.src = images[i].src;
        }

        function onImageLoad() {
            loadedCount++;
            percentEl.style.setProperty("--progress", Math.round(100 / totalImages * loadedCount) + "%");
            
            if (loadedCount >= totalImages) {
                window.addEventListener("load", () => {
                    const menuAfter = document.querySelector(".menu__after");
                    if (menuAfter) menuAfter.style.cssText = "animation-duration: 0s;";
                    
                    setTimeout(() => percentEl.classList.add("is-hidden"), 500);
                    
                    setTimeout(() => {
                        document.documentElement.classList.add("loaded");
                        flsModules.watcher = new ScrollWatcher({});
                        if (menuAfter) menuAfter.style.cssText = "";
                    }, 1500);

                    // Prevent interaction during transition
                    let body = document.querySelector("body");
                    body.style.pointerEvents = "none";
                    setTimeout(() => {
                        body.style.pointerEvents = "auto";
                    }, 3500);
                });
            }
        }
    })();

    // Menu Icon Click (Hamburger)
    const iconMenu = document.querySelector(".icon-menu");
    if (iconMenu) {
        document.addEventListener("click", (e) => {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                // Toggle Body Lock
                if (document.documentElement.classList.contains("lock")) {
                    bodyUnlock(500);
                } else {
                    bodyLock(500);
                }
                document.documentElement.classList.toggle("menu-open");
            }
        });
    }

    // Fullscreen Viewport Height fix for mobile
    (function fullScreenFix() {
        if (document.querySelectorAll("[data-fullscreen]").length && isMobile.any()) {
            function setVh() {
                let vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
            }
            window.addEventListener("resize", setVh);
            setVh();
        }
    })();

    isScrollReady = true;

    // Sticky Element Logic
    (function stickyElements() {
        const stickyItems = document.querySelectorAll("[data-sticky]");
        stickyItems.length && stickyItems.forEach(item => {
            let config = {
                media: item.dataset.sticky ? parseInt(item.dataset.sticky) : null,
                top: item.dataset.stickyTop ? parseInt(item.dataset.stickyTop) : 0,
                mobile: item.dataset.stickyMobile ? parseInt(item.dataset.stickyMobile) : null,
                bottom: item.dataset.stickyBottom ? parseInt(item.dataset.stickyBottom) : 0,
                header: item.hasAttribute("data-sticky-header") ? document.querySelector("header.header").offsetHeight : 0
            };

            // Initialize Sticky Calculation
            const stickyChild = item.querySelector("[data-sticky-item]");
            const startPoint = config.header + config.top;
            const triggerOffset = stickyChild.getBoundingClientRect().top + scrollY - startPoint;

            function updateSticky() {
                const endPoint = item.offsetHeight + item.getBoundingClientRect().top + scrollY - (startPoint + stickyChild.offsetHeight + config.bottom);
                let styles = {
                    position: "relative",
                    bottom: "auto",
                    top: "0px",
                    left: "0px",
                    width: "auto"
                };

                // Check media queries and boundaries
                if ((!config.media || config.media < window.innerWidth) && (startPoint + config.bottom + stickyChild.offsetHeight < window.innerHeight)) {
                    if (scrollY >= triggerOffset && scrollY <= endPoint) {
                        styles.position = "fixed";
                        styles.top = `${startPoint}px`;
                        styles.left = `${stickyChild.getBoundingClientRect().left}px`;
                        styles.width = `${stickyChild.offsetWidth}px`;
                    } else if (scrollY >= endPoint) {
                        styles.position = "absolute";
                        styles.bottom = `${config.bottom}px`;
                        styles.top = "auto";
                        styles.width = `${stickyChild.offsetWidth}px`;
                    }
                }

                // Apply styles
                stickyChild.style.cssText = `position:${styles.position};bottom:${styles.bottom};top:${styles.top};left:${styles.left};width:${styles.width};`;
            }

            document.addEventListener("windowScroll", updateSticky);
            window.addEventListener("resize", updateSticky);
        });
    })();
})();