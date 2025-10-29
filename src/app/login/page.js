"use client";

import React, { useState } from "react";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <SessionProvider>
      <LoginContent />
    </SessionProvider>
  );
}

function LoginContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  if (session) {
    router.replace("/tela-inicial");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      alert("Preencha email e senha");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      senha,
    });

    if (res?.ok) router.push("/tela-inicial");
    else alert("Email ou senha inválidos");
  };

  const handleGoogleLogin = () => signIn("google");

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.leftSide}>
          <div style={styles.leftContent}>
            <img src="/logo.png" alt="Logo Rebelde Store" style={styles.logoImage} />
            <p style={styles.welcomeText}>Seja Bem-Vindo</p>
          </div>
        </div>

        <div style={styles.rightSide}>
          <h2 style={styles.title}>Login</h2>
          <input
            type="email"
            placeholder="E-mail"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            style={styles.input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <a href="#" style={styles.forgotLink}>Esqueci minha senha</a>
          <button style={styles.button} onClick={handleLogin}>Entrar</button>
          <button
            style={{ ...styles.button, backgroundColor: "#4285F4", marginTop: "10px" }}
            onClick={handleGoogleLogin}
          >
            Continuar com o Google
          </button>
          <div style={styles.bottomText}>
            <a href="/cadastro" style={styles.link}>Não tem uma conta? Cadastre-se</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#FF6EA8", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  box: { width: "800px", height: "500px", display: "flex", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", position: "relative" },
  leftSide: { flex: 1, backgroundColor: "rgba(255,215,215,0.9)", display: "flex", justifyContent: "center", alignItems: "center", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" },
  leftContent: { display: "flex", flexDirection: "column", alignItems: "center" },
  logoImage: { width: "85%", maxWidth: "300px", height: "auto" },
  welcomeText: { marginTop: "-40px", fontSize: "18px", fontWeight: "300", color: "#000" },
  rightSide: { flex: 1, backgroundColor: "rgba(255,71,145,0.9)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", paddingBottom: "20px", position: "relative" },
  title: { marginBottom: "20px", fontSize: "30px", fontWeight: "bold" },
  input: { width: "70%", padding: "12px", margin: "10px 0", borderRadius: "10px", border: "none", outline: "none", fontSize: "16px", transition: "0.3s" },
  forgotLink: { marginBottom: "10px", color: "#fff", fontSize: "14px", textDecoration: "underline", cursor: "pointer" },
  button: { width: "70%", padding: "12px", marginTop: "10px", borderRadius: "10px", border: "none", backgroundColor: "#000", color: "#fff", fontSize: "18px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" },
  bottomText: { position: "absolute", bottom: "20px" },
  link: { color: "#fff", fontSize: "14px", textDecoration: "underline", cursor: "pointer" },
};
