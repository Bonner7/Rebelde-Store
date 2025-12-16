import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

// Função POST para cadastro
export async function POST(req) {
  try {
    const body = await req.json(); // precisava do await
    const { nome, email } = body;
    let { senha } = body;

    if (!nome || !email || !senha) {
      return NextResponse.json({ msg: "Preencha todos os campos" }, { status: 400 });
    }

    // Verifica se já existe um cliente com esse email
    const exists = await pool.query("SELECT * FROM clientes WHERE email=$1", [email]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ msg: "Email já cadastrado!" }, { status: 400 });
    }

    // Gera hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    // Insere o cliente no banco usando a coluna correta 'senha_hash'
    const result = await pool.query(
      "INSERT INTO clientes (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, hashedSenha]
    );

    const cliente = result.rows[0];

    return NextResponse.json({
      msg: "Cadastro realizado com sucesso!",
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Erro no servidor" }, { status: 500 });
  }
}
