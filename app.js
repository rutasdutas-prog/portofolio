document.addEventListener('DOMContentLoaded', () => {
    // Load Data from LocalStorage
    const siteData = JSON.parse(localStorage.getItem('port_site'));
    const projectsData = JSON.parse(localStorage.getItem('port_projects'));

    // Populate Site Content
    document.getElementById('heroTitle').innerText = siteData.heroTitle;
    document.getElementById('heroSubtitle').innerText = siteData.heroSubtitle;
    document.getElementById('aboutBio').innerText = siteData.aboutBio;
    document.getElementById('linkLinkedin').href = siteData.social.linkedin;
    document.getElementById('linkGithub').href = siteData.social.github;
    document.getElementById('linkInstagram').href = siteData.social.instagram;

    // Populate Skills
    const skillsArray = siteData.skills.split(',').map(s => s.trim()).filter(s => s);
    const skillsWrapper = document.getElementById('skillsWrapper');
    skillsArray.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.innerText = skill;
        skillsWrapper.appendChild(span);
    });

    // Populate Projects
    const portfolioGrid = document.getElementById('portfolioGrid');
    projectsData.forEach(project => {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        
        const techSpans = project.tech.split(',').map(t => `<span>${t.trim()}</span>`).join(' • ');
        const firstImg = Array.isArray(project.image) ? project.image[0] : project.image;

        item.innerHTML = `
            <img src="${firstImg}" alt="${project.title}" class="portfolio-img">
            <div class="portfolio-info">
                <h3>${project.title}</h3>
                <div class="tech-stack">${techSpans}</div>
            </div>
        `;
        
        // Modal Event
        item.addEventListener('click', () => openModal(project));
        portfolioGrid.appendChild(item);
    });

    // Modal Logic
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');

    function openModal(project) {
        const modalImgContainer = document.getElementById('modalImgContainer');
        const sliderPrev = document.getElementById('sliderPrev');
        const sliderNext = document.getElementById('sliderNext');
        const sliderDots = document.getElementById('sliderDots');
        
        modalImgContainer.innerHTML = '';
        if(sliderDots) sliderDots.innerHTML = '';
        
        const images = Array.isArray(project.image) ? project.image : [project.image];
        images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'modal-img';
            modalImgContainer.appendChild(img);
        });

        if (images.length > 1) {
            sliderPrev.style.display = 'flex';
            sliderNext.style.display = 'flex';
            
            // Create dots
            if(sliderDots) {
                images.forEach((_, idx) => {
                    const dot = document.createElement('div');
                    dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
                    dot.onclick = () => {
                        modalImgContainer.scrollTo({ left: idx * modalImgContainer.clientWidth, behavior: 'smooth' });
                    };
                    sliderDots.appendChild(dot);
                });
            }

            sliderPrev.onclick = () => {
                modalImgContainer.scrollBy({ left: -modalImgContainer.clientWidth, behavior: 'smooth' });
            };
            sliderNext.onclick = () => {
                modalImgContainer.scrollBy({ left: modalImgContainer.clientWidth, behavior: 'smooth' });
            };
            
            // Update active dot on scroll
            modalImgContainer.onscroll = () => {
                const index = Math.round(modalImgContainer.scrollLeft / modalImgContainer.clientWidth);
                if(sliderDots) {
                    const dotsList = sliderDots.querySelectorAll('.slider-dot');
                    dotsList.forEach((d, i) => {
                        if(i === index) d.classList.add('active');
                        else d.classList.remove('active');
                    });
                }
            };
        } else {
            sliderPrev.style.display = 'none';
            sliderNext.style.display = 'none';
            modalImgContainer.onscroll = null;
        }

        document.getElementById('modalTitle').innerText = project.title;
        document.getElementById('modalDesc').innerText = project.description;
        document.getElementById('modalTech').innerHTML = project.tech.split(',').map(t => `<span>${t.trim()}</span>`).join(' • ');
        
        const demoBtn = document.getElementById('modalDemo');
        if(project.demoLink && project.demoLink !== '#') {
            demoBtn.style.display = 'inline-block';
            demoBtn.href = project.demoLink;
        } else {
            demoBtn.style.display = 'none';
        }

        const gitBtn = document.getElementById('modalGithub');
        if(project.githubLink && project.githubLink !== '#') {
            gitBtn.style.display = 'inline-block';
            gitBtn.href = project.githubLink;
        } else {
            gitBtn.style.display = 'none';
        }

        modal.classList.add('show');
    }

    closeBtn.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => { if(e.target === modal) modal.classList.remove('show'); }

    // Mobile Menu
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Footer Year
    document.getElementById('year').innerText = new Date().getFullYear();

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = contactForm.querySelectorAll('input, textarea');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const message = inputs[2].value;

            const newMsg = {
                id: Date.now(),
                name: name,
                email: email,
                message: message,
                date: new Date().toLocaleString()
            };

            const messages = JSON.parse(localStorage.getItem('port_messages')) || [];
            messages.push(newMsg);
            localStorage.setItem('port_messages', JSON.stringify(messages));

            alert('Pesan berhasil terkirim!');
            contactForm.reset();
        });
    }
});
