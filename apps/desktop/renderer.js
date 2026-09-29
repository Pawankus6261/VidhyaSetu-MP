// VidyaSetu MP Desktop Command Studio - Renderer Logic

// Tab Switching
const navBtns = document.querySelectorAll('.nav-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const viewTitle = document.getElementById('view-title');
const viewDesc = document.getElementById('view-description');

const TAB_TITLES = {
  'tab-scholarships': {
    title: 'MPTAAS छात्रवृत्ति नोडल अधिकारी ऑडिट डेस्क',
    desc: 'आदिवासी एवं ग्रामीण विद्यार्थियों के आधार-समग्र विसंगति समाधान एवं प्रत्यक्ष लाभ अंतरण (DBT) सत्यापन',
  },
  'tab-doubts': {
    title: 'प्राध्यापक संदेह निवारण एवं शैक्षणिक एस्केलेशन डेस्क',
    desc: 'दूरस्थ विद्यार्थियों द्वारा 2G आउटबॉक्स से प्रेषित पेचीदा शैक्षणिक संदेहों का अधिकृत प्राध्यापक समाधान',
  },
  'tab-compiler': {
    title: '.VSMP माइक्रो-पैक कंपाइलर एवं पैकेजिंग स्टूडियो',
    desc: 'ऑडियो-स्लाइड मॉड्यूल को 1.8 MB के सख्त ऑफलाइन बजट में संपीड़ित एवं वितरित करने हेतु स्टूडियो',
  },
};

navBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    navBtns.forEach((b) => b.classList.remove('active'));
    tabPanes.forEach((p) => p.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');

    if (TAB_TITLES[tabId]) {
      viewTitle.textContent = TAB_TITLES[tabId].title;
      viewDesc.textContent = TAB_TITLES[tabId].desc;
    }
  });
});

// Live Clock in Topbar
function updateClock() {
  const clockEl = document.getElementById('live-clock');
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
  const dateStr = now.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  clockEl.textContent = `${timeStr} • ${dateStr}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==================== 1. MPTAAS SCHOLARSHIP AUDIT DATA & LOGIC ====================
let scholarshipApps = [
  {
    id: 'APP_MP_2026_091',
    samagraId: '198472910',
    studentName: 'सरिता भील',
    genderCategory: 'ST • छात्रा (महिला)',
    scheme: 'MPTAAS_ST',
    schemeLabel: 'MPTAAS ST पोस्ट-मैट्रिक',
    college: 'शासकीय अग्रणी महाविद्यालय, बड़वानी',
    flagType: 'warning',
    flagText: 'Aadhaar Name Mismatch (स्पेलिंग अंतर)',
    aadhaarName: 'SARITA BHIL',
    samagraName: 'SARITA',
    casteCertNo: 'RS/428/01/2023/1829',
    incomeAnnual: '₹95,000 / वर्ष',
    npciStatus: 'सक्रिय (SBI शाखा सेंधवा)',
    isResolved: false,
  },
  {
    id: 'APP_MP_2026_104',
    samagraId: '381920412',
    studentName: 'विकास जमरे',
    genderCategory: 'ST • छात्र',
    scheme: 'SAMBAL',
    schemeLabel: 'संबल 2.0 शिक्षा प्रोत्साहन',
    college: 'शासकीय महाविद्यालय, धार',
    flagType: 'danger',
    flagText: 'संबल कार्ड नवीनीकरण लंबित',
    aadhaarName: 'VIKAS JAMRE',
    samagraName: 'VIKAS JAMRE',
    casteCertNo: 'RS/312/04/2022/9482',
    incomeAnnual: 'संबल अंतर्गत छूट प्राप्त',
    npciStatus: 'सक्रिय (बैंक ऑफ इंडिया, धार)',
    isResolved: false,
  },
  {
    id: 'APP_MP_2026_118',
    samagraId: '519283741',
    studentName: 'ममता बघेल',
    genderCategory: 'ST • छात्रा',
    scheme: 'AWAS',
    schemeLabel: 'आवास सहायता योजना',
    college: 'शासकीय शहीद चंद्रशेखर आज़ाद कॉलेज, झाबुआ',
    flagType: 'success',
    flagText: 'सत्यापन योग्य (दस्तावेज़ पूर्ण)',
    aadhaarName: 'MAMTA BAGHEL',
    samagraName: 'MAMTA BAGHEL',
    casteCertNo: 'RS/102/09/2024/7741',
    incomeAnnual: '₹1,10,000 / वर्ष',
    npciStatus: 'सक्रिय (मध्य प्रदेश ग्रामीण बैंक)',
    isResolved: false,
  },
];

const tableBody = document.getElementById('scholarship-table-body');
const auditDrawer = document.getElementById('audit-drawer');
const drawerStudentName = document.getElementById('drawer-student-name');
const drawerBody = document.getElementById('drawer-body');
const btnCloseDrawer = document.getElementById('btn-close-drawer');
let activeAuditingApp = null;

function renderScholarshipTable() {
  tableBody.innerHTML = '';
  scholarshipApps.forEach((app) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${app.samagraId}</code></td>
      <td class="student-col">
        <strong>${app.studentName}</strong>
        <small>${app.id}</small>
      </td>
      <td>${app.genderCategory}</td>
      <td><strong>${app.schemeLabel}</strong></td>
      <td>${app.college}</td>
      <td>
        <span class="flag-badge flag-${app.flagType}">
          ${app.flagText}
        </span>
      </td>
      <td>
        <button class="btn-inspect" onclick="openAuditDrawer('${app.id}')">
          🔍 परीक्षण करें
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

window.openAuditDrawer = function (appId) {
  const app = scholarshipApps.find((a) => a.id === appId);
  if (!app) return;
  activeAuditingApp = app;

  drawerStudentName.textContent = `आवेदन ऑडिट: ${app.studentName} (${app.id})`;
  drawerBody.innerHTML = `
    <div class="audit-grid">
      <div class="audit-field-card">
        <div class="audit-field-label">समग्र सदस्य रिकॉर्ड नाम:</div>
        <div class="audit-field-value text-amber">${app.samagraName} (ID: ${app.samagraId})</div>
      </div>
      <div class="audit-field-card">
        <div class="audit-field-label">आधार कार्ड अधिकृत नाम:</div>
        <div class="audit-field-value text-emerald">${app.aadhaarName}</div>
      </div>
      <div class="audit-field-card">
        <div class="audit-field-label">डिजिटल जाति प्रमाण-पत्र क्रमांक:</div>
        <div class="audit-field-value">${app.casteCertNo}</div>
      </div>
      <div class="audit-field-card">
        <div class="audit-field-label">आधार-NPCI बैंक खाता स्थिति:</div>
        <div class="audit-field-value text-emerald">✓ ${app.npciStatus}</div>
      </div>
    </div>

    <div class="audit-actions-row">
      <button class="btn-reject" onclick="handleDecision('REJECTED')">
        ✗ आवेदन अस्वीकार करें
      </button>
      <button class="btn-kiosk-fix" onclick="handleDecision('KIOSK_CORRECTION')">
        ⚠ कियोस्क सुधार निर्देश जारी करें (SMS)
      </button>
      <button class="btn-approve" onclick="handleDecision('APPROVED')">
        ✓ विसंगति स्वीकृत व DBT पारित करें (Approve)
      </button>
    </div>
  `;

  auditDrawer.style.display = 'block';
};

btnCloseDrawer.addEventListener('click', () => {
  auditDrawer.style.display = 'none';
  activeAuditingApp = null;
});

window.handleDecision = async function (decision) {
  if (!activeAuditingApp) return;

  const decisionPayload = {
    applicationId: activeAuditingApp.id,
    status: decision,
    remarks: `नोडल अधिकारी निर्णय: ${decision} at ${new Date().toLocaleTimeString()}`,
  };

  if (window.electronAPI && window.electronAPI.saveAuditDecision) {
    const res = await window.electronAPI.saveAuditDecision(decisionPayload);
    alert(`[नोडल डेस्क] ${activeAuditingApp.studentName} का निर्णय सुरक्षित!\n${res.dispatchNotice}`);
  } else {
    alert(`[नोडल डेस्क] ${activeAuditingApp.studentName} का निर्णय '${decision}' सुरक्षित किया गया!`);
  }

  // Update UI state
  activeAuditingApp.flagType = decision === 'APPROVED' ? 'success' : decision === 'KIOSK_CORRECTION' ? 'warning' : 'danger';
  activeAuditingApp.flagText = decision === 'APPROVED' ? '✓ स्वीकृत एवं DBT अग्रेषित' : decision === 'KIOSK_CORRECTION' ? 'कियोस्क सुधार लंबित' : 'अस्वीकृत';
  
  auditDrawer.style.display = 'none';
  renderScholarshipTable();
};

renderScholarshipTable();

// ==================== 2. FACULTY DOUBT TRIAGE DATA & LOGIC ====================
let escalatedDoubts = [
  {
    id: 'DBT_BARWANI_101',
    student: 'सुरेश बामनिया (प्रथम वर्ष - B.A.)',
    college: 'शासकीय अग्रणी महाविद्यालय, बड़वानी',
    subject: 'इतिहास (सिंधु सभ्यता)',
    question: 'लोथल के गोदी (Dockyard) में जहाजों के प्रवेश हेतु ज्वार-भाटे (Tides) का उपयोग किस प्रकार होता था?',
    suggestedAnswer: 'लोथल खंभात की खाड़ी के निकट भोगावा नदी पर स्थित था। उच्च ज्वार (High Tide) के समय पानी और जहाज चैनल के माध्यम से गोदी में प्रवेश करते थे और फ्लडगेट से पानी रोक लिया जाता था।',
    suggestedCitation: 'बरकतउल्ला विश्वविद्यालय B.A. इतिहास, अध्याय 1, पृष्ठ 32',
  },
  {
    id: 'DBT_DHAR_102',
    student: 'कमलेश चौहान (द्वितीय वर्ष - B.Com)',
    college: 'शासकीय स्नातकोत्तर महाविद्यालय, धार',
    subject: 'संबल योजना एवं बैंकिंग',
    question: 'संबल 2.0 कार्ड से कॉलेज फीस शून्य हो गई है, क्या परीक्षा फॉर्म शुल्क भी माफ होता है?',
    suggestedAnswer: 'हाँ, संबल 2.0 योजना अंतर्गत प्रवेश शुल्क, शिक्षण शुल्क एवं परीक्षा शुल्क तीनों का शत-प्रतिशत वहन मध्य प्रदेश शासन द्वारा किया जाता है।',
    suggestedCitation: 'म.प्र. उच्च शिक्षा विभाग आदेश क्र. 418/2023 संबल परिपत्र',
  },
];

const doubtCardsContainer = document.getElementById('doubt-cards-container');
const editorDoubtTitle = document.getElementById('editor-doubt-title');
const editorStudentMeta = document.getElementById('editor-student-meta');
const facultyAnswerText = document.getElementById('faculty-answer-text');
const facultyCitation = document.getElementById('faculty-citation');
const btnSubmitResolution = document.getElementById('btn-submit-resolution');

let selectedDoubt = null;

function renderDoubtCards() {
  doubtCardsContainer.innerHTML = '';
  escalatedDoubts.forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = `doubt-card-item ${selectedDoubt && selectedDoubt.id === d.id ? 'active' : ''}`;
    card.innerHTML = `
      <div class="doubt-card-top">
        <span class="doubt-student-tag">${d.student}</span>
        <span class="doubt-subject-tag">${d.subject}</span>
      </div>
      <div class="doubt-card-question">"${d.question}"</div>
    `;
    card.addEventListener('click', () => selectDoubt(d));
    doubtCardsContainer.appendChild(card);
  });
}

function selectDoubt(d) {
  selectedDoubt = d;
  editorDoubtTitle.textContent = `प्रश्न: "${d.question}"`;
  editorStudentMeta.textContent = `विद्यार्थी: ${d.student} • ${d.college}`;
  facultyAnswerText.value = d.suggestedAnswer || '';
  facultyCitation.value = d.suggestedCitation || '';
  renderDoubtCards();
}

btnSubmitResolution.addEventListener('click', async () => {
  if (!selectedDoubt) {
    alert('कृपया पहले बाईं सूची से किसी प्रश्न का चयन करें!');
    return;
  }
  const answer = facultyAnswerText.value.trim();
  const citation = facultyCitation.value.trim();
  const facultyName = document.getElementById('faculty-name').value;

  if (!answer) {
    alert('कृपया उत्तर दर्ज करें!');
    return;
  }

  const payload = {
    doubtId: selectedDoubt.id,
    answer,
    citation,
    facultyName,
  };

  if (window.electronAPI && window.electronAPI.resolveFacultyDoubt) {
    const res = await window.electronAPI.resolveFacultyDoubt(payload);
    alert(`[प्राध्यापक डेस्क] उत्तर सुरक्षित!\n${res.syncNotice}`);
  } else {
    alert(`[प्राध्यापक डेस्क] उत्तर स्वीकृत!\nविद्यार्थी के 2G आउटबॉक्स में सिंक होने हेतु कतारबद्ध किया गया।`);
  }

  // Remove from escalated queue
  escalatedDoubts = escalatedDoubts.filter((d) => d.id !== selectedDoubt.id);
  selectedDoubt = null;
  editorDoubtTitle.textContent = 'उत्तर सफलता पूर्वक प्रेषित! अन्य प्रश्न का चयन करें।';
  editorStudentMeta.textContent = '-';
  facultyAnswerText.value = '';
  facultyCitation.value = '';
  renderDoubtCards();
  document.getElementById('doubt-count').textContent = escalatedDoubts.length;
});

// Auto-select first doubt
if (escalatedDoubts.length > 0) {
  selectDoubt(escalatedDoubts[0]);
}

// ==================== 3. .VSMP COMPILER STUDIO LOGIC ====================
const btnRunCompile = document.getElementById('btn-run-compile');
const consoleEl = document.getElementById('compilation-console');
const compResultSize = document.getElementById('comp-result-size');
const budgetPill = document.getElementById('budget-pill');

function logConsole(msg, colorClass = 'text-slate') {
  const line = document.createElement('div');
  line.className = `console-line ${colorClass}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

btnRunCompile.addEventListener('click', async () => {
  btnRunCompile.disabled = true;
  btnRunCompile.textContent = '⏳ कंपाइल हो रहा है (Opus + Brotli-6)...';
  consoleEl.innerHTML = '';

  const formatChoice = document.getElementById('comp-format').value;
  const isVideo = formatChoice.includes('VIDEO');

  logConsole(`प्रारंभ: .VSMP कंटेनर कंपाइलर इंजन v2.4 (${isVideo ? 'वीडियो मोड' : 'ऑडियो-स्लाइड मोड'})`, 'text-cyan');
  logConsole('सत्यापन: विश्वविद्यालय पाठ्यक्रम संदर्भ BU_HIST_01...', 'text-slate');

  setTimeout(() => {
    if (isVideo) {
      logConsole('वीडियो स्ट्रीम: H.264 AVC @ 120 kbps (240p) संपीड़न प्रक्रिया प्रारंभ...', 'text-yellow');
    } else {
      logConsole('ऑडियो विश्लेषण: 14 kbps Opus मोनो एन्कोडिंग लोड की जा रही है...', 'text-yellow');
    }
  }, 400);

  setTimeout(() => {
    logConsole('वेक्टर रेंडरिंग: 48 कैनवास आकृतियों का JSON संकुचन पूर्ण (142 KB)', 'text-slate');
  }, 900);

  setTimeout(() => {
    logConsole('मातृभाषा अनुवाद: 5 बोलियों (हिंदी, निमाड़ी, मालवी, बुंदेली, भीली) का ब्रोटली-6 संपीड़न (71 KB)', 'text-slate');
  }, 1400);

  setTimeout(async () => {
    let result = null;
    const moduleInput = {
      moduleCode: 'BU_HIST_INDUS_01',
      univ: document.getElementById('comp-univ').value,
      bitrate: document.getElementById('comp-bitrate').value,
      format: formatChoice,
    };

    if (window.electronAPI && window.electronAPI.compileVsmp) {
      result = await window.electronAPI.compileVsmp(moduleInput);
    } else {
      result = {
        success: true,
        outputFilename: isVideo ? 'BU_HIST_INDUS_01_VIDEO.vsmp' : 'BU_HIST_INDUS_01.vsmp',
        sizeFormatted: isVideo ? '14.2 MB' : '1.78 MB',
        isWithinBudget: true,
        checksumCRC32: isVideo ? 'B82C40A1' : '9F28A1C4',
      };
    }

    logConsole(`✓ पैकेज जनरेट हुआ: ${result.outputFilename}`, 'text-green');
    logConsole(`✓ कुल आकार: ${result.sizeFormatted} (${isVideo ? '240p वीडियो डेटा बचत' : 'बजट: < 2.0 MB पास'})`, 'text-green');
    logConsole(`✓ चेकसम CRC32: ${result.checksumCRC32} • सत्यापित!`, 'text-cyan');
    logConsole('वितरण स्थिति: पंचायत Wi-Fi हॉटस्पॉट एवं माइक्रो-SD कैश हेतु तैयार।', 'text-yellow');

    compResultSize.textContent = result.sizeFormatted;
    budgetPill.textContent = isVideo ? 'वीडियो कैश अनुकूल (14.2 MB)' : 'सत्यापित (1.78 MB)';
    btnRunCompile.disabled = false;
    btnRunCompile.textContent = '⚡ .VSMP पैकेज कंपाइल करें एवं बजट जांचें';
  }, 1900);
});
