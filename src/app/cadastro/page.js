"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("Senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        alert(data.error || "Erro no cadastro");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.leftSide}>
          <h2 style={styles.title}>Cadastro</h2>
          <input type="text" placeholder="Nome completo" style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="email" placeholder="E-mail" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" style={styles.input} value={senha} onChange={(e) => setSenha(e.target.value)} />
          <input type="password" placeholder="Confirmar senha" style={styles.input} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
          <button style={styles.button} onClick={handleCadastro} disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</button>
          <div style={styles.bottomText}>
            <a onClick={() => router.push("/login")} style={styles.link}>Já tem uma conta? Faça login</a>
          </div>
        </div>
        <div style={styles.rightSide}>
          <div style={styles.rightContent}>
            <img src="/logo.png" alt="Logo Rebelde Store" style={styles.logoImage} />
            <p style={styles.welcomeText}>Junte-se à Rebelde Store!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#FFD7E3", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  box: { width: "800px", height: "500px", display: "flex", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", position: "relative" },
  leftSide: { flex: 1, backgroundColor: "rgba(255,71,145,0.9)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", position: "relative" },
  rightSide: { flex: 1, backgroundColor: "rgba(255,215,215,0.9)", display: "flex", justifyContent: "center", alignItems: "center", borderTopRightRadius: "20px", borderBottomRightRadius: "20px" },
  rightContent: { display: "flex", flexDirection: "column", alignItems: "center" },
  logoImage: { width: "85%", maxWidth: "300px", height: "auto" },
  welcomeText: { marginTop: "-40px", fontSize: "18px", fontWeight: "300", color: "#000" },
  title: { marginBottom: "20px", fontSize: "30px", fontWeight: "bold" },
  input: { width: "70%", padding: "12px", margin: "8px 0", borderRadius: "10px", border: "none", outline: "none", fontSize: "16px", transition: "0.3s" },
  button: { width: "70%", padding: "12px", marginTop: "10px", borderRadius: "10px", border: "none", backgroundColor: "#000", color: "#fff", fontSize: "18px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" },
  bottomText: { position: "absolute", bottom: "20px" },
  link: { color: "#fff", fontSize: "14px", textDecoration: "underline", cursor: "pointer" },
};
