"use client";

import { useState, useEffect } from "react";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';
import logo from './imagem/logo.png';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TelaInicial() {
  const router = useRouter();

  const [lancamentos, setLancamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");

  // Buscar produtos
  useEffect(() => {
    async function fetchLancamentos() {
      try {
        const res = await fetch("/api/produtos"); // endpoint que traz todos os produtos
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const dados = await res.json();
        setLancamentos(dados.slice(0, 12)); // pega os 12 primeiros (mais novos)
      } catch (err) {
        console.error(err);
      }
    }
    fetchLancamentos();
  }, []);

  // Buscar categorias
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch("/api/categorias");
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        const dados = await res.json();
        setCategorias(dados);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategorias();
  }, []);

  function handleCategoriaClick(nome) {
    router.push(`/categoria/${encodeURIComponent(nome)}`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Barra superior com Instagram e Whatsapp */}
      <div
        style={{
          width: "100%",
          height: "84px",
          backgroundColor: "#FF4791",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      >
        <div style={{ gap: "20px", display: "flex" }}>
          <Instagram />
          <Whatsapp />
        </div>
      </div>

      {/* Barra com logo, links e busca */}
      <div
        style={{
          width: "100%",
          height: "118px",
          backgroundColor: "#FFD7D7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <Image
            src={logo}
            width={211}
            height={215}
            alt="Logo da Loja"
          />

          <div style={{ display: "flex", gap: "30px" }}>
            <span
              onClick={() => window.location.href = "/GerenciamentoEstoque"}
              style={{
                fontFamily: "Abhaya Libre, serif",
                fontWeight: "400",
                fontSize: "24px",
                color: "black",
                cursor: "pointer",
              }}
            >
              Gerenciamento
            </span>

            <span
              onClick={() => alert("Página de pedidos ainda não implementada")}
              style={{
                fontFamily: "Abhaya Libre, serif",
                fontWeight: "400",
                fontSize: "24px",
                color: "black",
                cursor: "pointer",
              }}
            >
              Pedidos
            </span>
          </div>
        </div>

        <form method="post">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "70px",
              border: "1px solid #ccc",
              width: "517px"
            }}
          />
        </form>
      </div>

      {/* Grid de categorias */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "60px",
          flexWrap: "wrap",
          padding: "20px",
          boxSizing: "border-box",
          maxWidth: "100%",
        }}
      >
        {categorias.length === 0 ? (
          <p>Carregando categorias...</p>
        ) : (
          categorias.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoriaClick(cat.nome)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                minWidth: 130,
              }}
            >
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  backgroundColor: "#FF4791",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 36,
                  boxShadow: "0 0 5px rgba(0,0,0,0.2)"
                }}
              >
                {cat.nome[0].toUpperCase()}
              </div>
              <span style={{ marginTop: 12, fontSize: 18, color: "#000", fontWeight: "600", textAlign: "center" }}>
                {cat.nome}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Seção de lançamentos */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "20px",
        }}
      >
        <h2
          style={{
            fontFamily: "Lalezar, regular",
            fontSize: "36px",
            margin: "0",
          }}
        >
          LANÇAMENTO
        </h2>

        <div
          style={{
            height: "2px",
            backgroundColor: "black",
            width: "80%",
            marginLeft: "20px",
          }}
        />
      </div>

      {/* Grid de lançamentos centralizado */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 242px)", // 6 produtos por linha
          justifyContent: "space-around", // centraliza o grid
          maxWidth: "1600px", // 242*6 + gaps aprox
          padding: "0",
        }}
      >
        {lancamentos.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%", marginTop: "50px" }}>
            Nenhum produto encontrado.
          </p>
        ) : (
          lancamentos.map((produto) => (
            <div
              key={produto.id}
              style={{
                width: "242px",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "10px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {/* Imagem */}
              <img
                src={produto.imagem_url}
                alt={produto.titulo}
                style={{
                  width: "100%",
                  height: "207px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />

              {/* Conteúdo do produto */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", flexGrow: 1 }}>
                <h3 style={{
                  fontSize: "16px",
                  margin: "10px 0 0 0",
                  fontWeight: "600",
                  color: "#333",
                  textAlign: "left",
                }}>
                  {produto.titulo}
                </h3>

                <p style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  margin: "0",
                  textAlign: "left",
                  color: "#000"
                }}>
                  R$ {Number(produto.valor).toFixed(2)}
                </p>

                <p style={{
                  fontSize: "12px",
                  color: "#555",
                  textAlign: "center",
                  margin: "5px 0"
                }}>
                  MAIS INFORMAÇÕES
                </p>
              </div>

              <button
                onClick={() => router.push(`/produto/${produto.id}`)}
                style={{
                  width: "100%", 
                  marginTop: "5px",
                  padding: "10px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Visualizar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
