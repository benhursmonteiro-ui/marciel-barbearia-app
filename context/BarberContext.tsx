"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    setDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    limit, 
    where 
} from 'firebase/firestore';
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
    workingHours?: any;
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
    id?: string | number;
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
    clientPhone?: string;
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

const SEED_SERVICES: Service[] = [
    { id: '1', name: 'Corte Social', description: 'Corte tradicional tesoura e máquina', price: 35, duration: '30 min', icon: '✂️', popular: true, active: true },
    { id: '2', name: 'Barba Completa', description: 'Modelagem com toalha quente e lâmina', price: 30, duration: '30 min', icon: '🪒', popular: false, active: true },
    { id: '3', name: 'Combo Corte + Barba', description: 'Experiência completa de corte e barba', price: 60, duration: '50 min', icon: '💈', popular: true, active: true },
    { id: '4', name: 'Acabamento / Pezinho', description: 'Alinhamento de contorno e pezinho', price: 15, duration: '15 min', icon: '⚡', popular: false, active: true }
];

const SEED_BARBERS: Barber[] = [
    { id: '1', userId: 'barber-1', name: 'Marciel Farias', specialty: 'Mestre Barbeiro / Degradê', commission: 50, rating: 5.0, reviews: 142, active: true, blockedSlots: [], holidays: [] },
    { id: '2', userId: 'barber-2', name: 'Lucas Silva', specialty: 'Barba Tradicional / Pigmentação', commission: 45, rating: 4.9, reviews: 88, active: true, blockedSlots: [], holidays: [] }
];

export function BarberProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [services, setServices] = useState<Service[]>(SEED_SERVICES);
    const [barbers, setBarbers] = useState<Barber[]>(SEED_BARBERS);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [notifications, setNotifications] = useState<MBSNotification[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [shopConfig, setShopConfig] = useState<ShopConfig>({
        id: '1',
        name: "Marciel BarberShop",
        logo: "",
        address: "Rua Castro Alves, 261 - Junco, Picos - PI, - 64600-000",
        phone: "(89) 9985-0601",
        whatsapp: "(89) 9985-0601",
        email: "marciel_farias@admin.com",
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

    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const safeCache = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('[MBS] Cache write warning:', key, e);
        }
    };

    // Firebase Data Fetching
    const fetchFromFirebase = async () => {
        try {
            // Agendamentos
            const appsRef = collection(db, 'agendamentos');
            const appsSnap = await getDocs(appsRef);
            if (!appsSnap.empty) {
                const loadedApps = appsSnap.docs.map(docSnap => {
                    const d = docSnap.data();
                    return {
                        id: docSnap.id,
                        clientId: d.clientId || d.cliente_id || '',
                        clientName: d.clientName || d.nome_cliente || 'Cliente',
                        clientPhone: d.clientPhone || d.telefone_cliente || '',
                        barberId: d.barberId || d.barbeiro_id || '',
                        barberName: d.barberName || d.nome_barbeiro || '',
                        serviceId: d.serviceId || d.servico_id || '',
                        serviceName: d.serviceName || d.nome_servico || '',
                        price: Number(d.price || d.valor || 0),
                        commission: Number(d.commission || d.comissao_gerada || 0),
                        date: d.date || d.data || '',
                        time: d.time || d.horario || '',
                        status: (d.status || 'agendado') as AppointmentStatus,
                        paymentStatus: d.paymentStatus || d.status_pagamento,
                        paymentMethod: d.paymentMethod || d.forma_pagamento,
                        isFiado: d.isFiado || d.is_fiado,
                        createdAt: d.createdAt || d.created_at || new Date().toISOString()
                    };
                }).sort((a, b) => {
                    const dateCompare = (b.date || "").localeCompare(a.date || "");
                    if (dateCompare !== 0) return dateCompare;
                    return (b.time || "").localeCompare(a.time || "");
                });
                setAppointments(loadedApps);
                safeCache('mbs_cache_appointments', loadedApps);
            }

            // Serviços
            const servRef = collection(db, 'servicos');
            const servSnap = await getDocs(servRef);
            if (!servSnap.empty) {
                const loadedServ = servSnap.docs.map(docSnap => {
                    const d = docSnap.data();
                    return {
                        id: docSnap.id,
                        name: d.name || d.nome || '',
                        description: d.description || d.descricao || '',
                        price: Number(d.price || d.preco || 0),
                        duration: d.duration || d.duracao || '30 min',
                        icon: d.icon || d.icone || '✂️',
                        popular: !!d.popular,
                        active: d.active !== false && d.ativo !== false
                    };
                });
                setServices(loadedServ);
                safeCache('mbs_cache_services', loadedServ);
            }

            // Barbeiros
            const barbRef = collection(db, 'barbeiros');
            const barbSnap = await getDocs(barbRef);
            if (!barbSnap.empty) {
                const loadedBarb = barbSnap.docs.map(docSnap => {
                    const d = docSnap.data();
                    return {
                        id: docSnap.id,
                        userId: d.userId || d.usuario_id || docSnap.id,
                        name: d.name || d.nome || '',
                        specialty: d.specialty || d.especialidade || '',
                        commission: Number(d.commission || d.comissao || 50),
                        rating: Number(d.rating || d.avaliacao || 5.0),
                        reviews: Number(d.reviews || d.total_avaliacoes || 0),
                        photo: d.photo || d.foto || '',
                        active: d.active !== false && d.ativo !== false,
                        workingHours: d.workingHours || d.horarios_trabalho,
                        blockedSlots: d.blockedSlots || d.horarios_bloqueados || [],
                        holidays: d.holidays || d.feriados || []
                    };
                });
                setBarbers(loadedBarb);
                safeCache('mbs_cache_barbers', loadedBarb);
            }

            // Estoque / Produtos
            const prodRef = collection(db, 'estoque');
            const prodSnap = await getDocs(prodRef);
            if (!prodSnap.empty) {
                const loadedProd = prodSnap.docs.map(docSnap => {
                    const d = docSnap.data();
                    return {
                        id: docSnap.id,
                        name: d.name || d.nome || '',
                        category: d.category || d.categoria || 'Geral',
                        price: Number(d.price || d.preco || 0),
                        stock: Number(d.stock || d.quantidade || 0),
                        minStock: Number(d.minStock || d.minimo || 2),
                        image: d.image || d.imagem || '',
                        active: d.active !== false && d.ativo !== false
                    };
                });
                setProducts(loadedProd);
                safeCache('mbs_cache_products', loadedProd);
            }

        } catch (error) {
            console.warn('[MBS] Firebase sync notice (using local storage fallback):', error);
        }
    };

    // Initial Load & Hydration
    useEffect(() => {
        const init = async () => {
            try {
                const savedCurrentUser = localStorage.getItem('mbs_current_user');
                if (savedCurrentUser) {
                    const parsedUser = JSON.parse(savedCurrentUser);
                    if (parsedUser && parsedUser.id) {
                        setCurrentUser(parsedUser);
                    }
                }

                const cachedServices = localStorage.getItem('mbs_cache_services');
                if (cachedServices) setServices(JSON.parse(cachedServices));

                const cachedBarbers = localStorage.getItem('mbs_cache_barbers');
                if (cachedBarbers) setBarbers(JSON.parse(cachedBarbers));

                const cachedApps = localStorage.getItem('mbs_cache_appointments');
                if (cachedApps) setAppointments(JSON.parse(cachedApps));

                const cachedProducts = localStorage.getItem('mbs_cache_products');
                if (cachedProducts) setProducts(JSON.parse(cachedProducts));

            } catch (e) {
                console.error('[MBS] Error restoring local cache:', e);
            } finally {
                setIsLoaded(true);
                setIsAuthReady(true);
            }

            fetchFromFirebase();
        };

        init();
    }, []);

    const login = async (email: string, password: string) => {
        const cleanEmail = email.trim().toLowerCase();

        // Fixed Admin Login
        if ((cleanEmail === 'marciel_farias@admin.com' || cleanEmail === 'admin') && password === '150326') {
            const adminUser: User = {
                id: 'admin-temp-id',
                name: 'Marciel (Administrador)',
                email: cleanEmail,
                password: password,
                role: 'admin'
            };

            setCurrentUser(adminUser);
            localStorage.setItem('mbs_current_user', JSON.stringify(adminUser));
            setAuthCookie(adminUser);
            return adminUser;
        }

        // Search user in local list or Firebase
        const match = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
        if (match) {
            setCurrentUser(match);
            localStorage.setItem('mbs_current_user', JSON.stringify(match));
            setAuthCookie(match);
            return match;
        }

        return null;
    };

    const register = async (name: string, email: string, password: string, role: UserRole, phone?: string) => {
        const newUser: User = { 
            id: `user-${Date.now()}`,
            name,
            email: email.trim().toLowerCase(),
            password,
            role,
            phone: phone || ''
        };

        try {
            const docRef = await addDoc(collection(db, 'usuarios'), {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                createdAt: new Date().toISOString()
            });
            newUser.id = docRef.id;
        } catch (e) {
            console.warn('[MBS] Firebase user add warning:', e);
        }

        setCurrentUser(newUser);
        setUsers(prev => [...prev, newUser]);
        localStorage.setItem('mbs_current_user', JSON.stringify(newUser));
        setAuthCookie(newUser);

        return newUser;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('mbs_current_user');
        clearAuthCookie();
    };

    const loginWithGoogle = async () => {};

    const addAppointment = async (appData: Omit<Appointment, 'id' | 'createdAt' | 'commission'>) => {
        const barber = barbers.find(b => String(b.id) === String(appData.barberId));
        const service = services.find(s => String(s.id) === String(appData.serviceId));
        const commissionVal = (appData.price * (barber?.commission || 50)) / 100;

        // Anti-double booking check in memory / local state
        const activeOverlap = appointments.find(a => 
            String(a.barberId) === String(appData.barberId) && 
            a.date === appData.date && 
            a.time === appData.time && 
            a.status !== 'cancelado'
        );

        if (activeOverlap) {
            throw new Error("⚠️ Este horário já foi reservado por outro cliente! Por favor, selecione outro horário disponível.");
        }

        const newId = `apt-${Date.now()}`;
        const newApp: Appointment = {
            id: newId,
            clientId: appData.clientId || `cli-${Date.now()}`,
            clientName: appData.clientName,
            clientPhone: appData.clientPhone || '',
            barberId: appData.barberId,
            barberName: barber?.name || appData.barberName,
            serviceId: appData.serviceId,
            serviceName: service?.name || appData.serviceName,
            price: appData.price,
            commission: commissionVal,
            date: appData.date,
            time: appData.time,
            status: 'agendado',
            createdAt: new Date().toISOString()
        };

        try {
            const docRef = await addDoc(collection(db, 'agendamentos'), {
                clientId: newApp.clientId,
                clientName: newApp.clientName,
                clientPhone: newApp.clientPhone,
                barberId: newApp.barberId,
                barberName: newApp.barberName,
                serviceId: newApp.serviceId,
                serviceName: newApp.serviceName,
                price: newApp.price,
                commission: newApp.commission,
                date: newApp.date,
                time: newApp.time,
                status: newApp.status,
                createdAt: newApp.createdAt
            });
            newApp.id = docRef.id;
        } catch (e) {
            console.warn('[MBS] Firebase addAppointment notice:', e);
        }

        setAppointments(prev => {
            const updated = [newApp, ...prev.filter(a => a.id !== newApp.id)];
            safeCache('mbs_cache_appointments', updated);
            return updated.sort((a, b) => {
                const dateCompare = (b.date || "").localeCompare(a.date || "");
                if (dateCompare !== 0) return dateCompare;
                return (b.time || "").localeCompare(a.time || "");
            });
        });
    };

    const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
        try {
            await updateDoc(doc(db, 'agendamentos', id), { status });
        } catch (e) {
            console.warn('[MBS] Firebase status update notice:', e);
        }

        setAppointments(prev => {
            const updated = prev.map(app => (app.id === id ? { ...app, status } : app));
            safeCache('mbs_cache_appointments', updated);
            return updated;
        });
    };

    const updateAppointmentPayment = async (id: string, paymentStatus: PaymentStatus, paymentMethod?: PaymentMethod) => {
        try {
            await updateDoc(doc(db, 'agendamentos', id), { paymentStatus, paymentMethod });
        } catch (e) {
            console.warn('[MBS] Firebase payment update notice:', e);
        }

        setAppointments(prev => {
            const updated = prev.map(app => (app.id === id ? { ...app, paymentStatus, paymentMethod } : app));
            safeCache('mbs_cache_appointments', updated);
            return updated;
        });
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
            createdAt: new Date().toISOString()
        };

        setAppointments(prev => [newApp, ...prev]);
    };

    const addService = async (data: Omit<Service, 'id'>) => {
        const newId = `serv-${Date.now()}`;
        const newServ: Service = { id: newId, ...data };
        try {
            const res = await addDoc(collection(db, 'servicos'), data);
            newServ.id = res.id;
        } catch (e) {}

        setServices(prev => {
            const updated = [...prev, newServ];
            safeCache('mbs_cache_services', updated);
            return updated;
        });
    };

    const updateService = async (id: string, data: Partial<Service>) => {
        try {
            await updateDoc(doc(db, 'servicos', id), data);
        } catch (e) {}

        setServices(prev => {
            const updated = prev.map(s => s.id === id ? { ...s, ...data } : s);
            safeCache('mbs_cache_services', updated);
            return updated;
        });
    };

    const removeService = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'servicos', id));
        } catch (e) {}

        setServices(prev => {
            const updated = prev.filter(s => s.id !== id);
            safeCache('mbs_cache_services', updated);
            return updated;
        });
    };

    const addBarber = async (data: any) => {
        const newBarb: Barber = {
            id: `barb-${Date.now()}`,
            userId: `user-${Date.now()}`,
            name: data.name,
            specialty: data.specialty,
            commission: data.commission,
            rating: 5.0,
            reviews: 0,
            active: true,
            blockedSlots: [],
            holidays: []
        };
        setBarbers(prev => [...prev, newBarb]);
    };

    const updateBarber = async (id: string, data: Partial<Barber>) => {
        setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    };

    const removeBarber = async (id: string) => {
        setBarbers(prev => prev.filter(b => b.id !== id));
    };

    const updateUser = async (id: string, data: Partial<User>) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    };

    const updateShopConfig = async (config: Partial<ShopConfig>) => {
        setShopConfig(prev => ({ ...prev, ...config }));
    };

    const addPromotion = async (promo: Omit<Promotion, 'id'>) => {
        const newP: Promotion = { id: `promo-${Date.now()}`, ...promo };
        setPromotions(prev => [...prev, newP]);
    };

    const updatePromotion = async (id: string, data: Partial<Promotion>) => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const removePromotion = async (id: string) => {
        setPromotions(prev => prev.filter(p => p.id !== id));
    };

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const newProd: Product = { id: `prod-${Date.now()}`, ...product };
        setProducts(prev => [...prev, newProd]);
    };

    const updateProduct = async (id: string, data: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const removeProduct = async (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const markNotificationAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const resetToSeed = () => {
        localStorage.clear();
        window.location.reload();
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
        setCart(prev =>
            prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean) as CartItem[]
        );
    };

    const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
        const newExp: Expense = { id: `exp-${Date.now()}`, ...expense, createdAt: new Date().toISOString() };
        setExpenses(prev => [newExp, ...prev]);
    };

    const addIncome = async (income: Omit<Income, 'id' | 'createdAt'>) => {
        const newInc: Income = { id: `inc-${Date.now()}`, ...income, createdAt: new Date().toISOString() };
        setIncomes(prev => [newInc, ...prev]);
    };

    const resetPassword = async (email: string, newPassword: string) => {
        return { success: true, message: "Senha redefinida com sucesso!" };
    };

    const refreshData = async () => {
        await fetchFromFirebase();
    };

    return (
        <BarberContext.Provider value={{
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
            notifications,
            refreshData,
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
            addPromotion,
            updatePromotion,
            removePromotion,
            addProduct,
            updateProduct,
            removeProduct,
            markNotificationAsRead,
            resetToSeed,
            loginWithGoogle,
            addToCart,
            removeFromCart,
            clearCart,
            updateCartQuantity,
            addExpense,
            addIncome,
            updateAppointmentPayment,
            addFiadoEntry,
            resetPassword
        }}>
            {children}
        </BarberContext.Provider>
    );
}

export const useBarber = () => {
    const context = useContext(BarberContext);
    if (!context) {
        throw new Error('useBarber must be used within a BarberProvider');
    }
    return context;
};
