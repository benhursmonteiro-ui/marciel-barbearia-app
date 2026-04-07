"use client";

import React, { useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { supabase, uploadImage } from "@/lib/supabase";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useBarber, Product } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminEstoque() {
    const { products, addProduct, updateProduct, removeProduct } = useBarber();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState({ 
        product: "", 
        category: "Finalizadores", 
        stock: "", 
        min: "5", 
        price: "",
        image: ""
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            setNewProduct(prev => ({ ...prev, image: url }));
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar imagem. Verifique se o bucket 'barber-images' existe no Supabase e está público.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.product || !newProduct.price) return;

        setIsSaving(true);
        try {
            const priceNum = parseFloat(newProduct.price.replace("R$", "").replace(",", ".").trim());
            const stockNum = parseInt(newProduct.stock) || 0;
            const minNum = parseInt(newProduct.min) || 5;

            const productData = {
                name: newProduct.product,
                category: newProduct.category,
                price: priceNum,
                stock: stockNum,
                minStock: minNum,
                image: newProduct.image,
                active: true
            };

            if (isEditing && editId) {
                await updateProduct(editId, productData);
            } else {
                await addProduct(productData);
            }

            resetForm();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar produto.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (product: Product) => {
        setIsEditing(true);
        setEditId(product.id);
        setNewProduct({
            product: product.name,
            category: product.category,
            stock: product.stock.toString(),
            min: product.minStock.toString(),
            price: product.price.toString(),
            image: product.image || ""
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setNewProduct({ product: "", category: "Finalizadores", stock: "", min: "5", price: "", image: "" });
        setIsModalOpen(false);
    };

    const adjustStock = async (id: string, currentStock: number, amount: number) => {
        await updateProduct(id, { stock: Math.max(0, currentStock + amount) });
    };

    const deleteProduct = async (id: string) => {
        if (confirm("Remover este produto do estoque permanentemente?")) {
            await removeProduct(id);
        }
    };

    const totalStockValue = products.reduce((acc, item) => acc + (item.price * item.stock), 0);
    const lowStockCount = products.filter(item => item.stock <= item.minStock).length;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <header className="mb-10 lg:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold mb-1">
                        Gestão de <span className="text-[#D4AF37]">Estoque</span>
                    </h1>
                    <p className="text-gray-400 text-sm italic">Controle de produtos para uso e revenda (Aparecem na tela do cliente)</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-2 h-14 px-8 rounded-2xl bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest shadow-lg shadow-[#D4AF37]/10 hover:scale-105 transition-all">
                    <Icon name="Plus" className="w-5 h-5" /> Novo Produto
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-[2rem] flex items-center gap-6 group hover:border-[#D4AF37]/20 transition-all">
                    <div className="bg-[#D4AF37]/5 w-16 h-16 rounded-2xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                        <Icon name="Boxes" className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Itens Totais</p>
                        <h3 className="text-3xl font-black tracking-tight">{products.length}</h3>
                    </div>
                </div>
                <div className="bg-[#111111] border border-red-500/10 p-8 rounded-[2rem] flex items-center gap-6 group hover:border-red-500/30 transition-all">
                    <div className="bg-red-500/5 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                        <Icon name="AlertTriangle" className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Estoque Crítico</p>
                        <h3 className="text-3xl font-black tracking-tight text-red-500">{lowStockCount} itens</h3>
                    </div>
                </div>
                <div className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-[2rem] flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                    <div className="bg-emerald-500/5 w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Icon name="DollarSign" className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Valor Estimado</p>
                        <h3 className="text-3xl font-black tracking-tight text-emerald-500">R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-[#1f1f1f] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#1f1f1f] bg-[#0d0d0d]">
                            <th className="p-8 text-[10px] uppercase tracking-widest text-gray-500 font-black">Produto</th>
                            <th className="p-8 text-[10px] uppercase tracking-widest text-gray-500 font-black">Categoria</th>
                            <th className="p-8 text-[10px] uppercase tracking-widest text-gray-500 font-black">Qtd. Atual</th>
                            <th className="p-8 text-[10px] uppercase tracking-widest text-gray-500 font-black text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f1f1f]">
                        {products.length > 0 ? products.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.02] transition-all group">
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Icon name="Package" className="w-6 h-6 text-gray-700" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-base text-gray-100 group-hover:text-[#D4AF37] transition-colors">{item.name}</p>
                                            <p className="text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.2em]">R$ {item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className="text-[9px] uppercase font-black text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 tracking-widest">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${item.stock <= item.minStock ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                            {item.stock}
                                        </div>
                                        {item.stock <= item.minStock && (
                                            <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20">
                                                <Icon name="AlertCircle" className="w-3 h-3 animate-pulse" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter">Crítico</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => adjustStock(item.id, item.stock, 1)} className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/10 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20"><Icon name="Plus" className="w-4 h-4" /></button>
                                        <button onClick={() => adjustStock(item.id, item.stock, -1)} className="w-11 h-11 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/5"><Icon name="Minus" className="w-4 h-4" /></button>
                                        <button onClick={() => handleEdit(item)} className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all border border-blue-500/10"><Icon name="Edit" className="w-4 h-4" /></button>
                                        <button onClick={() => deleteProduct(item.id)} className="w-11 h-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/10"><Icon name="Trash2" className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="p-32 text-center">
                                    <div className="opacity-20 space-y-4">
                                        <Icon name="Inbox" className="w-16 h-16 mx-auto mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Seu estoque está vazio.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-xl bg-[#111111] border border-[#1f1f1f] rounded-[3rem] p-10 md:p-14 shadow-2xl animate-fade-in-up">
                        <header className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter italic uppercase">{isEditing ? 'Editar' : 'Novo'} <span className="text-[#D4AF37]">Produto</span></h2>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Preencha os campos para atualizar o estoque</p>
                            </div>
                            <button onClick={resetForm} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all">
                                <Icon name="X" className="w-6 h-6" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome do Produto</label>
                                <Input required value={newProduct.product} onChange={e => setNewProduct({ ...newProduct, product: e.target.value })} className="bg-black/40 border-white/5 h-16 rounded-2xl focus:border-[#D4AF37]/50 transition-all font-bold" placeholder="Ex: Pomada Efeito Matte" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Preço Unitário (R$)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-black">R$</span>
                                        <Input required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="bg-black/40 border-white/5 h-16 rounded-2xl pl-12 font-bold focus:border-[#D4AF37]/50" placeholder="0,00" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Categoria</label>
                                    <select 
                                        value={newProduct.category} 
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 h-16 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-[#D4AF37]/50 appearance-none transition-all"
                                    >
                                        <option value="Finalizadores">Finalizadores</option>
                                        <option value="Barba">Barba</option>
                                        <option value="Cabelo">Cabelo</option>
                                        <option value="Acessórios">Acessórios</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Qtd. em Estoque</label>
                                    <Input required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} type="number" className="bg-black/40 border-white/5 h-16 rounded-2xl font-bold focus:border-[#D4AF37]/50" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Estoque Mínimo</label>
                                    <Input required value={newProduct.min} onChange={e => setNewProduct({ ...newProduct, min: e.target.value })} type="number" className="bg-black/40 border-white/5 h-16 rounded-2xl font-bold focus:border-[#D4AF37]/50" placeholder="5" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Foto / Imagem do Produto</label>
                                <div className="flex gap-4">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-2xl bg-black/60 border border-white/5 flex flex-col items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all cursor-pointer overflow-hidden relative group"
                                    >
                                        {isUploading ? (
                                            <Icon name="Loader2" className="w-6 h-6 animate-spin text-[#D4AF37]" />
                                        ) : newProduct.image ? (
                                            <>
                                                <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />
                                                <Icon name="Camera" className="absolute w-6 h-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="ImagePlus" className="w-6 h-6 mb-1" />
                                                <span className="text-[8px] font-bold uppercase tracking-tighter">Galeria</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Input 
                                            value={newProduct.image} 
                                            onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} 
                                            className="bg-black/40 border-white/5 h-12 rounded-xl text-[10px]" 
                                            placeholder="Cole o link ou clique ao lado" 
                                        />
                                        <p className="text-[9px] text-gray-600 font-bold italic ml-2">Dica: Formatos PNG ou JPG são melhores.</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileUpload} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </div>
                            </div>

                            <Button type="submit" isLoading={isSaving} className="w-full h-16 bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {isEditing ? 'Atualizar Produto' : 'Cadastrar no Estoque'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
