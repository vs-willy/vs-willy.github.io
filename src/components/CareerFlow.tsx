import { useCallback, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  useReactFlow,
  type Edge,
  type FitViewOptions,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import { ArrowCounterClockwise, HandGrabbing } from "@phosphor-icons/react";

type StepData = {
  title: string;
  period: string;
  note?: string;
  tone?: "default" | "muted" | "accent";
};
type StepNode = Node<StepData, "step">;

function StepNodeView({ data }: NodeProps<StepNode>) {
  const tone = data.tone ?? "default";
  return (
    <div
      className={[
        "flex h-[76px] w-[224px] flex-col justify-center rounded-[12px] border px-4",
        tone === "accent" ? "border-accent bg-surface-2 shadow-[0_0_30px_oklch(0.72_0.19_42/0.25)]" : "border-line-strong bg-surface-2",
        tone === "muted" ? "opacity-70" : "",
      ].join(" ")}
    >
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div className="font-mono text-[11.5px] text-ink-3">{data.period}</div>
      <div className="mt-0.5 text-[15px] font-semibold leading-tight text-ink">{data.title}</div>
      {data.note && <div className="mt-0.5 text-[13px] leading-snug text-ink-2">{data.note}</div>}
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}

const nodeTypes = { step: StepNodeView };

// Снизу больше места под подсказку
const fitOptions: FitViewOptions = { padding: { top: "28px", right: "24px", bottom: "64px", left: "24px" } };

// Строгая колонка: ноды одной ширины и высоты, шаг 112px, в конце развилка на две ветки
const initialNodes: StepNode[] = [
  { id: "vl", type: "step", position: { x: 120, y: 0 }, data: { period: "2021-2022", title: "ВиртуумЛаб", note: "касса, ККМ, локализация" } },
  { id: "army", type: "step", position: { x: 120, y: 112 }, data: { period: "2022-2023", title: "Армия", tone: "muted" } },
  { id: "jr", type: "step", position: { x: 120, y: 224 }, data: { period: "2023", title: "PIX Robotics", note: "Junior, фичи целиком" } },
  { id: "mid", type: "step", position: { x: 120, y: 336 }, data: { period: "2024", title: "Middle", note: "фронт + C#/.NET" } },
  { id: "own", type: "step", position: { x: 0, y: 472 }, data: { period: "2025 - сейчас", title: "Канвас и дизайн-система", note: "владею модулем", tone: "accent" } },
  { id: "hack", type: "step", position: { x: 240, y: 472 }, data: { period: "2026", title: "Хакатоны", note: "1 и 2 место" } },
];

const arrow = { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "var(--ink-3)" };
const edgeBase = { type: "smoothstep", pathOptions: { borderRadius: 12 }, markerEnd: arrow } as const;

const initialEdges: Edge[] = [
  { id: "vl-army", source: "vl", target: "army", ...edgeBase },
  { id: "army-jr", source: "army", target: "jr", ...edgeBase },
  { id: "jr-mid", source: "jr", target: "mid", ...edgeBase },
  { id: "mid-own", source: "mid", target: "own", ...edgeBase, animated: true, className: "is-current", markerEnd: { ...arrow, color: "var(--accent)" } },
  { id: "mid-hack", source: "mid", target: "hack", ...edgeBase },
];

function Flow() {
  const [nodes, setNodes] = useState<StepNode[]>(initialNodes);
  const [moved, setMoved] = useState(false);
  const { fitView } = useReactFlow();

  const onNodesChange = useCallback((changes: NodeChange<StepNode>[]) => {
    if (changes.some((c) => c.type === "position" && c.dragging)) setMoved(true);
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const reset = useCallback(() => {
    setNodes(initialNodes);
    setMoved(false);
    requestAnimationFrame(() => fitView({ ...fitOptions, duration: 400 }));
  }, [fitView]);

  const edges = useMemo(() => initialEdges, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        fitViewOptions={fitOptions}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        aria-label="Карьерный путь в виде схемы. Карточки можно перетаскивать"
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="var(--dot)" />
      </ReactFlow>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-bg/70 px-2.5 py-1 font-mono text-[11px] text-ink-3 backdrop-blur">
          <HandGrabbing size={14} weight="regular" />
          карточки можно двигать
        </span>
        {moved && (
          <button
            type="button"
            onClick={reset}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-line-strong bg-bg px-3 py-1 text-[12px] text-ink-2 transition hover:text-ink active:scale-[0.97]"
          >
            <ArrowCounterClockwise size={13} />
            Вернуть
          </button>
        )}
      </div>
    </>
  );
}

export function CareerFlow() {
  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-[20px] border border-line bg-surface sm:h-[520px]">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
