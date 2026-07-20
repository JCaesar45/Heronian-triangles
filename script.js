document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("triangleCanvas");
  const ctx = canvas.getContext("2d");
  const btnGenerate = document.getElementById("btnGenerate");
  const btnAnimate = document.getElementById("btnAnimate");

  let currentTriangles = [];
  let animationFrameId = null;
  let morphProgress = 0;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 64;
    canvas.height = rect.height - 120;
    drawScene();
  }

  window.addEventListener("resize", resizeCanvas);
  setTimeout(resizeCanvas, 100);

  function drawTriangle(triangle, progress = 1) {
    const { a, b, c, area } = triangle;
    const s = (a + b + c) / 2;

    const maxDim = Math.max(a, b, c);
    const scale = (Math.min(canvas.width, canvas.height) * 0.6) / maxDim;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(cx - (a * scale) / 2, cy + (b * scale) / 3);
    ctx.lineTo(cx + (a * scale) / 2, cy + (b * scale) / 3);

    const thirdX =
      cx -
      (a * scale) / 2 +
      c * scale * Math.cos(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
    const thirdY =
      cy +
      (b * scale) / 3 -
      c * scale * Math.sin(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
    ctx.lineTo(
      thirdX * progress + cx * (1 - progress),
      thirdY * progress + cy * (1 - progress)
    );
    ctx.closePath();

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "rgba(212, 175, 55, 0.1)");
    gradient.addColorStop(1, "rgba(212, 175, 55, 0.02)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#d4af37";
    ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function drawScene() {
    if (currentTriangles.length > 0) {
      drawTriangle(currentTriangles[0]);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#333";
      ctx.font = "14px Inter";
      ctx.textAlign = "center";
      ctx.fillText(
        "Awaiting Generation...",
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }

  function updateTelemetry(triangle) {
    document.getElementById(
      "valSides"
    ).textContent = `${triangle.a}, ${triangle.b}, ${triangle.c}`;
    document.getElementById("valArea").textContent = triangle.area;
    document.getElementById("valPerimeter").textContent =
      triangle.a + triangle.b + triangle.c;
    document.getElementById("valPrimitive").textContent = "TRUE";
  }

  function renderList(triangles) {
    const list = document.getElementById("sequenceList");
    list.innerHTML = "";
    triangles.slice(0, 15).forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>[${t.a}, ${t.b}, ${t.c}]</span> <span>A: ${t.area}</span>`;
      li.addEventListener("click", () => {
        currentTriangles = [t];
        drawTriangle(t);
        updateTelemetry(t);
      });
      list.appendChild(li);
    });
  }

  btnGenerate.addEventListener("click", async () => {
    btnGenerate.textContent = "Computing...";
    btnGenerate.disabled = true;

    try {
      const response = await fetch("http://localhost:8000/generate?limit=25");
      const data = await response.json();
      currentTriangles = data;
      drawScene();
      updateTelemetry(data[0]);
      renderList(data);
    } catch (e) {
      console.error("API Unreachable, using fallback local generation");
      const fallback = [
        { a: 3, b: 4, c: 5, area: 6 },
        { a: 5, b: 5, c: 6, area: 12 },
        { a: 5, b: 5, c: 8, area: 12 },
        { a: 4, b: 13, c: 15, area: 24 },
        { a: 5, b: 12, c: 13, area: 30 }
      ];
      currentTriangles = fallback;
      drawScene();
      updateTelemetry(fallback[0]);
      renderList(fallback);
    } finally {
      btnGenerate.textContent = "Generate Sequence";
      btnGenerate.disabled = false;
    }
  });

  btnAnimate.addEventListener("click", () => {
    if (currentTriangles.length < 2) return;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    let idx = 0;
    const animate = () => {
      drawTriangle(currentTriangles[idx]);
      updateTelemetry(currentTriangles[idx]);
      idx = (idx + 1) % currentTriangles.length;
      animationFrameId = setTimeout(() => requestAnimationFrame(animate), 800);
    };
    animate();
  });
});
