import db from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagem } = body;

    const query = `
      INSERT INTO produtos (titulo, valor, categoria, estoque, descricao, imagem)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [titulo, valor, categoria, estoque, descricao, imagem];

    const result = await db.query(query, values);

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return new Response("Erro ao adicionar produto", { status: 500 });
  }
}

