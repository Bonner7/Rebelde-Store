import db from "@/lib/db";

export async function GET() {
  try {
    const resultado = await db.query(
      "SELECT * FROM produto ORDER BY created_at DESC LIMIT 5"
    );
    return new Response(JSON.stringify(resultado.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na API /produtos/lancamentos:", error);
    return new Response("Erro ao buscar lançamentos", { status: 500 });
  }
}
