"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';

export default function EditarProduto1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemBase64, setImagemBase64] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  useEffect(() => {
    async function carregarProduto() {
      try {
        const response = await fetch(`/api/produtos/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar produto");
        const data = await response.json();
        setTitulo(data.titulo);
        setValor(data.valor);
        setCategoria(data.categoria);
        setEstoque(data.estoque);
        setDescricao(data.descricao);
        setImagemBase64(data.imagem_url);
      } catch (error) {
        alert("Erro ao carregar o produto");
        console.error(error);
      }
    }
    if (id) carregarProduto();
  }, [id]);

  const handleImagemSelecionada = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagemSelecionada(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoAtualizado = {
      titulo,
      valor,
      categoria,
      estoque,
      descricao,
      imagemBase64,
    };

    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado),
      });

      if (response.ok) {
        alert("Produto atualizado com sucesso!");
        router.push("/GerenciamentoEstoque");
      } else {
        alert("Erro ao atualizar produto");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar dados");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      
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
        EDITAR PRODUTO
      </div>

      {/* Conteúdo principal */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "60px",
        gap: "60px",
      }}>
        
        {/* Imagem */}
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
          position: "relative"
        }}>
          {imagemBase64 ? (
            <img
              src={imagemSelecionada ? URL.createObjectURL(imagemSelecionada) : imagemBase64}
              alt="Imagem"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
            />
          ) : (
            "Clique para alterar imagem"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemSelecionada}
            style={{ display: "none" }}
          />
        </label>

        {/* Linha divisória */}
        <div style={{ width: "2px", height: "350px", backgroundColor: "#000" }} />

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "400px"
        }}>
          <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inputEstilo} required />
          <input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} style={inputEstilo} required />
          <input type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={inputEstilo} required />
          <input type="number" placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} style={inputEstilo} required />
          <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={textareaEstilo} required />

          {/* Botões */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
            marginTop: "20px"
          }}>
            <button type="submit" style={botaoVerde}>Salvar</button>
            <button type="button" onClick={() => router.push("/GerenciamentoEstoque")} style={botaoVermelho}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputEstilo = {
  height: "40px",
  border: "1px solid #000",
  borderRadius: "40px",
  paddingLeft: "15px",
  fontSize: "16px"
};

const textareaEstilo = {
  height: "80px",
  border: "1px solid #000",
  borderRadius: "40px",
  padding: "10px 15px",
  fontSize: "16px",
  resize: "none"
};

const botaoVerde = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "40px",
  padding: "10px 30px",
  fontSize: "16px",
  cursor: "pointer"
};

const botaoVermelho = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "40px",
  padding: "10px 30px",
  fontSize: "16px",
  cursor: "pointer"
};
