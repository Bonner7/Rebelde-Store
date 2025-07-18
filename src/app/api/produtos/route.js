import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();

    const { titulo, valor, categoria, estoque, descricao, imagemBase64 } = data;

    let imagem_url = null;

    if (imagemBase64) {
      // Extrai tipo e base64
      const matches = imagemBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        return new Response('Imagem inválida', { status: 400 });
      }
      const ext = matches[1].split('/')[1];
      const base64Data = matches[2];

      const fileName = `produto_${Date.now()}.${ext}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      // Cria pasta uploads se não existir
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);

      // Salva arquivo
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
    console.error(err);
    return new Response('Erro interno', { status: 500 });
  }
}




