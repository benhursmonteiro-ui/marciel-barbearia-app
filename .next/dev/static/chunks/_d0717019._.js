(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "uploadImage",
    ()=>uploadImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
// Essas linhas buscam as chaves que você colocou no arquivo .env.local
const supabaseUrl = ("TURBOPACK compile-time value", "https://fcumwatjgcuvhuwtxtye.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_OZ5D8xEzn044ozlnLOeFkQ_r1ISx-ow");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
async function uploadImage(file, bucket = 'barber-images') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const BarberContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BarberProvider({ children }) {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [services, setServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [barbers, setBarbers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [promotions, setPromotions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [incomes, setIncomes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shopConfig, setShopConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "Marciel Barber Shop",
        logo: "",
        address: "Rua Castro Alves, 261 - Junco, Picos - PI, - 64600-000",
        phone: "(89) 9985-0601",
        whatsapp: "(89) 9985-0601",
        email: "[EMAIL_ADDRESS]",
        workingHours: {
            "Segunda": {
                start: "00:00",
                end: "00:00",
                closed: true
            },
            "Terça": {
                start: "08:00",
                end: "19:00",
                closed: false
            },
            "Quarta": {
                start: "08:00",
                end: "19:00",
                closed: false
            },
            "Quinta": {
                start: "08:00",
                end: "19:00",
                closed: false
            },
            "Sexta": {
                start: "08:00",
                end: "19:00",
                closed: false
            },
            "Sábado": {
                start: "08:00",
                end: "19:00",
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
    // Flag to control auth readiness before redirect
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthReady, setIsAuthReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Function to load all data from Supabase
    const fetchFromSupabase = async ()=>{
        try {
            const [{ data: dbUsers, error: usersError }, { data: dbBarbers }, { data: dbServices }, { data: dbAppointments }, { data: dbPromotions }, { data: dbProducts }, { data: dbConfig }, { data: dbExpenses }, { data: dbIncomes }] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('barbeiros').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('servicos').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('agendamentos').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('promocoes').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('estoque').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('configuracoes_loja').select('*').single(),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('despesas').select('*'),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('entradas_avulsas').select('*')
            ]);
            let usersToSet = dbUsers || [];
            if ("TURBOPACK compile-time truthy", 1) setUsers(usersToSet.map((u)=>({
                    id: u.id,
                    name: u.nome,
                    email: u.email,
                    password: u.senha,
                    role: u.funcao,
                    photo: u.foto_url || "",
                    phone: u.telefone || ""
                })));
            if (dbBarbers) setBarbers(dbBarbers.map((b)=>({
                    id: b.id,
                    userId: b.usuario_id,
                    name: b.nome,
                    specialty: b.especialidade,
                    rating: b.rating || b.avaliacao || 5.0,
                    reviews: b.reviews || b.total_avaliacoes || 0,
                    commission: b.comissao,
                    active: b.ativo
                })));
            if (dbServices) setServices(dbServices.map((s)=>({
                    id: s.id,
                    name: s.nome,
                    description: s.descricao,
                    duration: s.duracao,
                    price: s.preco,
                    icon: s.icone,
                    popular: s.popular,
                    active: s.ativo !== false
                })));
            if (dbAppointments) setAppointments(dbAppointments.map((a)=>({
                    id: a.id,
                    clientId: a.cliente_id,
                    clientName: a.nome_cliente,
                    barberId: a.barbeiro_id,
                    barberName: a.nome_barbeiro,
                    serviceId: a.servico_id,
                    serviceName: a.nome_servico,
                    price: a.valor,
                    commission: a.comissao_gerada,
                    date: a.data,
                    time: a.horario,
                    status: a.status,
                    createdAt: a.created_at
                })));
            if (dbPromotions) setPromotions(dbPromotions.map((p)=>({
                    id: p.id,
                    tag: p.tag,
                    title: p.titulo,
                    description: p.descricao,
                    price: p.preco,
                    color: p.gradiente_cor,
                    accentBg: p.accent_bg,
                    textColor: p.texto_cor,
                    active: p.ativo
                })));
            if (dbProducts) setProducts(dbProducts.map((p)=>({
                    id: p.id,
                    name: p.nome,
                    category: p.categoria,
                    price: p.preco,
                    stock: p.quantidade,
                    minStock: p.minimo,
                    image: p.imagem,
                    active: p.ativo !== false
                })));
            if (dbConfig) setShopConfig((prev)=>({
                    name: dbConfig.nome || prev.name,
                    logo: dbConfig.logo || prev.logo,
                    address: dbConfig.endereco || prev.address,
                    phone: dbConfig.telefone || prev.phone,
                    whatsapp: dbConfig.whatsapp || prev.whatsapp,
                    email: dbConfig.email || dbConfig['e-mail'] || prev.email,
                    workingHours: dbConfig.horarios_funcionamento || prev.workingHours,
                    social: dbConfig.redes_sociais || prev.social
                }));
            if (dbExpenses) setExpenses(dbExpenses.map((e)=>({
                    id: e.id,
                    label: e.label,
                    value: Number(e.value),
                    date: e.date,
                    time: e.time,
                    createdAt: e.created_at
                })));
            if (dbIncomes) setIncomes(dbIncomes.map((i)=>({
                    id: i.id,
                    label: i.label,
                    value: Number(i.value),
                    date: i.date,
                    time: i.time,
                    createdAt: i.created_at
                })));
        } catch (error) {
            console.error("Erro ao carregar dados do Supabase:", error);
        }
    };
    // Initial Load and Seed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            const init = {
                "BarberProvider.useEffect.init": async ()=>{
                    await fetchFromSupabase();
                    // Restore session from localStorage
                    const savedCurrentUser = localStorage.getItem('mbs_current_user');
                    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
                    setIsLoaded(true);
                    setIsAuthReady(true); // Now layouts can safely decide to redirect
                }
            }["BarberProvider.useEffect.init"];
            init();
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
    // Initial data fetch happens in start, no need for redundant localStorage sync of entire collections
    // as we now rely on Supabase as the source of truth.
    const login = async (email, password)=>{
        // Admin fixo — funciona mesmo se o Supabase ainda não tiver o usuário
        if (email === 'marciel_farias@admin.com' && password === '150326') {
            // Sincroniza e busca o ID real do banco
            const { data: dbAdmin, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').upsert([
                {
                    nome: 'Marciel',
                    email: 'marciel_farias@admin.com',
                    senha: '150326',
                    funcao: 'admin'
                }
            ], {
                onConflict: 'email'
            }).select().single();
            if (error || !dbAdmin) {
                console.error("Erro ao sincronizar admin:", error);
                // Fallback caso o banco falhe, mas o login esteja certo
                return {
                    id: 'admin-temp',
                    name: 'Marciel',
                    email,
                    role: 'admin'
                };
            }
            const adminUser = {
                id: dbAdmin.id,
                name: dbAdmin.nome,
                email: dbAdmin.email,
                password: dbAdmin.senha,
                role: 'admin'
            };
            setCurrentUser(adminUser);
            localStorage.setItem('mbs_current_user', JSON.stringify(adminUser));
            return adminUser;
        }
        // Login normal via Supabase para outros usuários
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').select('*').eq('email', email).eq('senha', password).single();
        if (error || !data) {
            console.error("Erro no login:", error);
            return null;
        }
        const user = {
            id: data.id,
            name: data.nome,
            email: data.email,
            password: data.senha,
            role: data.funcao?.toLowerCase() === 'barbeiro' ? 'barber' : data.funcao?.toLowerCase() === 'cliente' ? 'client' : data.funcao,
            photo: data.foto_url || "",
            phone: data.telefone || ""
        };
        setCurrentUser(user);
        localStorage.setItem('mbs_current_user', JSON.stringify(user));
        return user;
    };
    const register = async (name, email, password, role, phone)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').insert([
            {
                nome: name,
                email,
                senha: password,
                funcao: role,
                telefone: phone
            }
        ]).select().single();
        if (error || !data) {
            console.error("Erro no cadastro:", error);
            return null;
        }
        const newUser = {
            id: data.id,
            name: data.nome,
            email: data.email,
            password: data.senha,
            role: data.funcao?.toLowerCase() === 'barbeiro' ? 'barber' : data.funcao?.toLowerCase() === 'cliente' ? 'client' : data.funcao,
            photo: data.foto_url || "",
            phone: data.telefone || ""
        };
        setCurrentUser(newUser);
        setUsers((prev)=>[
                ...prev,
                newUser
            ]);
        localStorage.setItem('mbs_current_user', JSON.stringify(newUser));
        return newUser;
    };
    const logout = ()=>{
        setCurrentUser(null);
        localStorage.removeItem('mbs_current_user');
    };
    // Listener para capturar o login social (Google) e sincronizar com o nosso banco
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BarberProvider.useEffect": ()=>{
            const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "BarberProvider.useEffect": async (event, session)=>{
                    if (event === 'SIGNED_IN' && session?.user) {
                        const { user } = session;
                        // 1. Verifica se o usuário já existe na nossa tabela 'usuarios'
                        const { data: existingUser } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').select('*').eq('email', user.email).single();
                        let finalUser;
                        if (existingUser) {
                            finalUser = {
                                id: existingUser.id,
                                name: existingUser.nome,
                                email: existingUser.email,
                                role: existingUser.funcao?.toLowerCase() === 'barbeiro' ? 'barber' : existingUser.funcao?.toLowerCase() === 'cliente' ? 'client' : existingUser.funcao,
                                photo: existingUser.foto_url,
                                phone: existingUser.telefone
                            };
                        } else {
                            // 2. Se for novo, cria na nossa tabela como 'client'
                            const { data: newUser } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').insert([
                                {
                                    nome: user.user_metadata.full_name || user.email?.split('@')[0],
                                    email: user.email,
                                    funcao: 'client',
                                    foto_url: user.user_metadata.avatar_url
                                }
                            ]).select().single();
                            finalUser = {
                                id: newUser.id,
                                name: newUser.nome,
                                email: newUser.email,
                                role: 'client',
                                photo: newUser.foto_url,
                                phone: ""
                            };
                        }
                        setCurrentUser(finalUser);
                        localStorage.setItem('mbs_current_user', JSON.stringify(finalUser));
                    }
                }
            }["BarberProvider.useEffect"]);
            return ({
                "BarberProvider.useEffect": ()=>subscription.unsubscribe()
            })["BarberProvider.useEffect"];
        }
    }["BarberProvider.useEffect"], []);
    const loginWithGoogle = async ()=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/client`
            }
        });
        if (error) {
            console.error('Erro ao fazer login com Google:', error.message);
        }
    };
    const addAppointment = async (appData)=>{
        const barber = barbers.find((b)=>b.id === appData.barberId);
        const service = services.find((s)=>s.id === appData.serviceId);
        const commissionVal = appData.price * (barber?.commission || 40) / 100;
        const { data: newApp, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('agendamentos').insert([
            {
                cliente_id: appData.clientId,
                barbeiro_id: appData.barberId,
                servico_id: appData.serviceId,
                nome_cliente: appData.clientName,
                nome_barbeiro: barber?.name || appData.barberName,
                nome_servico: service?.name || appData.serviceName,
                valor: appData.price,
                comissao_gerada: commissionVal,
                data: appData.date,
                horario: appData.time,
                status: 'agendado'
            }
        ]).select().single();
        if (error) {
            console.error("Erro ao agendar:", error);
            return;
        }
        const formattedApp = {
            id: newApp.id,
            clientId: newApp.cliente_id,
            clientName: newApp.nome_cliente,
            barberId: newApp.barbeiro_id,
            barberName: newApp.nome_barbeiro,
            serviceId: newApp.servico_id,
            serviceName: newApp.nome_servico,
            price: newApp.valor,
            commission: newApp.comissao_gerada,
            date: newApp.data,
            time: newApp.horario,
            status: newApp.status,
            createdAt: newApp.created_at
        };
        setAppointments((prev)=>[
                formattedApp,
                ...prev
            ]);
    };
    const updateAppointmentStatus = async (id, status)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('agendamentos').update({
            status
        }).eq('id', id);
        if (error) {
            console.error("Erro ao atualizar status:", error);
            return;
        }
        setAppointments((prev)=>prev.map((app)=>app.id === id ? {
                    ...app,
                    status
                } : app));
    };
    const addService = async (data)=>{
        const { data: newService, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('servicos').insert([
            {
                nome: data.name,
                descricao: data.description,
                preco: data.price,
                duracao: data.duration,
                icone: data.icon,
                popular: data.popular,
                ativo: data.active
            }
        ]).select().single();
        if (error) {
            console.error("Erro ao adicionar serviço:", error);
            return;
        }
        const formattedService = {
            id: newService.id,
            name: newService.nome,
            description: newService.descricao,
            price: newService.preco,
            duration: newService.duracao,
            icon: newService.icone,
            popular: newService.popular,
            active: newService.ativo
        };
        setServices((prev)=>[
                ...prev,
                formattedService
            ]);
    };
    const updateService = async (id, data)=>{
        const updateData = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.description !== undefined) updateData.descricao = data.description;
        if (data.price !== undefined) updateData.preco = data.price;
        if (data.duration !== undefined) updateData.duracao = data.duration;
        if (data.icon !== undefined) updateData.icone = data.icon;
        if (data.popular !== undefined) updateData.popular = data.popular;
        if (data.active !== undefined) updateData.ativo = data.active;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('servicos').update(updateData).eq('id', id);
        if (error) {
            console.error("Erro ao atualizar serviço:", error);
            return;
        }
        setServices((prev)=>prev.map((s)=>s.id === id ? {
                    ...s,
                    ...data
                } : s));
    };
    const removeService = async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('servicos').delete().eq('id', id);
        if (error) {
            console.error("Erro ao remover serviço:", error);
            return;
        }
        setServices((prev)=>prev.filter((s)=>s.id !== id));
    };
    const addBarber = async (data)=>{
        // 1. Check if User already exists
        let userId = "";
        let finalUserRole = 'barber';
        const { data: existingUser } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').select('*').eq('email', data.email).single();
        if (existingUser) {
            userId = existingUser.id;
            // Se o usuário existir, mantemos a função dele ou garantimos que seja pelo menos barber
            finalUserRole = existingUser.funcao;
        } else {
            // 2. Create New User if doesn't exist
            const { data: newUser, error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').insert([
                {
                    nome: data.name,
                    email: data.email,
                    senha: data.password || '123456',
                    funcao: 'barber'
                }
            ]).select().single();
            if (userError) {
                console.error("Erro ao criar usuário para o barbeiro:", userError);
                return;
            }
            userId = newUser.id;
        }
        // 3. Create Barber linked to User
        const { data: newBarber, error: barberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('barbeiros').insert([
            {
                usuario_id: userId,
                nome: data.name,
                especialidade: data.specialty,
                comissao: data.commission,
                foto_url: data.photo,
                horarios_trabalho: data.workingHours,
                ativo: true
            }
        ]).select().single();
        if (barberError) {
            console.error("Erro ao criar barbeiro:", barberError);
            return;
        }
        const formattedBarber = {
            ...newBarber,
            userId: newBarber.usuario_id,
            name: newBarber.nome,
            specialty: newBarber.especialidade,
            rating: newBarber.rating || 5.0,
            reviews: newBarber.reviews || 0,
            active: newBarber.ativo,
            commission: newBarber.comissao || 40,
            workingHours: newBarber.horarios_trabalho || "08:00 às 19:00"
        };
        setBarbers((prev)=>[
                ...prev,
                formattedBarber
            ]);
    };
    const updateBarber = async (id, data)=>{
        const updateData = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.specialty !== undefined) updateData.especialidade = data.specialty;
        if (data.commission !== undefined) updateData.comissao = data.commission;
        if (data.active !== undefined) updateData.ativo = data.active;
        if (data.photo !== undefined) updateData.foto_url = data.photo;
        if (data.workingHours !== undefined) updateData.horarios_trabalho = data.workingHours;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('barbeiros').update(updateData).eq('id', id);
        if (error) {
            console.error("Erro ao atualizar barbeiro:", error);
            return;
        }
        setBarbers((prev)=>prev.map((b)=>b.id === id ? {
                    ...b,
                    ...data
                } : b));
    };
    const removeBarber = async (id)=>{
        const barber = barbers.find((b)=>b.id === id);
        if (!barber) return;
        // In a real app, you might want to deactivate instead of delete, 
        // but here we follow the existing pattern of removal.
        const { error: barberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('barbeiros').delete().eq('id', id);
        if (barberError) {
            console.error("Erro ao remover barbeiro:", barberError);
            return;
        }
        const { error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').delete().eq('id', barber.userId);
        if (userError) console.error("Erro ao remover usuário do barbeiro:", userError);
        setUsers((prev)=>prev.filter((u)=>u.id !== barber.userId));
        setBarbers((prev)=>prev.filter((b)=>b.id !== id));
    };
    const updateUser = async (id, data)=>{
        const updateData = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.password !== undefined) updateData.senha = data.password;
        if (data.role !== undefined) updateData.funcao = data.role;
        if (data.phone !== undefined) updateData.telefone = data.phone;
        if (data.photo !== undefined) updateData.foto_url = data.photo;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('usuarios').update(updateData).eq('id', id);
        if (error) {
            console.error("Erro ao atualizar usuário:", error);
            return;
        }
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
    const updateShopConfig = async (data)=>{
        const updateData = {
            id: 1
        };
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.address !== undefined) updateData.endereco = data.address;
        if (data.phone !== undefined) updateData.telefone = data.phone;
        if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
        if (data.email !== undefined) {
            updateData.email = data.email;
            updateData['e-mail'] = data.email; // Support both variations
        }
        if (data.workingHours !== undefined) updateData.horarios_funcionamento = data.workingHours;
        if (data.social !== undefined) updateData.redes_sociais = data.social;
        if (data.logo !== undefined) updateData.logo = data.logo;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('configuracoes_loja').upsert(updateData);
        if (error) {
            console.error("Erro ao atualizar configuração:", error);
            return;
        }
        setShopConfig((prev)=>({
                ...prev,
                ...data
            }));
    };
    const addPromotion = async (data)=>{
        const { data: newPromo, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('promocoes').insert([
            {
                tag: data.tag,
                titulo: data.title,
                descricao: data.description,
                preco: data.price,
                gradiente_cor: data.color,
                accent_bg: data.accentBg,
                texto_cor: data.textColor,
                ativo: data.active
            }
        ]).select().single();
        if (error) {
            console.error("Erro ao adicionar promoção:", error);
            return;
        }
        const formattedPromo = {
            ...newPromo,
            color: newPromo.gradiente_cor,
            accentBg: newPromo.accent_bg,
            textColor: newPromo.texto_cor
        };
        setPromotions((prev)=>[
                ...prev,
                formattedPromo
            ]);
    };
    const updatePromotion = async (id, data)=>{
        const updateData = {};
        if (data.tag !== undefined) updateData.tag = data.tag;
        if (data.title !== undefined) updateData.titulo = data.title;
        if (data.description !== undefined) updateData.descricao = data.description;
        if (data.price !== undefined) updateData.preco = data.price;
        if (data.color !== undefined) updateData.gradiente_cor = data.color;
        if (data.accentBg !== undefined) updateData.accent_bg = data.accentBg;
        if (data.textColor !== undefined) updateData.texto_cor = data.textColor;
        if (data.active !== undefined) updateData.ativo = data.active;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('promocoes').update(updateData).eq('id', id);
        if (error) {
            console.error("Erro ao atualizar promoção:", error);
            return;
        }
        setPromotions((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    ...data
                } : p));
    };
    const removePromotion = async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('promocoes').delete().eq('id', id);
        if (error) {
            console.error("Erro ao remover promoção:", error);
            return;
        }
        setPromotions((prev)=>prev.filter((p)=>p.id !== id));
    };
    const addProduct = async (data)=>{
        const { data: newProds, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('estoque').insert([
            {
                nome: data.name,
                categoria: data.category,
                preco: data.price,
                quantidade: data.stock,
                minimo: data.minStock,
                imagem: data.image,
                ativo: data.active
            }
        ]).select();
        if (error) {
            console.error("Erro ao adicionar produto:", error);
            throw error;
        }
        if (newProds && newProds.length > 0) {
            const newProd = newProds[0];
            const formattedProd = {
                id: newProd.id,
                name: newProd.nome,
                category: newProd.categoria,
                price: newProd.preco,
                stock: newProd.quantidade,
                minStock: newProd.minimo,
                image: newProd.imagem,
                active: newProd.ativo
            };
            setProducts((prev)=>[
                    ...prev,
                    formattedProd
                ]);
        }
    };
    const updateProduct = async (id, data)=>{
        const updateData = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.category !== undefined) updateData.categoria = data.category;
        if (data.price !== undefined) updateData.preco = data.price;
        if (data.stock !== undefined) updateData.quantidade = data.stock;
        if (data.minStock !== undefined) updateData.minimo = data.minStock;
        if (data.image !== undefined) updateData.imagem = data.image;
        if (data.active !== undefined) updateData.ativo = data.active;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('estoque').update(updateData).eq('id', id);
        if (error) {
            console.error("Erro ao atualizar produto:", error);
            throw error;
        }
        setProducts((prev)=>prev.map((p)=>p.id === id ? {
                    ...p,
                    ...data
                } : p));
    };
    const removeProduct = async (id)=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('estoque').delete().eq('id', id);
        if (error) {
            console.error("Erro ao remover produto:", error);
            return;
        }
        setProducts((prev)=>prev.filter((p)=>p.id !== id));
    };
    const addToCart = (product)=>{
        setCart((prev)=>{
            const existing = prev.find((item)=>item.product.id === product.id);
            if (existing) {
                return prev.map((item)=>item.product.id === product.id ? {
                        ...item,
                        quantity: item.quantity + 1
                    } : item);
            }
            return [
                ...prev,
                {
                    product,
                    quantity: 1
                }
            ];
        });
    };
    const removeFromCart = (productId)=>{
        setCart((prev)=>prev.filter((item)=>item.product.id !== productId));
    };
    const clearCart = ()=>setCart([]);
    const updateCartQuantity = (productId, delta)=>{
        setCart((prev)=>prev.map((item)=>{
                if (item.product.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return {
                        ...item,
                        quantity: newQty
                    };
                }
                return item;
            }));
    };
    const addExpense = async (data)=>{
        const { data: newExpense, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('despesas').insert([
            {
                label: data.label,
                value: data.value,
                date: data.date,
                time: data.time
            }
        ]).select().single();
        if (error) {
            console.error("Erro ao adicionar despesa:", error);
            return;
        }
        const formattedExpense = {
            id: newExpense.id,
            label: newExpense.label,
            value: Number(newExpense.value),
            date: newExpense.date,
            time: newExpense.time,
            createdAt: newExpense.created_at
        };
        setExpenses((prev)=>[
                ...prev,
                formattedExpense
            ]);
    };
    const addIncome = async (data)=>{
        const { data: newIncome, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('entradas_avulsas').insert([
            {
                label: data.label,
                value: data.value,
                date: data.date,
                time: data.time
            }
        ]).select().single();
        if (error) {
            console.error("Erro ao adicionar entrada:", error);
            return;
        }
        const formattedIncome = {
            id: newIncome.id,
            label: newIncome.label,
            value: Number(newIncome.value),
            date: newIncome.date,
            time: newIncome.time,
            createdAt: newIncome.created_at
        };
        setIncomes((prev)=>[
                ...prev,
                formattedIncome
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BarberContext.Provider, {
        value: {
            users,
            services,
            barbers,
            appointments,
            promotions,
            products,
            currentUser,
            shopConfig,
            isAuthReady,
            cart,
            expenses,
            incomes,
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
            removePromotion,
            addProduct,
            updateProduct,
            removeProduct,
            loginWithGoogle,
            addToCart,
            removeFromCart,
            clearCart,
            updateCartQuantity,
            addExpense,
            addIncome
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/BarberContext.tsx",
        lineNumber: 1033,
        columnNumber: 9
    }, this);
}
_s(BarberProvider, "wrsvfZ8SK/7jx8xv39NtUCkSLhM=");
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
]);

//# sourceMappingURL=_d0717019._.js.map