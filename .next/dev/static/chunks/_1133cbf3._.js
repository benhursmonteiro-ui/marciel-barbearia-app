(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/context/BarberContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarberProvider",
    ()=>BarberProvider,
    "useBarber",
    ()=>useBarber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const BarberContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BarberProvider({ children }) {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [services, setServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [barbers, setBarbers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [promotions, setPromotions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shopConfig, setShopConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "Marciel Barber Shop",
        logo: "",
        address: "Rua das Tesouras, 123 - Centro",
        phone: "(00) 0000-0000",
        whatsapp: "(00) 00000-0000",
        email: "contato@marcielbarber.com",
        workingHours: {
            "Segunda": {
                start: "08:00",
                end: "18:00",
                closed: false
            },
            "Terça": {
                start: "08:00",
                end: "18:00",
                closed: false
            },
            "Quarta": {
                start: "08:00",
                end: "18:00",
                closed: false
            },
            "Quinta": {
                start: "08:00",
                end: "18:00",
                closed: false
            },
            "Sexta": {
                start: "08:00",
                end: "18:00",
                closed: false
            },
            "Sábado": {
                start: "08:00",
                end: "16:00",
                closed: false
            },
            "Domingo": {
                start: "00:00",
                end: "00:00",
                closed: true
            }
        },
        social: {
            instagram: "@marcielbarber",
            facebook: "marcielbarbershop"
        }
    });
    // Initial Load and Seed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            const savedUsers = localStorage.getItem('mbs_users');
            const savedBarbers = localStorage.getItem('mbs_barbers');
            const savedServices = localStorage.getItem('mbs_services');
            const savedApps = localStorage.getItem('mbs_appointments');
            const savedPromos = localStorage.getItem('mbs_promotions');
            const savedCurrentUser = localStorage.getItem('mbs_current_user');
            const savedShopConfig = localStorage.getItem('mbs_shop_config');
            // Load existing data
            const loadedUsers = savedUsers ? JSON.parse(savedUsers) : [];
            const loadedBarbers = savedBarbers ? JSON.parse(savedBarbers) : [];
            const loadedServices = savedServices ? JSON.parse(savedServices) : [];
            const loadedPromos = savedPromos ? JSON.parse(savedPromos) : [];
            // Seed data if missing
            const hasAdmin = loadedUsers.some({
                "BarberProvider.useEffect.hasAdmin": (u)=>u.email === 'admin@teste.com'
            }["BarberProvider.useEffect.hasAdmin"]);
            if (!hasAdmin) {
                const seedUsers = [
                    {
                        id: 'u_admin',
                        name: 'Marciel Santos',
                        email: 'admin@teste.com',
                        password: '123456',
                        role: 'admin'
                    },
                    {
                        id: 'u_client',
                        name: 'Cliente Teste',
                        email: 'cliente@teste.com',
                        password: '123456',
                        role: 'client'
                    },
                    {
                        id: 'u_barber',
                        name: 'Barbeiro Teste',
                        email: 'barbeiro@teste.com',
                        password: '123456',
                        role: 'barber'
                    },
                    ...loadedUsers
                ];
                const seedBarbers = [
                    {
                        id: 'b_marciel',
                        userId: 'u_admin',
                        name: 'Marciel Santos',
                        specialty: 'Master Barber',
                        commission: 60,
                        rating: 5.0,
                        reviews: 0,
                        active: true
                    },
                    {
                        id: 'b_test',
                        userId: 'u_barber',
                        name: 'Barbeiro Teste',
                        specialty: 'Corte Social',
                        commission: 40,
                        rating: 4.8,
                        reviews: 12,
                        active: true
                    },
                    ...loadedBarbers
                ];
                const seedServices = [
                    {
                        id: 's1',
                        name: 'Corte Degradê',
                        description: 'Corte moderno com sombreado perfeito.',
                        price: 45,
                        duration: '40 min',
                        icon: '✂️',
                        popular: true,
                        active: true
                    },
                    {
                        id: 's2',
                        name: 'Barba Trimmed',
                        description: 'Alinhamento e hidratação da barba.',
                        price: 35,
                        duration: '25 min',
                        icon: '🪒',
                        active: true
                    },
                    {
                        id: 's3',
                        name: 'Corte + Barba',
                        description: 'Combo completo para renovar o visual.',
                        price: 70,
                        duration: '60 min',
                        icon: '💈',
                        active: true
                    },
                    ...loadedServices
                ];
                const seedPromos = [
                    {
                        id: 'p1',
                        tag: 'Especial de Primavera',
                        title: 'Corte + Hidratação',
                        description: 'Revitalize seu cabelo com desconto.',
                        price: 59.90,
                        color: 'from-[#1A1100] to-black',
                        accentBg: 'bg-[#D4AF37]',
                        textColor: 'text-black',
                        active: true
                    },
                    ...loadedPromos
                ];
                setUsers(seedUsers);
                setBarbers(seedBarbers);
                setServices(seedServices);
                setPromotions(seedPromos);
                localStorage.setItem('mbs_users', JSON.stringify(seedUsers));
                localStorage.setItem('mbs_barbers', JSON.stringify(seedBarbers));
                localStorage.setItem('mbs_services', JSON.stringify(seedServices));
                localStorage.setItem('mbs_promotions', JSON.stringify(seedPromos));
            } else {
                setUsers(loadedUsers);
                setBarbers(loadedBarbers);
                setServices(loadedServices);
                setPromotions(loadedPromos);
            }
            if (savedApps) setAppointments(JSON.parse(savedApps));
            if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
            if (savedShopConfig) setShopConfig(JSON.parse(savedShopConfig));
        }
    }["BarberProvider.useEffect"], []);
    const resetToSeed = ()=>{
        localStorage.removeItem('mbs_users');
        localStorage.removeItem('mbs_barbers');
        localStorage.removeItem('mbs_services');
        localStorage.removeItem('mbs_appointments');
        localStorage.removeItem('mbs_promotions');
        localStorage.removeItem('mbs_current_user');
        localStorage.removeItem('mbs_shop_config');
        window.location.reload();
    };
    // Sync to LocalStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            localStorage.setItem('mbs_users', JSON.stringify(users));
        }
    }["BarberProvider.useEffect"], [
        users
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            localStorage.setItem('mbs_barbers', JSON.stringify(barbers));
        }
    }["BarberProvider.useEffect"], [
        barbers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            localStorage.setItem('mbs_services', JSON.stringify(services));
        }
    }["BarberProvider.useEffect"], [
        services
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            localStorage.setItem('mbs_appointments', JSON.stringify(appointments));
        }
    }["BarberProvider.useEffect"], [
        appointments
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            localStorage.setItem('mbs_promotions', JSON.stringify(promotions));
        }
    }["BarberProvider.useEffect"], [
        promotions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            localStorage.setItem('mbs_shop_config', JSON.stringify(shopConfig));
        }
    }["BarberProvider.useEffect"], [
        shopConfig
    ]);
    const login = (email, password)=>{
        const user = users.find((u)=>u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('mbs_current_user', JSON.stringify(user));
            return user;
        }
        return null;
    };
    const register = (name, email, password, role)=>{
        const newUser = {
            id: 'u' + Date.now(),
            name,
            email,
            password,
            role
        };
        setUsers((prev)=>[
                ...prev,
                newUser
            ]);
        setCurrentUser(newUser);
        localStorage.setItem('mbs_current_user', JSON.stringify(newUser));
        return newUser;
    };
    const logout = ()=>{
        setCurrentUser(null);
        localStorage.removeItem('mbs_current_user');
    };
    const addAppointment = (data)=>{
        const barber = barbers.find((b)=>b.id === data.barberId);
        const commissionVal = data.price * (barber?.commission || 40) / 100;
        const newApp = {
            ...data,
            id: 'app' + Date.now(),
            createdAt: new Date().toISOString(),
            commission: commissionVal
        };
        setAppointments((prev)=>[
                newApp,
                ...prev
            ]);
    };
    const updateAppointmentStatus = (id, status)=>{
        setAppointments((prev)=>prev.map((app)=>app.id === id ? {
                    ...app,
                    status
                } : app));
    };
    const addService = (data)=>{
        const newService = {
            ...data,
            id: 's' + Date.now()
        };
        setServices((prev)=>[
                ...prev,
                newService
            ]);
    };
    const updateService = (id, data)=>{
        setServices((prev)=>prev.map((s)=>s.id === id ? {
                    ...s,
                    ...data
                } : s));
    };
    const removeService = (id)=>{
        setServices((prev)=>prev.filter((s)=>s.id !== id));
    };
    const addBarber = (data)=>{
        const userId = 'u' + Date.now();
        const newUser = {
            id: userId,
            name: data.name,
            email: data.email,
            password: data.password || '123456',
            role: 'barber'
        };
        const newBarber = {
            ...data,
            id: 'b' + Date.now(),
            userId,
            rating: 5.0,
            reviews: 0,
            active: true
        };
        setUsers((prev)=>[
                ...prev,
                newUser
            ]);
        setBarbers((prev)=>[
                ...prev,
                newBarber
            ]);
    };
    const updateBarber = (id, data)=>{
        setBarbers((prev)=>prev.map((b)=>b.id === id ? {
                    ...b,
                    ...data
                } : b));
    };
    const removeBarber = (id)=>{
        const barber = barbers.find((b)=>b.id === id);
        if (barber) {
            setUsers((prev)=>prev.filter((u)=>u.id !== barber.userId));
        }
        setBarbers((prev)=>prev.filter((b)=>b.id !== id));
    };
    const updateUser = (id, data)=>{
        setUsers((prev)=>prev.map((u)=>u.id === id ? {
                    ...u,
                    ...data
                } : u));
        if (currentUser?.id === id) {
            const updated = {
                ...currentUser,
                ...data
            };
            setCurrentUser(updated);
            localStorage.setItem('mbs_current_user', JSON.stringify(updated));
        }
    };
    const updateShopConfig = (data)=>{
        setShopConfig((prev)=>({
                ...prev,
                ...data
            }));
    };
    const addPromotion = (data)=>{
        const newPromo = {
            ...data,
            id: 'p' + Date.now()
        };
        setPromotions((prev)=>[
                ...prev,
                newPromo
            ]);
    };
    const updatePromotion = (id, data)=>{
        setPromotions((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    ...data
                } : p));
    };
    const removePromotion = (id)=>{
        setPromotions((prev)=>prev.filter((p)=>p.id !== id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BarberContext.Provider, {
        value: {
            users,
            services,
            barbers,
            appointments,
            promotions,
            currentUser,
            shopConfig,
            login,
            logout,
            register,
            addAppointment,
            updateAppointmentStatus,
            addService,
            updateService,
            removeService,
            addBarber,
            updateBarber,
            removeBarber,
            updateUser,
            updateShopConfig,
            resetToSeed,
            addPromotion,
            updatePromotion,
            removePromotion
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/BarberContext.tsx",
        lineNumber: 349,
        columnNumber: 9
    }, this);
}
_s(BarberProvider, "wgT+cYgZfR7Koaas7/g3G/cDywo=");
_c = BarberProvider;
function useBarber() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(BarberContext);
    if (!context) throw new Error('useBarber must be used within a BarberProvider');
    return context;
}
_s1(useBarber, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "BarberProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_1133cbf3._.js.map