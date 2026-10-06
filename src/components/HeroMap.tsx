import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  BaseEdge,
  ConnectionMode,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeProps,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import { ArrowClockwise, ArrowCounterClockwise, GridFour, Lightning, Play, TelegramLogo } from "@phosphor-icons/react";
import { contacts } from "../content";

// Живая карта процесса в первом экране: мини-редактор на @xyflow/react.
// Токен бежит по карте как в Process Mining, есть undo/redo, сетка и стресс-тест на 1000 элементов.

type Kind = "start" | "end" | "task" | "gateway" | "mini";
type MapData = { label?: string; kind: Kind; active?: boolean };
type MapNode = Node<MapData>;
type EdgeData = { label?: string; run?: number };
type MapEdge = Edge<EdgeData>;

const handles = (
  <>
    {[Position.Top, Position.Right, Position.Bottom, Position.Left].map((p) => (
      <Handle key={p} id={p} type="source" position={p} className="!h-2 !w-2 !min-h-0 !min-w-0 !border-0 !bg-accent opacity-0 transition group-hover:opacity-100" />
    ))}
  </>
);

const EventNode = memo(function EventNode({ data }: NodeProps<MapNode>) {
  const end = data.kind === "end";
  return (
    <div className="group relative flex flex-col items-center">
      <div
        className={`grid h-10 w-10 place-items-center rounded-full bg-surface-2 transition-all duration-300 ${end ? "border-[3px]" : "border-2"} ${
          data.active ? "border-accent shadow-[0_0_24px_oklch(0.72_0.19_42/0.6)]" : "border-ink-3"
        }`}
      />
      <div className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] text-ink-3">{data.label}</div>
      {handles}
    </div>
  );
});

const TaskNode = memo(function TaskNode({ data }: NodeProps<MapNode>) {
  return (
    <div
      className={`group grid h-14 w-40 place-items-center rounded-[12px] border bg-surface-2 px-3 text-center text-[13px] font-medium leading-tight transition-all duration-300 ${
        data.active ? "border-accent text-ink shadow-[0_0_28px_oklch(0.72_0.19_42/0.45)]" : "border-line-strong text-ink-2"
      }`}
    >
      {data.label}
      {handles}
    </div>
  );
});

const GatewayNode = memo(function GatewayNode({ data }: NodeProps<MapNode>) {
  return (
    <div className="group relative grid h-14 w-14 place-items-center">
      <div
        className={`absolute inset-[8px] rotate-45 rounded-[6px] border-2 bg-surface-2 transition-all duration-300 ${
          data.active ? "border-accent shadow-[0_0_24px_oklch(0.72_0.19_42/0.6)]" : "border-ink-3"
        }`}
      />
      <span className="relative font-mono text-[15px] font-semibold text-ink-2">?</span>
      <div className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 whitespace-nowrap text-[13px] font-medium text-ink-2">{data.label}</div>
      {handles}
    </div>
  );
});

// Элемент стресс-теста: минимум разметки, чтобы проверять именно канвас
const MiniNode = memo(function MiniNode() {
  return <div className="h-5 w-9 rounded-[4px] border border-line-strong bg-surface-2" />;
});

const nodeTypes = { start: EventNode, end: EventNode, task: TaskNode, gateway: GatewayNode, mini: MiniNode };

function TokenEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data, selected }: EdgeProps<MapEdge>) {
  const [path, lx, ly] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 14 });
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ stroke: selected ? "var(--accent)" : "var(--ink-3)", strokeWidth: 1.5 }} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{ transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)` }}
            className="nodrag nopan pointer-events-none absolute rounded-full bg-bg px-2 py-0.5 font-mono text-[11px] text-ink-3"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
      {data?.run ? (
        <circle key={data.run} r={6} className="fill-accent" style={{ filter: "drop-shadow(0 0 6px oklch(0.72 0.19 42))" }}>
          <animateMotion dur={`${STEP_MS / 1000}s`} fill="freeze" path={path} />
        </circle>
      ) : null}
    </>
  );
}

const edgeTypes = { token: TokenEdge };
const STEP_MS = 650;
const arrow = { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "var(--ink-3)" };
const edge = (id: string, source: string, sh: Position, target: string, th: Position, label?: string): MapEdge => ({
  id,
  source,
  target,
  sourceHandle: sh,
  targetHandle: th,
  type: "token",
  markerEnd: arrow,
  data: { label },
});

// Как я веду задачу: с проверкой производительности перед релизом
const baseNodes: MapNode[] = [
  { id: "start", type: "start", position: { x: 60, y: 0 }, data: { kind: "start", label: "задача" } },
  { id: "domain", type: "task", position: { x: 0, y: 88 }, data: { kind: "task", label: "Разобраться в домене" } },
  { id: "build", type: "task", position: { x: 0, y: 192 }, data: { kind: "task", label: "Фронт + бэк" } },
  { id: "gw", type: "gateway", position: { x: 52, y: 296 }, data: { kind: "gateway", label: "Тормозит?" } },
  { id: "fix", type: "task", position: { x: 216, y: 296 }, data: { kind: "task", label: "Профилировать и чинить" } },
  { id: "release", type: "task", position: { x: 0, y: 408 }, data: { kind: "task", label: "Релиз" } },
  { id: "end", type: "end", position: { x: 60, y: 512 }, data: { kind: "end", label: "готово" } },
];
const baseEdges: MapEdge[] = [
  edge("e1", "start", Position.Bottom, "domain", Position.Top),
  edge("e2", "domain", Position.Bottom, "build", Position.Top),
  edge("e3", "build", Position.Bottom, "gw", Position.Top),
  edge("e4", "gw", Position.Right, "fix", Position.Left, "да"),
  edge("e5", "fix", Position.Top, "build", Position.Right, "снова"),
  edge("e6", "gw", Position.Bottom, "release", Position.Top, "нет"),
  edge("e7", "release", Position.Bottom, "end", Position.Top),
];
// Маршрут токена: один круг через оптимизацию, потом релиз
const route: [string, string][] = [
  ["e1", "domain"],
  ["e2", "build"],
  ["e3", "gw"],
  ["e4", "fix"],
  ["e5", "build"],
  ["e3", "gw"],
  ["e6", "release"],
  ["e7", "end"],
];

const stressNodes: MapNode[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `m${i}`,
  type: "mini",
  position: { x: 460 + (i % 40) * 48, y: -40 + Math.floor(i / 40) * 28 },
  data: { kind: "mini" },
  draggable: true,
}));

type Snapshot = { nodes: MapNode[]; edges: MapEdge[] };

function useFps(enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const tick = (t: number) => {
      frames++;
      if (t - last >= 500) {
        if (ref.current) ref.current.textContent = String(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);
  return ref;
}

function Editor() {
  const { fitView } = useReactFlow();
  const [nodes, setNodes] = useState<MapNode[]>(baseNodes);
  const [edges, setEdges] = useState<MapEdge[]>(baseEdges);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [grid, setGrid] = useState(false);
  const [stress, setStress] = useState(false);
  const [token, setToken] = useState<{ edge: string; node: string; n: number } | null>(null);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Snapshot | null>(null);
  const timers = useRef<number[]>([]);
  const fps = useFps(visible);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const snapshot = useCallback((): Snapshot => ({ nodes, edges }), [nodes, edges]);
  const record = useCallback((s: Snapshot) => {
    setPast((p) => [...p.slice(-49), s]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast(past.slice(0, -1));
    setFuture([{ nodes, edges }, ...future]);
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [past, future, nodes, edges]);

  const redo = useCallback(() => {
    if (!future.length) return;
    const next = future[0];
    setFuture(future.slice(1));
    setPast([...past, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [past, future, nodes, edges]);

  const onNodesChange = useCallback((c: NodeChange<MapNode>[]) => setNodes((n) => applyNodeChanges(c, n)), []);
  const onEdgesChange = useCallback((c: EdgeChange<MapEdge>[]) => setEdges((e) => applyEdgeChanges(c, e)), []);
  const onConnect = useCallback(
    (c: Connection) => {
      record(snapshot());
      setEdges((e) => addEdge({ ...c, type: "token", markerEnd: arrow, data: {} }, e));
    },
    [record, snapshot],
  );

  const stop = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => stop, []);

  const play = () => {
    stop();
    setDone(false);
    setToken({ edge: "", node: "start", n: 0 });
    route.forEach(([e, n], i) => {
      timers.current.push(window.setTimeout(() => setToken({ edge: e, node: "", n: i + 1 }), i * STEP_MS));
      timers.current.push(window.setTimeout(() => setToken((t) => (t ? { ...t, node: n } : t)), (i + 1) * STEP_MS - 60));
    });
    timers.current.push(
      window.setTimeout(() => {
        setDone(true);
        setToken((t) => (t ? { ...t, edge: "" } : t));
      }, route.length * STEP_MS + 100),
    );
  };

  const toggleStress = () => {
    const on = !stress;
    setStress(on);
    setPast([]);
    setFuture([]);
    setNodes((n) => (on ? [...n, ...stressNodes] : n.filter((x) => x.data.kind !== "mini")));
    requestAnimationFrame(() => fitView({ padding: 0.08, duration: 500 }));
  };

  // Подсветка: активное ребро получает токен, активная нода светится
  const viewNodes = useMemo(
    () => (token?.node ? nodes.map((n) => (n.id === token.node ? { ...n, data: { ...n.data, active: true } } : n)) : nodes),
    [nodes, token?.node],
  );
  const viewEdges = useMemo(
    () => (token?.edge ? edges.map((e) => (e.id === token.edge ? { ...e, data: { ...e.data, run: token.n } } : e)) : edges),
    [edges, token?.edge, token?.n],
  );

  // Горячие клавиши работают, если последний клик был внутри редактора (фокус может уйти с отключенной кнопки)
  const inside = useRef(false);
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      inside.current = !!wrap.current?.contains(e.target as Element);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (!inside.current || !(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        redo();
      } else if (k === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [undo, redo]);

  const btn = "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] sm:px-3 font-medium transition active:scale-95 disabled:opacity-35 disabled:active:scale-100";

  return (
    <div ref={wrap} className="relative h-full w-full">
      <ReactFlow
        nodes={viewNodes}
        edges={viewEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={() => (dragStart.current = snapshot())}
        onNodeDragStop={() => dragStart.current && record(dragStart.current)}
        onBeforeDelete={async () => {
          record(snapshot());
          return true;
        }}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={grid}
        snapGrid={[24, 24]}
        fitView
        fitViewOptions={{ padding: { top: "68px", bottom: "92px", left: "96px", right: "24px" } }}
        minZoom={0.15}
        maxZoom={1.6}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        onlyRenderVisibleElements={stress}
        defaultEdgeOptions={{ type: "token" }}
        proOptions={{ hideAttribution: true }}
        aria-label="Интерактивная карта процесса"
      >
        <Background
          variant={grid ? BackgroundVariant.Lines : BackgroundVariant.Dots}
          gap={grid ? 24 : 22}
          size={1}
          color={grid ? "oklch(1 0 0 / 0.05)" : "var(--dot)"}
        />
      </ReactFlow>

      {/* Панель инструментов */}
      <div className="pointer-events-none absolute inset-x-2 top-2 flex items-center justify-between gap-1.5 sm:inset-x-3 sm:top-3 sm:gap-2">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-bg/80 p-1 backdrop-blur">
          <button type="button" onClick={play} className={`${btn} bg-accent text-[oklch(0.18_0.02_40)] hover:brightness-110`}>
            <Play size={14} weight="fill" />
            <span className="max-sm:hidden">Запустить</span>
            <span className="sm:hidden">Пуск</span>
          </button>
          <button type="button" onClick={undo} disabled={!past.length} aria-label="Отменить" title="Отменить (Ctrl+Z)" className={`${btn} max-[380px]:hidden text-ink-2 hover:bg-surface-2 hover:text-ink`}>
            <ArrowCounterClockwise size={16} />
          </button>
          <button type="button" onClick={redo} disabled={!future.length} aria-label="Повторить" title="Повторить (Ctrl+Shift+Z)" className={`${btn} text-ink-2 hover:bg-surface-2 hover:text-ink`}>
            <ArrowClockwise size={16} />
          </button>
          <button
            type="button"
            onClick={() => setGrid((g) => !g)}
            aria-pressed={grid}
            title="Привязка к сетке"
            className={`${btn} ${grid ? "bg-surface-2 text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}
          >
            <GridFour size={16} />
            <span className="max-sm:hidden">Сетка</span>
          </button>
        </div>
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-bg/80 p-1 backdrop-blur">
          <button
            type="button"
            onClick={toggleStress}
            aria-pressed={stress}
            className={`${btn} ${stress ? "bg-surface-2 text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}
          >
            <Lightning size={15} weight={stress ? "fill" : "regular"} className="max-sm:hidden" />
            {stress ? "Убрать" : "+1000"}
            <span className="max-sm:hidden">{stress ? "1000" : "элементов"}</span>
          </button>
          <span className="whitespace-nowrap px-1.5 font-mono text-[12px] text-ink-3 sm:px-2" aria-live="off">
            <span ref={fps} className="text-ink">60</span> fps
          </span>
        </div>
      </div>

      {/* Финал процесса: следующий шаг */}
      {done && (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[16px] border border-accent/50 bg-bg/90 p-3 pl-4 backdrop-blur animate-[fadeUp_0.4s_ease-out]">
          <span className="text-[14px] text-ink">Процесс завершен. Следующий шаг за вами</span>
          <a href={contacts.telegram.href} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[13px] font-semibold text-[oklch(0.18_0.02_40)] transition hover:brightness-110">
            <TelegramLogo size={15} weight="fill" />
            Написать
          </a>
        </div>
      )}
      {!done && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 font-mono text-[11.5px] leading-snug text-ink-3">
          тащи элементы, соединяй стрелками, Ctrl+Z работает
        </div>
      )}
    </div>
  );
}

export function HeroMap() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-[20px] border border-line bg-surface/70 sm:h-[600px] lg:h-[640px]">
      <ReactFlowProvider>
        <Editor />
      </ReactFlowProvider>
    </div>
  );
}
