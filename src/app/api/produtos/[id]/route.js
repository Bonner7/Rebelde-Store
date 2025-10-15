import { NextResponse } from "next/server"; 
import { put, del } from "@vercel/blob";
import db from "@/lib/db";
import { Buffer } from "buffer";

// --- Função de upload de imagem ---
async function uploadImage(imagemBase64, imagemAntiga = null) {
  if (!imagemBase64) return imagemAntiga;

  const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  let base64Data = imagemBase64;
  let ext = "png";

  if (matches) {
    base64Data = matches[2];
    ext = matches[1].split("/")[1];
  }

  try {
    const fileName = `produto_${Date.now()}.${ext}`;
    const blob = await put(fileName, Buffer.from(base64Data, "base64"), {
      access: "public",
      token: process.env.VERCEL_BLOB_TOKEN
    });

    if (imagemAntiga) {
      try {
        await del(imagemAntiga, { token: process.env.VERCEL_BLOB_TOKEN });
        console.log("Imagem antiga removida do Blob:", imagemAntiga);
      } catch (delError) {
        console.warn("Falha ao remover imagem antiga do Blob:", delError);
      }
    }

    return blob.url;
  } catch (uploadError) {
    console.error("Erro no upload da imagem:", uploadError);
    throw new Error("Falha ao fazer upload da imagem.");
  }
}

// --- GET produto por ID ---
export async function GET(req, { params }) {
  const { id } = await params;
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

// --- POST adicionar produto ---
export async function POST(req) {
  try {
    const data = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = data;

    if (!titulo || !valor || !categoria || estoque === undefined || !descricao) {
      return new Response("Campos obrigatórios faltando ou incompletos", { status: 400 });
    }

    // Verificar categoria existente
    let categoria_id;
    const catResult = await db.query(
      "SELECT id FROM categoria WHERE LOWER(TRIM(nome)) = LOWER(TRIM($1))",
      [categoria]
    );
    if (!catResult.rows.length) {
      const insertCat = await db.query("INSERT INTO categoria (nome) VALUES ($1) RETURNING id", [categoria]);
      categoria_id = insertCat.rows[0].id;
    } else {
      categoria_id = catResult.rows[0].id;
    }

    const imagem_url = await uploadImage(imagemBase64);

    await db.query(
      `INSERT INTO produto (titulo, valor, categoria_id, estoque, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [titulo, valor, categoria_id, estoque, descricao, imagem_url]
    );

    return new Response("Produto adicionado com sucesso", { status: 201 });
  } catch (err) {
    const status = err.message.includes("upload") || err.message.includes("base64") ? 400 : 500;
    console.error("Erro ao adicionar produto:", err);
    return new Response(`Erro ao adicionar produto: ${err.message}`, { status });
  }
}

// --- PUT atualizar produto ---
export async function PUT(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const dados = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = dados;

    const resultAtual = await db.query("SELECT * FROM produto WHERE id = $1", [produtoId]);
    if (!resultAtual.rows.length) return new Response("Produto não encontrado", { status: 404 });

    const produtoAtual = resultAtual.rows[0];

    let categoria_id = produtoAtual.categoria_id;
    const dadosAtualizados = {
      titulo: titulo ?? produtoAtual.titulo,
      valor: valor ?? produtoAtual.valor,
      estoque: estoque ?? produtoAtual.estoque,
      descricao: descricao ?? produtoAtual.descricao,
      imagem_url: produtoAtual.imagem_url
    };

    // Atualizar categoria
    if (categoria) {
      const catResult = await db.query("SELECT id FROM categoria WHERE LOWER(TRIM(nome)) = LOWER(TRIM($1))", [categoria]);
      if (!catResult.rows.length) {
        const insertCat = await db.query("INSERT INTO categoria (nome) VALUES ($1) RETURNING id", [categoria]);
        categoria_id = insertCat.rows[0].id;
      } else {
        categoria_id = catResult.rows[0].id;
      }
    }

    // Atualizar imagem
    if (imagemBase64 !== undefined) {
      dadosAtualizados.imagem_url = await uploadImage(imagemBase64, produtoAtual.imagem_url);
    }

    // UPDATE no banco
    await db.query(
      `UPDATE produto
       SET titulo=$1, valor=$2, categoria_id=$3, estoque=$4, descricao=$5, imagem_url=$6
       WHERE id=$7`,
      [
        dadosAtualizados.titulo,
        dadosAtualizados.valor,
        categoria_id,
        dadosAtualizados.estoque,
        dadosAtualizados.descricao,
        dadosAtualizados.imagem_url,
        produtoId
      ]
    );

    // Retornar produto atualizado
    const produtoAtualizado = {
      id: produtoId,
      titulo: dadosAtualizados.titulo,
      valor: dadosAtualizados.valor,
      categoria_id,
      descricao: dadosAtualizados.descricao,
      estoque: dadosAtualizados.estoque,
      imagem_url: dadosAtualizados.imagem_url
    };

    return NextResponse.json({ message: "Produto atualizado com sucesso", produto: produtoAtualizado }, { status: 200 });
  } catch (err) {
    const status = err.message.includes("upload") || err.message.includes("base64") ? 400 : 500;
    console.error("Erro ao atualizar produto:", err);
    return new Response(`Erro ao atualizar produto: ${err.message}`, { status });
  }
}

// --- DELETE remover produto ---
export async function DELETE(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const result = await db.query("SELECT imagem_url FROM produto WHERE id = $1", [produtoId]);
    if (!result.rows.length) return new Response("Produto não encontrado", { status: 404 });

    const imagem_url = result.rows[0].imagem_url;

    await db.query("DELETE FROM produto WHERE id = $1", [produtoId]);

    if (imagem_url) {
      try {
        await del(imagem_url, { token: process.env.VERCEL_BLOB_TOKEN });
        console.log("Imagem removida do Blob:", imagem_url);
      } catch (delError) {
        console.warn("Falha ao remover imagem do Blob (não é fatal):", delError);
      }
    }

    return new Response("Produto e imagem excluídos com sucesso", { status: 200 });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    return new Response(`Erro ao deletar produto: ${err.message}`, { status: 500 });
  }
}
