# dawg4037.com

Personal site. Static HTML, no build step, no CMS, no database.
Served from GitHub Pages.

Previously WordPress on Flux — the rewrite removed roughly everything
that could break.

## Structure

```
.
├── index.html            # homepage
├── 404.html
├── CNAME                 # custom domain for GitHub Pages
├── css/
│   ├── style.css         # site styles
│   └── crt.css           # CRT terminal component
├── js/
│   ├── site.js           # faceplate port readout (homepage)
│   └── crt.js            # CRT terminal driver
├── whatiuse/
│   └── index.html        # hardware inventory + CRT
└── posts/
    ├── watch-it-morph.html
    ├── why-networking-and-security.html
    └── hosting-on-flux.html
```

## Design

Technical spec sheet, not neon cyberpunk. Light chassis-grey field with dark
instrument panels. Green is semantic — it only ever means *link up*.

- Type: IBM Plex (Condensed for display, Sans for prose, Mono for data)
- Signature elements: the rack faceplate (homepage) and the CRT terminal (What I Use)
- Sections are numbered as rack units (U1, U2, …)

## The CRT component

Drop a `.crt` block on any page, include `css/crt.css` and `js/crt.js`, and put
the boot script in a JSON block inside it:

```html
<div class="crt" data-loop="7000">
  <div class="screen booting">
    <div class="screen-inner"></div>
    <div class="mask"></div>
    <div class="scanlines"></div>
    <div class="roll"></div>
    <div class="glare"></div>
    <div class="vignette"></div>
  </div>
  <div class="chin">…</div>

  <script type="application/json">
  [
    ["line of text", "dim", 0]
  ]
  </script>
</div>
```

Each line is `[text, class, speed]`.
`class` is `""`, `"dim"`, `"warn"` or `"hi"`. `speed` is ms per character;
`0` prints the line instantly. `data-loop` is the pause before it restarts
(`0` to run once).

## Local preview

No build. Serve the folder:

```bash
python3 -m http.server 8000
```

## Deploy

Push to `main`. GitHub Pages does the rest.

## To do

- [ ] Migrate the three blog posts from the WordPress export (`posts/` are stubs)
- [ ] Add images
- [ ] Point DNS at GitHub Pages, then decommission the Flux instance
