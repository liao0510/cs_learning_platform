# AGENTS.md — CS Interactive Learning Platform

## 1. Project Mission

Build and maintain a **Traditional Chinese (zh-TW) interactive computer science learning platform** for students. The website explains concepts with clear language, diagrams, flowcharts, formulas, worked examples, and optional interactive exercises.

The central development requirement is **repeatability**: future AI coding agents must be able to add new topics and visualizations following the same architecture and presentation rules, without redesigning existing pages or introducing incompatible technologies.

## 2. Technology and Deployment

- Use **HTML5, CSS3, and vanilla JavaScript (ES modules)** for the initial version.
- Keep the website **static and compatible with GitHub Pages**. Do not require a server, database, private API key, or Python runtime in production.
- Optional libraries for diagrams and equations may be used only when they provide clear value. Prefer lightweight, well-maintained libraries; document their versions and loading method in `README.md`. If external CDN libraries are used, include readable fallbacks when possible.
- Use **relative asset paths** so the site works under a repository subpath such as `https://username.github.io/repository-name/`.
- Do not add React, Vue, a build system, or a backend unless specifically requested by the user.
- Keep dependencies minimal; do not introduce a dependency just for a minor visual effect.

## 3. Learning Categories

Use stable English identifiers for internal names and Traditional Chinese for displayed titles.

| Slug | Display title | Example topics |
| --- | --- | --- |
| `data-structures` | 資料結構 | Array, Linked List, Stack, Queue, Tree, Graph, Hash Table |
| `programming` | 程式設計 | C pointer, address, array, stack/heap memory, `malloc`/`free`, memory safety |
| `algorithms` | 演算法 | Sorting, Binary Search, Big-O, Graph Traversal, Shortest Path |
| `operating-systems` | 作業系統 | Process/Thread, Scheduling, Virtual Memory, Deadlock |
| `networking` | 網路概論 | OSI, TCP/UDP, IP/CIDR, Routing, DNS |
| `wifi` | Wi-Fi 與無線網路 | FSPL, RSSI, SINR, Throughput, MCS, Wi-Fi 6/7, Mesh, Backhaul |

New categories are permitted only when the topic does not reasonably fit an existing category. Update navigation and documentation whenever adding a category.

## 4. Recommended Repository Structure

Use this structure as the default. If the repository already has a working structure, respect it and migrate only with explicit user approval.

```text
/
├── AGENTS.md
├── README.md
├── index.html
├── categories/
│   └── index.html                # Optional category index page
├── topics/
│   └── index.html                # Single reusable article page
├── data/
│   ├── categories.json
│   ├── topics.json               # Topic metadata / catalog
│   └── lessons/                  # Topic-specific structured data
│       └── <topic-slug>.json
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── catalog.js
│   ├── lesson-renderer.js
│   └── components/
│       ├── quiz.js
│       ├── diagram.js
│       └── calculator.js
├── assets/
│   ├── images/
│   └── diagrams/
└── docs/                         # Versioned documentation; may mirror GitHub Wiki
```

Prefer **data-driven topic pages** rendered by a shared template over copying an HTML file for every new lesson. Topic links should use a consistent format such as `topics/?id=sinr`. Validate query parameters and display a friendly error if a topic is missing. Use relative URLs; verify that direct loading works when deployed to GitHub Pages.

If JSON files are loaded via `fetch()`, test through a local HTTP server or deployed site; do not rely on opening `index.html` through `file://`.

## 5. Required Lesson Schema and Layout

Each lesson must have at least:

- `id`: unique lowercase kebab-case slug.
- `category`: one existing category slug.
- `title`: Traditional Chinese title.
- `summary`: one- or two-sentence introduction.
- `difficulty`: `beginner`, `intermediate`, or `advanced`.
- `keywords`: relevant Chinese and English search terms.
- `sections`: ordered learning sections, including conceptual explanation and a worked example.
- `takeaways`: 3–5 concise key points.
- `references`: authoritative source names and URLs when factual specifications or standards are discussed.

Recommended optional blocks: `diagram`, `flowchart`, `formula`, `comparison`, `interactive`, and `quiz`. Do not add empty placeholder blocks simply to fill the template.

The shared UI should consistently present:

1. Breadcrumb: home → category → topic.
2. Title, difficulty, tags, and short learning objective.
3. Conceptual explanations with short subsections.
4. One or more illustrative examples; relevant diagrams or flowcharts where useful.
5. Math formulas and variable definitions when applicable.
6. Key takeaway summary.
7. Optional mini-quiz and related topics.
8. Navigation back to category and other related topics.

Use stable metadata schema. If changing the schema, update the renderer, existing lessons, and documentation together.

## 6. Content Quality Rules

- Write student-facing material in **Taiwan Traditional Chinese**; give English technical terms on first mention, e.g. `訊號雜訊干擾比（SINR）`.
- Differentiate fundamental definitions, implementation choices, approximations, and examples.
- Never invent citations, experimental results, performance figures, standard requirements, or capabilities.
- Explain **assumptions, units, input ranges, and limitations** beside formulas or calculators.
- Keep code examples correct, minimal, and runnable when practical. Annotate key lines without overwhelming beginners.
- For C memory examples, distinguish stack vs heap, pointer vs pointed-to value, ownership and lifetime, and undefined behavior. Do not teach unsafe behavior as if it were reliable.
- For OS and networking, distinguish conceptual models from OS-, hardware-, driver-, or standard-specific behavior.
- For Wi-Fi topics, differentiate RSSI, SNR, SINR, PHY link rate, application throughput, access/backhaul capacity, and client demand. Never imply throughput is deterministically determined by SINR alone.
- Wi-Fi 6/7 technical claims, MCS tables, channel width, modulation, scheduling, and multi-link behavior must identify applicable standards, conditions, and implementation assumptions. Check up-to-date sources before adding version-specific claims.
- For FSPL/SINR/throughput formulas, define every symbol, ensure dimensional consistency, and show at least one checkable calculation if the topic is mathematical.
- Treat simulated predictions as model estimates, not real-world measured outcomes.
- Link to primary or reputable references when the lesson contains standards details or numerical claims. Respect copyright and do not copy long passages.

## 7. Visualizations and Interactions

- Use semantic HTML/CSS and accessible SVG for simple conceptual diagrams.
- Flowcharts should have logical reading order, clearly labeled arrows and steps, and accompanying text descriptions.
- Mathematical notation may use MathJax/KaTeX when warranted, but equations must also have plain-language explanations.
- Interactive demos must state what the user can change, what changes on screen, and what assumptions the model makes.
- For interactive algorithm animations, offer play/pause, reset, and step controls where appropriate; never make the core explanation depend on animation alone.
- Every chart or diagram needs a title, meaningful labels, appropriate units, and a textual alternative.
- Do not fabricate physical precision in Wi-Fi heatmaps. Label them as simulations and expose relevant parameters (e.g. transmit power, frequency, bandwidth, noise figure, obstacle-loss assumptions).
- Keep diagrams legible on mobile, keyboard navigable when interactive, and safe for reduced-motion preferences.

## 8. UI / UX and Accessibility

- Use a consistent site header, search/filter affordance, category navigation, and lesson template.
- Design mobile-first; support common desktop and phone screen sizes without horizontal page overflow.
- Centralize theme colors, spacing, and typography as CSS variables. Reuse components rather than duplicating styles.
- Use clear visual hierarchy and accessible color contrast. Never convey correctness by color alone.
- All buttons, inputs, tabs, quizzes, and interactive illustrations need visible labels and keyboard support.
- Use `lang="zh-Hant"`, descriptive document titles, headings in logical order, and alt text / text alternatives.
- Keep page loading lightweight and avoid excessive animation.

## 9. Quiz and Calculator Rules

- Quiz answers and explanations must be provided; support retry/reset.
- Do not treat ambiguous questions as having a single indisputable answer.
- Calculators must validate invalid, missing, and out-of-range inputs, and display units on results.
- Separate computational logic from DOM rendering. Prefer small pure functions that can be tested.
- For Wi-Fi calculations, document whether dB/dBm conversions and interference aggregation are done in the linear domain.

## 10. Workflow for AI Agents

Before implementing any request:

1. Read this file, inspect the existing structure, and review a similar existing topic or component.
2. Identify the smallest change that accomplishes the request; preserve existing functionality and conventions.
3. If creating a lesson, select its category and unique slug; verify whether the topic already exists.
4. Prefer updating structured lesson data and shared components rather than duplicating page markup.
5. For visualizations, choose the simplest maintainable solution and document key assumptions.
6. Update category/topic indexes, internal links, search metadata, and related-topic navigation.
7. Update `README.md` and `docs/`/Wiki-facing documentation when behavior, structure, or usage changes.
8. Run available tests and perform a manual browser smoke test (including mobile layout and direct-link navigation). If tools are unavailable, clearly report what was not verified.
9. Summarize changed files, behavior, tests performed, and any assumptions or limitations.

Never silently remove content, rewrite unrelated modules, change established URLs, or introduce a new architecture in the course of a small feature request. Ask for approval when a change would significantly alter architecture or scope.

## 11. Minimum Acceptance Criteria

A new lesson or feature is complete only when:

- It opens successfully through the normal site navigation and a direct link.
- It uses the same layout and style as comparable existing pages.
- It is written in Taiwan Traditional Chinese and its technical content has been reviewed for accuracy.
- All formulas, diagrams, code snippets, and quiz answers are consistent with the explanations.
- Buttons and inputs function, and invalid input is handled.
- It is usable on both desktop and mobile and is accessible through keyboard navigation where applicable.
- Existing pages still work; broken links or console errors are resolved.
- Relevant indexes and project documentation are updated.

## 12. Initial MVP Scope

Implement the following topics first, with one shared template and a consistent homepage/category navigation:

1. 資料結構：Stack 與 Queue
2. 程式設計：C 語言記憶體配置、指標與 `malloc` / `free`
3. 演算法：Binary Search
4. 作業系統：Process 與 Thread
5. 網路概論：OSI 七層模型
6. Wi-Fi：RSSI、SNR 與 SINR 的差異
7. Wi-Fi：Throughput、MCS 與速率限制
8. Wi-Fi：Wi-Fi 5 / 6 / 7 比較

The MVP should demonstrate at least one flowchart, one explanatory diagram, one formula with a worked example, and one functional interactive exercise or quiz. Advanced Wi-Fi simulation and live backends are **future enhancements**, not prerequisites for the initial submission.

## 13. Documentation and GitHub Pages

- Keep `README.md` useful for visitors: mission, features, site URL, local development instructions, file structure, and how to add a lesson.
- Use `docs/` for version-controlled technical documentation. If GitHub Wiki is used, keep it consistent with the repository and avoid contradictory instructions.
- GitHub Pages must publish a browseable public site with working static assets and direct lesson links.
- Do not put secrets, access tokens, or private datasets in the repository.

## 14. Definition of Done for This Assignment

The repository should demonstrate **rule-guided extensibility**: after the initial site exists, an AI agent can follow this file to add a new topic, update navigation and documentation, and maintain consistent design and code conventions without starting over.


## 15. Subcategory Taxonomy (Required)

- Use `data/subcategories.json` as the single source of truth for subcategories, and `data/categories.json` for top-level categories.
- Each subcategory has `id`, `category`, `title`, and `description`; ids must be unique kebab-case slugs.
- Each lesson **must** declare a `subcategory` value matching an existing entry whose `category` equals the lesson's `category`.
- Category pages must automatically render subcategory groups from JSON, including empty groups (mark them as planned, never imply completed content).
- Do not rename existing slugs without preserving working links and migrating all references.
- Whenever adding a lesson, update `data/topics.json` and add `data/lessons/<id>.json`, with the same `id`, `category`, `subcategory`, and title. Never hardcode article listings in HTML.

## 16. Formula → Interactive Calculator (Required)

- **For every lesson that introduces an evaluable numerical formula, provide a working interactive calculator** using the shared calculator component. Purely symbolic/definition equations may be exempt only with an explicit explanation of why a numeric calculator is not meaningful.
- Each calculator must include: named variables and units, editable values, reasonable defaults, formula shown beside it, Compute and Reset buttons, outputs with units, and an accessible error message for bad or missing inputs.
- Prefer a named, pure computation in `js/components/calculator.js`; keep mathematical computation separate from DOM. New calculator types must have self-tests in `tests.mjs` and documented assumptions.
- All formulas must clearly identify restrictions (e.g. positive distance/frequency, bandwidth > 0, nonnegative interference); distinguish theoretical upper bounds, PHY link rate, and actual application throughput.
- Convert dBm powers to linear mW before summing interference/noise. `SINR_dB = S_dBm - 10*log10(sum(I_mW)+N_mW)`. Avoid adding values expressed in dBm directly.
- For example, FSPL: `32.44 + 20log10(f_MHz) + 20log10(d_km)`; thermal noise `-174 + 10log10(B_Hz) + NF_dB`; Shannon capacity `B_Hz * log2(1+10^(SINR_dB/10))` is only an ideal theoretical bound, not Wi-Fi throughput.
- For MCS / OFDM rate demonstrations, explicitly expose subcarriers (Nsd), bits per subcarrier, code rate, number of spatial streams, and OFDM symbol duration, and state that overhead, error rate, interference scheduling, and implementation constraints are excluded. Do not promise real throughput or treat SINR as a deterministic MCS predictor.
- Calculator widgets must work without external APIs, with keyboard navigation, and on mobile.

## 17. Content & Interactive Demos

- Each category should eventually include a meaningful visualization; the initial build includes stack/queue operations, binary-search stepping, memory-layout diagram, OSI layer diagram, and Wi-Fi calculators.
- New interactive demos must be self-contained, have a Reset action, and include a readable description of behavior and limitations.
- Make sure `npm` is not required to view the published site; simple Node built-in smoke tests may be used locally for pure formulas and JSON consistency.
- Keep index/category/topic views shareable with query-string links and preserve behavior under GitHub Pages repository subpaths.

## 18. Expanded Curriculum and Coverage (2026-11)

- All 35 entries in `data/subcategories.json` have a corresponding in-depth *overview guide* named `guide-<category>-<subcategory>.json` and indexed in `data/topics.json`. Original 8 topic lessons remain intact.
- Overview guides contain multiple concept sections, a worked example, three to five takeaways, a self-check quiz and category-specific reference links. They are **not** substitutes for future topic-by-topic deep dives.
- When expanding a concept within a guide into a standalone lesson, preserve the overview, assign the same `category` and `subcategory`, create a new unique `id`, and check whether a specialized lesson already exists.
- A lesson that presents a numeric equation must supply a tested working calculator; current additional calculator IDs are `cidr`, `schedule`, `paging`, `log-steps`, `wifi-airtime`, `backhaul`, `qam`, `dbm-mw`, and `allocation`. Maintain formula notes and input bounds.
- Do not declare any subcategory complete solely because its overview exists. Future content can add diagrams, deeper examples, lab activities and topic-focused lessons in each subcategory.
