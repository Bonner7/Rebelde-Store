import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pkg from "pg";
const { Pool } = pkg;

// Conexão com PostgreSQL
const pool = new Pool({
  user: "neondb_owner",
  host: "ep-fragrant-mountain-a4y8wyx7-pooler.us-east-1.aws.neon.tech",
  database: "neondb",
  password: "npg_bo5alkUWm3GI",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// Função POST para login
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, senha } = body;

    // Busca cliente pelo email
    const result = await pool.query("SELECT * FROM clientes WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ msg: "Cliente não encontrado!" }, { status: 400 });
    }

    const cliente = result.rows[0];

    // Compara senha
    const match = await bcrypt.compare(senha, cliente.senha_hash);
    if (!match) {
      return NextResponse.json({ msg: "Senha incorreta!" }, { status: 400 });
    }

    // Gera token JWT
    const token = jwt.sign({ id: cliente.id, email: cliente.email }, "segredo_da_chave", {
      expiresIn: "1h",
    });

    // Retorna token e dados do cliente
    return NextResponse.json({
      token,
      nome: cliente.nome,
      email: cliente.email,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Erro no servidor" }, { status: 500 });
  }
}
