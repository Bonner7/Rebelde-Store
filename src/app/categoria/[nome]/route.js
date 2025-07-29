import db from "@/lib/db";

// GET: buscar todas as categorias
export async function GET() {
  try {
    const result = await db.query("SELECT * FROM categoria ORDER BY nome");
    return Response.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}

// POST: criar nova categoria
export async function POST(req) {
  try {
    const body = await req.json();
    const nome = body.nome?.trim();

    if (!nome) {
      return new Response("Nome da categoria é obrigatório", { status: 400 });
    }

    const existente = await db.query("SELECT * FROM categoria WHERE nome = $1", [nome]);
    if (existente.rows.length > 0) {
      return Response.json(existente.rows[0]); // categoria já existe
    }

    const insert = await db.query(
      "INSERT INTO categoria (nome) VALUES ($1) RETURNING *",
      [nome]
    );

    return Response.json(insert.rows[0]); // categoria nova criada
  } catch (err) {
    console.error("Erro ao adicionar categoria:", err);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}
