import db from "@/lib/db"; // seu banco já configurado (DBeaver/PostgreSQL)

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM categoria ORDER BY nome");
    return Response.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const nome = body.nome;

    if (!nome || nome.trim() === "") {
      return new Response("Nome da categoria é obrigatório", { status: 400 });
    }

    const insert = await db.query(
      "INSERT INTO categoria (nome) VALUES ($1) RETURNING *",
      [nome]
    );

    return Response.json(insert.rows[0]);
  } catch (err) {
    console.error("Erro ao adicionar categoria:", err);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}
