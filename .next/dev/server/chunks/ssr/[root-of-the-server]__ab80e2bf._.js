module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/socket.io-client [external] (socket.io-client, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("socket.io-client");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/components/LogBox.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/LogBox.js
__turbopack_context__.s([
    "default",
    ()=>LogBox
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function LogBox({ logs, height = "28rem" }) {
    const endRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Scroll to bottom when logs change
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        endRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [
        logs
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 bg-gray-900 text-green-400 font-mono rounded shadow-lg",
        style: {
            height,
            overflowY: "auto",
            border: "3px solid black",
            width: "400px",
            flexShrink: 0
        },
        children: [
            logs.map((log, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "0 0.25rem"
                    },
                    children: log
                }, index, false, {
                    fileName: "[project]/components/LogBox.js",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                ref: endRef
            }, void 0, false, {
                fileName: "[project]/components/LogBox.js",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LogBox.js",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/GridBox.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/GridBox.js
__turbopack_context__.s([
    "default",
    ()=>GridBox
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function GridBox({ plants, animals, width = 3, height = 3 }) {
    // Initialize empty grid with 2x2 mini-cells
    const grid = Array.from({
        length: height
    }, ()=>Array.from({
            length: width
        }, ()=>Array(4).fill("⬜")));
    // Helper to push entity into first available slot
    const addToCell = (x, y, emoji)=>{
        const cell = grid[y][x];
        for(let i = 0; i < 4; i++){
            if (cell[i] === "⬜") {
                cell[i] = emoji;
                break;
            }
        }
    };
    // Add plants
    for (const plant of plants){
        const { x, y } = plant.position;
        addToCell(x, y, "🌱");
    }
    // Add animals
    for (const animal of animals){
        if (!animal.alive) continue;
        const { x, y } = animal.position;
        if (animal.species === "rabbit") addToCell(x, y, "🐇");
        if (animal.species === "fox") addToCell(x, y, "🦊");
    }
    // Convert each 2x2 cell to string with a black outline
    const gridString = grid.map((row)=>{
        const top = row.map((cell)=>`┌${cell[0]}${cell[1]}┐`).join(" ");
        const bottom = row.map((cell)=>`└${cell[2]}${cell[3]}┘`).join(" ");
        return `${top}\n${bottom}`;
    }).join("\n");
    // Calculate dynamic font size based on grid dimensions to fill available space
    const containerWidth = 800; // Approximate available width (adjust based on your container)
    const containerHeight = 700; // Approximate available height (50rem - padding)
    // Each cell takes up roughly 6 characters width (┌xx┐ + space) and 2 lines height
    const cellWidth = 6;
    const cellHeight = 2;
    // Calculate max font size that fits both width and height constraints
    const maxFontSizeForWidth = containerWidth / (width * cellWidth);
    const maxFontSizeForHeight = containerHeight / (height * cellHeight);
    const baseFontSize = Math.max(6, Math.min(maxFontSizeForWidth, maxFontSizeForHeight));
    // Scale up the font size by 1.75x
    const fontSize = baseFontSize * 1.75;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            fontFamily: "monospace",
            fontSize: `${fontSize}px`,
            padding: "1rem",
            color: "#059669",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            height: "50rem",
            overflowY: "auto",
            border: "1px solid #059669",
            whiteSpace: "pre",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: gridString
    }, void 0, false, {
        fileName: "[project]/components/GridBox.js",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ControlBox.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/ControlBox.js
__turbopack_context__.s([
    "default",
    ()=>ControlBox
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function ControlBox() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 bg-gray-900 text-white font-mono rounded shadow-lg border-black min-h-52",
        style: {
            border: "3px solid black",
            width: "400px",
            boxSizing: "border-box"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "mb-4 text-green-400",
                children: "Controls"
            }, void 0, false, {
                fileName: "[project]/components/ControlBox.js",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Start Simulation"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Pause Simulation"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Reset Ecosystem"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Add Animals"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Change Grid Size"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ControlBox.js",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ControlBox.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/index.js
__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/socket.io-client [external] (socket.io-client, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LogBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LogBox.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GridBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GridBox.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ControlBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ControlBox.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
function Home() {
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [animals, setAnimals] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const socket = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__["io"])("http://localhost:5000");
        socket.on("log", (msg)=>setLogs((prev)=>[
                    ...prev,
                    msg
                ]));
        socket.on("gridUpdate", ({ plants, animals })=>{
            setPlants(plants);
            setAnimals(animals);
        });
        return ()=>socket.disconnect();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 min-h-screen bg-gray-800 flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: "text-2xl text-green-400 mb-4",
                children: "Ecosystem Simulation"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                    width: "100%",
                    maxWidth: "1800px",
                    alignItems: "flex-start"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            width: "400px",
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LogBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                logs: logs
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ControlBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GridBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        plants: plants,
                        animals: animals
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ab80e2bf._.js.map