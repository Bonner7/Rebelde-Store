"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Instagram from '../../instagram.js';
import Whatsapp from '../../whatsapp.js';

export default function CategoriaProdutos() {
  const params = useParams();
  const categoriaNome = params.nome;
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchProdutosCategoria() {
      try {
        setCarregando(true);
        const res = await fetch(`/api/produtos?categoria=${encodeURIComponent(categoriaNome)}`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const dados = await res.json();
        setProdutos(dados);
        setCarregando(false);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar produtos");
        setCarregando(false);
      }
    }
    fetchProdutosCategoria();
  }, [categoriaNome]);

  return (
    <div style={{ padding: 20, fontFamily: "Roboto, sans-serif" }}>
      {/* Barra superior */}
      <div
        style={{
          width: "100%",
          height: "84px",
          backgroundColor: "#FF4791",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
          marginBottom: 20,
        }}
      >
        <Instagram />
        <Whatsapp />
      </div>

      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        Produtos na categoria: <span style={{ fontWeight: "bold" }}>{categoriaNome}</span>
      </h1>

      {carregando && <p>Carregando produtos...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!carregando && !erro && produtos.length === 0 && (
        <p>Nenhum produto encontrado nessa categoria.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {produtos.map(produto => (
          <div
            key={produto.id}
            style={{
              width: 200,
              border: "2px solid black",
              padding: 10,
              boxSizing: "border-box",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={produto.imagem_url}
              alt={produto.titulo}
              style={{ width: "100%", height: 160, objectFit: "contain", marginBottom: 10 }}
            />
            <div style={{ fontSize: 14, marginBottom: 5, width: "100%", textAlign: "left" }}>
              {produto.titulo}
            </div>
            <div style={{ fontWeight: "bold", fontSize: 16, width: "100%", textAlign: "left" }}>
              R$ {Number(produto.valor).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
