document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. INISIALISASI BACKGROUND 3D (THREE.JS PARTICLES) ---
    const canvas = document.getElementById('bgCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Membuat partikel bintang 3D di ruang angkasa maya
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 3;

    // Interaksi Mouse menggerakkan partikel 3D
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // Loop Animasi 3D Three.js
    function animate3D() {
        requestAnimationFrame(animate3D);
        particlesMesh.rotation.y += 0.001 + (mouseX * 0.05);
        particlesMesh.rotation.x += 0.001 + (mouseY * 0.05);
        renderer.render(scene, camera);
    }
    animate3D();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // --- 2. EFEK INTERAKTIF 3D TILT PADA KARTU UTAMA ---
    const tiltCard = document.getElementById('tiltCard');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.clientX) / 35;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 35;
        tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
        tiltCard.style.transition = 'transform 0.5s ease';
    });

    tiltCard.addEventListener('mouseenter', () => {
        tiltCard.style.transition = 'none';
    });


    // --- 3. LOGIKA APLIKASI TODO (STATE & LOCALSTORAGE) ---
    const todoInput = document.getElementById('todoInput');
    const todoDate = document.getElementById('todoDate');
    const todoPriority = document.getElementById('todoPriority');
    const todoCategory = document.getElementById('todoCategory');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const taskCounter = document.getElementById('taskCounter');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importFile = document.getElementById('importFile');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressText');

    let tasks = JSON.parse(localStorage.getItem('immersive_3d_tasks')) || [];
    let currentFilter = 'all';
    let searchQuery = '';

    // Tema Terang / Gelap
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        let theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        themeToggleBtn.innerHTML = theme === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', theme);
    });

    function saveAndRender() {
        localStorage.setItem('immersive_3d_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function updateProgress() {
        if (tasks.length === 0) {
            progressBarFill.style.width = '0%';
            progressText.textContent = '0%';
            return;
        }
        const completedCount = tasks.filter(t => t.completed).length;
        const percentage = Math.round((completedCount / tasks.length) * 100);
        progressBarFill.style.width = percentage + '%';
        progressText.textContent = percentage + '%';
    }

    function renderTasks() {
        todoList.innerHTML = '';

        let filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;
            if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });

        const sortValue = sortSelect.value;
        if (sortValue === 'deadline') {
            filteredTasks.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(a.date) - new Date(b.date);
            });
        } else if (sortValue === 'priority') {
            const weight = { high: 3, medium: 2, low: 1 };
            filteredTasks.sort((a, b) => weight[b.priority] - weight[a.priority]);
        }

        if (filteredTasks.length === 0) {
            todoList.innerHTML = `<li style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 12px; cursor: default;">Tidak ada tugas ditemukan.</li>`;
            updateProgress();
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        filteredTasks.forEach((task) => {
            const originalIndex = tasks.indexOf(task);
            let warningText = '';
            let dateClass = 'todo-date';

            if (task.date && !task.completed) {
                const deadlineDate = new Date(task.date);
                deadlineDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    dateClass += ' overdue';
                    warningText = `<span class="todo-warning"><i class="fa-solid fa-triangle-exclamation"></i> Terlambat!</span>`;
                } else if (diffDays === 0) {
                    dateClass += ' overdue';
                    warningText = `<span class="todo-warning"><i class="fa-solid fa-clock"></i> Hari Ini!</span>`;
                } else if (diffDays === 1) {
                    warningText = `<span class="todo-warning" style="background:rgba(245, 158, 11, 0.2); color:#fbbf24;"><i class="fa-solid fa-bell"></i> Besok!</span>`;
                }
            }

            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('draggable', 'true');
            li.dataset.index = originalIndex;

            let priorityLabel = { high: 'Penting', medium: 'Sedang', low: 'Rendah' }[task.priority];

            li.innerHTML = `
                <div class="todo-left">
                    <i class="fa-solid fa-grip-vertical drag-handle" title="Geser posisi"></i>
                    <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${originalIndex})">
                    <div class="todo-details" onclick="toggleTask(${originalIndex})" style="cursor: pointer;">
                        <span class="todo-text">${escapeHtml(task.text)}</span>
                        <div class="todo-meta">
                            <span class="badge-category">${task.category || 'Umum'}</span>
                            <span class="badge-priority ${task.priority}">${priorityLabel}</span>
                            ${task.date ? `<span class="${dateClass}">${task.date}</span>` : ''}
                        </div>
                        ${warningText}
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteTask(${originalIndex})"><i class="fa-solid fa-trash-can"></i></button>
            `;

            // Drag and Drop
            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', originalIndex);
                setTimeout(() => li.classList.add('dragging'), 0);
            });
            li.addEventListener('dragend', () => li.classList.remove('dragging'));
            li.addEventListener('dragover', (e) => e.preventDefault());
            li.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                if (draggedIndex !== originalIndex) {
                    const movedItem = tasks.splice(draggedIndex, 1)[0];
                    tasks.splice(originalIndex, 0, movedItem);
                    saveAndRender();
                }
            });

            todoList.appendChild(li);
        });

        const activeCount = tasks.filter(t => !t.completed).length;
        taskCounter.textContent = `${activeCount} tugas tersisa`;
        updateProgress();
    }

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveAndRender();
    };

    function addTask() {
        const text = todoInput.value.trim();
        if (text !== '') {
            tasks.push({
                text: text,
                date: todoDate.value,
                priority: todoPriority.value,
                category: todoCategory.value,
                completed: false
            });
            todoInput.value = '';
            todoDate.value = '';
            saveAndRender();
        }
    }

    if (addTodoBtn && todoInput) {
        addTodoBtn.addEventListener('click', addTask);
        todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            tasks = tasks.tasks = tasks.filter(t => !t.completed);
            saveAndRender();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderTasks();
        });
    });

    if (searchInput) searchInput.addEventListener('input', (e) => { searchQuery = e.target.value.trim(); renderTasks(); });
    if (sortSelect) sortSelect.addEventListener('change', renderTasks);

    exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "taskflow_3d_backup.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    importFile.addEventListener('change', (event) => {
        const fileReader = new FileReader();
        if (event.target.files[0]) {
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = (e) => {
                try {
                    const importedTasks = JSON.parse(e.target.result);
                    if (Array.isArray(importedTasks)) {
                        tasks = importedTasks;
                        saveAndRender();
                        alert("Data 3D TaskFlow berhasil dipulihkan!");
                    } else {
                        alert("Format file tidak valid.");
                    }
                } catch (error) {
                    alert("Gagal membaca file JSON.");
                }
            };
        }
    });

    function escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    renderTasks();
});