"use client";

import { useState } from "react";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';

export default function AdicionarProduto() {
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemBase64, setImagemBase64] = useState(null);

  const handleImagemSelecionada = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produto = {
      titulo,
      valor,
      categoria,
      estoque,
      descricao,
      imagemBase64
    };

    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        alert('Produto adicionado com sucesso!');
        setTitulo("");
        setValor("");
        setCategoria("");
        setEstoque("");
        setDescricao("");
        setImagemBase64(null);
      } else {
        alert('Erro ao adicionar produto');
      }
    } catch (error) {
      console.error(error);
      alert('Erro no envio');
    }
  };

  const handleCancelar = () => {
    setTitulo("");
    setValor("");
    setCategoria("");
    setEstoque("");
    setDescricao("");
    setImagemBase64(null);
    window.location.href = "/GerenciamentoEstoque";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
      {/* Barra superior */}
      <div style={{
        width: "100%",
        height: "84px",
        backgroundColor: "#FF4791",
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px"
      }}>
        <div style={{ gap: "20px", display: "flex" }}>
          <Instagram />
          <Whatsapp />
        </div>
      </div>

      {/* Título centralizado */}
      <div style={{
        width: "758px",
        height: "80px",
        backgroundColor: "#E5D7E1",
        borderRadius: "74px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Lustria, serif",
        fontSize: "36px",
        marginTop: "40px"
      }}>
        ADICIONAR PRODUTO
      </div>

      {/* Container linha vertical, quadrado imagem e formulário */}
      <div style={{
        marginTop: "60px",
        width: "100%",
        maxWidth: "1460px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "300px",
        height: "320px",
        position: "relative"
      }}>

        {/* Quadrado da imagem */}
        <label style={{
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
          position: "relative",
          backgroundColor: imagemBase64 ? "transparent" : "transparent"
        }}>
          {imagemBase64 ? (
            <img
              src={imagemBase64}
              alt="Imagem selecionada"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
            />
          ) : (
            "Clique para adicionar imagem"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemSelecionada}
            style={{ display: "none" }}
          />
        </label>

        {/* Linha vertical */}
        <div style={{
          width: "2px",
          height: "300px",
          backgroundColor: "#000",
          marginTop: "0"
        }} />

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "400px"
          }}
        >
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ border: "1px solid #000", borderRadius: "40px", padding: "10px", fontSize: "16px" }}
            required
          />

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={{ border: "1px solid #000", borderRadius: "40px", padding: "10px", fontSize: "16px" }}
            required
            min="0"
            step="0.01"
          />

          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ border: "1px solid #000", borderRadius: "40px", padding: "10px", fontSize: "16px" }}
            required
          />

          <input
            type="number"
            placeholder="Estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            style={{ border: "1px solid #000", borderRadius: "40px", padding: "10px", fontSize: "16px" }}
            required
            min="0"
          />

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ border: "1px solid #000", borderRadius: "40px", padding: "10px", fontSize: "16px", resize: "vertical" }}
            rows={3}
            required
          />

          {/* Botões */}
          <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: "green",
                color: "white",
                borderRadius: "40px",
                height: "50px",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              Salvar
            </button>

            <button
              type="button"
              onClick={handleCancelar}
              style={{
                flex: 1,
                backgroundColor: "red",
                color: "white",
                borderRadius: "40px",
                height: "50px",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






