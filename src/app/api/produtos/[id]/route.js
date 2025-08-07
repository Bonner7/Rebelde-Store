import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);
  if (isNaN(produtoId)) {
    return new Response("ID inválido", { status: 400 });
  }
  try {
    const result = await db.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [produtoId]);
    if (result.rows.length === 0) {
      return new Response("Produto não encontrado", { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Erro no GET por ID:", error);
    return new Response("Erro interno no servidor", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);
  if (isNaN(produtoId)) {
    return new Response("ID inválido", { status: 400 });
  }
  try {
    const dados = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = dados;

    let categoria_id = null;
    if (categoria) {
      const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
      if (catResult.rows.length === 0) {
        return new Response("Categoria não encontrada", { status: 400 });
      }
      categoria_id = catResult.rows[0].id;
    }

    await db.query(
      `UPDATE produto
       SET titulo = $1,
           valor = $2,
           categoria_id = $3,
           estoque = $4,
           descricao = $5,
           imagem_url = $6
       WHERE id = $7`,
      [titulo, valor, categoria_id, estoque, descricao, imagemBase64, produtoId]
    );

    return new Response("Produto atualizado com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro no PUT:", error);
    return new Response("Erro ao atualizar o produto", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);
  if (isNaN(produtoId)) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    await db.query("DELETE FROM produto WHERE id = $1", [produtoId]);
    return new Response(JSON.stringify({ message: "Produto excluído com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return new Response(JSON.stringify({ error: "Erro ao excluir o produto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
