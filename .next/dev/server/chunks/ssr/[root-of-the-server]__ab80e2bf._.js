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
                    lineNumber: 25,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                ref: endRef
            }, void 0, false, {
                fileName: "[project]/components/LogBox.js",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LogBox.js",
        lineNumber: 14,
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
;
function GridBox({ plants, animals, width, height }) {
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
        lineNumber: 61,
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function ControlBox({ socket }) {
    const [plantsNum, setPlantsNum] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(5);
    const [rabbitsNum, setRabbitsNum] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(5);
    const [foxesNum, setFoxesNum] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(2);
    const [gridSize, setGridSize] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(5);
    const handleResetEcosystem = ()=>{
        if (socket) {
            socket.emit("resetEcosystem", {
                plantsNum,
                rabbitsNum,
                foxesNum,
                gridSize
            });
        }
    };
    const handleStartSimulation = ()=>{
        if (socket) {
            socket.emit("startSimulation");
        }
    };
    const handlePauseSimulation = ()=>{
        if (socket) {
            socket.emit("pauseSimulation");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 bg-gray-900 text-white font-mono rounded shadow-lg min-h-52",
        style: {
            border: "3px solid black",
            width: "400px",
            boxSizing: "border-box"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "mb-4 text-green-400",
                children: "Controls"
            }, void 0, false, {
                fileName: "[project]/components/ControlBox.js",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "text-sm text-green-400",
                                children: [
                                    "Plants: ",
                                    plantsNum
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "0",
                                max: "20",
                                value: plantsNum,
                                onChange: (e)=>setPlantsNum(Number(e.target.value)),
                                className: "w-full"
                            }, void 0, false, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "text-sm text-green-400",
                                children: [
                                    "Rabbits: ",
                                    rabbitsNum
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "0",
                                max: "15",
                                value: rabbitsNum,
                                onChange: (e)=>setRabbitsNum(Number(e.target.value)),
                                className: "w-full"
                            }, void 0, false, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "text-sm text-green-400",
                                children: [
                                    "Foxes: ",
                                    foxesNum
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "0",
                                max: "10",
                                value: foxesNum,
                                onChange: (e)=>setFoxesNum(Number(e.target.value)),
                                className: "w-full"
                            }, void 0, false, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "text-sm text-green-400",
                                children: [
                                    "Grid Size: ",
                                    gridSize,
                                    "x",
                                    gridSize
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "3",
                                max: "15",
                                value: gridSize,
                                onChange: (e)=>setGridSize(Number(e.target.value)),
                                className: "w-full"
                            }, void 0, false, {
                                fileName: "[project]/components/ControlBox.js",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ControlBox.js",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleResetEcosystem,
                        className: "p-2 bg-red-700 text-white border border-red-500 rounded cursor-pointer font-mono hover:bg-red-600",
                        children: "Reset Ecosystem"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleStartSimulation,
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Start Simulation"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handlePauseSimulation,
                        className: "p-2 bg-gray-700 text-white border border-gray-500 rounded cursor-pointer font-mono hover:bg-gray-600",
                        children: "Pause Simulation"
                    }, void 0, false, {
                        fileName: "[project]/components/ControlBox.js",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ControlBox.js",
                lineNumber: 93,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ControlBox.js",
        lineNumber: 35,
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
;
function Home() {
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [plants, setPlants] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [animals, setAnimals] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [gridSize, setGridSize] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(5);
    const [socket, setSocket] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const socketInstance = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$socket$2e$io$2d$client__$5b$external$5d$__$28$socket$2e$io$2d$client$2c$__esm_import$29$__["io"])("http://localhost:5000");
        setSocket(socketInstance);
        socketInstance.on("log", (msg)=>setLogs((prev)=>[
                    ...prev,
                    msg
                ]));
        socketInstance.on("gridUpdate", ({ plants, animals, gridSize })=>{
            setPlants(plants);
            setAnimals(animals);
            setGridSize(gridSize);
        });
        return ()=>socketInstance.disconnect();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 min-h-screen bg-gray-800 flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                className: "text-2xl text-green-400 mb-4",
                children: "Ecosystem Simulation"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 32,
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
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ControlBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                socket: socket
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 49,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GridBox$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        plants: plants,
                        animals: animals,
                        width: gridSize,
                        height: gridSize
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 31,
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