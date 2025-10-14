import Link from "next/link";
import db from "@/lib/db";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';
import seta from './imagem/seta.png';
import Image from "next/image.js";

export default async function GerenciamentoEstoque() {
  const produtosRes = await db.query(`
    SELECT p.*, c.nome AS categoria_nome
    FROM produto p
    LEFT JOIN categoria c ON p.categoria_id = c.id
    ORDER BY p.id DESC
  `);

  const produtos = produtosRes.rows;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{
          width: "100%",
          height: 84,
          backgroundColor: "#FF4791",
          display: "flex",
          alignItems: "center",
          paddingLeft: 20
        }}>
          <div style={{ gap: 20, display: "flex" }}>
            <Instagram />
            <Whatsapp />
          </div>
        </div>

        <div style={{ marginRight: '94%', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/tela-inicial" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image src={seta} alt="Voltar" style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 20, fontFamily: 'Roboto, sans-serif', color: '#000', fontWeight: 'bold' }}>
              VOLTAR
            </span>
          </Link>
        </div>

        <div style={{
          marginTop: 100,
          fontFamily: "Roboto, sans-serif",
          fontWeight: "bold",
          fontSize: 40,
          color: "#000",
          textAlign: "center"
        }}>
          Gerenciamento de Estoque
        </div>

        <div style={{
          width: 1278,
          height: 106,
          backgroundColor: "#FF6EA8",
          borderRadius: 40,
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: 10
        }}>
          <a href="/AdicionarProduto" style={{ ...buttonStyle, textDecoration: "none" }}>
            ADICIONAR
          </a>

          <a href="/ExcluirProduto" style={{ ...buttonStyle, textDecoration: "none" }}>
            EXCLUIR
          </a>

          <a href="/EditarProduto" style={{ ...buttonStyle, textDecoration: "none" }}>
            EDITAR
          </a>
        </div>

        <div style={{
          width: 1278,
          marginTop: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "bold",
          fontSize: 24,
          color: "#000"
        }}>
          <div style={{ width: 300 }}>Produto</div>
          <div style={{ width: 200, marginLeft: 90 }}>Categoria</div>
          <div style={{ width: 100, marginLeft: 100 }}>Quantidade</div>
          <div style={{ marginLeft: 100 }}>Valor</div>
        </div>

        <div style={{
          width: 1278,
          height: 2,
          backgroundColor: "#000",
          marginTop: 10
        }} />

        {produtos.map(produto => (
          <div
            key={produto.id}
            style={{
              marginTop: 30,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 1278
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: 300 }}>
              <img
                src={produto.imagem_url}
                alt={produto.titulo}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  marginRight: 10,
                  borderRadius: 10
                }}
              />
              <div style={{ fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
                {produto.titulo}
              </div>
            </div>

            <div style={{ marginLeft: 90, width: 200, fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
              {produto.categoria_nome} {/* Mostra corretamente o nome da categoria */}
            </div>

            <div style={{ marginLeft: 100, width: 100, fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
              {produto.estoque}
            </div>

            <div style={{ marginLeft: 100, fontFamily: "Roboto, sans-serif", fontSize: 24 }}>
              R$ {Number(produto.valor).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const buttonStyle = {
  width: 353,
  height: 76,
  backgroundColor: "#D9D9D9",
  border: "none",
  borderRadius: 40,
  cursor: "pointer",
  fontFamily: "Roboto, sans-serif",
  fontWeight: "bold",
  fontSize: 32,
  color: "#000",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
