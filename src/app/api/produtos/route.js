import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

// GET: Retorna todos os produtos
export async function GET() {
  try {
    const result = await db.query("SELECT * FROM produto ORDER BY id DESC");
    return NextResponse.json(result.rows); // <-- Isso retorna JSON corretamente
  } catch (err) {
    console.error("Erro no GET /api/produtos:", err);
    return new Response("Erro ao buscar produtos", { status: 500 });
  }
}

// POST: Adiciona um novo produto
export async function POST(request) {
  try {
    const data = await request.json();

    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = data;

    let imagem_url = null;

    if (imagemBase64) {
      const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        return new Response('Imagem inválida', { status: 400 });
      }
      const ext = matches[1].split('/')[1];
      const base64Data = matches[2];

      const fileName = `produto_${Date.now()}.${ext}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

      imagem_url = `/uploads/${fileName}`;
    }

    await db.query(
      `INSERT INTO produto (titulo, valor, categoria, estoque, descricao, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [titulo, parseFloat(valor), categoria, parseInt(estoque), descricao, imagem_url]
    );

    return new Response('Produto adicionado', { status: 201 });
  } catch (err) {
    console.error("Erro no POST /api/produtos:", err);
    return new Response('Erro interno', { status: 500 });
  }
}
