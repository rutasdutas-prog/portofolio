// Default Data Structure
const defaultData = {
    auth: [
        { id: 1, username: 'admin', password: 'admin123' }
    ],
    messages: [],
    site: {
        heroTitle: 'Nama Anda',
        heroSubtitle: 'Web Developer & UI/UX Desainer',
        aboutBio: 'Saya adalah seorang profesional yang bersemangat dalam menciptakan solusi digital yang elegan. Dengan pengalaman beberapa tahun di industri ini, saya selalu berusaha untuk memberikan kualitas terbaik pada setiap baris kode dan setiap piksel desain.',
        skills: 'HTML, CSS, JavaScript, UI/UX, Figma',
        social: {
            linkedin: 'https://linkedin.com',
            github: 'https://github.com',
            instagram: 'https://instagram.com'
        }
    },
    projects: [
        {
            id: 1,
            title: 'E-Commerce Platform',
            description: 'Aplikasi toko online lengkap dengan fitur keranjang belanja dan integrasi pembayaran.',
            tech: 'HTML, CSS, JS',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
            demoLink: '#',
            githubLink: '#'
        },
        {
            id: 2,
            title: 'Dashboard Analytics',
            description: 'Dashboard interaktif untuk memantau metrik bisnis secara real-time dengan grafik visual.',
            tech: 'Vanilla JS, Chart.js',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
            demoLink: '#',
            githubLink: '#'
        }
    ]
};

function initData() {
    if (!localStorage.getItem('port_auth')) {
        localStorage.setItem('port_auth', JSON.stringify(defaultData.auth));
    } else {
        // Migration if auth is still an object
        try {
            let authData = JSON.parse(localStorage.getItem('port_auth'));
            if (!Array.isArray(authData)) {
                localStorage.setItem('port_auth', JSON.stringify([
                    { id: 1, username: authData.username || 'admin', password: authData.password || 'admin123' }
                ]));
            }
        } catch(e){}
    }
    if (!localStorage.getItem('port_messages')) {
        localStorage.setItem('port_messages', JSON.stringify(defaultData.messages));
    }
    if (!localStorage.getItem('port_site')) {
        localStorage.setItem('port_site', JSON.stringify(defaultData.site));
    }
    if (!localStorage.getItem('port_projects')) {
        localStorage.setItem('port_projects', JSON.stringify(defaultData.projects));
    }
}

initData();
