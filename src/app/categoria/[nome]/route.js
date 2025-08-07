import db from "@/lib/db";

export async function GET(req, context) {
  const { nome } = await context.params; // ✅ agora é assíncrono

  console.log("Categoria recebida na URL:", nome);

  try {
    const result = await db.query(
      `
      SELECT produto.*
      FROM produto
      INNER JOIN categoria ON produto.categoria_id = categoria.id
      WHERE LOWER(categoria.nome) = LOWER($1)
      `,
      [nome]
    );

    console.log("Resultado da consulta:", result.rows);

    return Response.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    return new Response("Erro ao buscar produtos por categoria", { status: 500 });
  }
}
