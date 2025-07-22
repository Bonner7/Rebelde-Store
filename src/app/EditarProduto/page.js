"use client";

import { useState, useEffect } from "react";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';
import { useRouter } from 'next/navigation';

export default function EditarProduto() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaAberta, setCategoriaAberta] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const router = useRouter();

  const categorias = ["Camisas", "Cosméticos", "Calças", "Saias", "Vestidos", "Shorts", "Pijamas"];

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch("/api/produtos");
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter(produto => {
    const buscaLower = busca.toLowerCase();
    const tituloMatch = produto.titulo.toLowerCase().includes(buscaLower);
    const categoriaMatch = categoriaSelecionada ? produto.categoria === categoriaSelecionada : true;
    return tituloMatch && categoriaMatch;
  });

  // Função para navegar para a tela EditarProduto1 com o id do produto
  function handleEditarProduto(id) {
    router.push(`/EditarProduto1?id=${id}`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      {/* Barra superior */}
      <div style={{
        width: "100%",
        height: 84,
        backgroundColor: "#FF4791",
        display: "flex",
        alignItems: "center",
        paddingLeft: 20
      }}>
        <div style={{ gap: 20, display: "flex" }}>
          <Instagram />
          <Whatsapp />
        </div>
      </div>

      {/* Título */}
      <div style={{
        width: 1100,
        marginTop: 40,
        textAlign: "center",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "bold",
        fontSize: 40,
        color: "#000"
      }}>
        EDITAR PRODUTO
      </div>

      {/* Quadro com barra de pesquisa + categoria */}
      <div style={{
        width: 750,
        height: 100,
        backgroundColor: "#FF6EA8",
        borderRadius: 40,
        marginTop: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        paddingLeft: 10,
        paddingRight: 10,
        boxSizing: "border-box",
        position: "relative"
      }}>
        {/* Input busca */}
        <input
          type="text"
          placeholder="Buscar produto"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{
            width: 320,
            height: 56,
            borderRadius: 40,
            border: "1px solid #000",
            paddingLeft: 20,
            fontSize: 18,
            boxSizing: "border-box"
          }}
        />

        {/* Botão categoria */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setCategoriaAberta(!categoriaAberta)}
            style={{
              width: 320,
              height: 56,
              borderRadius: 40,
              backgroundColor: "#D9D9D9",
              fontSize: 18,
              cursor: "pointer",
              border: "1px solid #000",
              boxSizing: "border-box"
            }}
          >
            {categoriaSelecionada || "Categoria"}
          </button>

          {categoriaAberta && (
            <div style={{
              position: "absolute",
              top: 66,
              left: 0,
              width: 320,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 10,
              zIndex: 1000,
              maxHeight: 160,
              overflowY: "auto",
              fontSize: 16
            }}>
              {categorias.map(cat => (
                <div
                  key={cat}
                  onClick={() => {
                    setCategoriaSelecionada(cat);
                    setCategoriaAberta(false);
                  }}
                  style={{
                    padding: 10,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {cat}
                </div>
              ))}

              <div
                onClick={() => {
                  setCategoriaSelecionada("");
                  setCategoriaAberta(false);
                }}
                style={{
                  padding: 10,
                  textAlign: "center",
                  cursor: "pointer",
                  color: "red",
                  fontWeight: "bold",
                  borderTop: "1px solid #eee"
                }}
              >
                Limpar filtro
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cabeçalho das colunas - sem "Editar" */}
      <div style={{
        marginTop: 40,
        marginLeft: 135,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "bold",
        fontSize: 24,
        color: "#000",
        width: 1250
      }}>
        <div style={{ width: 300 }}>Produto</div>
        <div style={{ width: 200, marginLeft: 90 }}>Categoria</div>
        <div style={{ width: 100, marginLeft: 100 }}>Quantidade</div>
        <div style={{ marginLeft: 100 }}>Valor</div>
      </div>

      {/* Linha divisória abaixo do cabeçalho */}
      <div style={{
        width: 1300,
        height: 2,
        backgroundColor: "#000",
        marginLeft: 50,
        marginTop: 10
      }} />

      {/* Listagem dos produtos */}
      {produtosFiltrados.length === 0 ? (
        <div style={{
          width: 1200,
          marginLeft: 135,
          marginTop: 30,
          fontFamily: "Roboto, sans-serif",
          fontSize: 24,
          color: "#000"
        }}>
          Nenhum produto encontrado.
        </div>
      ) : (
        produtosFiltrados.map(produto => (
          <div
            key={produto.id}
            style={{
              marginLeft: 135,
              marginTop: 30,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 1300
            }}
          >
            {/* Produto (imagem + nome) */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: 300 }}>
              <img
                src={produto.imagem_url}
                alt={produto.titulo}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  marginRight: 10,
                  borderRadius: 10
                }}
              />
              <div style={{ fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
                {produto.titulo}
              </div>
            </div>

            {/* Categoria */}
            <div style={{ marginLeft: 90, width: 200, fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
              {produto.categoria}
            </div>

            {/* Quantidade */}
            <div style={{ marginLeft: 100, width: 100, fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
              {produto.estoque}
            </div>

            {/* Valor */}
            <div style={{ marginLeft: 100, fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
              R$ {Number(produto.valor).toFixed(2)}
            </div>

            {/* Botão editar ao lado do produto, alinhado reto */}
            <div style={{
              marginLeft: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <button
                onClick={() => handleEditarProduto(produto.id)}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#FF4791",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Editar produto"
              >
                ✏️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
