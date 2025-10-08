"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// --- ESTILOS UNIFICADOS (Importados da tela de Adição) ---
const estiloInput = { height: "40px", border: "1px solid #000", borderRadius: "40px", paddingLeft: "15px", fontSize: "16px" };
const estiloTextArea = { height: "80px", border: "1px solid #000", borderRadius: "40px", padding: "10px 15px", fontSize: "16px", resize: "none" };
const botaoVerde = { backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "40px", padding: "10px 30px", fontSize: "16px", cursor: "pointer" };
const botaoVermelho = { backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "40px", padding: "10px 30px", fontSize: "16px", cursor: "pointer" };
const estiloImagem = { 
    width: "300px", 
    height: "300px", 
    border: "2px dashed #aaa", 
    borderRadius: "20px", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer", 
    fontSize: "16px", 
    color: "#666", 
    overflow: "hidden", 
    position: "relative" 
};
const estiloMiniImagem = { 
    width: "90px", 
    height: "90px", 
    border: "2px dashed #aaa", 
    borderRadius: "10px", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    cursor: "pointer", 
    fontSize: "16px", 
    color: "#666", 
    overflow: "hidden", 
    position: "relative" 
};
// --------------------------------------------------------


export default function EditarProduto() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [titulo, setTitulo] = useState("");
    const [valor, setValor] = useState("");
    // Inicializado como string vazia para o <select>
    const [categoriaId, setCategoriaId] = useState(""); 
    const [estoque, setEstoque] = useState("");
    const [descricao, setDescricao] = useState("");

    // Imagens
    // imagemPrincipalUrl guarda a URL do DB ou a DataURL do novo File (preview)
    const [imagemPrincipalUrl, setImagemPrincipalUrl] = useState(null); 
    // imagemPrincipalFile guarda o novo File para ser convertido e enviado
    const [imagemPrincipalFile, setImagemPrincipalFile] = useState(null); 
    
    // Até 3 imagens extras
    const [imagensExtrasUrls, setImagensExtrasUrls] = useState([null, null, null]); 
    const [imagensExtrasFiles, setImagensExtrasFiles] = useState([null, null, null]); 

    // Cores (Múltipla Seleção)
    const coresMaisUsadas = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080", "#00FFFF", "#FFC0CB", "#A52A2A", "#808080", "#000000", "#FFFFFF", "#6B8E23", "#4682B4", "#D2B48C", "#FFD700", "#008080", "#FF4500"];
    const [abrirPopoverCores, setAbrirPopoverCores] = useState(false);
    const [coresSelecionadas, setCoresSelecionadas] = useState([]); 
    const [codigoCorManual, setCodigoCorManual] = useState(""); 
    const refPopoverCores = useRef();

    // Tamanhos (Múltipla Seleção)
    const tamanhosDisponiveis = [
        "PP", "P", "M", "G", "GG", "XG", "XXG", "3G", "4G", "5G", "6G",
        "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "50", "52", "54", "56", "58", "60",
        "ÚNICO"
    ];
    const [abrirPopoverTamanhos, setAbrirPopoverTamanhos] = useState(false);
    const [tamanhosSelecionados, setTamanhosSelecionados] = useState([]);
    const refPopoverTamanhos = useRef();

    const [categorias, setCategorias] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // --- FUNÇÕES AUXILIARES DE IMAGEM ---

    const converterBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    
    // NOVO HELPER: Remove o prefixo do Data URL ou mantém se for URL pública (http/https).
    const limparBase64 = (dataUrlOrUrl) => {
        if (!dataUrlOrUrl) return null;
        if (dataUrlOrUrl.startsWith('http')) return dataUrlOrUrl;
        // Remove o prefixo (ex: "data:image/png;base64,") para enviar a Base64 pura
        return dataUrlOrUrl.replace(/^data:image\/(?:[a-z]+);base64,/, "");
    };

    const handleImagemPrincipal = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImagemPrincipalFile(file);
        // Exibir no preview como DataURL
        setImagemPrincipalUrl(URL.createObjectURL(file)); 
    };

    const handleImagemExtra = (index) => (async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Atualiza a lista de arquivos a serem enviados
        const novosFiles = [...imagensExtrasFiles]; 
        novosFiles[index] = file; 
        setImagensExtrasFiles(novosFiles);
        
        // Atualiza a lista de URLs/DataURLs para preview
        const novasUrls = [...imagensExtrasUrls];
        novasUrls[index] = URL.createObjectURL(file);
        setImagensExtrasUrls(novasUrls);
    });

    const removerImagemExtra = (index) => {
        // Remove o File do array de Files
        const novosFiles = [...imagensExtrasFiles];
        novosFiles[index] = null;
        setImagensExtrasFiles(novosFiles);

        // Remove a URL/DataURL do array de URLs para preview
        const novasUrls = [...imagensExtrasUrls];
        novasUrls[index] = null;
        setImagensExtrasUrls(novasUrls);
    };

    // --- LÓGICA DE CORES E TAMANHOS (Copiada da tela de Adição) ---

    // Lógica para adicionar/remover cores
    const toggleCor = (cor) => {
        const corNormalizada = cor.toUpperCase();
        if (coresSelecionadas.includes(corNormalizada)) {
            setCoresSelecionadas(coresSelecionadas.filter(c => c !== corNormalizada));
        } else {
            setCoresSelecionadas([...coresSelecionadas, corNormalizada]);
        }
        setCodigoCorManual("");
    };

    const handleCodigoCorChange = (e) => {
        let newCode = e.target.value.toUpperCase().trim();
        if (newCode.length > 0 && !newCode.startsWith('#')) {
            newCode = '#' + newCode;
        }
        setCodigoCorManual(newCode);
    };
    
    const adicionarCorManual = () => {
        const cor = codigoCorManual.toUpperCase().trim();
        const corValida = /^#[0-9A-F]{6}$/.test(cor);
        
        if (corValida) {
            if (coresSelecionadas.includes(cor)) {
                alert(`A cor ${cor} já foi adicionada!`);
            } else {
                setCoresSelecionadas([...coresSelecionadas, cor]);
            }
            setCodigoCorManual("");
        } else if (cor.length > 0) {
            alert("Código HEX inválido. Use o formato #RRGGBB (ex: #FF4791).");
        }
    };

    const removerCor = (cor) => {
        setCoresSelecionadas(coresSelecionadas.filter(c => c !== cor));
    };
    
    // Lógica para adicionar/remover Tamanhos
    const toggleTamanho = (tamanho) => {
        if (tamanhosSelecionados.includes(tamanho)) {
            setTamanhosSelecionados(tamanhosSelecionados.filter(t => t !== tamanho));
        } else {
            setTamanhosSelecionados([...tamanhosSelecionados, tamanho]);
        }
    };

    // --- EFEITOS DE CARREGAMENTO E EVENT LISTENERS ---

    useEffect(() => {
        // Buscar categorias
        async function carregarCategorias() {
            try {
                const res = await fetch('/api/categorias');
                if (!res.ok) throw new Error("Erro ao buscar categorias");
                const data = await res.json();
                setCategorias(data);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
            }
        }
        carregarCategorias();

        // Fechar popovers clicando fora
        const handleClickFora = (e) => {
            if (refPopoverCores.current && !refPopoverCores.current.contains(e.target)) {
                setAbrirPopoverCores(false);
            }
            if (refPopoverTamanhos.current && !refPopoverTamanhos.current.contains(e.target)) {
                setAbrirPopoverTamanhos(false);
            }
        };
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    // EFEITO PARA CARREGAR DADOS DO PRODUTO (NOVO)
    useEffect(() => {
        async function carregarProduto() {
            if (!id) return;
            try {
                const response = await fetch(`/api/produtos/${id}`);
                if (!response.ok) throw new Error("Erro ao carregar produto");
                const data = await response.json();
                
                // Dados básicos
                setTitulo(data.titulo ?? "");
                // Importante: Valor deve ser string para preencher o input type="number"
                setValor(String(data.valor ?? "")); 
                setCategoriaId(data.categoria_id ? String(data.categoria_id) : ""); 
                setEstoque(String(data.estoque ?? ""));
                setDescricao(data.descricao ?? "");
                
                // Imagem Principal (URL do DB)
                setImagemPrincipalUrl(data.imagem_url ?? null);
                
                // Imagens Extras (limita a 3)
                if (data.imagens_extras && Array.isArray(data.imagens_extras)) {
                    const loadedExtras = data.imagens_extras.slice(0, 3);
                    // Preenche o array de URLs/DataURLs para preview com as URLs do DB
                    setImagensExtrasUrls([
                        loadedExtras[0] || null,
                        loadedExtras[1] || null,
                        loadedExtras[2] || null
                    ]);
                    // O array de Files permanece [null, null, null] até que o usuário troque uma imagem
                    // Não há necessidade de preencher o imagensExtrasFiles, apenas as URLs
                }

                // Cores e Tamanhos (JSONB)
                if (data.cores && Array.isArray(data.cores)) {
                    setCoresSelecionadas(data.cores);
                }
                if (data.tamanho && Array.isArray(data.tamanho)) { // Usando 'tamanho' singular do DB
                    setTamanhosSelecionados(data.tamanho);
                }

            } catch (error) {
                alert("Erro ao carregar o produto");
                console.error(error);
            }
        }
        if (id) carregarProduto();
    }, [id]);

    const nomeCategoria = categorias.length > 0 && categoriaId
        ? (categorias.find(cat => cat.id === parseInt(categoriaId))?.nome || "")
        : "";

    // --- FUNÇÃO DE ENVIO CORRIGIDA ---

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Lógica para Imagem Principal: Base64 se for novo arquivo, URL se for imagem existente
        let imagemPrincipalPayload;
        if (imagemPrincipalFile) {
            // Se o usuário selecionou um novo arquivo, converte para Base64 pura
            const dataUrl = await converterBase64(imagemPrincipalFile);
            imagemPrincipalPayload = limparBase64(dataUrl); 
        } else {
            // Se não alterou, envia a URL existente (ou null se não tiver imagem)
            imagemPrincipalPayload = imagemPrincipalUrl; 
        }

        // 2. Lógica para Imagens Extras: 
        const imagensExtrasPayload = await Promise.all(imagensExtrasUrls.map(async (urlOrDataUrl, index) => {
            const file = imagensExtrasFiles[index];
            if (file) {
                // Se o usuário selecionou um novo arquivo (tem file no estado), converte para Base64 pura
                const dataUrl = await converterBase64(file);
                return limparBase64(dataUrl);
            } else if (urlOrDataUrl && urlOrDataUrl.startsWith('http')) {
                // Se o link é uma URL do DB e o usuário NÃO alterou o File, envia a URL original
                return urlOrDataUrl;
            } else if (urlOrDataUrl && urlOrDataUrl.startsWith('data:')) {
                // Caso extremo: Se for uma DataURL no estado, mas o File não foi populado (não deve acontecer com a lógica de cima), converte.
                return limparBase64(urlOrDataUrl);
            }
            return null; // Imagem removida ou nunca existiu
        }));

        // Filtra nulos e vazios
        const imagensExtrasLimpa = imagensExtrasPayload.filter(Boolean);


        const produtoAtualizado = {
            titulo,
            // Converte a string 'valor' para float
            valor: parseFloat(valor.replace(',', '.')) || 0,
            // Converte o ID da categoria para inteiro (ou null se for "")
            categoria_id: categoriaId ? parseInt(categoriaId) : null, 
            // Converte a string 'estoque' para inteiro
            estoque: parseInt(estoque) || 0,
            
            descricao,
            // Nome alterado para refletir que pode ser Base64 OU a URL
            imagem_principal_payload: imagemPrincipalPayload, 
            imagens_extras_payload: imagensExtrasLimpa, // Nome alterado
            cores: coresSelecionadas,
            tamanhos: tamanhosSelecionados
        };

        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produtoAtualizado),
            });

            if (response.ok) {
                setMostrarAlerta(true);
                setTimeout(() => {
                    setMostrarAlerta(false);
                    router.push("/GerenciamentoEstoque");
                }, 3000);
            } else {
                console.error("Erro na resposta da API:", response.status, await response.text());
                alert("Erro ao atualizar produto. Verifique o console para detalhes.");
            }
        } catch (error) {
            console.error("Erro ao enviar dados para a API:", error);
            alert("Erro ao enviar dados");
        }
    };

    // Helper para exibir as cores selecionadas no input
    const coresDisplay = coresSelecionadas.length > 0
        ? coresSelecionadas.join(", ")
        : "Escolha a cor";

    // Helper para exibir os tamanhos selecionados no input
    const tamanhosDisplay = tamanhosSelecionados.length > 0
        ? tamanhosSelecionados.join(", ")
        : "Selecione tamanhos";

    const handleCancelar = () => { router.push("/GerenciamentoEstoque"); };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            
            {/* Barra superior */}
            <div style={{ width: "100%", height: "84px", backgroundColor: "#FF4791", display: "flex", alignItems: "center", paddingLeft: "20px" }}>
                <Instagram /><Whatsapp />
            </div>

            {/* Botão Voltar */}
            <div style={{ marginRight: "94%", marginTop: "1%", display: "flex", alignItems: "center", gap: 10 }}>
                <Link href="/GerenciamentoEstoque" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <span style={{ fontSize: 20, fontFamily: "Roboto, sans-serif", color: "#000", fontWeight: "bold" }}>VOLTAR</span>
                </Link>
            </div>

            {/* Título */}
            <div style={{ width: "758px", height: "80px", backgroundColor: "#E5D7E1", borderRadius: "74px", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Lustria, serif", fontSize: "36px", marginTop: "40px" }}>
                EDITAR PRODUTO (ID: {id ?? '...'})
            </div>

            {/* Corpo */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: "60px", gap: "60px" }}>
                
                {/* Imagens (Com botão de remover para as extras) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    
                    {/* Imagem Principal */}
                    <label style={estiloImagem}>
                        {imagemPrincipalUrl ? (
                            <img 
                                src={imagemPrincipalUrl} 
                                alt="Principal" 
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }} 
                            />
                        ) : "Clique para adicionar imagem"}
                        <input type="file" accept="image/*" onChange={handleImagemPrincipal} style={{ display: "none" }} />
                    </label>

                    {/* Imagens Extras */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        {imagensExtrasUrls.map((url, i) => (
                            <label key={i} style={estiloMiniImagem}>
                                {url ? (
                                    <>
                                        <img 
                                            src={url} 
                                            alt={`Extra ${i}`} 
                                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} 
                                        />
                                        {/* Botão de Remover Imagem Extra */}
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.preventDefault(); removerImagemExtra(i); }}
                                            style={{ 
                                                position: 'absolute', top: '-5px', right: '-5px', 
                                                backgroundColor: '#dc3545', color: 'white', border: 'none', 
                                                borderRadius: '50%', width: '20px', height: '20px', 
                                                cursor: 'pointer', fontSize: '12px', lineHeight: '1', 
                                                display: 'flex', justifyContent: 'center', alignItems: 'center' 
                                            }}
                                        >
                                            &times;
                                        </button>
                                        
                                    </>
                                ) : "➕"}
                                <input type="file" accept="image/*" onChange={handleImagemExtra(i)} style={{ display: "none" }} />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Linha divisória */}
                <div style={{ width: "2px", height: "550px", backgroundColor: "#000" }} />

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", width: "400px" }}>
                    
                    <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={estiloInput} required />
                    <input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} style={estiloInput} required />

                    {/* Campos Cor e Tamanho lado a lado */}
                    <div style={{ display: "flex", gap: "10px" }}>
                        
                        {/* Cor */}
                        <div style={{ position: "relative", flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Escolha a cor"
                                value={coresDisplay}
                                onFocus={() => setAbrirPopoverCores(true)}
                                readOnly
                                style={estiloInput}
                                required={coresSelecionadas.length === 0}
                            />
                            {abrirPopoverCores && (
                                <div ref={refPopoverCores} style={{ position: "absolute", top: "45px", left: 0, width: "100%", backgroundColor: "#fff", border: "1px solid #000", borderRadius: "10px", padding: "8px", zIndex: 10, maxHeight: '300px', overflowY: 'auto' }}>
                                    
                                    {/* Cores Selecionadas */}
                                    {coresSelecionadas.length > 0 && (
                                        <div style={{ marginBottom: "10px", paddingBottom: "5px", borderBottom: '1px solid #eee' }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>Cores Selecionadas:</h4>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                                {coresSelecionadas.map(cor => (
                                                    <div
                                                        key={cor}
                                                        onClick={() => removerCor(cor)}
                                                        title={`Remover cor ${cor}`}
                                                        style={{
                                                            width: "25px", height: "25px", borderRadius: "50%", backgroundColor: cor, position: "relative", cursor: "pointer",
                                                            border: cor === "#FFFFFF" ? "1px solid #ccc" : "none",
                                                            boxShadow: '0 0 0 2px #FF4791, 0 0 0 4px #fff', 
                                                        }}
                                                    >
                                                        <span style={{ position: 'absolute', top: '-5px', right: '-5px', color: '#dc3545', backgroundColor: '#fff', borderRadius: '50%', width: '15px', height: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', lineHeight: '1', border: '1px solid #dc3545' }}>
                                                            &times;
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Seleção de Cores Mais Usadas */}
                                    <h4 style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Cores Frequentes:</h4>
                                    {coresMaisUsadas.map((cor, index) => (
                                        (index % 6 === 0) && (
                                            <div key={`row-${index}`} style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "5px", marginBottom: "5px" }}>
                                                {coresMaisUsadas.slice(index, index + 6).map(c => (
                                                    <div
                                                        key={c}
                                                        style={{
                                                            width: "20px", height: "20px", borderRadius: "50%", backgroundColor: c, position: "relative", cursor: "pointer",
                                                            border: coresSelecionadas.includes(c) ? "3px solid #FF4791" : (c === "#FFFFFF" ? "1px solid #ccc" : "none")
                                                        }}
                                                        onClick={() => toggleCor(c)}>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ))}

                                    {/* Campo HEX */}
                                    <h4 style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Adicionar Manualmente:</h4>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input
                                            type="text"
                                            placeholder="#HEX da cor"
                                            value={codigoCorManual}
                                            onChange={handleCodigoCorChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault(); 
                                                    adicionarCorManual();
                                                }
                                            }}
                                            style={{ flexGrow: 1, height: "30px", border: "1px solid #000", borderRadius: "8px", paddingLeft: "8px", fontSize: "14px" }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={adicionarCorManual} 
                                            disabled={!/^#[0-9A-F]{6}$/.test(codigoCorManual)}
                                            style={{ 
                                                padding: '0 8px', 
                                                backgroundColor: /^#[0-9A-F]{6}$/.test(codigoCorManual) ? '#FF4791' : '#ccc', 
                                                color: '#fff', 
                                                border: 'none', 
                                                borderRadius: '8px', 
                                                cursor: /^#[0-9A-F]{6}$/.test(codigoCorManual) ? 'pointer' : 'not-allowed', 
                                                fontSize: '14px' 
                                            }}>
                                            Adicionar
                                        </button>
                                    </div>
                                    
                                    {/* Botão Concluir */}
                                    <button type="button" onClick={() => setAbrirPopoverCores(false)} style={{ padding: '4px 8px', backgroundColor: '#FF4791', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', marginTop: '10px', width: '100%' }}>
                                        Concluir Seleção
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tamanho */}
                        <div style={{ position: "relative", flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Selecione tamanho"
                                value={tamanhosDisplay}
                                onFocus={() => setAbrirPopoverTamanhos(true)}
                                readOnly
                                style={estiloInput}
                                required={tamanhosSelecionados.length === 0}
                            />
                            {abrirPopoverTamanhos && (
                                <div ref={refPopoverTamanhos} style={{ position: "absolute", top: "45px", left: 0, width: "100%", backgroundColor: "#fff", border: "1px solid #000", borderRadius:"10px", padding:"8px", zIndex:10, maxHeight: '200px', overflowY: 'auto' }}>
                                    <div style={{display:"flex", flexWrap:"wrap", gap:"5px"}}>
                                        {tamanhosDisponiveis.map(t=>(
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => toggleTamanho(t)}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '5px',
                                                    border: tamanhosSelecionados.includes(t) ? '2px solid #FF4791' : '1px solid #ccc',
                                                    backgroundColor: tamanhosSelecionados.includes(t) ? '#FFF0F5' : '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    minWidth: '35px',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <button type="button" onClick={() => setAbrirPopoverTamanhos(false)} style={{ padding: '4px 8px', backgroundColor: '#FF4791', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', marginTop: '8px', width: '100%' }}>
                                        Concluir Seleção
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Categoria (select) */}
                    <select 
                        value={categoriaId || ""} 
                        onChange={(e) => setCategoriaId(e.target.value)} 
                        style={estiloInput} 
                        required
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                    </select>

                    <input type="number" placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} style={estiloInput} required />
                    <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={estiloTextArea} required />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "20px" }}>
                        <button type="submit" style={botaoVerde}>Salvar Alterações</button>
                        <button type="button" onClick={handleCancelar} style={botaoVermelho}>Cancelar</button>
                    </div>
                </form>
            </div>

            {/* ALERTA DE SUCESSO */}
            {mostrarAlerta && (
                <div style={{
                    position: "absolute",
                    top: 131,
                    right: 'calc(50% - 379px)', 
                    width: 344,
                    zIndex: 9999
                }}>
                    <Alert severity="success" sx={{ height: "100%" }}>
                        <AlertTitle>Sucesso</AlertTitle>
                        Produto atualizado com sucesso!
                    </Alert>
                </div>
            )}
        </div>
    );
}