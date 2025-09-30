import db from "@/lib/db";

export async function GET(req, { params }) {
  let {nome} = params;
  nome = decodeURIComponent(nome);
  
  try {
    const result = await db.query(
      `SELECT p.*, c.nome AS categoria_nome
       FROM produto p
       LEFT JOIN categoria c ON p.categoria_id = c.id
       WHERE TRIM(LOWER(c.nome)) = LOWER($1)`,
      [nome.trim()]
    );
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Erro ao buscar produtos por categoria:", err);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}
