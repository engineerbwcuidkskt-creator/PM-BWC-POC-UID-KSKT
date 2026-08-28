let visits = [
  { id: 1, agenda: 'Review kesiapan PM BWC', area: 'UP3 Banjarmasin', unit: 'ULP Banjarmasin Kota', date: '2024-08-26', completedDate: '2024-08-26', pic: 'Dimas Pratama', status: 'Selesai', progress: 100 },
  { id: 2, agenda: 'Verifikasi data aset jaringan', area: 'UP3 Palangkaraya', unit: 'ULP Palangkaraya', date: '2024-08-28', pic: 'Siti Aulia', status: 'Dalam Proses', progress: 65 },
  { id: 3, agenda: 'Evaluasi pelaksanaan PM', area: 'UP3 Kotabaru', unit: 'ULP Batulicin', date: '2024-08-29', pic: 'Rizky Hadi', status: 'Terjadwal', progress: 0 },
  { id: 4, agenda: 'Monitoring tindak lanjut temuan', area: 'UP3 Barabai', unit: 'ULP Kandangan', date: '2024-08-30', pic: 'Nadia Putri', status: 'Dalam Proses', progress: 45 },
  { id: 5, agenda: 'Validasi progres pemeliharaan', area: 'UP3 Kuala Kapuas', unit: 'ULP Pulang Pisau', date: '2024-09-02', pic: 'Agus Salim', status: 'Selesai', progress: 100 },
  { id: 6, agenda: 'Sinkronisasi rencana kerja', area: 'UP3 Sampit', unit: 'ULP Sampit Kota', date: '2024-09-03', pic: 'Maya Lestari', status: 'Terlambat', progress: 30 },
  { id: 7, agenda: 'Audit dokumentasi PM BWC', area: 'UP3 Banjarmasin', unit: 'ULP Banjarbaru', date: '2024-09-04', pic: 'Fajar Nugraha', status: 'Terjadwal', progress: 0 },
  { id: 8, agenda: 'Review inspeksi gardu', area: 'UP3 Muara Teweh', unit: 'ULP Muara Teweh', date: '2024-09-05', pic: 'Dimas Pratama', status: 'Terjadwal', progress: 0 },
  { id: 9, agenda: 'Koordinasi pekerjaan preventif', area: 'UP3 Tanjung', unit: 'ULP Tanjung', date: '2024-09-06', pic: 'Siti Aulia', status: 'Selesai', progress: 100 },
  { id: 10, agenda: 'Pemeriksaan laporan bulanan', area: 'UP3 Palangkaraya', unit: 'ULP Kuala Kurun', date: '2024-09-09', pic: 'Rizky Hadi', status: 'Selesai', progress: 100 },
  { id: 11, agenda: 'Kunjungan evaluasi ULP', area: 'UP3 Kotabaru', unit: 'ULP Kotabaru', date: '2024-09-10', pic: 'Nadia Putri', status: 'Dalam Proses', progress: 70 },
  { id: 12, agenda: 'Finalisasi rekomendasi', area: 'UP3 Barabai', unit: 'ULP Rantau', date: '2024-09-11', pic: 'Agus Salim', status: 'Selesai', progress: 100 }
];
const masterStorageKey = 'pm-bwc-master-data';
const legacyMaster = typeof masterData !== 'undefined' ? { up3: masterData.up3Options.map(name => ({ name, ulp: masterData.ulpOptions[name] || [] })) } : { up3: [
  { name: 'UP3 Banjarmasin', ulp: ['ULP Banjarmasin Kota', 'ULP Banjarmasin Selatan', 'ULP Banjarbaru', 'ULP Martapura', 'ULP Marabahan'] },
  { name: 'UP3 Kuala Kapuas', ulp: ['ULP Kuala Kapuas', 'ULP Pulang Pisau', 'ULP Tamiang Layang'] },
  { name: 'UP3 Palangkaraya', ulp: ['ULP Palangkaraya', 'ULP Kasongan', 'ULP Kuala Kurun', 'ULP Tewah'] },
  { name: 'UP3 Barabai', ulp: ['ULP Barabai', 'ULP Kandangan', 'ULP Rantau', 'ULP Negara'] },
  { name: 'UP3 Batulicin', ulp: ['ULP Batulicin', 'ULP Kotabaru', 'ULP Pelaihari'] },
  { name: 'UP3 Pangkalan Bun', ulp: ['ULP Pangkalan Bun', 'ULP Kumai', 'ULP Sukamara', 'ULP Lamandau'] }
] };
const masterSource = window.PM_BWC_MASTER_DATA || legacyMaster;
let appMasterData = masterSource;
const storedMaster = localStorage.getItem(masterStorageKey);
if (storedMaster) {
  try { appMasterData = JSON.parse(storedMaster); } catch { localStorage.removeItem(masterStorageKey); }
}
let up3Options = appMasterData.up3.map(item => item.name);
let ulpOptions = Object.fromEntries(appMasterData.up3.map(item => [item.name, item.ulp]));
const storedVisits = localStorage.getItem('pm-bwc-visits');
if (storedVisits) {
  try { visits = JSON.parse(storedVisits); } catch { localStorage.removeItem('pm-bwc-visits'); }
}
let chart;
const statusClass = { 'Selesai': 'done', 'Dalam Proses': 'process', 'Terjadwal': 'planned', 'Terlambat': 'late' };
const formatDate = date => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
const icon = name => `<i data-lucide="${name}"></i>`;
const saveVisits = () => localStorage.setItem('pm-bwc-visits', JSON.stringify(visits));
const saveMaster = () => localStorage.setItem(masterStorageKey, JSON.stringify(appMasterData));
function syncMasterOptions() {
  up3Options = appMasterData.up3.map(item => item.name);
  ulpOptions = Object.fromEntries(appMasterData.up3.map(item => [item.name, item.ulp]));
}
const displayDate = date => date ? formatDate(date) : '-';
const displayDateRange = visit => `${displayDate(visit.date)} - ${displayDate(visit.estimatedEndDate || visit.date)}`;
const displayDevice = visit => visit.device ? `${visit.device}<br><small class="subline">${visit.deviceModel || '-'}</small>` : `${visit.bwcType && visit.bwcType !== '-' ? `BWC Hytera: ${visit.bwcType}` : 'BWC: -'}<br><small class="subline">${visit.pocType && visit.pocType !== '-' ? `POC Hytera: ${visit.pocType}` : 'POC: -'}</small>`;
const todayIso = () => new Date().toISOString().slice(0, 10);
function updateRealtimeClock() {
  const now = new Date();
  document.querySelector('#realtimeTime').textContent = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  document.querySelector('#realtimeDate').textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(now);
}
const normalizeVisitDates = visit => { if (!visit.estimatedEndDate || visit.estimatedEndDate < visit.date) visit.estimatedEndDate = visit.date; if (visit.completedDate && visit.completedDate < visit.date) visit.completedDate = visit.date; return visit; };
function populateOptions(selectedArea = up3Options[0], selectedUnit = '') {
  const areaSelect = document.querySelector('#areaSelect');
  const unitSelect = document.querySelector('#unitSelect');
  areaSelect.innerHTML = up3Options.map(area => `<option value="${area}">${area}</option>`).join('');
  areaSelect.value = up3Options.includes(selectedArea) ? selectedArea : up3Options[0];
  const units = ulpOptions[areaSelect.value] || [];
  unitSelect.innerHTML = units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
  unitSelect.value = units.includes(selectedUnit) ? selectedUnit : units[0];
}

function renderTable() {
  const query = document.querySelector('#searchInput').value.toLowerCase();
  const status = document.querySelector('#statusFilter').value;
  const filtered = visits.map(normalizeVisitDates).filter(v => (status === 'all' || v.status === status) && [v.agenda, v.area, v.unit, v.pic].join(' ').toLowerCase().includes(query));
  document.querySelector('#visitTable').innerHTML = filtered.map(v => `<tr><td>${v.agenda}</td><td>${v.area}<br><small class="subline">${v.unit}</small></td><td>${displayDateRange(v)}</td><td>${displayDate(v.completedDate)}</td><td>${displayDevice(v)}</td><td>${v.pic}</td><td><span class="status ${statusClass[v.status]} ">${v.status}</span></td><td><div class="progress-cell"><div class="progress-track"><div class="progress-fill ${v.status === 'Terlambat' ? 'warning' : ''}" style="width:${v.progress}%"></div></div><small>${v.progress}%</small></div></td><td><button class="row-menu" data-id="${v.id}" title="Edit agenda">${icon('pencil')}</button></td></tr>`).join('') || '<tr><td colspan="9" class="empty">Tidak ada agenda yang cocok.</td></tr>';
  document.querySelector('#tableCount').textContent = `Menampilkan ${filtered.length} dari ${filtered.length} agenda`;
  lucide.createIcons();
}
function updateMetrics() {
  const total = visits.length, done = visits.filter(v => v.status === 'Selesai').length, process = visits.filter(v => v.status === 'Dalam Proses').length, late = visits.filter(v => v.status === 'Terlambat').length;
  document.querySelector('#totalMetric').textContent = String(total).padStart(2, '0');
  document.querySelector('#doneMetric').textContent = String(done).padStart(2, '0');
  document.querySelector('#progressMetric').textContent = String(process).padStart(2, '0');
  document.querySelector('#lateMetric').textContent = String(late).padStart(2, '0');
}
function renderAreas() {
  document.querySelector('#areaList').innerHTML = up3Options.map(area => {
    const rows = visits.filter(v => v.area === area);
    const value = rows.length ? Math.round(rows.reduce((sum, v) => sum + v.progress, 0) / rows.length) : 0;
    const units = ulpOptions[area] || [];
    return `<div class="area-group"><div class="area-label"><span>${area}</span><strong>${value}% · ${rows.length} agenda</strong></div><div class="progress-track"><div class="progress-fill ${value < 40 ? 'warning' : ''}" style="width:${value}%"></div></div><div class="unit-list">${units.map(unit => `<span>${unit}</span>`).join('')}</div></div>`;
  }).join('');
}
let editingMaster = null;
function renderMasterTable() {
  const query = document.querySelector('#masterSearch').value.toLowerCase();
  const rows = appMasterData.up3.flatMap(area => [{ area: area.name, unit: '', isArea: true }, ...area.ulp.map(unit => ({ area: area.name, unit }))]).filter(row => `${row.area} ${row.unit}`.toLowerCase().includes(query));
  document.querySelector('#masterTable').innerHTML = rows.map(row => `<tr class="${row.isArea ? 'master-area-row' : ''}"><td>${row.area}</td><td>${row.unit || '<span class="subline">UP3 induk</span>'}</td><td><button class="row-menu master-edit" data-area="${row.area}" data-unit="${row.unit}" title="Edit lokasi">${icon('pencil')}</button><button class="row-menu master-delete" data-area="${row.area}" data-unit="${row.unit}" title="Hapus lokasi">${icon('trash-2')}</button></td></tr>`).join('') || '<tr><td colspan="3" class="empty">Lokasi tidak ditemukan.</td></tr>';
  document.querySelector('#masterCount').textContent = `${rows.filter(row => !row.isArea).length} ULP dari ${appMasterData.up3.length} UP3`;
  lucide.createIcons();
}
function openMasterModal(area = '', unit = '') {
  editingMaster = area ? { area, unit } : null;
  document.querySelector('#masterModalTitle').textContent = area ? 'Edit lokasi master' : 'Tambah lokasi master';
  document.querySelector('#masterType').value = area && unit ? 'ulp' : 'up3';
  document.querySelector('#masterName').value = unit || area;
  document.querySelector('#masterParent').value = area;
  document.querySelector('#masterParent').disabled = !area || !unit;
  document.querySelector('#masterName').placeholder = area && unit ? 'Nama ULP' : 'Nama UP3';
  document.querySelector('#masterBackdrop').classList.add('open');
}
function closeMasterModal() { document.querySelector('#masterBackdrop').classList.remove('open'); editingMaster = null; }
function refreshMasterViews() {
  syncMasterOptions(); saveMaster(); populateOptions(); renderAreas(); renderMasterTable();
  if (document.querySelector('#chartUp3Filter')) { populateChartFilters(); }
  updateChart();
}
function updateMasterType() {
  const isUlp = document.querySelector('#masterType').value === 'ulp';
  document.querySelector('#masterParent').disabled = !isUlp;
  document.querySelector('#masterParent').required = isUlp;
  if (!isUlp) document.querySelector('#masterParent').value = '';
  document.querySelector('#masterName').placeholder = isUlp ? 'Nama ULP' : 'Nama UP3';
}
function populateMasterParent() {
  document.querySelector('#masterParent').innerHTML = '<option value="">Pilih UP3</option>' + up3Options.map(area => `<option value="${area}">${area}</option>`).join('');
}
function saveMasterForm(event) {
  event.preventDefault();
  const type = document.querySelector('#masterType').value;
  const name = document.querySelector('#masterName').value.trim();
  const parent = document.querySelector('#masterParent').value;
  if (!name || (type === 'ulp' && !parent)) return;
  if (editingMaster) {
    const area = appMasterData.up3.find(item => item.name === editingMaster.area);
    if (type === 'up3') { area.name = name; visits.forEach(visit => { if (visit.area === editingMaster.area) visit.area = name; }); }
    else { const unitIndex = area.ulp.indexOf(editingMaster.unit); area.ulp[unitIndex] = name; visits.forEach(visit => { if (visit.area === editingMaster.area && visit.unit === editingMaster.unit) visit.unit = name; }); }
  } else if (type === 'up3') {
    if (appMasterData.up3.some(item => item.name.toLowerCase() === name.toLowerCase())) return toast('Nama UP3 sudah digunakan');
    appMasterData.up3.push({ name, ulp: [] });
  } else {
    const area = appMasterData.up3.find(item => item.name === parent);
    if (!area || area.ulp.some(unit => unit.toLowerCase() === name.toLowerCase())) return toast('Nama ULP sudah digunakan');
    area.ulp.push(name);
  }
  saveVisits(); refreshMasterViews(); closeMasterModal(); toast('Data master berhasil disimpan');
}
function deleteMasterLocation(areaName, unitName = '') {
  const used = visits.some(visit => visit.area === areaName && (!unitName || visit.unit === unitName));
  if (used) return toast('Lokasi masih dipakai agenda dan tidak dapat dihapus');
  const area = appMasterData.up3.find(item => item.name === areaName);
  if (unitName) area.ulp = area.ulp.filter(unit => unit !== unitName);
  else appMasterData.up3 = appMasterData.up3.filter(item => item.name !== areaName);
  refreshMasterViews(); toast('Lokasi berhasil dihapus');
}
function createChart() {
  const ctx = document.querySelector('#progressChart');
  chart = new Chart(ctx, { type: 'bar', data: { labels: [], datasets: [
    { label: 'Selesai', data: [], backgroundColor: '#1aa3a8', borderRadius: 3, barThickness: 12 },
    { label: 'Dalam proses', data: [], backgroundColor: '#e8a547', borderRadius: 3, barThickness: 12 },
    { label: 'Terjadwal', data: [], backgroundColor: '#d9e8e6', borderRadius: 3, barThickness: 12 },
    { label: 'Terlambat', data: [], backgroundColor: '#df6c61', borderRadius: 3, barThickness: 12 }
  ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#092f38', padding: 10, displayColors: true, callbacks: { title: items => { const unit = chart.data.labels[items[0].dataIndex]; const area = up3Options.find(areaName => (ulpOptions[areaName] || []).includes(unit)); return `${area} · ${unit}`; } } } }, scales: { x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { color: '#8aa09f', font: { family: 'DM Sans', size: 10 }, maxRotation: 55, minRotation: 35 } }, y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, color: '#9aabaa', font: { size: 10 } }, grid: { color: '#edf3f2' }, border: { display: false } } } } });
}
function updateChart() {
  if (!chart) return;
  const selectedArea = document.querySelector('#chartUp3Filter').value;
  const selectedUnit = document.querySelector('#chartUlpFilter').value;
  const areas = selectedArea === 'all' ? up3Options : [selectedArea];
  const labels = selectedUnit === 'all' ? areas.flatMap(area => ulpOptions[area] || []) : [selectedUnit];
  const values = ['Selesai', 'Dalam Proses', 'Terjadwal', 'Terlambat'].map(status => labels.map(unit => visits.filter(v => v.unit === unit && v.status === status).length));
  chart.data.labels = labels;
  chart.data.datasets.forEach((dataset, index) => { dataset.data = values[index]; });
  chart.options.scales.y.max = Math.max(2, ...values.flat()) + 1;
  chart.update();
}
function populateChartFilters() {
  const areaFilter = document.querySelector('#chartUp3Filter');
  const unitFilter = document.querySelector('#chartUlpFilter');
  const currentArea = areaFilter.value;
  const currentUnit = unitFilter.value;
  areaFilter.innerHTML = '<option value="all">Semua UP3</option>' + up3Options.map(area => `<option value="${area}">${area}</option>`).join('');
  areaFilter.value = up3Options.includes(currentArea) ? currentArea : 'all';
  const updateUnits = () => {
    const units = areaFilter.value === 'all' ? up3Options.flatMap(area => ulpOptions[area] || []) : (ulpOptions[areaFilter.value] || []);
    unitFilter.innerHTML = '<option value="all">Semua ULP</option>' + units.map(unit => `<option value="${unit}">${unit}</option>`).join('');
    unitFilter.value = units.includes(currentUnit) ? currentUnit : 'all';
    updateChart();
  };
  if (!areaFilter.dataset.bound) {
    areaFilter.addEventListener('change', updateUnits);
    unitFilter.addEventListener('change', updateChart);
    areaFilter.dataset.bound = 'true';
  }
  updateUnits();
}
let editingId = null;
function openModal(visit = null) {
  editingId = visit ? visit.id : null;
  document.querySelector('#modalEyebrow').textContent = visit ? 'EDIT AGENDA' : 'AGENDA BARU';
  document.querySelector('#modalTitle').textContent = visit ? 'Edit kunjungan' : 'Tambah kunjungan';
  document.querySelector('#deleteButton').style.display = visit ? 'inline-flex' : 'none';
  const form = document.querySelector('#visitForm');
  populateOptions(visit?.area, visit?.unit);
  ['agenda', 'date', 'estimatedEndDate', 'completedDate', 'pic', 'status', 'progress'].forEach(field => { form.elements[field].value = visit ? (visit[field] || (field === 'estimatedEndDate' ? visit.date : '')) : field === 'progress' ? 0 : ''; });
  form.elements.device.value = visit ? (visit.device || (visit.bwcType && visit.bwcType !== '-' ? 'BWC Hytera' : 'POC Hytera')) : 'BWC Hytera';
  document.querySelector('#deviceSelect').dispatchEvent(new Event('change'));
  form.elements.deviceModel.value = visit ? (visit.deviceModel || visit.bwcType || visit.pocType || 'Hytera SC580') : 'Hytera SC580';
  form.elements.estimatedEndDate.min = form.elements.date.value;
  document.querySelector('#modalBackdrop').classList.add('open');
}
function closeModal() { document.querySelector('#modalBackdrop').classList.remove('open'); }
function toast(message) { const el = document.querySelector('#toast'); el.querySelector('span').textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2800); }
async function exportExcel() {
  const workbook = new ExcelJS.Workbook(); workbook.creator = 'PM BWC Monitor';
  const sheet = workbook.addWorksheet('Timeline PM BWC'); sheet.views = [{ state: 'frozen', ySplit: 4 }];
  sheet.mergeCells('A1:M1'); sheet.getCell('A1').value = 'MONITORING TIMELINE PM BWC - UID KALSELTENG'; sheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } }; sheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF092F38' } }; sheet.getCell('A1').alignment = { horizontal: 'center' };
  sheet.mergeCells('A2:M2'); sheet.getCell('A2').value = 'Laporan kunjungan UP3 dan ULP | Periode Triwulan III 2024'; sheet.getCell('A2').font = { italic: true, color: { argb: 'FF607779' } };
  sheet.addRow([]); const header = sheet.addRow(['Agenda', 'UP3', 'ULP', 'Mulai Estimasi', 'Akhir Estimasi', 'Tanggal Selesai', 'Perangkat', 'Model', 'PIC', 'Status', 'Progress']); header.eachCell(cell => { cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1AA3A8' } }; });
  visits.forEach(v => sheet.addRow([v.agenda, v.area, v.unit, displayDate(v.date), displayDate(v.estimatedEndDate), displayDate(v.completedDate), v.device || (v.bwcType && v.bwcType !== '-' ? 'BWC Hytera' : 'POC Hytera'), v.deviceModel || v.bwcType || v.pocType || '-', v.pic, v.status, v.progress / 100]));
  sheet.columns = [{ width: 32 }, { width: 20 }, { width: 25 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 20 }, { width: 16 }, { width: 12 }]; sheet.getColumn(13).numFmt = '0%';
  sheet.eachRow((row, index) => { if (index > 4 && index % 2 === 1) row.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5FAF9' } }; }); });
  const imageId = workbook.addImage({ base64: document.querySelector('#progressChart').toDataURL('image/png'), extension: 'png' }); const chartSheet = workbook.addWorksheet('Chart Progres'); chartSheet.getCell('A1').value = 'PROGRES KUNJUNGAN PER MINGGU'; chartSheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF092F38' } }; chartSheet.addImage(imageId, 'A3', 'H20');
  const buffer = await workbook.xlsx.writeBuffer(); const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'PM-BWC-Timeline-UID-Kalselteng.xlsx'; link.click(); URL.revokeObjectURL(link.href); toast('File Excel dengan chart berhasil dibuat');
}
function exportPdf() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.setFontSize(16); pdf.setTextColor(9, 47, 56); pdf.text('Monitoring Timeline PM BWC - UID Kalselteng', 14, 15);
  pdf.setFontSize(9); pdf.setTextColor(96, 119, 121); pdf.text('Laporan kunjungan UP3 dan ULP | Periode Triwulan III 2024', 14, 22);
  pdf.autoTable({ startY: 29, head: [['Agenda', 'UP3 / ULP', 'Rentang estimasi', 'Selesai', 'Perangkat', 'PIC', 'Status', 'Progress']], body: visits.map(v => [v.agenda, `${v.area} / ${v.unit}`, displayDateRange(v), displayDate(v.completedDate), `${v.device || '-'} / ${v.deviceModel || '-'}`, v.pic, v.status || '-', `${v.progress}%`]), styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [26, 163, 168] }, alternateRowStyles: { fillColor: [245, 250, 249] } });
  pdf.save('PM-BWC-Timeline-UID-Kalselteng.pdf'); toast('File PDF berhasil dibuat');
}
function openReportModal() { document.querySelector('#reportBackdrop').classList.add('open'); }
function closeReportModal() { document.querySelector('#reportBackdrop').classList.remove('open'); }

document.querySelector('#searchInput').addEventListener('input', renderTable); document.querySelector('#statusFilter').addEventListener('change', renderTable); document.querySelector('#addButton').addEventListener('click', () => openModal()); document.querySelector('#closeModal').addEventListener('click', closeModal); document.querySelector('#cancelModal').addEventListener('click', closeModal); document.querySelector('#printButton').addEventListener('click', () => window.print()); document.querySelector('#downloadReportButton').addEventListener('click', openReportModal); document.querySelector('#exportButton').addEventListener('click', exportExcel); document.querySelector('#downloadExcel').addEventListener('click', () => { closeReportModal(); exportExcel(); }); document.querySelector('#downloadPdf').addEventListener('click', () => { closeReportModal(); exportPdf(); }); document.querySelector('#closeReportModal').addEventListener('click', closeReportModal); document.querySelector('#areaSelect').addEventListener('change', () => populateOptions(document.querySelector('#areaSelect').value)); document.querySelector('#modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') closeModal(); }); document.querySelector('#reportBackdrop').addEventListener('click', e => { if (e.target.id === 'reportBackdrop') closeReportModal(); });
document.querySelector('#visitTable').addEventListener('click', e => { const button = e.target.closest('.row-menu'); if (button) openModal(visits.find(v => v.id === Number(button.dataset.id))); });
document.querySelector('#visitForm').elements.date.addEventListener('change', e => { document.querySelector('#visitForm').elements.estimatedEndDate.min = e.target.value; });
document.querySelector('#visitForm').elements.estimatedEndDate.addEventListener('change', e => { const start = document.querySelector('#visitForm').elements.date.value; if (start && e.target.value < start) { e.target.setCustomValidity('Akhir estimasi harus sama atau setelah mulai estimasi.'); } else e.target.setCustomValidity(''); });
document.querySelector('#deviceSelect').addEventListener('change', e => { document.querySelector('#deviceModelSelect').innerHTML = e.target.value === 'BWC Hytera' ? '<option value="Hytera SC580">Hytera SC580</option>' : '<option value="Hytera PNC380">Hytera PNC380</option>'; });
document.querySelector('#deleteButton').addEventListener('click', () => { const visit = visits.find(v => v.id === editingId); if (visit && confirm(`Hapus agenda "${visit.agenda}"?`)) { visits = visits.filter(v => v.id !== editingId); saveVisits(); updateMetrics(); renderAreas(); renderTable(); updateChart(); closeModal(); toast('Agenda berhasil dihapus'); } });
document.querySelector('#visitForm').addEventListener('submit', e => { e.preventDefault(); const form = e.target; const completedDate = form.elements.completedDate.value || (form.elements.status.value === 'Selesai' ? todayIso() : ''); const data = normalizeVisitDates({ agenda: form.elements.agenda.value, area: form.elements.area.value, unit: form.elements.unit.value, date: form.elements.date.value, estimatedEndDate: form.elements.estimatedEndDate.value, completedDate, pic: form.elements.pic.value, status: completedDate ? 'Selesai' : form.elements.status.value, device: form.elements.device.value, deviceModel: form.elements.deviceModel.value, progress: Number(form.elements.progress.value) }); const wasEditing = Boolean(editingId); if (wasEditing) Object.assign(visits.find(v => v.id === editingId), data); else visits.unshift({ id: Date.now(), ...data }); saveVisits(); updateMetrics(); renderAreas(); renderTable(); updateChart(); closeModal(); form.reset(); toast(wasEditing ? 'Agenda berhasil diperbarui' : 'Agenda kunjungan berhasil ditambahkan'); editingId = null; });
document.querySelectorAll('.nav-item,.text-button').forEach(button => button.addEventListener('click', () => { const section = button.dataset.section; const isMaster = section === 'master'; document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.section === section)); document.querySelectorAll('.page-head,.metrics-grid,.content-grid,.table-panel,footer').forEach(element => { element.style.display = isMaster ? 'none' : ''; }); const masterSection = document.querySelector('#masterSection'); masterSection.classList.toggle('open', isMaster); masterSection.style.display = isMaster ? 'block' : 'none'; if (isMaster) renderMasterTable(); }));
document.querySelector('#masterSearch').addEventListener('input', renderMasterTable);
document.querySelector('#addMasterButton').addEventListener('click', () => { populateMasterParent(); openMasterModal(); });
document.querySelector('#closeMasterModal').addEventListener('click', closeMasterModal);
document.querySelector('#cancelMasterModal').addEventListener('click', closeMasterModal);
document.querySelector('#masterType').addEventListener('change', updateMasterType);
document.querySelector('#masterForm').addEventListener('submit', saveMasterForm);
document.querySelector('#masterBackdrop').addEventListener('click', event => { if (event.target.id === 'masterBackdrop') closeMasterModal(); });
document.querySelector('#masterTable').addEventListener('click', event => { const edit = event.target.closest('.master-edit'); const remove = event.target.closest('.master-delete'); if (edit) { populateMasterParent(); openMasterModal(edit.dataset.area, edit.dataset.unit); } if (remove) deleteMasterLocation(remove.dataset.area, remove.dataset.unit); });
visits = visits.map(normalizeVisitDates);
saveVisits();
syncMasterOptions(); populateMasterParent(); renderMasterTable(); updateMetrics(); renderAreas(); renderTable(); createChart(); populateChartFilters(); updateRealtimeClock(); lucide.createIcons();
setInterval(updateRealtimeClock, 1000);
