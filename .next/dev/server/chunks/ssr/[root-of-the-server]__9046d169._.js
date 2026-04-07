module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/context/BarberContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarberProvider",
    ()=>BarberProvider,
    "useBarber",
    ()=>useBarber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const BarberContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BarberProvider({ children }) {
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [services, setServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [barbers, setBarbers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [promotions, setPromotions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shopConfig, setShopConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const hasAdmin = loadedUsers.some((u)=>u.email === 'admin@teste.com');
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
    }, []);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('mbs_users', JSON.stringify(users));
    }, [
        users
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('mbs_barbers', JSON.stringify(barbers));
    }, [
        barbers
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('mbs_services', JSON.stringify(services));
    }, [
        services
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('mbs_appointments', JSON.stringify(appointments));
    }, [
        appointments
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('mbs_promotions', JSON.stringify(promotions));
    }, [
        promotions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('mbs_shop_config', JSON.stringify(shopConfig));
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BarberContext.Provider, {
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
function useBarber() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(BarberContext);
    if (!context) throw new Error('useBarber must be used within a BarberProvider');
    return context;
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9046d169._.js.map