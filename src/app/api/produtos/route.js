import { NextResponse } from 'next/server';
import { put } from "@vercel/blob";
import db from '@/lib/db';
import { Buffer } from 'buffer';

export const runtime = 'nodejs'; 

// --- FUNÇÃO AUXILIAR DE UPLOAD PARA VERCEL BLOB ---
async function uploadBase64ToVercelBlob(base64Data, productName, index = 0) {
  if (!base64Data) return null;

  try {
    const now = Date.now();
    const safeProductName = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const fileExtension = 'jpeg'; 
    const fileName = `produtos/${safeProductName}-${now}-${index}.${fileExtension}`;
    
    const buffer = Buffer.from(base64Data, 'base64');

    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: `image/${fileExtension}`,
      addRandomSuffix: true
    });

    return blob.url;
  } catch (error) {
    console.error("Erro ao fazer upload para Vercel Blob:", error);
    return null; 
  }
}
// --------------------------------------------------

// GET: Lista todos os produtos com nome da categoria
export async function GET() {
  try {
    const result = await db.query(`
      SELECT p.*, c.nome AS categoria_nome
      FROM produto p
      LEFT JOIN categoria c ON p.categoria_id = c.id
      ORDER BY p.id DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return new Response("Erro ao buscar produtos", { status: 500 });
  }
}

// POST: Adiciona um novo produto
export async function POST(request) {
  try {
    const data = await request.json();
    const { 
        titulo, valor, categoria, estoque, descricao, 
        imagemPrincipalBase64, imagensExtrasBase64,
        cores, tamanhos
    } = data;

    // Buscar id da categoria pelo nome
    const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
    if (catResult.rows.length === 0) {
      return new Response("Categoria não encontrada", { status: 400 });
    }
    const categoria_id = catResult.rows[0].id;

    // Upload da imagem principal
    const imagemPrincipalUrl = await uploadBase64ToVercelBlob(imagemPrincipalBase64, titulo, 0);
    if (!imagemPrincipalUrl) {
      return new Response("Erro ao carregar imagem principal. Verifique o Vercel Blob Token.", { status: 500 });
    }

    // Upload das imagens extras
    const imagensExtrasUrls = [];
    if (imagensExtrasBase64 && Array.isArray(imagensExtrasBase64)) {
      for (let i = 0; i < imagensExtrasBase64.length; i++) {
        const url = await uploadBase64ToVercelBlob(imagensExtrasBase64[i], titulo, i + 1);
        if (url) imagensExtrasUrls.push(url);
      }
    }
    
    // Inserir produto no DB
    await db.query(
      `INSERT INTO produto (
         titulo, valor, categoria_id, estoque, descricao, 
         imagem_url, imagens_extras, cores, tamanho
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        titulo, 
        parseFloat(valor), 
        categoria_id, 
        parseInt(estoque), 
        descricao, 
        imagemPrincipalUrl, 
        JSON.stringify(imagensExtrasUrls), 
        JSON.stringify(cores), 
        JSON.stringify(tamanhos) 
      ]
    );

    return new Response('Produto adicionado', { status: 201 });
  } catch (err) {
    console.error("Erro no POST /api/produtos:", err);
    return new Response('Erro interno', { status: 500 });
  }
}

// DELETE: Excluir um produto pelo ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return new Response("ID do produto não fornecido", { status: 400 });

    await db.query("DELETE FROM produto WHERE id = $1", [id]);

    return new Response("Produto excluído com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return new Response("Erro ao excluir produto", { status: 500 });
  }
}
