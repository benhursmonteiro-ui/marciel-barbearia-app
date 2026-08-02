"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth-cookies';

// Types representing the database tables
export type UserRole = 'admin' | 'barber' | 'client';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    photo?: string;
    blocked?: boolean;
}

export interface Barber {
    id: string;
    userId: string;
    name: string;
    specialty: string;
    commission: number;
    rating: number;
    reviews: number;
    photo?: string;
    active: boolean;
    workingHours?: string;
    blockedSlots: string[];
    holidays: number[];
}

export interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: string;
    icon?: string;
    popular?: boolean;
    active: boolean;
}

export interface ShopConfig {
    id?: number;
    name: string;
    logo: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    workingHours: {
        [key: string]: { start: string; end: string; closed: boolean };
    };
    social: {
        instagram: string;
        facebook: string;
    };
    blockedSlots: string[];
    holidays: number[];
}

export type AppointmentStatus = 'agendado' | 'confirmado' | 'em atendimento' | 'concluido' | 'cancelado';
export type PaymentStatus = 'pago' | 'pendente' | 'fiado';
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao' | 'fiado';

export interface Appointment {
    id: string;
    clientId: string;
    clientName: string;
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    price: number;
    commission: number;
    date: string;
    time: string;
    status: AppointmentStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    isFiado?: boolean;
    fiadoPaid?: boolean;
    fiadoPaidAt?: string;
    createdAt: string;
}

export interface Promotion {
    id: string;
    tag: string;
    title: string;
    description: string;
    price: number;
    color: string;
    accentBg: string;
    textColor: string;
    active: boolean;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    image?: string;
    active: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Expense {
    id: string;
    label: string;
    value: number;
    date: string;
    time: string;
    createdAt?: string;
}

export interface Income {
    id: string;
    label: string;
    value: number;
    date: string;
    time: string;
    createdAt?: string;
}

export interface MBSNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    referenceId?: string;
    createdAt: string;
}

interface BarberContextType {
    users: User[];
    services: Service[];
    barbers: Barber[];
    appointments: Appointment[];
    promotions: Promotion[];
    products: Product[];
    currentUser: User | null;
    shopConfig: ShopConfig;
    isAuthReady: boolean;
    cart: CartItem[];
    expenses: Expense[];
    incomes: Income[];
    notifications: MBSNotification[];

    // Actions
    refreshData: () => Promise<void>;
    login: (email: string, password: string) => Promise<User | null>;
    logout: () => void;
    register: (name: string, email: string, password: string, role: UserRole, phone?: string) => Promise<User | null>;
    addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'commission'>) => Promise<void>;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
    addService: (service: Omit<Service, 'id'>) => Promise<void>;
    updateService: (id: string, service: Partial<Service>) => Promise<void>;
    removeService: (id: string) => Promise<void>;
    addBarber: (barber: Omit<Barber, 'id' | 'userId' | 'rating' | 'reviews' | 'active'> & { email: string; password?: string }) => Promise<void>;
    updateBarber: (id: string, data: Partial<Barber>) => Promise<void>;
    removeBarber: (id: string) => Promise<void>;
    updateUser: (id: string, data: Partial<User>) => Promise<void>;
    updateShopConfig: (config: Partial<ShopConfig>) => Promise<void>;
    addPromotion: (promo: Omit<Promotion, 'id'>) => Promise<void>;
    updatePromotion: (id: string, data: Partial<Promotion>) => Promise<void>;
    removePromotion: (id: string) => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
    removeProduct: (id: string) => Promise<void>;
    markNotificationAsRead: (id: string) => Promise<void>;
    resetToSeed: () => void;
    loginWithGoogle: () => Promise<void>;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    updateCartQuantity: (productId: string, delta: number) => void;
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
    addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => Promise<void>;
    updateAppointmentPayment: (id: string, paymentStatus: PaymentStatus, paymentMethod?: PaymentMethod) => Promise<void>;
    addFiadoEntry: (clientId: string, clientName: string, serviceName: string, price: number, barberName?: string, date?: string) => Promise<void>;
    resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export function BarberProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [notifications, setNotifications] = useState<MBSNotification[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [shopConfig, setShopConfig] = useState<ShopConfig>({
        id: 1,
        name: "Marciel BarberShop",
        logo: "",
        address: "Rua Castro Alves, 261 - Junco, Picos - PI, - 64600-000",
        phone: "(89) 9985-0601",
        whatsapp: "(89) 9985-0601",
        email: "[EMAIL_ADDRESS]",
        workingHours: {
            "Segunda": { start: "00:00", end: "00:00", closed: true },
            "Terça": { start: "08:00", end: "19:00", closed: false },
            "Quarta": { start: "08:00", end: "19:00", closed: false },
            "Quinta": { start: "08:00", end: "19:00", closed: false },
            "Sexta": { start: "08:00", end: "19:00", closed: false },
            "Sábado": { start: "08:00", end: "19:00", closed: false },
            "Domingo": { start: "00:00", end: "00:00", closed: true }
        },
        social: { instagram: "@marcielbarber", facebook: "marcielbarbershop" },
        blockedSlots: [],
        holidays: []
    });

    // Flag to control auth readiness before redirect
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Function to load all data from Supabase
    const fetchFromSupabase = async () => {
        try {
            const safeFetch = async (query: any, tableName?: string) => {
                const { data, error } = await query;
                if (error) {
                    console.warn(`[MBS] Fetch warning (${tableName || 'unknown'}):`, error.message);
                    return null;
                }
                if (tableName) {
                    console.log(`[MBS] Fetched ${tableName}: ${data?.length ?? 0} records`);
                }
                return data;
            };

            const [
                dbUsers,
                dbBarbers,
                dbServices,
                dbAppointments,
                dbPromotions,
                dbProducts,
                dbConfig,
                dbExpenses,
                dbIncomes,
                dbNotifications
            ] = await Promise.all([
                safeFetch(supabase.from('usuarios').select('*'), 'usuarios'),
                safeFetch(supabase.from('barbeiros').select('*'), 'barbeiros'),
                safeFetch(supabase.from('servicos').select('*'), 'servicos'),
                safeFetch(supabase.from('agendamentos').select('*'), 'agendamentos'),
                safeFetch(supabase.from('promocoes').select('*'), 'promocoes'),
                safeFetch(supabase.from('estoque').select('*'), 'estoque'),
                safeFetch(supabase.from('configuracoes_loja').select('*'), 'configuracoes_loja'),
                safeFetch(supabase.from('despesas').select('*'), 'despesas'),
                safeFetch(supabase.from('entradas_avulsas').select('*'), 'entradas_avulsas'),
                safeFetch(supabase.from('notificacoes').select('*').order('created_at', { ascending: false }), 'notificacoes')
            ]);

            if (dbUsers) setUsers(dbUsers.map((u: any) => ({
                id: u.id,
                name: u.nome,
                email: u.email,
                password: u.senha,
                role: (u.funcao?.toLowerCase() === 'barbeiro' ? 'barber' :
                    u.funcao?.toLowerCase() === 'cliente' ? 'client' :
                        u.funcao) as UserRole,
                blocked: u.bloqueado || false,
                photo: u.foto_url || "",
                phone: u.telefone || ""
            })));
            
            if (dbBarbers) setBarbers(dbBarbers.map((b: any) => ({
                id: b.id,
                userId: b.usuario_id,
                name: b.nome,
                specialty: b.especialidade,
                rating: b.rating || b.avaliacao || 5.0,
                reviews: b.reviews || b.total_avaliacoes || 0,
                commission: b.comissao,
                active: b.ativo,
                workingHours: b.horarios_trabalho,
                blockedSlots: b.horarios_bloqueados || [],
                holidays: b.feriados || []
            })));
            
            if (dbServices) setServices(dbServices.map((s: any) => ({
                id: s.id,
                name: s.nome,
                description: s.descricao,
                duration: s.duracao,
                price: s.preco,
                icon: s.icone,
                popular: s.popular,
                active: s.ativo !== false
            })));
            
            if (dbAppointments) {
                const sortedApps = dbAppointments.map((a: any) => ({
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
                })).sort((a: any, b: any) => {
                    const dateCompare = (b.date || "").localeCompare(a.date || "");
                    if (dateCompare !== 0) return dateCompare;
                    return (b.time || "").localeCompare(a.time || "");
                });
                setAppointments(sortedApps);
            }
            
            if (dbPromotions) setPromotions(dbPromotions.map((p: any) => ({
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
            
            if (dbProducts) setProducts(dbProducts.map((p: any) => ({
                id: p.id,
                name: p.nome,
                category: p.categoria,
                price: p.preco,
                stock: p.quantidade,
                minStock: p.minimo,
                image: p.imagem,
                active: p.ativo !== false
            })));
            
            if (dbConfig && Array.isArray(dbConfig) && dbConfig.length > 0) {
                const cfg = dbConfig[0];
                setShopConfig(prev => ({
                    id: cfg.id || prev.id,
                    name: cfg.nome || prev.name,
                    logo: cfg.logo || prev.logo,
                    address: cfg.endereco || prev.address,
                    phone: cfg.telefone || prev.phone,
                    whatsapp: cfg.whatsapp || prev.whatsapp,
                    email: cfg.email || cfg['e-mail'] || prev.email,
                    workingHours: cfg.horarios_funcionamento || prev.workingHours,
                    social: cfg.redes_sociais || prev.social,
                    blockedSlots: cfg.horarios_bloqueados || prev.blockedSlots || [],
                    holidays: cfg.feriados || prev.holidays || []
                }));
            }
            
            if (dbExpenses) setExpenses(dbExpenses.map((e: any) => ({
                id: e.id,
                label: e.label,
                value: Number(e.value),
                date: e.date,
                time: e.time,
                createdAt: e.created_at
            })));
            
            if (dbIncomes) setIncomes(dbIncomes.map((i: any) => ({
                id: i.id,
                label: i.label,
                value: Number(i.value),
                date: i.date,
                time: i.time,
                createdAt: i.created_at
            })));
            
            if (dbNotifications) setNotifications(dbNotifications.map((n: any) => ({
                id: n.id,
                userId: n.usuario_id,
                title: n.titulo,
                message: n.mensagem,
                type: n.tipo,
                read: n.lida,
                referenceId: n.referencia_id,
                createdAt: n.created_at
            })));

        } catch (error) {
            console.error("Critical error in fetchFromSupabase:", error);
        }
    };

    // Initial Load and Seed
    useEffect(() => {
        const init = async () => {
            await fetchFromSupabase();

            // Restore session from localStorage
            const savedCurrentUser = localStorage.getItem('mbs_current_user');
            if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));

            setIsLoaded(true);
            setIsAuthReady(true);
        };

        init();
    }, []);

    // Realtime Subscriptions
    useEffect(() => {
        const agendamentosChannel = supabase.channel('public:agendamentos')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'agendamentos' }, (payload) => {
                console.log('[MBS] Realtime: agendamentos changed', payload.eventType);
                fetchFromSupabase();
            })
            .subscribe((status) => {
                console.log('[MBS] Realtime agendamentos subscription:', status);
            });

        const notificacoesChannel = supabase.channel('public:notificacoes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, (payload) => {
                console.log('[MBS] Realtime: notificacoes changed', payload.eventType);
                fetchFromSupabase();
            })
            .subscribe((status) => {
                console.log('[MBS] Realtime notificacoes subscription:', status);
            });

        const barbeirosChannel = supabase.channel('public:barbeiros')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'barbeiros' }, (payload) => {
                console.log('[MBS] Realtime: barbeiros changed', payload.eventType);
                fetchFromSupabase();
            })
            .subscribe();

        const servicosChannel = supabase.channel('public:servicos')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'servicos' }, (payload) => {
                console.log('[MBS] Realtime: servicos changed', payload.eventType);
                fetchFromSupabase();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(agendamentosChannel);
            supabase.removeChannel(notificacoesChannel);
            supabase.removeChannel(barbeirosChannel);
            supabase.removeChannel(servicosChannel);
        };
    }, []);

    // Periodic polling every 30 seconds to ensure data stays fresh
    // This guarantees appointments appear even if realtime fails
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('[MBS] Periodic refresh triggered');
            fetchFromSupabase();
        }, 30000);

        return () => clearInterval(interval);
    }, []);


    const resetToSeed = () => {
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

    const login = async (email: string, password: string) => {
        // Admin fixo — funciona mesmo se o Supabase ainda não tiver o usuário
        if (email === 'marciel_farias@admin.com' && password === '150326') {
            // Tenta buscar o admin no banco (ignorando erros de RLS se houver)
            const { data: dbAdmin } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single();

            const adminUser: User = {
                id: dbAdmin?.id || 'admin-temp-id',
                name: dbAdmin?.nome || 'Marciel',
                email: email,
                password: password,
                role: 'admin'
            };

            setCurrentUser(adminUser);
            localStorage.setItem('mbs_current_user', JSON.stringify(adminUser));
            setAuthCookie(adminUser);
            return adminUser;
        }

        // Login via RPC segura (protegida contra RLS)
        const { data, error } = await supabase
            .rpc('login_user', { 
                p_email: email, 
                p_password: password 
            })
            .single() as { data: any, error: any };

        if (error || !data) {
            console.error("Erro no login:", error);
            return null;
        }

        // Tenta buscar diretamente da tabela usuarios para verificar se está bloqueado!
        const { data: dbUser } = await supabase
            .from('usuarios')
            .select('bloqueado')
            .eq('id', data.id)
            .single();

        if (dbUser?.bloqueado) {
            throw new Error("Sua conta está bloqueada. Entre em contato com o administrador.");
        }

        const user: User = {
            id: data.id,
            name: data.nome,
            email: data.email,
            password: data.senha,
            role: (data.funcao?.toLowerCase() === 'barbeiro' ? 'barber' :
                data.funcao?.toLowerCase() === 'cliente' ? 'client' :
                    data.funcao) as UserRole,
            blocked: dbUser?.bloqueado || false,
            photo: data.foto_url || "",
            phone: data.telefone || ""
        };

        setCurrentUser(user);
        localStorage.setItem('mbs_current_user', JSON.stringify(user));
        setAuthCookie(user);
        
        // Sync data for the logged-in user
        await fetchFromSupabase();
        
        return user;
    };

    const register = async (name: string, email: string, password: string, role: UserRole, phone?: string) => {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nome: name, email, senha: password, funcao: role, telefone: phone }])
            .select()
            .single();

        if (error || !data) {
            console.error("Erro no cadastro:", error);
            return null;
        }

        const newUser: User = { 
            id: data.id,
            name: data.nome,
            email: data.email,
            password: data.senha,
            role: (data.funcao?.toLowerCase() === 'barbeiro' ? 'barber' :
                data.funcao?.toLowerCase() === 'cliente' ? 'client' :
                    data.funcao) as UserRole,
            photo: data.foto_url || "",
            phone: data.telefone || ""
        };
        setCurrentUser(newUser);
        setUsers(prev => [...prev, newUser]);
        localStorage.setItem('mbs_current_user', JSON.stringify(newUser));
        setAuthCookie(newUser);
        
        // Recalcular estado global
        await fetchFromSupabase();
        
        return newUser;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('mbs_current_user');
        clearAuthCookie();
    };

    // Listener para capturar o login social (Google) e sincronizar com o nosso banco
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { user } = session;
                
                // 1. Verifica se o usuário já existe na nossa tabela 'usuarios'
                const { data: existingUser } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('email', user.email)
                    .single();

                let finalUser: User;

                if (existingUser) {
                    finalUser = {
                        id: existingUser.id,
                        name: existingUser.nome,
                        email: existingUser.email,
                        role: (existingUser.funcao?.toLowerCase() === 'barbeiro' ? 'barber' :
                             existingUser.funcao?.toLowerCase() === 'cliente' ? 'client' :
                             existingUser.funcao) as UserRole,
                        photo: existingUser.foto_url,
                        phone: existingUser.telefone
                    };
                } else {
                    // 2. Se for novo, cria na nossa tabela como 'client'
                    const { data: newUser } = await supabase
                        .from('usuarios')
                        .insert([{
                            nome: user.user_metadata.full_name || user.email?.split('@')[0],
                            email: user.email,
                            funcao: 'client',
                            foto_url: user.user_metadata.avatar_url
                        }])
                        .select()
                        .single();
                    
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
                setAuthCookie(finalUser);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/client` 
            }
        });
        
        if (error) {
            console.error('Erro ao fazer login com Google:', error.message);
        }
    };

    const addAppointment = async (appData: Omit<Appointment, 'id' | 'createdAt' | 'commission'>) => {
        const barber = barbers.find(b => b.id === appData.barberId);
        const service = services.find(s => s.id === appData.serviceId);
        const commissionVal = (appData.price * (barber?.commission || 40)) / 100;

        // Verificar se existe algum agendamento cancelado para esse horário/barbeiro para reaproveitar a linha e evitar conflito de chave única
        const { data: cancelledApps } = await supabase
            .from('agendamentos')
            .select('id')
            .eq('barbeiro_id', appData.barberId)
            .eq('data', appData.date)
            .eq('horario', appData.time)
            .eq('status', 'cancelado')
            .limit(1);

        let newApp: any = null;
        let error: any = null;

        if (cancelledApps && cancelledApps.length > 0) {
            const cancelledId = cancelledApps[0].id;
            const { data: updatedList, error: updateErr } = await supabase
                .from('agendamentos')
                .update({
                    cliente_id: appData.clientId,
                    servico_id: appData.serviceId,
                    nome_cliente: appData.clientName,
                    nome_barbeiro: barber?.name || appData.barberName,
                    nome_servico: service?.name || appData.serviceName,
                    valor: appData.price,
                    comissao_gerada: commissionVal,
                    status: 'agendado'
                })
                .eq('id', cancelledId)
                .select();

            newApp = updatedList?.[0];
            error = updateErr;
        } else {
            const { data: newAppList, error: insertErr } = await supabase
                .from('agendamentos')
                .insert([{
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
                }])
                .select();

            newApp = newAppList?.[0];
            error = insertErr;
        }

        if (error) {
            console.error("Erro ao agendar no Supabase:", error);
            throw new Error(`Erro ao salvar no banco de dados: ${error.message}`);
        }

        const formattedApp: Appointment = {
            id: newApp?.id || Math.random().toString(36).substr(2, 9),
            clientId: newApp?.cliente_id || appData.clientId,
            clientName: newApp?.nome_cliente || appData.clientName,
            barberId: newApp?.barbeiro_id || appData.barberId,
            barberName: newApp?.nome_barbeiro || barber?.name || appData.barberName,
            serviceId: newApp?.servico_id || appData.serviceId,
            serviceName: newApp?.nome_servico || service?.name || appData.serviceName,
            price: newApp?.valor || appData.price,
            commission: newApp?.comissao_gerada || commissionVal,
            date: newApp?.data || appData.date,
            time: newApp?.horario || appData.time,
            status: newApp?.status || 'agendado',
            createdAt: newApp?.created_at || new Date().toISOString()
        };

        setAppointments(prev => {
            const newAppointments = [formattedApp, ...prev.filter(a => a.id !== formattedApp.id)];
            return newAppointments.sort((a, b) => {
                const dateCompare = (b.date || "").localeCompare(a.date || "");
                if (dateCompare !== 0) return dateCompare;
                return (b.time || "").localeCompare(a.time || "");
            });
        });

        // NOTIFICATIONS
        const adminUsers = users.filter(u => u.role === 'admin');
        const barberUser = users.find(u => u.id === barber?.userId || u.name.toLowerCase() === barber?.name?.toLowerCase());

        const notificationInserts = [];

        // For Barber
        if (barberUser) {
            notificationInserts.push({
                usuario_id: barberUser.id,
                titulo: 'Novo Agendamento!',
                mensagem: `${formattedApp.clientName} agendou ${formattedApp.serviceName} para ${formattedApp.date} às ${formattedApp.time}.`,
                tipo: 'novo_agendamento',
                referencia_id: formattedApp.id
            });
        }

        // For Admins
        adminUsers.forEach(admin => {
            notificationInserts.push({
                usuario_id: admin.id,
                titulo: 'Novo Agendamento (Admin)',
                mensagem: `${formattedApp.clientName} agendou com ${formattedApp.barberName} para ${formattedApp.date} às ${formattedApp.time}.`,
                tipo: 'novo_agendamento_admin',
                referencia_id: formattedApp.id
            });
        });

        if (notificationInserts.length > 0) {
            const { data: newNotifs, error: notifError } = await supabase
                .from('notificacoes')
                .insert(notificationInserts)
                .select();

            if (!notifError && newNotifs) {
                const mappedNotifs: MBSNotification[] = newNotifs.map((n: any) => ({
                    id: n.id,
                    userId: n.usuario_id,
                    title: n.titulo,
                    message: n.mensagem,
                    type: n.tipo,
                    read: n.lida,
                    referenceId: n.referencia_id,
                    createdAt: n.created_at
                }));
                setNotifications(prev => [...mappedNotifs, ...prev]);
            }
        }
    };

    const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
        const { error } = await supabase
            .from('agendamentos')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar status:", error);
            return;
        }

        setAppointments(prev => prev.map(app => (app.id === id ? { ...app, status } : app)));

        // If cancelled, notify barber and admin
        if (status === 'cancelado') {
            const app = appointments.find(a => a.id === id);
            if (!app) return;

            const barber = barbers.find(b => b.id === app.barberId);
            const barberUser = users.find(u => u.id === barber?.userId);
            const adminUsers = users.filter(u => u.role === 'admin');

            const notificationInserts = [];

            if (barberUser) {
                notificationInserts.push({
                    usuario_id: barberUser.id,
                    titulo: 'Horário Cancelado',
                    mensagem: `O cliente ${app.clientName} cancelou o horário de ${app.date} às ${app.time}.`,
                    tipo: 'cancelamento',
                    referencia_id: app.id
                });
            }

            adminUsers.forEach(admin => {
                notificationInserts.push({
                    usuario_id: admin.id,
                    titulo: 'Agendamento Cancelado (Admin)',
                    mensagem: `O agendamento de ${app.clientName} com ${app.barberName} para ${app.date} às ${app.time} foi cancelado.`,
                    tipo: 'cancelamento_admin',
                    referencia_id: app.id
                });
            });

            if (notificationInserts.length > 0) {
                const { data: newNotifs } = await supabase
                    .from('notificacoes')
                    .insert(notificationInserts)
                    .select();

                if (newNotifs) {
                    const mappedNotifs: MBSNotification[] = newNotifs.map((n: any) => ({
                        id: n.id,
                        userId: n.usuario_id,
                        title: n.titulo,
                        message: n.mensagem,
                        type: n.tipo,
                        read: n.lida,
                        referenceId: n.referencia_id,
                        createdAt: n.created_at
                    }));
                }
            }
        }
    };

    const updateAppointmentPayment = async (id: string, paymentStatus: PaymentStatus, paymentMethod?: PaymentMethod) => {
        const updateData: any = {
            paymentStatus,
            paymentMethod,
            isFiado: paymentStatus === 'fiado' || paymentMethod === 'fiado',
            fiadoPaid: paymentStatus === 'pago',
            fiadoPaidAt: paymentStatus === 'pago' ? new Date().toISOString() : undefined
        };

        // Try updating Supabase if table columns exist, and always update local state
        try {
            await supabase
                .from('agendamentos')
                .update({
                    status_pagamento: paymentStatus,
                    forma_pagamento: paymentMethod,
                    is_fiado: paymentStatus === 'fiado' || paymentMethod === 'fiado'
                })
                .eq('id', id);
        } catch (e) {
            console.log('Supabase sync info:', e);
        }

        setAppointments(prev => prev.map(app => (app.id === id ? {
            ...app,
            paymentStatus,
            paymentMethod,
            isFiado: paymentStatus === 'fiado' || paymentMethod === 'fiado',
            fiadoPaid: paymentStatus === 'pago',
            fiadoPaidAt: paymentStatus === 'pago' ? new Date().toISOString() : undefined
        } : app)));
    };

    const addFiadoEntry = async (
        clientId: string,
        clientName: string,
        serviceName: string,
        price: number,
        barberName: string = 'Barbearia',
        date: string = new Date().toISOString().split('T')[0]
    ) => {
        const newApp: Appointment = {
            id: `fiado-${Date.now()}`,
            clientId,
            clientName,
            barberId: barbers[0]?.id || '1',
            barberName,
            serviceId: services[0]?.id || '1',
            serviceName: `Corte Fiado: ${serviceName}`,
            price,
            commission: price * 0.5,
            date,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'concluido',
            paymentStatus: 'fiado',
            paymentMethod: 'fiado',
            isFiado: true,
            fiadoPaid: false,
            createdAt: new Date().toISOString()
        };

        try {
            await supabase
                .from('agendamentos')
                .insert([{
                    cliente_id: clientId,
                    barbeiro_id: newApp.barberId,
                    servico_id: newApp.serviceId,
                    data: date,
                    horario: newApp.time,
                    status: 'concluido',
                    preco: price,
                    comissao: newApp.commission,
                    status_pagamento: 'fiado',
                    forma_pagamento: 'fiado',
                    is_fiado: true
                }]);
        } catch (e) {
            console.log('Supabase insert fiado note:', e);
        }

        setAppointments(prev => [newApp, ...prev]);
    };

    const addService = async (data: Omit<Service, 'id'>) => {
        const { data: newService, error } = await supabase
            .from('servicos')
            .insert([{
                nome: data.name,
                descricao: data.description,
                preco: data.price,
                duracao: data.duration,
                icone: data.icon,
                popular: data.popular,
                ativo: data.active
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao adicionar serviço:", error);
            return;
        }

        const formattedService: Service = {
            id: newService.id,
            name: newService.nome,
            description: newService.descricao,
            price: newService.preco,
            duration: newService.duracao,
            icon: newService.icone,
            popular: newService.popular,
            active: newService.ativo
        };

        setServices(prev => [...prev, formattedService]);
    };

    const updateService = async (id: string, data: Partial<Service>) => {
        const updateData: any = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.description !== undefined) updateData.descricao = data.description;
        if (data.price !== undefined) updateData.preco = data.price;
        if (data.duration !== undefined) updateData.duracao = data.duration;
        if (data.icon !== undefined) updateData.icone = data.icon;
        if (data.popular !== undefined) updateData.popular = data.popular;
        if (data.active !== undefined) updateData.ativo = data.active;

        const { error } = await supabase
            .from('servicos')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar serviço:", error);
            return;
        }

        setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const removeService = async (id: string) => {
        const { error } = await supabase
            .from('servicos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Erro ao remover serviço:", error);
            return;
        }

        setServices(prev => prev.filter(s => s.id !== id));
    };

    const addBarber = async (data: Omit<Barber, 'id' | 'userId' | 'rating' | 'reviews' | 'active'> & { email: string; password?: string }) => {
        // 1. Check if User already exists
        let userId = "";
        let finalUserRole = 'barber';

        const { data: existingUser } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', data.email)
            .single();

        if (existingUser) {
            userId = existingUser.id;
            // Se o usuário existir, mantemos a função dele ou garantimos que seja pelo menos barber
            finalUserRole = existingUser.funcao;
        } else {
            // 2. Create New User if doesn't exist
            const { data: newUser, error: userError } = await supabase
                .from('usuarios')
                .insert([{ nome: data.name, email: data.email, senha: data.password || '123456', funcao: 'barber' }])
                .select()
                .single();

            if (userError) {
                console.error("Erro ao criar usuário para o barbeiro:", userError);
                return;
            }
            userId = newUser.id;
        }

        // 3. Create Barber linked to User
        const { data: newBarber, error: barberError } = await supabase
            .from('barbeiros')
            .insert([{
                usuario_id: userId,
                nome: data.name,
                especialidade: data.specialty,
                comissao: data.commission,
                foto_url: data.photo,
                horarios_trabalho: data.workingHours,
                ativo: true,
                horarios_bloqueados: data.blockedSlots || [],
                feriados: data.holidays || []
            }])
            .select()
            .single();

        if (barberError) {
            console.error("Erro ao criar barbeiro:", barberError);
            return;
        }

        const formattedBarber: Barber = {
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
        setBarbers(prev => [...prev, formattedBarber]);
    };

    const updateBarber = async (id: string, data: Partial<Barber>) => {
        const updateData: any = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.specialty !== undefined) updateData.especialidade = data.specialty;
        if (data.commission !== undefined) updateData.comissao = data.commission;
        if (data.active !== undefined) updateData.ativo = data.active;
        if (data.photo !== undefined) updateData.foto_url = data.photo;
        if (data.workingHours !== undefined) updateData.horarios_trabalho = data.workingHours;
        if (data.blockedSlots !== undefined) updateData.horarios_bloqueados = data.blockedSlots;
        if (data.holidays !== undefined) updateData.feriados = data.holidays;

        const { error } = await supabase
            .from('barbeiros')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar barbeiro:", error);
            throw new Error(`Falha ao salvar no banco: ${error.message}`);
        }

        setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    };

    const removeBarber = async (id: string) => {
        const barber = barbers.find(b => b.id === id);
        if (!barber) return;

        // In a real app, you might want to deactivate instead of delete, 
        // but here we follow the existing pattern of removal.
        const { error: barberError } = await supabase.from('barbeiros').delete().eq('id', id);
        if (barberError) {
            console.error("Erro ao remover barbeiro:", barberError);
            throw new Error(`Falha ao remover barbeiro: ${barberError.message}`);
        }

        const { error: userError } = await supabase.from('usuarios').delete().eq('id', barber.userId);
        if (userError) console.error("Erro ao remover usuário do barbeiro:", userError);

        setUsers(prev => prev.filter(u => u.id !== barber.userId));
        setBarbers(prev => prev.filter(b => b.id !== id));
    };

    const updateUser = async (id: string, data: Partial<User>) => {
        const updateData: any = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.password !== undefined) updateData.senha = data.password;
        if (data.role !== undefined) updateData.funcao = data.role;
        if (data.phone !== undefined) updateData.telefone = data.phone;
        if (data.photo !== undefined) updateData.foto_url = data.photo;
        if (data.blocked !== undefined) updateData.bloqueado = data.blocked;

        const { error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw new Error(`Falha ao salvar usuário: ${error.message}`);
        }

        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
        if (currentUser?.id === id) {
            const updated = { ...currentUser, ...data } as User;
            setCurrentUser(updated);
            localStorage.setItem('mbs_current_user', JSON.stringify(updated));
        }
    };

    const updateShopConfig = async (data: Partial<ShopConfig>) => {
        // Se já temos um ID, usamos ele para garantir atualização do registro correto
        // Caso contrário, tentamos usar o ID 1 como padrão para o primeiro registro
        const targetId = shopConfig.id || 1;
        
        const updateData: any = { id: targetId };
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.address !== undefined) updateData.endereco = data.address;
        if (data.phone !== undefined) updateData.telefone = data.phone;
        if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
        if (data.email !== undefined) {
            updateData.email = data.email;
            updateData['e-mail'] = data.email;
        }
        if (data.workingHours !== undefined) updateData.horarios_funcionamento = data.workingHours;
        if (data.social !== undefined) updateData.redes_sociais = data.social;
        if (data.logo !== undefined) updateData.logo = data.logo;
        if (data.blockedSlots !== undefined) updateData.horarios_bloqueados = data.blockedSlots;
        if (data.holidays !== undefined) updateData.feriados = data.holidays;

        console.log("Salvando configurações da loja:", updateData);

        const { data: result, error } = await supabase
            .from('configuracoes_loja')
            .upsert(updateData, { onConflict: 'id' })
            .select();

        if (error) {
            console.error("Erro ao atualizar configuração:", error);
            throw new Error(`Falha ao salvar configurações no banco: ${error.message}`);
        }

        console.log("Configurações salvas com sucesso no banco:", result);
        setShopConfig(prev => ({ ...prev, ...data, id: targetId }));
    };

    const addPromotion = async (data: Omit<Promotion, 'id'>) => {
        const { data: newPromo, error } = await supabase
            .from('promocoes')
            .insert([{
                tag: data.tag,
                titulo: data.title,
                descricao: data.description,
                preco: data.price,
                gradiente_cor: data.color,
                accent_bg: data.accentBg,
                texto_cor: data.textColor,
                ativo: data.active
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao adicionar promoção:", error);
            return;
        }

        const formattedPromo: Promotion = {
            ...newPromo,
            color: newPromo.gradiente_cor,
            accentBg: newPromo.accent_bg,
            textColor: newPromo.texto_cor
        };

        setPromotions(prev => [...prev, formattedPromo]);
    };

    const updatePromotion = async (id: string, data: Partial<Promotion>) => {
        const updateData: any = {};
        if (data.tag !== undefined) updateData.tag = data.tag;
        if (data.title !== undefined) updateData.titulo = data.title;
        if (data.description !== undefined) updateData.descricao = data.description;
        if (data.price !== undefined) updateData.preco = data.price;
        if (data.color !== undefined) updateData.gradiente_cor = data.color;
        if (data.accentBg !== undefined) updateData.accent_bg = data.accentBg;
        if (data.textColor !== undefined) updateData.texto_cor = data.textColor;
        if (data.active !== undefined) updateData.ativo = data.active;

        const { error } = await supabase
            .from('promocoes')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar promoção:", error);
            return;
        }

        setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const removePromotion = async (id: string) => {
        const { error } = await supabase.from('promocoes').delete().eq('id', id);
        if (error) {
            console.error("Erro ao remover promoção:", error);
            return;
        }
        setPromotions(prev => prev.filter(p => p.id !== id));
    };

    const addProduct = async (data: Omit<Product, 'id'>) => {
        const { data: newProds, error } = await supabase
            .from('estoque')
            .insert([{
                nome: data.name,
                categoria: data.category,
                preco: data.price,
                quantidade: data.stock,
                minimo: data.minStock,
                imagem: data.image,
                ativo: data.active
            }])
            .select();

        if (error) {
            console.error("Erro ao adicionar produto:", error);
            throw error;
        }

        if (newProds && newProds.length > 0) {
            const newProd = newProds[0];
            const formattedProd: Product = {
                id: newProd.id,
                name: newProd.nome,
                category: newProd.categoria,
                price: newProd.preco,
                stock: newProd.quantidade,
                minStock: newProd.minimo,
                image: newProd.imagem,
                active: newProd.ativo
            };
            setProducts(prev => [...prev, formattedProd]);
        }
    };

    const updateProduct = async (id: string, data: Partial<Product>) => {
        const updateData: any = {};
        if (data.name !== undefined) updateData.nome = data.name;
        if (data.category !== undefined) updateData.categoria = data.category;
        if (data.price !== undefined) updateData.preco = data.price;
        if (data.stock !== undefined) updateData.quantidade = data.stock;
        if (data.minStock !== undefined) updateData.minimo = data.minStock;
        if (data.image !== undefined) updateData.imagem = data.image;
        if (data.active !== undefined) updateData.ativo = data.active;

        const { error } = await supabase
            .from('estoque')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Erro ao atualizar produto:", error);
            throw error;
        }

        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const removeProduct = async (id: string) => {
        const { error } = await supabase.from('estoque').delete().eq('id', id);
        if (error) {
            console.error("Erro ao remover produto:", error);
            return;
        }
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => setCart([]);

    const updateCartQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const addExpense = async (data: Omit<Expense, 'id' | 'createdAt'>) => {
        const { data: newExpense, error } = await supabase
            .from('despesas')
            .insert([{
                label: data.label,
                value: data.value,
                date: data.date,
                time: data.time
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao adicionar despesa:", error);
            return;
        }

        const formattedExpense: Expense = {
            id: newExpense.id,
            label: newExpense.label,
            value: Number(newExpense.value),
            date: newExpense.date,
            time: newExpense.time,
            createdAt: newExpense.created_at
        };

        setExpenses(prev => [...prev, formattedExpense]);
    };

    const addIncome = async (data: Omit<Income, 'id' | 'createdAt'>) => {
        const { data: newIncome, error } = await supabase
            .from('entradas_avulsas')
            .insert([{
                label: data.label,
                value: data.value,
                date: data.date,
                time: data.time
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao adicionar entrada:", error);
            return;
        }

        const formattedIncome: Income = {
            id: newIncome.id,
            label: newIncome.label,
            value: Number(newIncome.value),
            date: newIncome.date,
            time: newIncome.time,
            createdAt: newIncome.created_at
        };

        setIncomes(prev => [...prev, formattedIncome]);
    };

    const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        try {
            // Chama a função RPC segura que criamos no banco
            const { data, error } = await supabase.rpc('reset_user_password', {
                p_email: email.toLowerCase().trim(),
                p_new_password: newPassword
            });

            if (error) {
                console.error('Erro RPC ao redefinir senha:', error);
                return { success: false, message: 'Erro ao processar solicitação. Tente novamente.' };
            }

            if (data === true) {
                return { success: true, message: 'Senha alterada com sucesso! Faça login com a nova senha.' };
            } else {
                return { success: false, message: 'E-mail não encontrado ou não permitido.' };
            }
        } catch (err) {
            console.error('Erro inesperado:', err);
            return { success: false, message: 'Erro inesperado. Tente novamente mais tarde.' };
        }
    };

    const markNotificationAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notificacoes')
            .update({ lida: true })
            .eq('id', id);

        if (error) {
            console.error("Erro ao marcar notificação como lida:", error);
            return;
        }

        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <BarberContext.Provider value={{
            users, services, barbers, appointments, promotions, products, currentUser, shopConfig, isAuthReady, cart, expenses, incomes,
            notifications,
            refreshData: fetchFromSupabase,
            login, logout, register, addAppointment, updateAppointmentStatus,
            addService, updateService, removeService, addBarber, updateBarber, removeBarber, updateUser, updateShopConfig, resetToSeed,
            addPromotion, updatePromotion, removePromotion, addProduct, updateProduct, removeProduct, loginWithGoogle,
            addToCart, removeFromCart, clearCart, updateCartQuantity, addExpense, addIncome, markNotificationAsRead, resetPassword,
            updateAppointmentPayment, addFiadoEntry
        }}>
            {children}
        </BarberContext.Provider>
    );
}

export function useBarber() {
    const context = useContext(BarberContext);
    if (!context) throw new Error('useBarber must be used within a BarberProvider');
    return context;
}
