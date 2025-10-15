"use client";

import seta from './imagem/seta.png';
import { useState, useEffect, useRef } from "react";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';
import Link from "next/link";
import Image from "next/image";

export default function AdicionarProduto() {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");

  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [imagemPrincipalBase64, setImagemPrincipalBase64] = useState(null);
  const [imagensExtras, setImagensExtras] = useState([null, null, null]);
  const [imagensExtrasBase64, setImagensExtrasBase64] = useState([null, null, null]);

  const coresMaisUsadas = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080", "#00FFFF", "#FFC0CB", "#A52A2A", "#808080", "#000000", "#FFFFFF", "#6B8E23", "#4682B4", "#D2B48C", "#FFD700", "#008080", "#FF4500"];
  const [abrirPopoverCores, setAbrirPopoverCores] = useState(false);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]); 
  const [codigoCorManual, setCodigoCorManual] = useState(""); 

  const tamanhosDisponiveis = [
    "PP", "P", "M", "G", "GG", "XG", "XXG", "3G", "4G", "5G", "6G",
    "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "50", "52", "54", "56", "58", "60",
    "ÚNICO"
  ];
  const [abrirPopoverTamanhos, setAbrirPopoverTamanhos] = useState(false);
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState([]);

  const refPopoverCores = useRef();
  const refPopoverTamanhos = useRef();

  useEffect(() => {
    const buscarCategorias = async () => {
      const res = await fetch("/api/categorias");
      const data = await res.json();
      setCategorias(data);
    };
    buscarCategorias();

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

  const converterBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const limparBase64 = (base64) => {
      if (!base64) return null;
      return base64.replace(/^data:image\/(?:[a-z]+);base64,/, "");
  };

  const handleImagemPrincipal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagemPrincipal(file);
    const base64 = await converterBase64(file);
    setImagemPrincipalBase64(base64);
  };

  const handleImagemExtra = (index) => (async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const novas = [...imagensExtras]; novas[index] = file; setImagensExtras(novas);
    const novasBase64 = [...imagensExtrasBase64]; novasBase64[index] = await converterBase64(file); setImagensExtrasBase64(novasBase64);
  });

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
  
  const toggleTamanho = (tamanho) => {
    if (tamanhosSelecionados.includes(tamanho)) {
      setTamanhosSelecionados(tamanhosSelecionados.filter(t => t !== tamanho));
    } else {
      setTamanhosSelecionados([...tamanhosSelecionados, tamanho]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoriaFinal = novaCategoria.trim() || categoriaSelecionada;

    if (!categoriaFinal) { alert("Selecione ou adicione uma categoria."); return; }
    if (coresSelecionadas.length === 0) { alert("Selecione pelo menos uma cor."); return; }
    if (tamanhosSelecionados.length === 0) { alert("Selecione pelo menos um tamanho."); return; }
    
    const imagemPrincipalLimpa = limparBase64(imagemPrincipalBase64);
    const imagensExtrasLimpa = imagensExtrasBase64.map(limparBase64).filter(Boolean);

    if (!imagemPrincipalLimpa) { 
        alert("Adicione a imagem principal."); 
        return; 
    }

    try {
      if (novaCategoria.trim()) {
        const resCategoria = await fetch("/api/categorias", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: novaCategoria.trim() }) });
        if (!resCategoria.ok) throw new Error("Erro ao salvar nova categoria.");
      }

      const produto = {
        titulo, valor, categoria: categoriaFinal, estoque, descricao,
        imagemPrincipalBase64: imagemPrincipalLimpa, 
        imagensExtrasBase64: imagensExtrasLimpa,
        cores: coresSelecionadas, 
        tamanhos: tamanhosSelecionados 
      };

      const response = await fetch("/api/produtos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(produto) });
      if (response.ok) {
        alert("Produto adicionado com sucesso!");
        setTitulo(""); setValor(""); setCategoriaSelecionada(""); setNovaCategoria("");
        setEstoque(""); setDescricao(""); setImagemPrincipal(null); setImagemPrincipalBase64(null);
        setImagensExtras([null, null, null]); setImagensExtrasBase64([null, null, null]);
        setCoresSelecionadas([]); setCodigoCorManual(""); setAbrirPopoverCores(false);
        setTamanhosSelecionados([]); setAbrirPopoverTamanhos(false);
        window.location.href = "/GerenciamentoEstoque";
      } else alert("Erro ao adicionar produto");
    } catch (err) { console.error(err); alert("Erro no envio"); }
  };

  const handleCancelar = () => { window.location.href = "/GerenciamentoEstoque"; };

  const coresDisplay = coresSelecionadas.length > 0
    ? coresSelecionadas.join(", ")
    : codigoCorManual || "Escolha a cor";

  const tamanhosDisplay = tamanhosSelecionados.length > 0
    ? tamanhosSelecionados.join(", ")
    : "Selecione tamanhos";


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Barra superior */}
      <div style={{ width: "100%", height: "84px", backgroundColor: "#FF4791", display: "flex", alignItems: "center", paddingLeft: "20px" }}>
        <Instagram /><Whatsapp />
      </div>

      {/* Botão Voltar */}
      <div style={{ marginRight: "94%", marginTop: "1%", display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/GerenciamentoEstoque" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image src={seta} alt="Voltar" style={{ cursor: "pointer" }} />
          <span style={{ fontSize: 20, fontFamily: "Roboto, sans-serif", color: "#000", fontWeight: "bold" }}>VOLTAR</span>
        </Link>
      </div>

      {/* Título */}
      <div style={{ width: "758px", height: "80px", backgroundColor: "#E5D7E1", borderRadius: "74px", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Lustria, serif", fontSize: "36px", marginTop: "40px" }}>
        ADICIONAR PRODUTO
      </div>

      {/* Corpo */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: "60px", gap: "60px" }}>
        {/* Imagens */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={estiloImagem}>
            {imagemPrincipal ? <img src={URL.createObjectURL(imagemPrincipal)} alt="Principal" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }} /> : "Clique para adicionar imagem"}
            <input type="file" accept="image/*" onChange={handleImagemPrincipal} style={{ display: "none" }} />
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            {imagensExtras.map((img, i) => (
              <label key={i} style={{ ...estiloImagem, width: "90px", height: "90px" }}>
                {img ? <img src={URL.createObjectURL(img)} alt={`Extra ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} /> : "➕"}
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
            {/* Cor - ESTRUTURA MODIFICADA */}
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
                  
                  {/* LINHAS HORIZONTAIS COM AS CORES SELECIONADAS */}
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
                                          boxShadow: '0 0 0 2px #FF4791, 0 0 0 4px #fff', // Efeito para destacar o item selecionado
                                      }}
                                  >
                                      {/* Icone de X para remover */}
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
                  {/* Bolinhas cores - Linha 1 */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "5px", marginBottom: "5px" }}>
                    {coresMaisUsadas.slice(0, 6).map(cor => (
                      <div
                        key={cor}
                        style={{
                          width: "20px", height: "20px", borderRadius: "50%", backgroundColor: cor, position: "relative", cursor: "pointer",
                          border: coresSelecionadas.includes(cor) ? "3px solid #FF4791" : (cor === "#FFFFFF" ? "1px solid #ccc" : "none")
                        }}
                        onClick={() => toggleCor(cor)}>
                      </div>
                    ))}
                  </div>
                  {/* Bolinhas cores - Linha 2 */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "5px", marginBottom: "5px" }}>
                    {coresMaisUsadas.slice(6, 12).map(cor => (
                      <div
                        key={cor}
                        style={{
                          width: "20px", height: "20px", borderRadius: "50%", backgroundColor: cor, position: "relative", cursor: "pointer",
                          border: coresSelecionadas.includes(cor) ? "3px solid #FF4791" : (cor === "#FFFFFF" ? "1px solid #ccc" : "none")
                        }}
                        onClick={() => toggleCor(cor)}>
                      </div>
                    ))}
                  </div>
                  {/* Bolinhas cores - Linha 3 (opções adicionais) */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "5px", marginBottom: "10px" }}>
                    {coresMaisUsadas.slice(12).map(cor => (
                      <div
                        key={cor}
                        style={{
                          width: "20px", height: "20px", borderRadius: "50%", backgroundColor: cor, position: "relative", cursor: "pointer",
                          border: coresSelecionadas.includes(cor) ? "3px solid #FF4791" : (cor === "#FFFFFF" ? "1px solid #ccc" : "none")
                        }}
                        onClick={() => toggleCor(cor)}>
                      </div>
                    ))}
                  </div>

                  {/* Campo HEX - ESTRUTURA MODIFICADA COM BOTÃO DE ADICIONAR */}
                  <h4 style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Adicionar Manualmente:</h4>
                  <div style={{ display: 'flex', gap: '5px' }}>
                      <input
                          type="text"
                          placeholder="#HEX da cor"
                          value={codigoCorManual}
                          onChange={handleCodigoCorChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Impede o submit do formulário
                                adicionarCorManual();
                            }
                          }}
                          style={{ flexGrow: 1, height: "30px", border: "1px solid #000", borderRadius: "8px", paddingLeft: "8px", fontSize: "14px" }}
                      />
                      <button 
                          type="button" 
                          onClick={adicionarCorManual} 
                          // O botão só fica ativo se o valor for um HEX válido
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

            {/* Tamanho - ESTRUTURA ORIGINAL MANTIDA */}
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

          {/* Categoria */}
          <select value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)} style={estiloInput} required={!novaCategoria}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat => <option key={cat.id || cat.nome} value={cat.nome}>{cat.nome}</option>)}
            <option value="nova">➕ Adicionar nova categoria...</option>
          </select>
          {categoriaSelecionada === "nova" && <input type="text" placeholder="Digite a nova categoria" value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} style={estiloInput} required />}

          <input type="number" placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} style={estiloInput} required />
          <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={estiloTextArea} required />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "20px" }}>
            <button type="submit" style={botaoVerde}>Salvar</button>
            <button type="button" onClick={handleCancelar} style={botaoVermelho}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Estilos (MANTIDOS ORIGINAIS)
const estiloInput = { height: "40px", border: "1px solid #000", borderRadius: "40px", paddingLeft: "15px", fontSize: "16px" };
const estiloTextArea = { height: "80px", border: "1px solid #000", borderRadius: "40px", padding: "10px 15px", fontSize: "16px", resize: "none" };
const botaoVerde = { backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "40px", padding: "10px 30px", fontSize: "16px", cursor: "pointer" };
const botaoVermelho = { backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "40px", padding: "10px 30px", fontSize: "16px", cursor: "pointer" };
const estiloImagem = { width: "300px", height: "300px", border: "2px dashed #aaa", borderRadius: "20px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", fontSize: "16px", color: "#666", overflow: "hidden", position: "relative" };