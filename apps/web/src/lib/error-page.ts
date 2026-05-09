export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: dark;
        --bg: #071019;
        --panel: rgba(20, 30, 43, 0.78);
        --panel-border: rgba(255, 255, 255, 0.08);
        --text: #f5f7fb;
        --muted: rgba(220, 228, 239, 0.72);
        --primary-a: #7fd8ea;
        --primary-b: #4f8ec9;
        --shadow: 0 32px 80px -28px rgba(0, 0, 0, 0.72);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        color: var(--text);
        font: 16px/1.6 Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top, rgba(96, 180, 214, 0.18), transparent 28%),
          radial-gradient(circle at bottom left, rgba(201, 173, 89, 0.09), transparent 24%),
          linear-gradient(180deg, #0b1420, var(--bg));
        overflow: hidden;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        background-image:
          linear-gradient(rgba(127, 216, 234, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(127, 216, 234, 0.05) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: radial-gradient(circle at center, black 35%, transparent 82%);
        pointer-events: none;
      }
      .card {
        position: relative;
        width: min(100%, 44rem);
        text-align: center;
        padding: 3rem 2rem;
        border-radius: 2rem;
        border: 1px solid var(--panel-border);
        background:
          linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03)),
          var(--panel);
        backdrop-filter: blur(20px) saturate(135%);
        box-shadow: var(--shadow);
      }
      .card::after {
        content: "";
        position: absolute;
        inset: 1px;
        border-radius: inherit;
        border: 1px solid rgba(255, 255, 255, 0.04);
        pointer-events: none;
      }
      .icon {
        width: 4.25rem;
        height: 4.25rem;
        margin: 0 auto 1.5rem;
        display: grid;
        place-items: center;
        border-radius: 1.25rem;
        color: #0d1622;
        background: linear-gradient(135deg, var(--primary-a), var(--primary-b));
        box-shadow: 0 18px 50px -18px rgba(95, 183, 219, 0.58);
      }
      .eyebrow {
        margin: 0 0 1rem;
        color: var(--primary-a);
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.32em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font: 600 clamp(2.4rem, 6vw, 4rem)/0.98 Fraunces, "Iowan Old Style", "Times New Roman", serif;
        letter-spacing: -0.04em;
      }
      p {
        margin: 1.25rem auto 0;
        max-width: 34rem;
        color: var(--muted);
        font-size: 1.05rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
      }
      a, button {
        appearance: none;
        border: 0;
        font: inherit;
        cursor: pointer;
        text-decoration: none;
        padding: 0.9rem 1.35rem;
        border-radius: 0.95rem;
        transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease, opacity 180ms ease;
      }
      a:hover, button:hover { transform: translateY(-1px); }
      .primary {
        color: #071019;
        background: linear-gradient(135deg, var(--primary-a), var(--primary-b));
        box-shadow: 0 16px 40px -18px rgba(95, 183, 219, 0.48);
      }
      .secondary {
        color: var(--text);
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.04);
      }
      @media (max-width: 640px) {
        .card { padding: 2.5rem 1.25rem; border-radius: 1.5rem; }
        p { font-size: 0.98rem; }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.3 3.3 1 18h22L13.7 3.3a2 2 0 0 0-3.4 0Z"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
      </div>
      <div class="eyebrow">Runtime Error</div>
      <h1>This page didn't load</h1>
      <p>Something interrupted the page while it was loading. You can retry safely, or head back to the homepage and continue browsing.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
