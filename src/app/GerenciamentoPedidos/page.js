"use client";

import React, { useState } from "react";
import pixIcon from "./imagem/pix.png";
import setaesquerda from "./imagem/setaesquerda.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GerenciamentoProdutos() {
  const router = useRouter();

  const [pedidos, setPedidos] = useState([
    {
      id: 1,
      numero: "001",
      cliente: "Wylliam Ferreira dos Santos",
      itens: ["1x Vixey Vestido Longo Challis", "Cor: #FF0000"],
      pagamento: "Pix",
      entrega: true,
      data: "16/12/2025",
      total: 31.0,
      status: "Pendente",
      numeroMarginTop: 0,
      clienteMarginTop: 0,
      dataMarginTop: 0,
      statusMarginTop: 0,
    },
  ]);

  const toggleEntrega = (id) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, entrega: !p.entrega } : p))
    );
  };

  const changeStatus = (id, status) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const removePedido = (id) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        gap: "30px",
        padding: "20px",
      }}
    >
      {/* Barra rosa */}
      <div style={{ width: "100%", height: "84px", backgroundColor: "#FF4791" }} />

      {/* Botão voltar: seta + texto */}
   <div
  onClick={() => router.push("/tela-inicial")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    width: "100%",
    padding: "0 40px",
    marginTop: "10px",
  }}
>
  <Image src={setaesquerda} alt="Voltar" width={24} height={24} />
  <span style={{ fontFamily: "Abhaya Libre, serif", fontSize: "18px", fontWeight: "500" }}>
    Voltar
  </span>
</div>

      {/* Título centralizado */}
      <h1
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "36px",
          fontWeight: "700",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Gerenciamento de Pedidos
      </h1>

      {/* Cabeçalhos em cima do card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 300px 150px 150px",
          width: "90%",
          maxWidth: "1000px",
          fontWeight: "700",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        <span>Pedidos</span>
        <span>Cliente</span>
        <span style={{ justifySelf: "end" }}>Data</span>
        <span style={{ justifySelf: "end" }}>Status</span>
      </div>

      {/* Lista de pedidos */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "90%",
          maxWidth: "1000px",
        }}
      >
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            style={{
              border: "2px solid #ccc",
              borderRadius: "16px",
              padding: "20px",
              boxSizing: "border-box",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "grid",
              gridTemplateColumns: "200px 300px 150px 150px",
              alignItems: "start",
              gap: "20px",
            }}
          >
            {/* Pedidos */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginTop: pedido.numeroMarginTop,
              }}
            >
              <span style={{ color: "green", fontWeight: "700" }}># {pedido.numero}</span>
              <span style={{ fontWeight: "700" }}>Itens:</span>
            </div>

            {/* Cliente */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginTop: pedido.clienteMarginTop,
              }}
            >
              <span>{pedido.cliente}</span>
              {pedido.itens.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>

            {/* Data */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginTop: pedido.dataMarginTop,
                justifySelf: "end",
              }}
            >
              <span>{pedido.data}</span>
            </div>

            {/* Status */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginTop: pedido.statusMarginTop,
                justifySelf: "end",
              }}
            >
              <button
                style={{
                  backgroundColor:
                    pedido.status === "Concluído"
                      ? "green"
                      : pedido.status === "Pendente"
                      ? "orange"
                      : "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "5px 12px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const nextStatus =
                    pedido.status === "Concluído"
                      ? "Pendente"
                      : pedido.status === "Pendente"
                      ? "Cancelado"
                      : "Concluído";
                  changeStatus(pedido.id, nextStatus);
                }}
              >
                {pedido.status}
              </button>
            </div>

            {/* Rodapé: Pagamento, Entrega e Total */}
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Image src={pixIcon} alt="Pix" width={20} height={20} />
                  Pix
                </span>
                <span>Entrega:</span>
                <button
                  onClick={() => toggleEntrega(pedido.id)}
                  style={{
                    backgroundColor: pedido.entrega ? "green" : "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  {pedido.entrega ? "Sim" : "Não"}
                </button>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <button
                  onClick={() => removePedido(pedido.id)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                    fontSize: "18px",
                  }}
                >
                  🗑️
                </button>
                <span>Total: R$ 154,90 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
