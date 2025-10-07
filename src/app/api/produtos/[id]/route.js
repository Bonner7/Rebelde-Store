import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import db from "@/lib/db";

// GET: buscar todos os produtos
export async function GET(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const result = await db.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [produtoId]);

    if (!result.rows.length) return new Response("Produto não encontrado", { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Erro no GET por ID:", err);
    return new Response("Erro interno no servidor", { status: 500 });
  }
}

// GET: buscar produto por ID
export async function GET_ID(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const result = await db.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [produtoId]);

    if (!result.rows.length) return new Response("Produto não encontrado", { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Erro no GET por ID:", err);
    return new Response("Erro interno no servidor", { status: 500 });
  }
}

// POST: adicionar novo produto
export async function POST(req) {
  try {
    const data = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = data;

    // Buscar id da categoria
    const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
    if (!catResult.rows.length) return new Response("Categoria não encontrada", { status: 400 });
    const categoria_id = catResult.rows[0].id;

    let imagem_url = null;
    if (imagemBase64) {
      const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      let base64Data = imagemBase64;
      let ext = "png";
      if (matches) {
        base64Data = matches[2];
        ext = matches[1].split("/")[1];
      }
      const fileName = `produto_${Date.now()}.${ext}`;
      const blob = await put(fileName, Buffer.from(base64Data, "base64"), { access: "public" });
      imagem_url = blob.url;
    }

    await db.query(
      `INSERT INTO produto (titulo, valor, categoria_id, estoque, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [titulo, valor, categoria_id, estoque, descricao, imagem_url]
    );

    return new Response("Produto adicionado com sucesso", { status: 201 });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    return new Response(`Erro ao adicionar produto: ${err.message}`, { status: 500 });
  }
}

// PUT: atualizar produto
export async function PUT(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const dados = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = dados;

    // Buscar id da categoria
    let categoria_id = null;
    if (categoria) {
      const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
      if (!catResult.rows.length) return new Response("Categoria não encontrada", { status: 400 });
      categoria_id = catResult.rows[0].id;
    }

    // Buscar imagem antiga
    const resultAtual = await db.query("SELECT imagem_url FROM produto WHERE id = $1", [produtoId]);
    if (!resultAtual.rows.length) return new Response("Produto não encontrado", { status: 404 });
    const imagemAntiga = resultAtual.rows[0].imagem_url;

    let imagem_url = imagemAntiga;

    // Se enviou nova imagem, faz upload e apaga a antiga
    if (imagemBase64) {
      const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      let base64Data = imagemBase64;
      let ext = "png";
      if (matches) {
        base64Data = matches[2];
        ext = matches[1].split("/")[1];
      }
      const fileName = `produto_${Date.now()}.${ext}`;
      const blob = await put(fileName, Buffer.from(base64Data, "base64"), { access: "public" });
      imagem_url = blob.url;

      if (imagemAntiga) {
        try {
          await del(imagemAntiga);
          console.log("Imagem antiga removida do Blob:", imagemAntiga);
        } catch (delError) {
          console.warn("Falha ao remover imagem antiga do Blob:", delError);
        }
      }
    }

    await db.query(
      `UPDATE produto
       SET titulo=$1, valor=$2, categoria_id=$3, estoque=$4, descricao=$5, imagem_url=$6
       WHERE id=$7`,
      [titulo, valor, categoria_id, estoque, descricao, imagem_url, produtoId]
    );

    return new Response("Produto atualizado com sucesso", { status: 200 });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    return new Response(`Erro ao atualizar produto: ${err.message}`, { status: 500 });
  }
}

// DELETE: remover produto e imagem no Blob
export async function DELETE(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const result = await db.query("SELECT imagem_url FROM produto WHERE id = $1", [produtoId]);
    if (!result.rows.length) return new Response("Produto não encontrado", { status: 404 });
    const imagem_url = result.rows[0].imagem_url;

    // Deletar produto do banco
    await db.query("DELETE FROM produto WHERE id = $1", [produtoId]);

    // Deletar imagem no Blob
    if (imagem_url) {
      try {
        await del(imagem_url);
        console.log("Imagem removida do Blob:", imagem_url);
      } catch (delError) {
        console.warn("Falha ao remover imagem do Blob:", delError);
      }
    }

    return new Response("Produto e imagem excluídos com sucesso", { status: 200 });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    return new Response(`Erro ao deletar produto: ${err.message}`, { status: 500 });
  }
}
