"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
        console.error("Erro ao buscar produtos por categoria:", error);
        setProdutos([]);
      }
    }
    fetchProdutos();
  }, [nome]);

  return (
    <div style={{ padding: "0 0px 0px 0px" }}>
      
      {/* Barra rosa no topo */}
      <div style={{
        width: "100%",
        height: "84px",
        backgroundColor: "#FF4791",
        borderRadius: "0px",
        marginBottom: "20px"
      }}></div>

      {/* Grid de produtos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 242px)",
        gap: "60px 20px",
        justifyContent: "center",
      }}>
        {produtos.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%", marginTop: "50px" }}>
            Nenhum produto encontrado nessa categoria.
          </p>
        ) : (
          produtos.map((produto) => (
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
                src={produto.imagem_url || "/uploads/default.png"}
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
                {/* Nome */}
                <h3 style={{
                  fontSize: "16px",
                  margin: "10px 0 0 0",
                  fontWeight: "600",
                  color: "#333",
                  textAlign: "left",
                }}>
                  {produto.titulo}
                </h3>

                {/* Preço */}
                <p style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  margin: "0",
                  textAlign: "left",
                  color: "#000"
                }}>
                  R$ {Number(produto.valor).toFixed(2)}
                </p>

                {/* Texto fixo MAIS INFORMAÇÕES */}
                <p style={{
                  fontSize: "12px",
                  color: "#555",
                  textAlign: "center",
                  margin: "5px 0"
                }}>
                  MAIS INFORMAÇÕES
                </p>
              </div>

              {/* Botão */}
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
