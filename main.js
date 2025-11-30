// -----------------------------------------------------
// VARIÁVEIS GLOBAIS
// -----------------------------------------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let points = [];            // pontos de controle
let selectedPoint = null;   // ponto clicado
let dragging = false;

// Configurações
let curveType = "bezier";
let splineDegree = 3;
let splineStep = 80;

// Ajuste automático do canvas
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


// -----------------------------------------------------
// EVENTOS DO MENU LATERAL
// -----------------------------------------------------
document.getElementById("curveType").addEventListener("change", (e) => {
    curveType = e.target.value;
    toggleMenus();
    draw();
});

document.getElementById("weightSlider").addEventListener("input", (e) => {
    if (selectedPoint) {
        selectedPoint.weight = parseInt(e.target.value);
        document.getElementById("weightValue").textContent = selectedPoint.weight;
        draw();
    }
});

document.getElementById("splineDegree").addEventListener("input", (e) => {
    splineDegree = parseInt(e.target.value);
    draw();
});

document.getElementById("splineStep").addEventListener("input", (e) => {
    splineStep = parseInt(e.target.value);
    document.getElementById("stepValue").textContent = splineStep;
    draw();
});

document.getElementById("exportBtn").addEventListener("click", () => {
    const data = {
        type: curveType,
        points: points,
        splineDegree,
        splineStep
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curva.json";
    a.click();
});

// ⭐ NOVO BOTÃO: LIMPAR TELA
document.getElementById("clearBtn").addEventListener("click", () => {
    points = [];
    selectedPoint = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// Menu dinâmico
function toggleMenus() {
    document.getElementById("bezierMenu").classList.toggle("hidden", curveType !== "bezier");
    document.getElementById("splineMenu").classList.toggle("hidden", curveType !== "spline");
}


// -----------------------------------------------------
// EVENTOS DO MOUSE
// -----------------------------------------------------
canvas.addEventListener("mousedown", (e) => {
    const { x, y } = getMousePos(e);

    // Verifica se clicou em algum ponto
    for (let p of points) {
        if (dist(x, y, p.x, p.y) < 8) {
            selectedPoint = p;
            dragging = true;
            return;
        }
    }

    // Caso contrário, adiciona ponto novo
    points.push({ x, y, weight: 1 });
    draw();
});

canvas.addEventListener("mousemove", (e) => {
    if (dragging && selectedPoint) {
        const { x, y } = getMousePos(e);
        selectedPoint.x = x;
        selectedPoint.y = y;
        draw();
    }
});

canvas.addEventListener("mouseup", () => {
    dragging = false;
});


// -----------------------------------------------------
// FUNÇÕES DE CÁLCULO: BÉZIER (De Casteljau)
// -----------------------------------------------------
function deCasteljau(pts, t) {
    let temp = pts.map(p => ({ x: p.x, y: p.y }));

    for (let r = 1; r < pts.length; r++) {
        for (let i = 0; i < pts.length - r; i++) {
            temp[i].x = (1 - t) * temp[i].x + t * temp[i + 1].x;
            temp[i].y = (1 - t) * temp[i].y + t * temp[i + 1].y;
        }
    }

    return temp[0];
}


// -----------------------------------------------------
// FUNÇÕES DE CÁLCULO: SPLINE (B-SPLINE CÚBICA)
// -----------------------------------------------------
function bspline(t, degree, points) {
    let n = points.length - 1;

    function N(i, k, t) {
        if (k === 0) {
            return (t >= i && t < i + 1) ? 1 : 0;
        }
        return (
            ((t - i) / k) * N(i, k - 1, t) +
            ((i + k + 1 - t) / k) * N(i + 1, k - 1, t)
        );
    }

    let x = 0, y = 0;
    for (let i = 0; i <= n; i++) {
        let b = N(i, degree, t);
        x += b * points[i].x;
        y += b * points[i].y;
    }
    return { x, y };
}


// -----------------------------------------------------
// RENDERIZAÇÃO
// -----------------------------------------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length === 0) return;

    drawControlPoints();

    if (curveType === "bezier") drawBezier();
    else drawSpline();
}

function drawControlPoints() {
    ctx.fillStyle = "white";
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBezier() {
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let t = 0; t <= 1; t += 0.01) {
        const p = deCasteljau(points, t);
        if (t === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
}

function drawSpline() {
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.beginPath();

    let maxT = points.length + splineDegree + 1;

    for (let t = 0; t < maxT; t += (1 / splineStep)) {
        const p = bspline(t, splineDegree, points);
        if (t === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
}


// -----------------------------------------------------
// FUNÇÕES AUXILIARES
// -----------------------------------------------------
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}


// Inicializa
draw();
