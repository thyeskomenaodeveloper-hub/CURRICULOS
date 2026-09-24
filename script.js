// Estado global
let currentUser = null;
let currentCv = {
    title: "Meu Primeiro Currículo",
    data: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        summary: "",
        experiences: [],
        education: [],
        skills: ""
    },
    style: {
        primaryColor: "#0f172a",
        fontFamily: "'Inter', sans-serif"
    }
};

// Navegação entre views
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    lucide.createIcons();
}

// Autenticação (Simulação)
function toggleAuthMode(e) {
    e.preventDefault();
    const isLogin = document.getElementById('authTitle').innerText === "Acesse sua conta";
    document.getElementById('authTitle').innerText = isLogin ? "Crie sua conta" : "Acesse sua conta";
    document.getElementById('authSubmitBtn').innerText = isLogin ? "Cadastrar" : "Entrar";
    document.getElementById('nameGroup').style.display = isLogin ? "flex" : "none";
}

function handleAuth(e) {
    e.preventDefault();
    currentUser = { name: "Usuário Teste" };
    document.getElementById('userNameDisplay').innerText = `Olá, ${currentUser.name}`;
    switchView('dashboardView');
    renderDashboard();
}

function logout() {
    currentUser = null;
    switchView('landingView');
}

// Dashboard
function renderDashboard() {
    const grid = document.getElementById('resumesGrid');
    grid.innerHTML = `
        <div class="resume-card" onclick="openEditor()">
            <div class="resume-card-title">${currentCv.title}</div>
            <div class="resume-card-date">Última edição: Hoje</div>
            <div class="resume-card-actions">
                <button class="btn-secondary" onclick="event.stopPropagation()">PDF</button>
                <button class="btn-primary" onclick="event.stopPropagation()">Editar</button>
            </div>
        </div>
    `;
}

function openEditor() {
    switchView('editorView');
    setStep(1);
    renderFormFromState();
    updatePreview();
}

// Editor
function setStep(step) {
    document.querySelectorAll('.step-tab').forEach((tab, index) => {
        tab.classList.toggle('active', index === step - 1);
    });
    document.querySelectorAll('.step-pane').forEach((pane, index) => {
        pane.classList.toggle('hidden', index !== step - 1);
    });
    lucide.createIcons();
}

function updateProgress() {
    let filled = 0;
    const data = currentCv.data;
    if (data.fullName) filled++;
    if (data.jobTitle) filled++;
    if (data.email) filled++;
    const progress = Math.min((filled / 3) * 100, 100);
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').innerText = `Currículo ${Math.round(progress)}% completo`;
}

// Sincronizar Estado a partir dos Inputs
function saveAndRender() {
    currentCv.data.fullName = document.getElementById('fullName').value;
    currentCv.data.jobTitle = document.getElementById('jobTitle').value;
    currentCv.data.email = document.getElementById('email').value;
    currentCv.data.phone = document.getElementById('phone').value;
    currentCv.data.location = document.getElementById('location').value;
    currentCv.data.website = document.getElementById('website').value;
    currentCv.data.summary = document.getElementById('summary').value;
    currentCv.data.skills = document.getElementById('skills').value;
    
    currentCv.style.primaryColor = document.getElementById('primaryColor').value;
    currentCv.style.fontFamily = document.getElementById('fontFamily').value;

    // Coletar Experiências
    currentCv.data.experiences = [];
    document.querySelectorAll('#experiencesContainer .dynamic-item').forEach(item => {
        currentCv.data.experiences.push({
            company: item.querySelector('.exp-company').value,
            role: item.querySelector('.exp-role').value,
            period: item.querySelector('.exp-period').value,
            desc: item.querySelector('.exp-desc').value
        });
    });

    // Coletar Formação
    currentCv.data.education = [];
    document.querySelectorAll('#educationContainer .dynamic-item').forEach(item => {
        currentCv.data.education.push({
            inst: item.querySelector('.edu-inst').value,
            course: item.querySelector('.edu-course').value,
            period: item.querySelector('.edu-period').value
        });
    });

    updatePreview();
    updateProgress();
}

// Atualizar Preview em Tempo Real
function updatePreview() {
    document.getElementById('pvName').innerText = currentCv.data.fullName || "SEU NOME COMPLETO";
    document.getElementById('pvTitle').innerText = currentCv.data.jobTitle || "CARGO DESEJADO";
    document.getElementById('pvEmail').innerText = currentCv.data.email || "seu@email.com";
    document.getElementById('pvPhone').innerText = currentCv.data.phone || "(00) 00000-0000";
    document.getElementById('pvLocation').innerText = currentCv.data.location || "Cidade - UF";
    document.getElementById('pvWebsite').innerText = currentCv.data.website || "linkedin.com/in/perfil";
    document.getElementById('pvSummary').innerText = currentCv.data.summary || "Preencha seus dados para ver seu currículo aqui.";
    
    // Skills
    const skillsContainer = document.getElementById('pvSkills');
    skillsContainer.innerHTML = '';
    if (currentCv.data.skills.trim()) {
        const skills = currentCv.data.skills.split(',').map(s => s.trim()).filter(s => s);
        skillsContainer.innerText = skills.join(', ');
    } else {
        skillsContainer.innerText = "Adicione suas habilidades...";
    }

    // Experiências Preview
    const expContainer = document.getElementById('pvExperiences');
    expContainer.innerHTML = '';
    if (currentCv.data.experiences.length > 0) {
        currentCv.data.experiences.forEach(exp => {
            if (exp.company || exp.role) {
                const div = document.createElement('div');
                div.className = 'cv-item';
                div.innerHTML = `
                    <div class="cv-item-header">
                        <span>${exp.role || 'Cargo'} ${exp.company ? ' - ' + exp.company : ''}</span>
                        <span>${exp.period || ''}</span>
                    </div>
                    <div class="cv-item-desc">${exp.desc || ''}</div>
                `;
                expContainer.appendChild(div);
            }
        });
    } else {
        expContainer.innerHTML = '<div class="cv-item-desc">Adicione suas experiências profissionais...</div>';
    }

    // Formação Preview
    const eduContainer = document.getElementById('pvEducation');
    eduContainer.innerHTML = '';
    if (currentCv.data.education.length > 0) {
        currentCv.data.education.forEach(edu => {
            if (edu.inst || edu.course) {
                const div = document.createElement('div');
                div.className = 'cv-item';
                div.innerHTML = `
                    <div class="cv-item-header">
                        <span>${edu.course || 'Curso'}</span>
                        <span>${edu.period || ''}</span>
                    </div>
                    <div class="cv-item-sub">${edu.inst || ''}</div>
                `;
                eduContainer.appendChild(div);
            }
        });
    } else {
        eduContainer.innerHTML = '<div class="cv-item-desc">Adicione sua formação acadêmica...</div>';
    }

    // Estilos
    const preview = document.getElementById('resumePreview');
    preview.style.fontFamily = currentCv.style.fontFamily;
    document.getElementById('cvHeader').style.borderColor = currentCv.style.primaryColor;
}

// Renderizar Formulário do Estado (ao abrir)
function renderFormFromState() {
    document.getElementById('fullName').value = currentCv.data.fullName;
    document.getElementById('jobTitle').value = currentCv.data.jobTitle;
    document.getElementById('email').value = currentCv.data.email;
    document.getElementById('phone').value = currentCv.data.phone;
    document.getElementById('location').value = currentCv.data.location;
    document.getElementById('website').value = currentCv.data.website;
    document.getElementById('summary').value = currentCv.data.summary;
    document.getElementById('skills').value = currentCv.data.skills;

    document.getElementById('primaryColor').value = currentCv.style.primaryColor;
    document.getElementById('fontFamily').value = currentCv.style.fontFamily;

    // Experiências
    const expContainer = document.getElementById('experiencesContainer');
    expContainer.innerHTML = '';
    if (currentCv.data.experiences.length === 0) {
        addExperienceData();
    } else {
        currentCv.data.experiences.forEach(exp => addExperienceData(exp));
    }

    // Formação
    const eduContainer = document.getElementById('educationContainer');
    eduContainer.innerHTML = '';
    if (currentCv.data.education.length === 0) {
        addEducationData();
    } else {
        currentCv.data.education.forEach(edu => addEducationData(edu));
    }
}

// Dynamic Items com dados
function addExperienceData(data = { company: '', role: '', period: '', desc: '' }) {
    const container = document.getElementById('experiencesContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <button class="btn-remove" onclick="this.parentElement.remove(); saveAndRender();"><i data-lucide="trash-2"></i></button>
        <div class="form-group"><label>Empresa</label><input type="text" class="exp-company" value="${data.company}" oninput="saveAndRender()"></div>
        <div class="form-group"><label>Cargo</label><input type="text" class="exp-role" value="${data.role}" oninput="saveAndRender()"></div>
        <div class="form-group"><label>Período</label><input type="text" class="exp-period" value="${data.period}" oninput="saveAndRender()"></div>
        <div class="form-group"><label>Atividades</label><textarea class="exp-desc" rows="2" oninput="saveAndRender()">${data.desc}</textarea></div>
    `;
    container.appendChild(div);
    lucide.createIcons();
    saveAndRender();
}

function addEducationData(data = { inst: '', course: '', period: '' }) {
    const container = document.getElementById('educationContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <button class="btn-remove" onclick="this.parentElement.remove(); saveAndRender();"><i data-lucide="trash-2"></i></button>
        <div class="form-group"><label>Instituição</label><input type="text" class="edu-inst" value="${data.inst}" oninput="saveAndRender()"></div>
        <div class="form-group"><label>Curso</label><input type="text" class="edu-course" value="${data.course}" oninput="saveAndRender()"></div>
        <div class="form-group"><label>Período</label><input type="text" class="edu-period" value="${data.period}" oninput="saveAndRender()"></div>
    `;
    container.appendChild(div);
    lucide.createIcons();
    saveAndRender();
}

function addExperience() { addExperienceData(); }
function addEducation() { addEducationData(); }

function generatePDF() {
    const element = document.getElementById('resumePreview');
    // Adiciona classe temporária para garantir estilo limpo no PDF
    element.style.boxShadow = "none";
    
    const opt = {
        margin:       0,
        filename:     `${currentCv.data.fullName || 'curriculo'}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, backgroundColor: '#ffffff' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.1)"; // Restaura a sombra na tela
    });
}

window.onload = () => lucide.createIcons();
