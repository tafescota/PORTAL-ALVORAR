// Persistência das regras do módulo REALOCAÇÃO USO E CONSUMO.
// Usa uma store SEPARADA ("uso-consumo") do Netlify Blobs.
// Não lê nem grava a store "depara" (regras de conciliação, provisões e recebimentos).
import { getStore } from "@netlify/blobs";

const CHAVE = "regras";

function regrasValidas(r) {
  return r && typeof r === "object"
    && r.parametros && typeof r.parametros === "object"
    && Array.isArray(r.categorias)
    && Array.isArray(r.regras_fornecedor)
    && Array.isArray(r.regras_ncm);
}

export default async (req) => {
  const store = getStore("uso-consumo");

  if (req.method === "GET") {
    try {
      const raw = await store.get(CHAVE);
      return Response.json({ regras: raw ? JSON.parse(raw) : null });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === "PUT" || req.method === "POST") {
    try {
      const body = await req.json();
      const regras = body && body.regras;
      if (!regrasValidas(regras)) {
        return Response.json({ error: "Formato inválido: faltam parametros, categorias, regras_fornecedor ou regras_ncm." }, { status: 400 });
      }
      if (!Array.isArray(regras.regras_produto)) regras.regras_produto = [];
      // backup da versão anterior antes de gravar
      const anterior = await store.get(CHAVE);
      const agora = new Date().toISOString();
      let backup = null;
      if (anterior) {
        backup = `backups/${agora.replace(/[:.]/g, "-")}`;
        await store.set(backup, anterior);
      }
      regras.atualizadoEm = agora;
      await store.set(CHAVE, JSON.stringify(regras));
      return Response.json({ ok: true, atualizadoEm: agora, backup });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return new Response("Método não permitido.", { status: 405 });
};

export const config = {
  path: "/.netlify/functions/uso-consumo-base",
};
