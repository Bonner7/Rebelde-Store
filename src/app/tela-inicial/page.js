"use client";

import { useState, useEffect } from "react";
import logo from './imagem/logo.png';
import lupa from "./imagem/lupa.png"
import Image from "next/image";
import { useRouter } from "next/navigation";

// IMPORT DAS IMAGENS DAS CATEGORIAS
import calca from "./imagem/calca.png";
import blusas from "./imagem/blusas.png";
import pijama from "./imagem/pijamas.png";
import saias from "./imagem/saias.png";
import cosmeticos from "./imagem/cosmeticos.png";
import short from "./imagem/short.png";
import vestidos from "./imagem/vestidos.png";

export default function TelaInicial() {
  const router = useRouter();

  const [lancamentos, setLancamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState("");

  // Mapa de imagens que serão usadas nas categorias
  const imagensCategorias = {
    "Blusas": blusas,
    "Calças": calca,
    "Pijamas": pijama,
    "Saias": saias,
    "Cosméticos": cosmeticos,
    "Shorts": short,
    "Vestidos": vestidos
  };

  useEffect(() => {
    async function fetchLancamentos() {
      try {
        const res = await fetch("/api/produtos");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const dados = await res.json();
        setLancamentos(dados.slice(0, 12));
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

      {/* Barra superior */}
      <div
        style={{
          width: "100%",
          height: "84px",
          backgroundColor: "#FF4791",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      />

      {/* Barra com logo e busca */}
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
          <Image src={logo} width={211} height={215} alt="Logo da Loja" />

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

        <form method="post" style={{ position: "relative", display: "flex", alignItems: "center" }}>
  
  {/* Ícone da lupa */}
  <Image 
    src={lupa} 
    alt="Buscar" 
    width={22} 
    height={22}
    style={{
      position: "absolute",
      left: 15,
      top: "50%",
      transform: "translateY(-50%)"
    }}
  />

  {/* Input de busca */}
  <input
    type="text"
    placeholder="Pesquisar..."
    value={busca}
    onChange={e => setBusca(e.target.value)}
    style={{
      padding: "10px 10px 10px 45px",  // espaço para a lupa
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

              {/* BOLINHA DE CATEGORIA COM IMAGEM */}
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  backgroundColor: "#FF4791",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  boxShadow: "0 0 5px rgba(0,0,0,0.2)"
                }}
              >
                <Image
                  src={imagensCategorias[cat.nome] || "/uploads/default.png"}
                  alt={cat.nome}
                  width={130}
                  height={130}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%"
                  }}
                />
              </div>

              <span
                style={{
                  marginTop: 12,
                  fontSize: 18,
                  color: "#000",
                  fontWeight: "600",
                  textAlign: "center"
                }}
              >
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

      {/* Grid de lançamentos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 242px)",
          justifyContent: "space-around",
          maxWidth: "1600px",
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
