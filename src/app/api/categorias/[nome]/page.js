"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Instagram from "@/app/instagram";
import Whatsapp from "@/app/whatsapp";

export default function CategoriaProdutos() {
  const { nome } = useParams();
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
  async function fetchProdutos() {
    try {
      const res = await fetch(`/api/produtos/categoria/${encodeURIComponent(nome)}`);
      if (!res.ok) throw new Error("Erro ao buscar produtos por categoria");
      const dados = await res.json();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProdutos([]); // Limpa a lista em caso de erro
    }
  }

  fetchProdutos();
}, [nome]);


  return (
    <div>
      {/* Barra superior */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <Instagram />
        <Whatsapp />
      </div>

      {/* Título da categoria */}
      <h1 style={{
        textAlign: "center",
        fontSize: "2rem",
        marginTop: "20px",
        marginBottom: "10px",
        textTransform: "capitalize"
      }}>
        {nome}
      </h1>

      {/* Lista de produtos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "20px",
        padding: "20px"
      }}>
        {produtos.map((produto) => (
          <div key={produto.id} style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "10px",
            textAlign: "left"
          }}>
            <img
              src={produto.imagem_url}
              alt={produto.titulo}
              style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
            />
            <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>{produto.titulo}</h3>
            <p style={{ color: "#333" }}>R$ {parseFloat(produto.valor).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Se não houver produtos */}
      {produtos.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Nenhum produto encontrado nessa categoria.
        </p>
      )}
    </div>
  );
}
