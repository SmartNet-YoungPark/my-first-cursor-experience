(function () {
  "use strict";

  const COLS = 10;
  const ROWS = 20;
  const CELL = 30;

  const COLORS = {
    I: "#00e5e5",
    O: "#f5d90a",
    T: "#a855f7",
    S: "#22c55e",
    Z: "#ef4444",
    J: "#3b82f6",
    L: "#f97316",
  };

  /** 4×4, 1 = 블록. O는 회전 1개만 사용 */
  const MATRICES = {
    I: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
    O: [
      [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    T: [
      [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    S: [
      [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    Z: [
      [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    J: [
      [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    L: [
      [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  };

  const TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

  const boardCanvas = document.getElementById("board");
  const nextCanvas = document.getElementById("next");
  if (!boardCanvas || !nextCanvas || !boardCanvas.getContext || !nextCanvas.getContext) {
    return;
  }
  const ctx = boardCanvas.getContext("2d");
  const nctx = nextCanvas.getContext("2d");
  if (!ctx || !nctx) {
    return;
  }

  const elScore = document.getElementById("score");
  const elLevel = document.getElementById("level");
  const elLines = document.getElementById("lines");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const btnResume = document.getElementById("btn-resume");
  const btnRestart = document.getElementById("btn-restart");

  let board = [];
  let bag = [];
  let score = 0;
  let linesTotal = 0;
  let level = 1;
  let paused = false;
  let gameOver = false;

  /** @type {{ type: string, rot: number, x: number, y: number } | null} */
  let piece = null;
  let nextType = "I";
  let dropAccum = 0;
  let softDrop = false;

  function randInt(n) {
    return (Math.random() * n) | 0;
  }

  function refillBag() {
    bag = TYPES.slice();
    for (let i = bag.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      const t = bag[i];
      bag[i] = bag[j];
      bag[j] = t;
    }
  }

  function pullFromBag() {
    if (bag.length === 0) refillBag();
    return bag.pop();
  }

  function matrixFor(type, rot) {
    const list = MATRICES[type];
    return list[rot % list.length];
  }

  function rotCount(type) {
    return MATRICES[type].length;
  }

  function collides(type, rot, x, y) {
    const m = matrixFor(type, rot);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!m[r][c]) continue;
        const gy = y + r;
        const gx = x + c;
        if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
        if (gy >= 0 && board[gy][gx]) return true;
      }
    }
    return false;
  }

  function mergePiece() {
    if (!piece) return;
    const m = matrixFor(piece.type, piece.rot);
    const color = piece.type;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!m[r][c]) continue;
        const gy = piece.y + r;
        const gx = piece.x + c;
        if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
          board[gy][gx] = color;
        }
      }
    }
  }

  function clearLines() {
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; ) {
      if (board[y].every((cell) => cell !== null)) {
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(null));
        cleared++;
      } else {
        y--;
      }
    }
    if (cleared > 0) {
      const table = [0, 100, 300, 500, 800];
      score += table[cleared] * level;
      linesTotal += cleared;
      level = Math.floor(linesTotal / 10) + 1;
      if (level > 20) level = 20;
    }
  }

  function dropIntervalSec() {
    const base = Math.max(0.05, 0.85 * Math.pow(0.88, level - 1));
    return softDrop ? base * 0.12 : base;
  }

  function spawnPiece(type) {
    const startX = 3;
    const startY = 0;
    if (collides(type, 0, startX, startY)) {
      return false;
    }
    piece = { type, rot: 0, x: startX, y: startY };
    return true;
  }

  function newPiece() {
    const t = nextType;
    nextType = pullFromBag();
    if (!spawnPiece(t)) {
      gameOver = true;
      showOverlay("게임 오버 · 점수 " + score, false);
      return;
    }
  }

  function tryMove(dx, dy) {
    if (!piece) return false;
    const nx = piece.x + dx;
    const ny = piece.y + dy;
    if (collides(piece.type, piece.rot, nx, ny)) return false;
    piece.x = nx;
    piece.y = ny;
    return true;
  }

  function tryRotate(dir) {
    if (!piece) return false;
    const rc = rotCount(piece.type);
    const newRot = (piece.rot + (dir > 0 ? 1 : -1) + rc * 4) % rc;
    const kicks = [0, -1, 1, -2, 2];
    for (let i = 0; i < kicks.length; i++) {
      const k = kicks[i];
      if (!collides(piece.type, newRot, piece.x + k, piece.y)) {
        piece.rot = newRot;
        piece.x += k;
        return true;
      }
      if (!collides(piece.type, newRot, piece.x + k, piece.y - 1)) {
        piece.rot = newRot;
        piece.x += k;
        piece.y -= 1;
        return true;
      }
    }
    return false;
  }

  function hardDrop() {
    if (!piece || gameOver) return;
    let n = 0;
    while (tryMove(0, 1)) n++;
    score += n * 2;
    mergePiece();
    clearLines();
    updateHud();
    piece = null;
    newPiece();
  }

  function lockPiece() {
    if (!piece) return;
    mergePiece();
    clearLines();
    updateHud();
    piece = null;
    newPiece();
  }

  function tickDrop() {
    if (!piece || gameOver) return;
    if (!tryMove(0, 1)) {
      lockPiece();
    } else if (softDrop) {
      score += 1;
    }
  }

  function updateHud() {
    elScore.textContent = String(score);
    elLevel.textContent = String(level);
    elLines.textContent = String(linesTotal);
  }

  function showOverlay(title, showResume) {
    overlayTitle.textContent = title;
    overlay.classList.remove("hidden");
    btnResume.style.display = showResume ? "block" : "none";
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function resetGame() {
    board = [];
    for (let y = 0; y < ROWS; y++) {
      board.push(Array(COLS).fill(null));
    }
    bag = [];
    refillBag();
    score = 0;
    linesTotal = 0;
    level = 1;
    gameOver = false;
    paused = false;
    piece = null;
    softDrop = false;
    dropAccum = 0;
    nextType = pullFromBag();
    newPiece();
    updateHud();
    hideOverlay();
  }

  function drawCell(context, x, y, color, alpha) {
    const pad = 1;
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.fillRect(x * CELL + pad, y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    context.strokeStyle = "rgba(255,255,255,0.25)";
    context.lineWidth = 1;
    context.strokeRect(x * CELL + pad, y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    context.globalAlpha = 1;
  }

  function ghostY() {
    if (!piece) return 0;
    let gy = piece.y;
    while (!collides(piece.type, piece.rot, piece.x, gy + 1)) gy++;
    return gy;
  }

  function drawBoard() {
    ctx.fillStyle = "#0a0c10";
    ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(COLS * CELL, y * CELL);
      ctx.stroke();
    }

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = board[y][x];
        if (cell) drawCell(ctx, x, y, COLORS[cell], 1);
      }
    }

    if (piece && !gameOver) {
      const gy = ghostY();
      const m = matrixFor(piece.type, piece.rot);
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!m[r][c]) continue;
          const bx = piece.x + c;
          const by = gy + r;
          if (by >= 0 && by < ROWS) {
            drawCell(ctx, bx, by, COLORS[piece.type], 0.22);
          }
        }
      }
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!m[r][c]) continue;
          const bx = piece.x + c;
          const by = piece.y + r;
          if (by >= 0 && by < ROWS) {
            drawCell(ctx, bx, by, COLORS[piece.type], 1);
          }
        }
      }
    }
  }

  function drawNext() {
    const nw = nextCanvas.width;
    const nh = nextCanvas.height;
    nctx.fillStyle = "#0a0c10";
    nctx.fillRect(0, 0, nw, nh);
    const m = matrixFor(nextType, 0);
    const cs = 24;
    let minC = 4;
    let maxC = -1;
    let minR = 4;
    let maxR = -1;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (m[r][c]) {
          minC = Math.min(minC, c);
          maxC = Math.max(maxC, c);
          minR = Math.min(minR, r);
          maxR = Math.max(maxR, r);
        }
      }
    }
    const bw = maxC - minC + 1;
    const bh = maxR - minR + 1;
    const ox = (nw - bw * cs) / 2 - minC * cs;
    const oy = (nh - bh * cs) / 2 - minR * cs;
    const color = COLORS[nextType];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!m[r][c]) continue;
        const px = ox + c * cs;
        const py = oy + r * cs;
        nctx.fillStyle = color;
        nctx.fillRect(px + 1, py + 1, cs - 2, cs - 2);
        nctx.strokeStyle = "rgba(255,255,255,0.25)";
        nctx.strokeRect(px + 1, py + 1, cs - 2, cs - 2);
      }
    }
  }

  function draw() {
    drawBoard();
    drawNext();
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused && !gameOver && piece) {
      dropAccum += dt;
      const interval = dropIntervalSec();
      while (dropAccum >= interval) {
        dropAccum -= interval;
        tickDrop();
      }
    }
    draw();
    requestAnimationFrame(frame);
  }

  function applyKey(code, down) {
    switch (code) {
      case "ArrowLeft":
        if (down && !paused && !gameOver) tryMove(-1, 0);
        break;
      case "ArrowRight":
        if (down && !paused && !gameOver) tryMove(1, 0);
        break;
      case "ArrowDown":
        softDrop = down;
        break;
      case "ArrowUp":
        if (down && !paused && !gameOver) tryRotate(1);
        break;
      case "Space":
        if (down && !paused && !gameOver) hardDrop();
        break;
      default:
        break;
    }
  }

  window.addEventListener("keydown", (ev) => {
    if (ev.code === "KeyP") {
      if (gameOver) return;
      paused = !paused;
      if (paused) showOverlay("일시정지", true);
      else hideOverlay();
      return;
    }
    if (ev.code === "Space") ev.preventDefault();
    if (ev.repeat && (ev.code === "ArrowLeft" || ev.code === "ArrowRight" || ev.code === "ArrowUp")) return;
    applyKey(ev.code, true);
  });

  window.addEventListener("keyup", (ev) => {
    applyKey(ev.code, false);
  });

  window.addEventListener("blur", () => {
    softDrop = false;
  });

  btnResume.addEventListener("click", () => {
    paused = false;
    hideOverlay();
  });

  btnRestart.addEventListener("click", () => {
    resetGame();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay && !gameOver) {
      paused = false;
      hideOverlay();
    }
  });

  boardCanvas.addEventListener("click", () => {
    boardCanvas.focus();
  });

  resetGame();
  requestAnimationFrame(frame);
})();
