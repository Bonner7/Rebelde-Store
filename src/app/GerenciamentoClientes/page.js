"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import seta from "./imagem/setaesquerda.png";
import pessoaIcone from "./imagem/pessoa.png";
import olhoaberto from "./imagem/olhoaberto.png";
import olhofechado from "./imagem/olhofechado.png";

export default function GerenciamentoClientes() {
  const router = useRouter();

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: "Wylliam Ferreira dos Santos",
      cpf: "000.000.000-00",
      email: "wylliamferreiraif@gmail.com",
      celular: "(00) 00000-0000",
      nascimento: "07/06/2007",
      genero: "Masculino",
      cpfVisivel: true, // controla se o CPF é visível
    },
  ]);

  const toggleCPFVisivel = (id) => {
    setClientes((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, cpfVisivel: !c.cpfVisivel } : c
      )
    );
  };

  useEffect(() => {
    // Futuramente buscar clientes do backend
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        gap: "30px",
        alignItems: "center",
      }}
    >
      {/* Barra rosa */}
      <div style={{ width: "100%", height: "84px", backgroundColor: "#FF4791" }} />

      {/* Botão voltar abaixo da barra rosa */}
      <div
       onClick={() => router.push("/tela-inicial")} // vai direto para a tela inicial
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
        <Image src={seta} alt="Voltar" width={24} height={24} />
        <span style={{ fontFamily: "Abhaya Libre, serif", fontSize: "18px", fontWeight: "500" }}>
          Voltar
        </span>
      </div>

      {/* Cabeçalho central */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginTop: "20px", // empurra o título mais para baixo
        }}
      >
        <Image src={pessoaIcone} alt="Usuário" width={60} height={60} />
        <h1 style={{ fontFamily: "Abhaya Libre, serif", fontSize: "30px", fontWeight: "700", margin: 0 }}>
          Gerenciamento de Usuário
        </h1>
      </div>

      {/* Lista de clientes */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          padding: "0 40px",
          alignItems: "center",
          width: "100%",
        }}
      >
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              border: "2px solid #000000",
              padding: "20px",
              borderRadius: "24px",
              gap: "30px",
              width: "100%",
              maxWidth: "1200px",
              boxSizing: "border-box",
            }}
          >
            {/* Foto do usuário (lado esquerdo) */}
            <Image
              src={pessoaIcone}
              alt={cliente.nome}
              width={140}
              height={140}
              style={{ borderRadius: "16px" }}
            />

            {/* Informações do cliente (lado direito) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>
                -- {cliente.nome} --
              </h2>

              {/* CPF com ícone visível/não visível */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>CPF: {cliente.cpfVisivel ? cliente.cpf : "•••.•••.•••-••"}</span>
                <div
                  onClick={() => toggleCPFVisivel(cliente.id)}
                  style={{ cursor: "pointer" }}
                  title={cliente.cpfVisivel ? "Ocultar CPF" : "Mostrar CPF"}
                >
                  <Image
                    src={cliente.cpfVisivel ? olhoaberto : olhofechado}
                    alt={cliente.cpfVisivel ? "Visível" : "Não visível"}
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              <p style={{ margin: 0 }}>E-mail: {cliente.email}</p>
              <p style={{ margin: 0 }}>Celular: {cliente.celular}</p>
              <p style={{ margin: 0 }}>Data de Nascimento: {cliente.nascimento}</p>
              <p style={{ margin: 0 }}>Gênero: {cliente.genero}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
