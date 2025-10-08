import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import db from "@/lib/db";

// --- Função Auxiliar para Conversão de Base64 e Upload ---
// Ajuda a evitar repetição de código no POST e PUT
async function uploadImage(imagemBase64, imagemAntiga = null) {
  if (!imagemBase64) return imagemAntiga; // Retorna a antiga se não houver nova

  const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  let base64Data = imagemBase64;
  let ext = "png";

  if (matches) {
    base64Data = matches[2];
    ext = matches[1].split("/")[1];
  }

  try {
    const fileName = `produto_${Date.now()}.${ext}`;
    const blob = await put(fileName, Buffer.from(base64Data, "base64"), { access: "public" });
    
    // Se fez upload de uma nova, deleta a antiga, se existir
    if (imagemAntiga) {
      try {
        await del(imagemAntiga);
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

// ------------------------------------------------------------------

// GET: buscar produto por ID
// NOTA: A função 'GET_ID' foi removida, pois 'GET' já faz o trabalho em rotas com [id]
export async function GET(req, { params }) {
  // Acesso direto ao parâmetro 'id' do objeto 'params'
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

    // Retorna apenas o primeiro (e único) resultado
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

    // Validação básica dos campos obrigatórios
    if (!titulo || !valor || !categoria || estoque === undefined || !descricao) {
        return new Response("Campos obrigatórios faltando ou incompletos", { status: 400 });
    }

    // Buscar id da categoria
    const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
    if (!catResult.rows.length) return new Response("Categoria não encontrada", { status: 400 });
    const categoria_id = catResult.rows[0].id;

    // Fazer upload da imagem (se base64 estiver presente)
    const imagem_url = await uploadImage(imagemBase64);

    await db.query(
      `INSERT INTO produto (titulo, valor, categoria_id, estoque, descricao, imagem_url)
        VALUES ($1, $2, $3, $4, $5, $6)`,
      [titulo, valor, categoria_id, estoque, descricao, imagem_url]
    );

    return new Response("Produto adicionado com sucesso", { status: 201 });
  } catch (err) {
    // Trata erro de upload ou qualquer outro erro
    const status = err.message.includes("upload") || err.message.includes("base64") ? 400 : 500;
    console.error("Erro ao adicionar produto:", err);
    return new Response(`Erro ao adicionar produto: ${err.message}`, { status });
  }
}

// PUT: atualizar produto (Comportamento de PATCH: atualiza campos fornecidos)
export async function PUT(req, { params }) {
  const { id } = params;
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    const dados = await req.json();
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = dados;

    // 1. Buscar dados atuais do produto e verificar se existe
    const resultAtual = await db.query("SELECT * FROM produto WHERE id = $1", [produtoId]);
    if (!resultAtual.rows.length) return new Response("Produto não encontrado", { status: 404 });
    const produtoAtual = resultAtual.rows[0];
    let categoria_id = produtoAtual.categoria_id; // Começa com o ID de categoria atual

    // 2. Mesclar dados: usa o novo dado se fornecido, senão usa o atual
    const dadosAtualizados = {
        titulo: titulo ?? produtoAtual.titulo,
        valor: valor ?? produtoAtual.valor,
        estoque: estoque ?? produtoAtual.estoque,
        descricao: descricao ?? produtoAtual.descricao,
        imagem_url: produtoAtual.imagem_url // Imagem atual
    };

    // 3. Lidar com a Categoria
    if (categoria) {
      const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
      if (!catResult.rows.length) return new Response("Categoria não encontrada", { status: 400 });
      categoria_id = catResult.rows[0].id; // Atualiza o ID da categoria
    }
    
    // 4. Lidar com a Imagem (upload se for nova, e deleção da antiga)
    if (imagemBase64 !== undefined) {
        // Se imagemBase64 for null ou string, tentamos fazer o upload/atualização
        // Se for null, o uploadImage retorna null e deleta a antiga.
        const imagemAntiga = produtoAtual.imagem_url;
        dadosAtualizados.imagem_url = await uploadImage(imagemBase64, imagemAntiga);
    }

    // 5. Executar o UPDATE
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

    return new Response("Produto atualizado com sucesso", { status: 200 });
  } catch (err) {
    const status = err.message.includes("upload") || err.message.includes("base64") ? 400 : 500;
    console.error("Erro ao atualizar produto:", err);
    return new Response(`Erro ao atualizar produto: ${err.message}`, { status });
  }
}

// DELETE: remover produto e imagem no Blob
export async function DELETE(req, { params }) {
  const { id } = params; // Acesso direto ao parâmetro 'id'
  const produtoId = parseInt(id);

  if (isNaN(produtoId)) return new Response("ID inválido", { status: 400 });

  try {
    // 1. Buscar a URL da imagem para deleção
    const result = await db.query("SELECT imagem_url FROM produto WHERE id = $1", [produtoId]);
    if (!result.rows.length) return new Response("Produto não encontrado", { status: 404 });
    const imagem_url = result.rows[0].imagem_url;

    // 2. Deletar produto do banco
    await db.query("DELETE FROM produto WHERE id = $1", [produtoId]);

    // 3. Deletar imagem no Blob (se existir)
    if (imagem_url) {
      try {
        await del(imagem_url);
        console.log("Imagem removida do Blob:", imagem_url);
      } catch (delError) {
        console.warn("Falha ao remover imagem do Blob (não é fatal para a exclusão do produto):", delError);
      }
    }

    return new Response("Produto e imagem excluídos com sucesso", { status: 200 });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    return new Response(`Erro ao deletar produto: ${err.message}`, { status: 500 });
  }
}