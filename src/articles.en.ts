// English versions of the project articles. Same structure as articles.ts.
import type { Article } from "./articles";

export const articlesEn: Record<string, Article> = {
  kosmohackathon: {
    lead: "Three days, 40 teams in our case, and a task that was about economics, not rockets: how to keep an orbital fuel depot supplied. We plugged the case into our own simulation platform and defended a plan that survives the mandatory 2038 stress test.",
    role: "Interface and the pitch",
    team: "3 people, team «Rezonans»",
    duration: "3 days, Sep 18-20, 2026",
    links: [{ label: "KosmoHackathon in St. Petersburg", href: "https://xn--80aa2abijcbdyq6a.xn--p1ai/spb/" }],
    blocks: [
      { h: "The case" },
      {
        p: "A hackathon from the «Personnel for Space» program by Roscosmos, MIREA and the Ministry of Science, hybrid format: on site in St. Petersburg and online. 80 teams in total, 40 of them in our case.",
      },
      {
        p: "The case was called «Fuel Space Loop». There is a fuel depot in orbit, and demand grows from 100 to 390 tonnes a year between 2035 and 2040. You have to decide which supplies to sign in advance, what to keep as an option, and how to survive the mandatory 2038 stress: demand +15%, prices +25%, and the lunar channel under-delivers.",
      },
      {
        list: [
          "**A**: long-term Earth contract with take-or-pay",
          "**B**: flexible and expensive, no commitments",
          "**C**: a new Earth channel via an option",
          "**D**: the Moon, the cheapest tonne, but high CAPEX and only available from 2038",
          "**E**: emergency channel",
        ],
      },
      { h: "Where we started" },
      {
        p: "The organizers gave a starter pack of data and rules in Python. We didn't run or copy it: we moved the data and rules into our own C# stack ourselves, with provenance and a SHA manifest of the pack, so every number could be traced back to its source.",
      },
      {
        p: "We didn't start from zero. After ROBOZON we had **Praxis**, our own discrete-event simulation platform in C#/.NET. Our architect came up with it, and KosmoHackathon became its second domain after the sorting center.",
      },
      {
        flow: [{ title: "Model" }, { title: "Simulation" }, { title: "Experiments" }, { title: "Results" }, { title: "Report", accent: true }],
        caption: "The Praxis cycle. The report is built from saved run data, not filled in by hand",
      },
      { h: "Betting on the Moon" },
      {
        p: "At first we bet on the Moon: the lunar channel gives the cheapest tonne. But near the end of coding the lunar tactic failed the stress test, and about six hours before the code freeze we had to change the strategy.",
      },
      { quote: "The lunar strategy was the cheapest. It didn't survive the stress." },
      {
        p: "The key finding: no single fixed plan passes both the base scenario and the stress. If you size volumes for the stress, the tank overflows by 120 tonnes in the base case. So we submitted a base plan plus a reaction rule: everything decided before February 1, 2038 is frozen, and you can only react with capacity contracted in advance.",
      },
      { h: "Two layers of checks" },
      {
        compare: [
          {
            title: "Monthly balance",
            items: [
              "Opening stock, delivered, boiled off, served, closing stock",
              "Reserved, ordered, delivered and served tonnes tracked separately: paid capacity is not fuel yet",
              "Hard case rules: service level, 45-day reserve, CAPEX limits, emergency channel, losses under stress",
            ],
          },
          {
            title: "Event-driven simulation",
            items: [
              "The plan compiles into an operational model on the Praxis engine",
              "Berths, mission windows, transfers, boil-off between events, emergency orders on a threshold",
              "Stock is recalculated from scratch, independently of the monthly model",
            ],
          },
        ],
        caption: "The calculation model picks a strategy, the simulation checks whether the plan works delivery by delivery",
      },
      {
        p: "On top of that, a portfolio: 8 plans across 4 scenarios (base, mandatory stress, low and high demand), selected by the Pareto front with an explanation of what keeps each plan feasible. We didn't claim a global optimum. The risk register doesn't write prose, it re-runs the actual plan under supplier failure, lunar shortfall, demand growth and price growth.",
      },
      { h: "Engineering" },
      {
        list: [
          "An ADR for every decision, 30 records in three days",
          "Requirements traceability: all 20 rubric criteria in `requirements.csv`",
          "Determinism: 68 artifacts match byte for byte on a re-run",
          "An independent `verify.py` that re-derives the verdicts without calling the main core",
          "The solution builds its own report, and every parameter can be tweaked, up to new mission expansion inputs",
        ],
      },
      { h: "The final strategy" },
      {
        timeline: [
          { when: "2035", what: "Option on the new Earth channel C" },
          { when: "2036", what: "Storage upgrade" },
          { when: "2037", what: "Lunar plant" },
          { when: "2038", what: "Prepaid capacity reserve on B and E" },
          { when: "Feb 1, 2038", what: "If the stress hits, the operator calls the prepaid reserve, no new orders needed" },
        ],
        caption: "Balanced, with a reserve paid for in advance",
      },
      {
        p: "Under stress this plan has zero shortage, the 45-day reserve holds, and all hard checks pass. The first lunar tactic was cheaper in the base case, but under stress it sat on the emergency channel three years in a row, which the rules explicitly forbid.",
      },
      {
        note: "We were open about the weak spot: the safety margin is narrow. The reserve is sized exactly for the announced stress, and a contract doesn't protect against the supplier itself failing.",
      },
      { h: "My part" },
      {
        p: "The interface, as a continuation of the Praxis frontend, including a public calculator behind a QR code so the jury could play with the solution themselves. But my main focus was the pitch: I ran the presentation, the demo and the Q&A, with teammates joining in on answers.",
      },
      {
        p: "The pitch was short. The jury especially liked the two-layer approach and asked: «Is this a simulation?» The answer was «yes and no». The solution is a calculation model for choosing a strategy, with an event-driven feasibility check on top. There's no physics of storage or orbits: boil-off is an analytical coefficient, no CFD and no trajectories.",
      },
      { h: "Takeaway" },
      { p: "A platform you don't throw away after a hackathon pays off at the next one. And the pitch is its own piece of work, not a retelling of the code." },
    ],
  },

  robozon: {
    lead: "An Ozon Tech hackathon with 3,667 participants. Our track had about 1,000 teams, and five made it to the on-site final. We wrote our own sorting center simulation engine instead of using off-the-shelf tools and took second place.",
    role: "Model editor, 3D scene, dashboards",
    team: "3 people, team «Rezonans»",
    duration: "About two months, Aug-Sep 2026",
    links: [{ label: "ROBOZON hackathon", href: "https://ozon-robozon.ru/" }],
    blocks: [
      { h: "The case" },
      {
        p: "The hackathon had three tracks: designing an automated sorter, computer vision sorting, and ours, simulation modeling of a sorting center. The prize pool was 15 million rubles.",
      },
      {
        p: "The task: a model of a sorting center with goods and containers moving through it, showing bottlenecks and ways to raise efficiency. Target throughput was 100,000 items an hour across about 40 destinations. The destinations were the hard part: the model had to route every item to the right one.",
      },
      {
        timeline: [
          { when: "Aug 2", what: "End of stage one" },
          { when: "Aug 11", what: "Finalists announced, 5 teams per track" },
          { when: "Sep 6", what: "End of stage two" },
          { when: "Sep 12", what: "On-site pitch in Moscow" },
          { when: "Sep 13", what: "Awards at the E-CODE conference" },
        ],
      },
      { h: "Why our own engine" },
      {
        compare: [
          {
            title: "AnyLogic",
            items: ["A closed GUI tool for analysts", "Models are stored as Java projects", "Hard to plug an agent into", "Can't ship it in a browser or a single binary"],
          },
          {
            title: "SimPy",
            items: ["Too slow for thousands of runs while training an RL agent", "No logistics primitives", "No backpressure or strict determinism, we'd have to write them anyway"],
          },
        ],
        caption: "The off-the-shelf tools we considered",
      },
      { quote: "We needed to own both the engine and the agent contract." },
      {
        p: "Our own core gave us exactly what we wanted: the model as data in `model.json`, a standard event stream as output, a Gym interface for RL agents out of the box, and a single native AOT binary.",
      },
      { h: "How the engine works" },
      {
        p: "The core is a discrete-event simulation: an event queue on a `PriorityQueue` keyed by (time, sequence number), with model time jumping from event to event. A run goes all at once or step by step through `RunUntil`, which is the mode for the RL agent.",
      },
      {
        flow: [
          { title: "Source", note: "batches" },
          { title: "Conveyor" },
          { title: "Induction", note: "feed rate" },
          { title: "Sorter", note: "chutes", accent: true },
          { title: "Tray", note: "buffer" },
          { title: "Packing" },
          { title: "Sink" },
        ],
        caption: "Our own library of sorting center nodes",
      },
      {
        p: "**Two-phase backpressure.** A node first checks whether there's room and only then commits to accepting an item. If there's no room, the previous node holds the item, and the jam propagates upstream by itself, just like in a real sorting center, without special rules.",
      },
      {
        p: "Resources like operators, docks and chutes are seized for the service time, and reusable containers have their own return loop with a delay. Routing works by attribute, condition or probability through our own safe expression evaluator without reflection, and individual routing points can be handed to the RL agent. All randomness goes through our own seeded generator: the same seed gives a byte-identical run.",
      },
      {
        p: "Around the core: ASP.NET Minimal API with REST and a WebSocket event stream, plus an HTTP bridge to Gym. For agent training, Python, Gymnasium and PPO with the model exported to ONNX.",
      },
      { h: "My part: editor and 3D" },
      {
        p: "The frontend in React and three.js: the model editor, the 3D scene of the sorting center, dashboards, and the demo stand for the on-site pitch in Moscow with 2D and 3D views.",
      },
      {
        p: "Performance was the stumbling block: the 3D scene was overloaded with models, especially during simulation, with lots of boxes moving at once. We fixed it with plain optimization: cut the event handlers down to a minimum and added a cache so switching between two sections that share the scene is instant.",
      },
      { h: "Result" },
      {
        stats: [
          { value: "2nd place", label: "in a track of about 1,000 teams" },
          { value: "101k", label: "items an hour against a 100k target" },
          { value: "5", label: "teams per track in the on-site final" },
        ],
      },
      { h: "Takeaway" },
      { p: "The experience of a first hackathon win. And the understanding that you win with the right team and the right tactics." },
    ],
  },

  arrows: {
    lead: "Every element on the canvas rendered about 30 attachment handles, and clients' large maps crashed the tab on open. I replaced them with a single handle that slides along the element's border. A 1000-element map now opens in 1.7 s.",
    role: "Idea, implementation and migration",
    team: "Solo, requirements with an analyst",
    duration: "A few weeks",
    blocks: [
      { h: "Context" },
      {
        p: "PIX Processes is a product for drawing business process maps. The canvas is built on @xyflow/react, and since mid-2025 this module has been fully mine. Typical client maps have 500-1000 elements.",
      },
      { h: "Where the slowness came from" },
      {
        p: "I started by counting the DOM inside each element and profiling map opening in DevTools Performance. There were far too many handles: three on each side at 25, 50 and 75% of its length, separately for incoming and outgoing edges, plus corners and service handles.",
      },
      {
        list: ["3 handles × 4 sides × 2 (in and out) = **24**", "4 corner handles for callouts", "1 handle for the whole element", "1 handle for the quick connector"],
      },
      {
        p: "An edge stored the element id and the id of one handle from that fixed set, and xyflow drew the line itself. Large maps crashed the tab, and edges could only attach at those fixed points.",
      },
      { figure: "handles", caption: "About 30 handles per element before, one that slides along the border after" },
      { h: "One handle instead of thirty" },
      {
        p: "In the new model an edge stores the element id and a position as fractions of the element's bounding box, from the top-left corner, and there's a single handle id shared by all elements. Instead of a scatter of handles there's one anchor that runs along the whole border and snaps to the grid every 10 px.",
      },
      {
        p: "That allowed attaching anywhere on the border, but I had to write the logic for how a line leaves and enters an element myself: the library only does it from fixed handles. I proposed the approach and fitted it to the product's business requirements together with an analyst. The idea had been around for about a year, but business priorities kept it on hold.",
      },
      {
        p: "Migrating old maps was deterministic: the old handles had known coordinates, so the conversion was unambiguous. We rolled it out to everyone at once, with no visual distortion and no rollbacks.",
      },
      { h: "What had to be reworked" },
      { list: ["Auto-layout", "Import of external formats", "Export and import of our own maps", "Map generation from other modules", "Automated tests", "The connector toolbar"] },
      { h: "Result" },
      {
        stats: [
          { value: "1.7 s", label: "to open a 1000-element map, which used to crash the tab" },
          { value: "2.5-3x", label: "less memory" },
          { value: "1", label: "handle instead of ~30" },
        ],
      },
      {
        p: "We measured by comparing versions on maps from 50 to 1000 elements. Opening time now barely grows with map size, while old versions degraded non-linearly. A .bpmn import of 1000 elements now completes. FPS while zooming and dragging changed less than opening time and memory: that's the next layer of optimization, which needs lighter element objects.",
      },
      { h: "What's next" },
      { p: "We can move away from the rectangular bounding box and attach edges to the real outline of a shape. That matters for non-rectangular notation elements." },
      { h: "Takeaway" },
      { p: "Sometimes it's more important to redo a solution than to keep scaling it when that's no longer possible." },
    ],
  },

  e2e: {
    lead: "The product had zero e2e tests. I built an architecture on Playwright where developers hide the system's complexity inside Page Objects and testers write scenarios on top of ready-made classes. There are about two hundred tests now, and more every month.",
    role: "Test architecture",
    team: "4-5 testers and about 10 developers",
    duration: "2026, ongoing",
    blocks: [
      { h: "Zero tests" },
      { p: "Everything was checked by hand against checklists. There were three reasons to finally introduce automated tests:" },
      {
        list: [
          "it was time to automate the QA team's checks, which had been put off for a long time",
          "the tech lead wanted to start building a test pyramid",
          "we wanted to cut manual regression",
        ],
      },
      { p: "We picked Playwright to have one tool for everything: it was already used for API tests." },
      { h: "Architecture" },
      {
        p: "The core idea is splitting the roles. A developer prepares and maintains a Page Object and hides all the system's complexity inside it. A tester writes the scenario on top of the ready classes in a strict DSL. Every Page Object method is wrapped in a step, so reports read like documentation.",
      },
      {
        flow: [
          { title: "Developer", note: "Page Object and environment" },
          { title: "Tester", note: "scenario", accent: true },
          { title: "Pipeline" },
          { title: "Quality control", note: "results via API" },
        ],
        caption: "Who owns what",
      },
      {
        p: "Maps have their own environment builder: all preconditions go through it, so a test starts right from the state it needs. Video and tracing come from Playwright out of the box, and a colleague set up the Allure reports.",
      },
      {
        code: `// Scenario: how a tester writes it
test('undoing a delete brings the element back with its edge', async ({ page }) => {
  const map = await MapEnvironment.create(page)
    .withTask('Prepare goods')
    .withTask('Sell goods')
    .withEdge('Prepare goods', 'Sell goods')
    .open();

  await map.element('Sell goods').delete();
  await map.expectElementsCount(1);

  await map.toolbar.undo();
  await map.expectElementsCount(2);
  await map.expectEdge('Prepare goods', 'Sell goods');
});

// Page Object: prepared and maintained by a developer
export class CanvasElement {
  constructor(private page: Page, private name: string) {}

  async delete() {
    await test.step(\`Delete element "\${this.name}"\`, async () => {
      await this.locator().click();
      await this.page.keyboard.press('Delete');
    });
  }

  private locator() {
    return this.page.getByTestId('canvas-node').filter({ hasText: this.name });
  }
}`,
        caption: "An illustrative example: names are made up, this isn't product code",
      },
      { h: "Starting with the hardest part" },
      {
        p: "We covered undo/redo first. To have something to undo, we had to get many canvas features working properly, and that gave us a base on which the rest of the tests came quickly.",
      },
      {
        p: "We didn't rush: first we wrote 100 tests and used them to check that the architecture holds up. Then another 100 for related features. We barely changed anything along the way, because we'd thought it through in advance.",
      },
      { h: "Getting QA on board" },
      {
        p: "To get testers writing scenarios themselves, I taught them how to work with Page Objects and reminded them that every feature has a responsible developer to talk to. The tech lead and I also gave a talk about the test pyramid at an internal meetup.",
      },
      { quote: "Tests aren't one person's guerrilla war, they're a dance between several departments." },
      {
        p: "With flaky tests the rule is simple: if a test fails every other run, the problem is either in the test or in the feature. More than once a «flaky» test caught a real bug.",
      },
      { h: "Result" },
      {
        stats: [
          { value: "~200", label: "full scenarios, and the number keeps growing" },
          { value: "0", label: "e2e tests before" },
        ],
      },
      {
        p: "The tests run in the pipeline, and the results go to the internal quality control system via API. Testers rely on them, and developers use them to check nothing broke before a release.",
      },
      { h: "Takeaway" },
      { p: "At the start of a long road it pays to think everything through and test your theories first." },
    ],
  },

  canvas: {
    lead: "Any component could change the canvas map state directly, and the same bugs were fixed in different places. I proposed a different architecture: commands with rollback, listeners every change goes through, and a single facade over the canvas API.",
    role: "Idea and implementation",
    team: "Solo, in a team of about 10 developers",
    duration: "About a month, 2025",
    blocks: [
      { h: "Context" },
      {
        p: "The canvas is the main module of PIX Processes, where process maps are drawn. The product's backend core is built on Event Sourcing. The team has about ten full stack developers, and new canvas features kept coming.",
      },
      { h: "Before" },
      { p: "Map state lived in Redux, and any component changed it directly. Several things became the last straw at once:" },
      {
        list: [
          "the system could no longer scale with the flow of new features",
          "performance kept degrading",
          "the same bugs were duplicated in different places",
          "every developer had their own way of working with the canvas API",
        ],
      },
      { h: "A new engine or order" },
      {
        p: "The team lead suggested writing our own engine. I was against it: we'd have to build it from scratch and would drown in maintaining it. I proposed my own concept, showed an MVP and got the green light.",
      },
      { quote: "The problem wasn't the tool, it was how we used it." },
      { h: "Commands" },
      {
        p: "A user action becomes a command. It goes to the backend alone or in a batch and is rolled back if it isn't applied. That gives undo/redo and fits Event Sourcing on the backend. The Executor applies the changes that come from the server via SignalR.",
      },
      { figure: "commands", caption: "An action becomes a command, the server confirms it, the Executor applies the result" },
      { h: "Listeners" },
      {
        p: "@xyflow/react events arrive as usual, but before reaching the state they pass through listeners. There are two hooks, for elements and for edges: they check, correct, extend or block a change. All the logic for changing a map lives in one place instead of being spread across components.",
      },
      { figure: "listeners", caption: "Every change goes through a listener first" },
      { h: "MapInstance" },
      {
        p: "A single typed entry point to the canvas state: selection, positions, navigation, data loading. No direct Redux access and no breaking the rules of hooks. Plus its own store for the canvas instead of Redux, so elements re-render less.",
      },
      { figure: "facade", caption: "One door into the canvas for the whole team" },
      { h: "Rolling it out" },
      {
        p: "The rework went on in parallel with regular development, without a code freeze. We switched to the new architecture all at once, and everything shipped in one release. Before merging into the main branch I held a session with all developers to walk them through the new architecture.",
      },
      { h: "Result" },
      {
        p: "Nothing changed for users, but technically we grew up. All map changes go through one model of commands and listeners, the team has one entry point into the canvas, elements re-render less, and a bug gets fixed in one place instead of in every component.",
      },
      { h: "Takeaway" },
      { p: "Sometimes it's worth looking at how a technology is used before replacing it with another one." },
    ],
  },

  igor: {
    lead: "IIgor is the AI assistant inside PIX Processes. It draws process maps from a description, writes process regulations and helps improve maps. We built it as a pair with the tech lead, and I owned the whole frontend.",
    role: "Frontend",
    team: "Pair with the tech lead",
    duration: "2025, ongoing",
    blocks: [
      { h: "Why an assistant" },
      {
        p: "So users can automate part of their work or get a draft that only needs a little polishing instead of starting from scratch. For example, draw a process map from a description in a file or a chat message, or get a regulation for an existing map.",
      },
      { h: "How we built it" },
      {
        p: "We built the backend and frontend in parallel after agreeing on contracts up front, and then I tied it all together. The backend runs on Semantic Kernel, and answers stream over WebSocket, which was the tech lead's call.",
      },
      { h: "It knows where you are" },
      {
        p: "The main frontend piece is the situational model, that is, the assistant's integration with every module of the product. Along with the question, the assistant gets context: where the user is right now, what they've selected and which map is open.",
      },
      {
        flow: [
          { title: "Section", note: "canvas, Process Mining" },
          { title: "Selection", note: "objects" },
          { title: "Map", note: "project" },
          { title: "Request", note: "with context", accent: true },
          { title: "IIgor" },
        ],
        caption: "What the assistant knows about the user when they ask",
      },
      { quote: "Not a chat in a vacuum, but an assistant that knows where you are." },
      { h: "Streaming and animations" },
      {
        p: "The animations are minimal and familiar for an AI chat: answers stream in, there's a waiting state, and the user slides into the chat and back, like in Telegram. There was nothing to invent here, and that's a good thing.",
      },
      { h: "Result" },
      {
        p: "The assistant works and is still evolving. It generates documents from process maps, helps analyze and improve maps, and creates them from a description in a file or a chat message.",
      },
      { h: "Takeaway" },
      { p: "A lot has already been invented. Proven patterns work, and it's better to lean on them than to reinvent your own from scratch." },
    ],
  },

  "design-system": {
    lead: "Three npm packages for the company's products: a UI library on top of Ant Design 5, 740+ icons that come straight from Figma, and design tokens. I built all three, the designers draw the icons.",
    role: "All three packages",
    team: "Solo, with the design team",
    duration: "2025",
    blocks: [
      { h: "Context" },
      {
        p: "The company has four products. The design team took Ant Design as a base, but not one to one, so the built-in theming wasn't enough. Since mid-2025 the design system has been mine, along with the canvas.",
      },
      { h: "Before and after" },
      {
        compare: [
          {
            title: "Before",
            items: [
              "Icons were saved from Figma to a folder and imported in code by hand",
              "Everyone exported differently: different sizes, black fill here, currentColor there",
              "The UI library lived inside one product",
            ],
          },
          {
            title: "After",
            items: ["Icons come from Figma through one pipeline as one package", "One size, color inherited from text", "Three separate packages in GitLab Package Registry"],
          },
        ],
      },
      { h: "Three packages" },
      { figure: "designSystem", caption: "Where the packages come from and where they go" },
      {
        p: "**UI library.** It was moved out of a product into its own package with its own provider. Customizing through ThemeProvider didn't give enough control, so many Ant Design components had to be wrapped by hand.",
      },
      {
        p: "**Icons.** Built from scratch: Figma via `@figma-export/core`, then SVGO and SVGR, and TypeScript components come out. 740+ icons, CJS and ESM builds, tree-shaking with standard bundler settings.",
      },
      {
        p: "**Tokens** for colors and typography. I wanted to export them from Figma automatically but hit the limits of our subscription, so for now they're entered by hand.",
      },
      {
        p: "Packages are published through CI: patch versions go out automatically, while minor and major versions with architectural changes are published by hand. There's a Storybook.",
      },
      { h: "Working with designers" },
      {
        p: "We agreed with the designers on icon naming and on how to group them into folders, so the package could be split later. The agreements were verbal, so sometimes I had to adjust the naming core to their rules.",
      },
      { note: "The weak spot for now is component documentation: it's thin." },
      { h: "Result" },
      {
        stats: [
          { value: "3 of 4", label: "company products use the packages" },
          { value: "740+", label: "icons with no manual export" },
          { value: "3", label: "npm packages" },
        ],
      },
      { h: "Takeaway" },
      { quote: "If something starts to annoy you, it's the first candidate for automation." },
    ],
  },

  export: {
    lead: "Map images were built right in the user's browser, and on large maps the interface froze or crashed. I moved export to the server into headless Chromium: now it doesn't depend on the client's machine and can do things that were impossible in the browser.",
    role: "Idea and implementation",
    team: "Solo",
    duration: "About a sprint, 2025",
    blocks: [
      { h: "Before" },
      {
        p: "Users export process maps as images or documents, and client maps are big, 500-1000 elements. Export was done on the frontend with html2image. A 250-element map took about 20 seconds to export, could crash, and loaded the user's computer the whole time. People tried to patch it point by point, but it didn't help.",
      },
      { h: "The idea" },
      { quote: "The server is always more powerful than the client's machine." },
      {
        p: "I proposed changing the approach itself. The frontend only sends export settings, and the server opens the map on behalf of the user in headless Chromium, hides extra interface elements and takes a screenshot at the required resolution and quality.",
      },
      {
        flow: [
          { title: "Frontend", note: "settings" },
          { title: "Queue", note: "up to 5 at once" },
          { title: "Chromium", note: "map as the user", accent: true },
          { title: "Shots", note: "stitching" },
          { title: "File", note: "or zip" },
        ],
        caption: "The export path on the server",
      },
      {
        p: "Chromium isn't bundled with the product: its path and settings are configured on the backend at deploy time. The browser starts once per service and is reused. Up to five maps export at once, the rest wait in a queue.",
      },
      { h: "Invisible flags" },
      {
        p: "A loaded page doesn't mean the map is ready. So the page has two invisible flags: the map is initialized, meaning all rendering is done, and the viewport is ready. The second is needed because export shoots a large map in several images, adjusting the viewport, and then stitches them.",
      },
      { p: "I built it in about a sprint and refined it later, for example so export works correctly through clients' proxies." },
      { h: "Result" },
      {
        compare: [
          { title: "In the browser", items: ["A 250-element map in about 20 s", "Could crash", "Loaded the user's computer"] },
          { title: "On the server", items: ["About 15 s or the same", "Doesn't touch the user's machine", "Flexible settings: quality, PDF, PNG, JPG, several maps"] },
        ],
        caption: "Speed isn't the point: export no longer depends on the client's computer",
      },
      {
        p: "When we needed to export a map together with its child maps, the solution was already there. The server collects the candidate maps, opens and shoots each one in turn, checking permissions on each, and packs everything into a zip. Doing that properly on the frontend wouldn't have been possible.",
      },
      { h: "Takeaway" },
      { p: "Look at the big picture and don't try to improve a direction that's wrong from the start." },
    ],
  },

  "event-log": {
    lead: "The Process Mining event log was loaded through EF Core, and ten million rows barely loaded at all. I switched loading to native COPY BINARY in PostgreSQL: now it takes about a minute.",
    role: "Implementation",
    team: "Solo, consulting the team lead",
    duration: "2024, as a Junior",
    blocks: [
      { h: "Process Mining" },
      {
        p: "An event log from a client's information systems is the trail an employee leaves behind. It shows how a process actually runs, not how it looks on paper. The file is usually uploaded by a process office analyst: it's assembled from several systems by a shared id and pre-processed. It arrives as CSV or Excel with 3 or 5 fields.",
      },
      { p: "We needed to accept logs of up to 10 million rows, which is several gigabytes." },
      { h: "Before" },
      {
        p: "Inserting rows fast with standard EF Core tools didn't work: a million rows took 1-2 minutes, and ten million were practically impossible to load. I tried bulk solutions and saving in batches, but EF Core still saves records one at a time.",
      },
      { h: "Going around the ORM" },
      {
        p: "I switched loading to native `COPY ... FROM STDIN (FORMAT BINARY)` via `NpgsqlBinaryImporter`. The protocol itself is a ready part of the library, and I wrote streaming file parsing and type mapping for that format. The hardest part turned out to be the variety of data clients have.",
      },
      {
        flow: [
          { title: "File", note: "CSV or Excel" },
          { title: "Parser", note: "100k rows at a time" },
          { title: "COPY BINARY", accent: true },
          { title: "Normalization", note: "Hangfire" },
          { title: "Metrics" },
        ],
        caption: "The file is read as a stream, so memory was never a problem",
      },
      {
        p: "After loading, a background Hangfire job normalizes the log: it brings a 3-5 column file to a single 5-column schema. For about a minute some features are limited, then process metrics are recalculated by a nightly job or right away on a button press.",
      },
      { h: "Result" },
      {
        stats: [
          { value: "20-30 s", label: "a million rows, used to be 1-2 minutes" },
          { value: "~1 min", label: "ten million rows" },
        ],
      },
      { quote: "Sometimes it's faster to go around the ORM than to try to speed it up." },
      { h: "Takeaway" },
      { p: "Sometimes you should accept a technology's limits and look for another way." },
    ],
  },

  crm: {
    lead: "A CRM and a website for a new business in Italy that sells pallets. A colleague and I built the system up to the first MVP in one quarter.",
    role: "Mostly backend",
    team: "Pair with a colleague",
    duration: "A quarter, 2022",
    blocks: [
      { h: "Context" },
      {
        p: "VirtuumLab is an outsourcing company. Its founders started with developing DODO IS, so almost every project follows a similar approach: a solid CRM, analytics and readiness for franchising. Here the client was from Italy, in sales. It was a new business with no system of its own, so we built everything to their wishes.",
      },
      { h: "What we built" },
      {
        p: "First we set the system up to the company standard, where stability and the shared architecture inherited from DODO IS come first. Then we developed it for the client: inventory, components and sales with analytics, plus a website.",
      },
      {
        p: "I was mostly on the backend and localization, sometimes helping with the frontend. Delivery zones and route building on GeoJSON were mostly my colleague's work.",
      },
      { h: "Takeaway" },
      { quote: "Agree on contracts first, write code second." },
    ],
  },

  fudkit: {
    lead: "FudKit is a ready-made system for automating small and medium businesses: a CRM, a website and a POS out of the box. When the product moved from Angular to React, I rewrote the POS module and translated the whole product into four languages.",
    role: "POS and localization",
    team: "3 developers",
    duration: "2021-2022",
    blocks: [
      { h: "Context" },
      {
        p: "I joined VirtuumLab as an intern under a strong mentor in May 2021, then worked part-time and full-time. The product was moving from Angular to React: React was the company standard and gave faster development.",
      },
      { h: "The POS" },
      {
        p: "I rewrote the POS module from scratch in React along with a redesign, on our own UI components without ready-made kits. Receipts are printed through a separate local C# daemon that listens on `localhost:8888` and talks to the hardware through the Atol driver.",
      },
      {
        p: "The frontend has its own POS core, `cashRegisterProvider` and `cashRegisterMachine`, so the rest of the code doesn't know protocol details. We didn't design for offline work: fiscal transactions need a network anyway.",
      },
      { figure: "kkm", caption: "The POS doesn't know the printer protocol: everything goes through the wrapper and the local daemon" },
      { h: "Localization" },
      {
        p: "Translating the whole product took about a month because of the volume. My mentor and I worked out the concept in advance and built it our own way rather than with i18next: the backend keeps .resx dictionaries in ru, en, de and it and serves them for the current locale, and the frontend reads them by key. That way backend and frontend translations live in one place and never drift apart.",
      },
      {
        flow: [{ title: ".resx", note: "ru, en, de, it" }, { title: "Backend", note: "dictionary per locale" }, { title: "Frontend", note: "lookup by key", accent: true }],
        caption: "One source of translations for both sides",
      },
      {
        p: "A fun moment: while I was doing translations, the team moved all project folders into a single `src/`. Git refused to merge such a move properly, but I managed to sort out the conflict. The POS shipped.",
      },
      { h: "Takeaway" },
      { p: "The habit of caring about architecture and code style. My mentor gave me that." },
      { quote: "Patience and hard work will get you through anything." },
    ],
  },
};
