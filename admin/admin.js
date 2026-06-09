document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Logic
    const loginContainer = document.getElementById('loginContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    function checkAuth() {
        const isAuth = localStorage.getItem('port_isLoggedIn');
        if (isAuth === 'true') {
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'flex';
            loadAdminData();
        } else {
            loginContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let authData = JSON.parse(localStorage.getItem('port_auth'));
        if (!Array.isArray(authData)) {
            authData = [{ id: 1, username: authData.username || 'admin', password: authData.password || 'admin123' }];
        }
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        const validUser = authData.find(u => u.username === user && u.password === pass);

        if (validUser) {
            localStorage.setItem('port_isLoggedIn', 'true');
            localStorage.setItem('port_currentUser', validUser.id);
            checkAuth();
        } else {
            loginError.innerText = 'Username atau password salah!';
            loginError.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('port_isLoggedIn');
        localStorage.removeItem('port_currentUser');
        checkAuth();
    });

    // 2. Navigation
    const navLinks = document.querySelectorAll('.nav-links a[data-target]');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if(!targetId) return; // For the "Ke Website" link or logout
            
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            views.forEach(view => {
                if (view.id === targetId) view.classList.add('active');
                else view.classList.remove('active');
            });
            
            // Close sidebar on mobile after clicking
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 2.b Mobile Menu Toggle
    const adminMenuBtn = document.getElementById('adminMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    if(adminMenuBtn) {
        adminMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // 3. Load Data into Forms
    function loadAdminData() {
        // Load Site Content
        const siteData = JSON.parse(localStorage.getItem('port_site'));
        document.getElementById('siteHeroTitle').value = siteData.heroTitle;
        document.getElementById('siteHeroSubtitle').value = siteData.heroSubtitle;
        document.getElementById('siteAboutBio').value = siteData.aboutBio;
        document.getElementById('siteSkills').value = siteData.skills;
        document.getElementById('siteLinkedIn').value = siteData.social.linkedin;
        document.getElementById('siteGitHub').value = siteData.social.github;
        document.getElementById('siteInstagram').value = siteData.social.instagram;

        // Render Tables
        renderProjects();
        renderMessages();
        renderUsers();
    }

    // 4. Handle Site Content Submit
    document.getElementById('siteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const siteData = {
            heroTitle: document.getElementById('siteHeroTitle').value,
            heroSubtitle: document.getElementById('siteHeroSubtitle').value,
            aboutBio: document.getElementById('siteAboutBio').value,
            skills: document.getElementById('siteSkills').value,
            social: {
                linkedin: document.getElementById('siteLinkedIn').value,
                github: document.getElementById('siteGitHub').value,
                instagram: document.getElementById('siteInstagram').value
            }
        };
        localStorage.setItem('port_site', JSON.stringify(siteData));
        alert('Pengaturan halaman statis berhasil disimpan!');
    });

    // 6. Manage Projects
    const projectsTableBody = document.getElementById('projectsTableBody');
    const projectFormModal = document.getElementById('projectFormModal');
    const projectForm = document.getElementById('projectForm');
    
    document.getElementById('btnAddProject').addEventListener('click', () => {
        projectForm.reset();
        document.getElementById('projId').value = '';
        document.getElementById('projImg').value = '';
        document.getElementById('projectModalTitle').innerText = 'Tambah Proyek';
        projectFormModal.classList.add('show');
    });

    document.getElementById('closeProjectModal').addEventListener('click', () => {
        projectFormModal.classList.remove('show');
    });

    function renderProjects() {
        const projects = JSON.parse(localStorage.getItem('port_projects'));
        projectsTableBody.innerHTML = '';
        projects.forEach(p => {
            const firstImg = Array.isArray(p.image) ? p.image[0] : p.image;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${firstImg}" alt=""></td>
                <td>${p.title}</td>
                <td>${p.tech}</td>
                <td class="action-btns">
                    <button class="btn btn-edit" data-id="${p.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-delete" data-id="${p.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;"><i class="fas fa-trash"></i> Hapus</button>
                </td>
            `;
            projectsTableBody.appendChild(tr);
        });

        // Attach events
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => editProject(e.target.closest('button').dataset.id));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => deleteProject(e.target.closest('button').dataset.id));
        });
    }

    function editProject(id) {
        const projects = JSON.parse(localStorage.getItem('port_projects'));
        const p = projects.find(item => item.id == id);
        if(p) {
            document.getElementById('projId').value = p.id;
            document.getElementById('projTitle').value = p.title;
            document.getElementById('projDesc').value = p.description;
            document.getElementById('projTech').value = p.tech;
            
            document.getElementById('projImg').value = JSON.stringify(Array.isArray(p.image) ? p.image : [p.image]);
            document.getElementById('projImgUrl').value = '';
            document.getElementById('projImgFile').value = '';
            
            document.getElementById('projDemo').value = p.demoLink;
            document.getElementById('projGithub').value = p.githubLink;
            
            document.getElementById('projectModalTitle').innerText = 'Edit Proyek';
            projectFormModal.classList.add('show');
        }
    }

    function deleteProject(id) {
        if(confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            let projects = JSON.parse(localStorage.getItem('port_projects'));
            projects = projects.filter(item => item.id != id);
            localStorage.setItem('port_projects', JSON.stringify(projects));
            renderProjects();
        }
    }

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Cek apakah ada file yang diunggah
        const fileInput = document.getElementById('projImgFile');
        const urlInput = document.getElementById('projImgUrl').value;
        let existingImageRaw = document.getElementById('projImg').value;
        let existingImages = [];
        try {
            existingImages = existingImageRaw ? JSON.parse(existingImageRaw) : [];
        } catch(e) {
            if(existingImageRaw) existingImages = [existingImageRaw];
        }

        let newUrls = urlInput.trim() !== '' ? urlInput.split(',').map(s=>s.trim()) : [];
        
        if (fileInput.files && fileInput.files.length > 0) {
            const promises = [];
            for(let i=0; i<fileInput.files.length; i++) {
                promises.push(new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.readAsDataURL(fileInput.files[i]);
                }));
            }
            Promise.all(promises).then(base64Array => {
                // If editing and we selected new files, we can combine or just override. Let's override.
                // Wait, user might want to combine. Let's combine files with URLs
                const finalImages = [...base64Array, ...newUrls];
                saveProjectData(finalImages);
            });
        } else {
            const finalImages = newUrls.length > 0 ? newUrls : existingImages;
            if (finalImages.length === 0) {
                alert('Silakan unggah gambar atau masukkan URL gambar.');
                return;
            }
            saveProjectData(finalImages);
        }
    });

    function saveProjectData(imagesArray) {
        let projects = JSON.parse(localStorage.getItem('port_projects'));
        const id = document.getElementById('projId').value;
        
        const newProj = {
            id: id ? parseInt(id) : Date.now(),
            title: document.getElementById('projTitle').value,
            description: document.getElementById('projDesc').value,
            tech: document.getElementById('projTech').value,
            image: imagesArray,
            demoLink: document.getElementById('projDemo').value || '#',
            githubLink: document.getElementById('projGithub').value || '#'
        };

        if(id) {
            // Edit
            projects = projects.map(p => p.id == id ? newProj : p);
        } else {
            // Add
            projects.push(newProj);
        }

        localStorage.setItem('port_projects', JSON.stringify(projects));
        projectFormModal.classList.remove('show');
        renderProjects();
    }

    // Manage Messages
    const messagesTableBody = document.getElementById('messagesTableBody');
    function renderMessages() {
        const messages = JSON.parse(localStorage.getItem('port_messages')) || [];
        messagesTableBody.innerHTML = '';
        if(messages.length === 0) {
            messagesTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada pesan masuk.</td></tr>';
            return;
        }
        messages.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.date}</td>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.message}</td>
                <td class="action-btns">
                    <button class="btn btn-danger btn-delete-msg" data-id="${m.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;"><i class="fas fa-trash"></i> Hapus</button>
                </td>
            `;
            messagesTableBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-delete-msg').forEach(btn => {
            btn.addEventListener('click', (e) => deleteMessage(e.target.closest('button').dataset.id));
        });
    }

    function deleteMessage(id) {
        if(confirm('Hapus pesan ini?')) {
            let msgs = JSON.parse(localStorage.getItem('port_messages'));
            msgs = msgs.filter(m => m.id != id);
            localStorage.setItem('port_messages', JSON.stringify(msgs));
            renderMessages();
        }
    }

    // Manage Users
    const usersTableBody = document.getElementById('usersTableBody');
    const userFormModal = document.getElementById('userFormModal');
    const userForm = document.getElementById('userForm');
    
    document.getElementById('btnAddUser').addEventListener('click', () => {
        userForm.reset();
        document.getElementById('userId').value = '';
        document.getElementById('userModalTitle').innerText = 'Tambah User';
        userFormModal.classList.add('show');
    });

    document.getElementById('closeUserModal').addEventListener('click', () => {
        userFormModal.classList.remove('show');
    });

    function renderUsers() {
        const users = JSON.parse(localStorage.getItem('port_auth')) || [];
        usersTableBody.innerHTML = '';
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.username}</td>
                <td class="action-btns">
                    <button class="btn btn-edit-user" data-id="${u.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;"><i class="fas fa-edit"></i> Edit</button>
                    ${users.length > 1 ? `<button class="btn btn-danger btn-delete-user" data-id="${u.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;"><i class="fas fa-trash"></i> Hapus</button>` : ''}
                </td>
            `;
            usersTableBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => editUser(e.target.closest('button').dataset.id));
        });
        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => deleteUser(e.target.closest('button').dataset.id));
        });
    }

    function editUser(id) {
        const users = JSON.parse(localStorage.getItem('port_auth')) || [];
        const u = users.find(item => item.id == id);
        if(u) {
            document.getElementById('userId').value = u.id;
            document.getElementById('userUsername').value = u.username;
            document.getElementById('userPassword').value = ''; // Don't show password
            document.getElementById('userModalTitle').innerText = 'Edit User & Password';
            userFormModal.classList.add('show');
        }
    }

    function deleteUser(id) {
        const currentUser = localStorage.getItem('port_currentUser');
        if(id === currentUser) {
            alert('Anda tidak dapat menghapus akun Anda sendiri saat sedang login!');
            return;
        }
        if(confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            let users = JSON.parse(localStorage.getItem('port_auth')) || [];
            users = users.filter(item => item.id != id);
            localStorage.setItem('port_auth', JSON.stringify(users));
            renderUsers();
        }
    }

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let users = JSON.parse(localStorage.getItem('port_auth')) || [];
        const id = document.getElementById('userId').value;
        const newUsername = document.getElementById('userUsername').value;
        const newPassword = document.getElementById('userPassword').value;

        if(id) {
            // Edit
            users = users.map(u => {
                if(u.id == id) {
                    u.username = newUsername;
                    if(newPassword.trim() !== '') u.password = newPassword;
                }
                return u;
            });
        } else {
            // Add
            users.push({
                id: Date.now(),
                username: newUsername,
                password: newPassword
            });
        }

        localStorage.setItem('port_auth', JSON.stringify(users));
        userFormModal.classList.remove('show');
        renderUsers();
    });

    // Initial load
    checkAuth();
});
