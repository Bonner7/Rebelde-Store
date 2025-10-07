import { NextResponse } from 'next/server';
import { put } from "@vercel/blob";
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

// GET: lista todos os produtos com nome da categoria
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
    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = data;

    // Buscar id da categoria pelo nome
    const catResult = await db.query("SELECT id FROM categoria WHERE nome = $1", [categoria]);
    if (catResult.rows.length === 0) {
      return new Response("Categoria não encontrada", { status: 400 });
    }
    const categoria_id = catResult.rows[0].id;

    let imagem_url = null;

    if (imagemBase64) {
  const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    return new Response('Imagem inválida', { status: 400 });
  }

  const ext = matches[1].split('/')[1];
  const base64Data = matches[2];
  const fileName = `produto_${Date.now()}.${ext}`;

  // ⬅️ Aguardar o upload e pegar a URL pública
  const blob = await put(fileName, Buffer.from(base64Data, 'base64'), {
    access: 'public',
  });

  imagem_url = blob.url; // ⬅️ Salvar a URL completa
}

    // Inserir produto com categoria_id
    await db.query(
      `INSERT INTO produto (titulo, valor, categoria_id, estoque, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [titulo, parseFloat(valor), categoria_id, parseInt(estoque), descricao, imagem_url]
    );

    return new Response('Produto adicionado', { status: 201 });
  } catch (err) {
    console.error("Erro no POST /api/produtos:", err);
    return new Response('Erro interno', { status: 500 });
  }
}
