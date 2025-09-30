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

  useEffect(() => {
    async function fetchLancamentos() {
      try {
        const res = await fetch("/api/produtos/lancamentos");
        if (!res.ok) throw new Error("Erro ao buscar lançamentos");
        const dados = await res.json();
        setLancamentos(dados);
      } catch (err) {
        console.error(err);
      }
    }
    fetchLancamentos();
  }, []);

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
    gap: "60px",  // aumento do espaçamento entre as bolas
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
            fontSize: 36, // letra maior
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          padding: "0 20px",
          flexWrap: "wrap"
        }}
      >
        {lancamentos.length === 0 ? (
          <p>Carregando lançamentos...</p>
        ) : (
          lancamentos
            .filter(produto => produto.titulo.toLowerCase().includes(busca.toLowerCase()))
            .map((produto) => (
              <div
                key={produto.id}
                style={{
                  width: "200px",
                  height: "266px",
                  border: "2px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                  boxSizing: "border-box",
                  cursor: "pointer"
                }}
                onClick={() => router.push(`/produto/${produto.id}`)}
              >
                <img
                  src={produto.imagem_url}
                  alt={produto.titulo}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "contain",
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                />
                <div style={{
                  fontSize: 14,
                  marginBottom: 5,
                  width: "100%",
                  textAlign: "left"
                }}>
                  {produto.titulo}
                </div>
                <div style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  width: "100%",
                  textAlign: "left"
                }}>
                  R$ {Number(produto.valor).toFixed(2)}
                </div>
              </div>
            ))
        )}
      </div>

    </div>
  );
}
