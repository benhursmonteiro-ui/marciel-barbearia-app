"use client";

import React from 'react';
import {
    TrendingUp, CalendarRange, Calendar, Scissors, Clock, Users, UserPlus,
    Wallet, Package, Megaphone, FileText, Bell, Settings, LogOut, Menu, X,
    ChevronLeft, ChevronRight, Building2, ShieldCheck, CheckCircle2, AlertCircle,
    Eye, EyeOff, Search, Plus, Trash2, Edit, Edit3, Check, DollarSign, UserCheck, UserX, Star,
    Award, Percent, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, Filter,
    Loader2, FileDown, Camera, Power, Play, Phone, MessageSquare, RotateCcw, CalendarX,
    TrendingDown, AlertTriangle, Send, Lock, User, Save, Moon, Sun, Globe, Sliders,
    CheckSquare, CreditCard, Smartphone, MapPin, Mail, Share2, Key
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
    TrendingUp, CalendarRange, Calendar, Scissors, Clock, Users, UserPlus,
    Wallet, Package, Megaphone, FileText, Bell, Settings, LogOut, Menu, X,
    ChevronLeft, ChevronRight, Building2, ShieldCheck, CheckCircle2, AlertCircle,
    Eye, EyeOff, Search, Plus, Trash2, Edit, Edit3, Check, DollarSign, UserCheck, UserX, Star,
    Award, Percent, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, Filter,
    Loader2, FileDown, Camera, Power, Play, Phone, MessageSquare, RotateCcw, CalendarX,
    TrendingDown, AlertTriangle, Send, Lock, User, Save, Moon, Sun, Globe, Sliders,
    CheckSquare, CreditCard, Smartphone, MapPin, Mail, Share2, Key
};

export function SafeIcon({ name, className }: { name: string; className?: string }) {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
        return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: 'transparent' }} />;
    }
    return <IconComponent className={className} />;
}

export default SafeIcon;
