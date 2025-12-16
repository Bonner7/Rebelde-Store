import { NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "neondb_owner",
  host: "ep-fragrant-mountain-a4y8wyx7-pooler.us-east-1.aws.neon.tech",
  database: "neondb",
  password: "npg_bo5alkUWm3GI",
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// Adicionar ou remover favorito
export async function POST(req) {
  try {
    const body = await req.json();
    const { cliente_id, produto_id, favoritar } = body;

    if (!cliente_id || !produto_id) {
      return NextResponse.json({ msg: "Dados incompletos" }, { status: 400 });
    }

    if (favoritar) {
      // Favoritar
      const exists = await pool.query(
        "SELECT * FROM favoritos WHERE cliente_id=$1 AND produto_id=$2",
        [cliente_id, produto_id]
      );

      if (exists.rows.length > 0) {
        return NextResponse.json({ msg: "Produto já favoritado" }, { status: 400 });
      }

      const result = await pool.query(
        "INSERT INTO favoritos (cliente_id, produto_id) VALUES ($1, $2) RETURNING *",
        [cliente_id, produto_id]
      );

      return NextResponse.json({ msg: "Produto favoritado", favorito: result.rows[0] });
    } else {
      // Desfavoritar
      await pool.query(
        "DELETE FROM favoritos WHERE cliente_id=$1 AND produto_id=$2",
        [cliente_id, produto_id]
      );
      return NextResponse.json({ msg: "Produto removido dos favoritos" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Erro no servidor" }, { status: 500 });
  }
}

// Listar favoritos de um cliente
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cliente_id = searchParams.get("cliente_id");

    if (!cliente_id) {
      return NextResponse.json({ msg: "Cliente não informado" }, { status: 400 });
    }

    const result = await pool.query(
      "SELECT p.* FROM produtos p INNER JOIN favoritos f ON p.id=f.produto_id WHERE f.cliente_id=$1",
      [cliente_id]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Erro ao listar favoritos" }, { status: 500 });
  }
}
