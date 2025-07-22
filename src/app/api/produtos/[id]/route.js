import db from "@/lib/db";

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response("ID inválido", { status: 400 });
  }

  try {
    const result = await db.query("SELECT * FROM produto WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return new Response("Produto não encontrado", { status: 404 });
    }
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("Erro no GET:", error);
    return new Response("Erro interno no servidor", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response("ID inválido", { status: 400 });
  }

  try {
    const dados = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = dados;

    await db.query(
      `UPDATE produto
       SET titulo = $1,
           valor = $2,
           categoria = $3,
           estoque = $4,
           descricao = $5,
           imagem_url = $6
       WHERE id = $7`,
      [titulo, valor, categoria, estoque, descricao, imagemBase64, id]
    );

    return new Response("Produto atualizado com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro no PUT:", error);
    return new Response("Erro ao atualizar o produto", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response("ID inválido", { status: 400 });
  }

  try {
    await db.query("DELETE FROM produto WHERE id = $1", [id]);
    return new Response("Produto excluído com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return new Response("Erro ao excluir o produto", { status: 500 });
  }
}
