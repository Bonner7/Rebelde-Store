import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { nome, email, senha, role = "cliente" } = await request.json();

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const client = await pool.connect();

    // Verifica se o usuário já existe
    const existe = await client.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (existe.rowCount > 0) {
      client.release();
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    // Cria hash da senha
    const senhaHash = await bcrypt.hash(senha, 12); 

    // Insere usuário na tabela
    await client.query(
      "INSERT INTO usuarios (nome, email, hash, role) VALUES ($1, $2, $3, $4)",
      [nome, email, senhaHash, role]
    );

    client.release();

    return NextResponse.json({ message: "Usuário criado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
