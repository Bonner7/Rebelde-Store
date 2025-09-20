"use client";

import React, { useState, useEffect } from "react";

export default function GerenciamentoClientes() {
  // Estado para armazenar os clientes cadastrados
  const [clientes, setClientes] = useState([]);

  // Aqui futuramente você vai buscar os clientes do backend ou de uma API
  useEffect(() => {
    // Exemplo: fetch('/api/clientes').then(...).then(data => setClientes(data))
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Barra decorativa */}
      <div
        style={{
          width: "100%",
          height: "84px",
          backgroundColor: "#FF4791",
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
        }}
      ></div>

      {/* Título da página */}
      <div
        style={{
          marginTop: 100,
          fontFamily: "Roboto, sans-serif",
          fontWeight: "bold",
          fontSize: 40,
          color: "#000",
          textAlign: "center",
        }}
      >
        Gerenciamento de Clientes
      </div>

      {/* Cards de clientes */}
      {clientes.map((cliente, index) => (
        <div
          key={cliente.id}
          style={{
            position: "absolute",
            top: 306 + index * 220, // empilha os cards verticalmente
            left: 143,
            width: 1324,
            height: 188,
            backgroundColor: "#FFF9FB",
            borderRadius: 40,
            display: "flex",
            alignItems: "center",
            padding: 20,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* Foto do cliente */}
          {cliente.foto && (
            <img
              src={cliente.foto}
              alt={cliente.nome}
              style={{ width: 100, height: 100, borderRadius: "50%", marginRight: 20 }}
            />
          )}

          {/* Informações do cliente */}
          <div style={{ fontFamily: "Roboto, sans-serif", lineHeight: 1.5 }}>
            {cliente.nome && <div style={{ fontSize: 24, fontWeight: "bold" }}>{cliente.nome}</div>}
            {cliente.cpf && <div>CPF: {cliente.cpf}</div>}
            {cliente.email && <div>E-mail: {cliente.email}</div>}
            {cliente.celular && <div>Celular: {cliente.celular}</div>}
            {cliente.nascimento && <div>Data de Nascimento: {cliente.nascimento}</div>}
            {cliente.genero && <div>Gênero: {cliente.genero}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
