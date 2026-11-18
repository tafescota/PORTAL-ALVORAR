/* =====================================================================
   PORTAL ALVORAR - Módulo REALOCAÇÃO USO E CONSUMO
   Arquivo independente: não lê nem grava a base de regras de de-para.
   As regras deste módulo ficam na função /.netlify/functions/uso-consumo-base
   (store "uso-consumo" do Netlify Blobs). Sem servidor (teste local),
   ficam no localStorage do navegador.
   ===================================================================== */
(function (raiz) {
  'use strict';

  // ---------------------------------------------------------------
  // 1. REGRAS INICIAIS (usadas só se ainda não houver regras salvas)
  // ---------------------------------------------------------------
  const REGRAS_INICIAIS = {
    "versao": "2026-11-17",
    "descricao": "Regras iniciais da Realocação Uso e Consumo - ALVORAR",
    "parametros": {
      "conta_origem": 186,
      "limite_1_fica_conta_normal": 1000,
      "limite_2_imobilizado": 1200,
      "conta_bem_pequeno_valor": 184,
      "cfops_uso_consumo": [
        "1556",
        "2556",
        "1407",
        "2407",
        "1557",
        "2557"
      ],
      "modo_data": "ORIGINAL",
      "prefixo_historico": "RECLASSIFICACAO -",
      "cfops_comodato": [
        "1908",
        "2908"
      ]
    },
    "categorias": [
      {
        "categoria": "CALAMO (nota inteira)",
        "conta_normal": 186,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Calamo fica na 186, sem produto"
      },
      {
        "categoria": "ANTILHAS (nota inteira)",
        "conta_normal": 32532,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Antilhas vai inteira para Material de Embalagem"
      },
      {
        "categoria": "SEM PRODUTO / SERVIÇO",
        "conta_normal": 186,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Nota do razão sem itens no relatório de produtos (normalmente nota de serviço). O módulo só trata produtos: fica na conta de origem."
      },
      {
        "categoria": "COMODATO / NÃO É COMPRA",
        "conta_normal": 186,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Bem de terceiro (comodato, CFOP 1908/2908): não é despesa nem imobilizado. Não reclassifica; o lançamento na 186 deve ser estornado com o fiscal."
      },
      {
        "categoria": "EMBALAGEM",
        "conta_normal": 32532,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": ""
      },
      {
        "categoria": "HIGIENE E LIMPEZA",
        "conta_normal": 51241,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": ""
      },
      {
        "categoria": "ALIMENTACAO",
        "conta_normal": 884,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Comida/bebida. Confirmar conta com a Rosangele"
      },
      {
        "categoria": "UNIFORME",
        "conta_normal": 4172,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": ""
      },
      {
        "categoria": "EXPEDIENTE",
        "conta_normal": 176,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": ""
      },
      {
        "categoria": "MANUTENCAO",
        "conta_normal": 186,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Fica na 186. Se a Rosangele usar 181 Manutenção e Reparos, troque aqui"
      },
      {
        "categoria": "CONSUMO GERAL",
        "conta_normal": 186,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Copa/descartáveis, fita, PDV - fica na 186 (como nos lançamentos da Rosangele)"
      },
      {
        "categoria": "DURAVEL - INFORMATICA",
        "conta_normal": 186,
        "bem_duravel": true,
        "conta_imobilizado": 274,
        "observacao": ""
      },
      {
        "categoria": "DURAVEL - ELETRONICO",
        "conta_normal": 186,
        "bem_duravel": true,
        "conta_imobilizado": 288,
        "observacao": ""
      },
      {
        "categoria": "DURAVEL - MAQUINA/EQUIPAMENTO",
        "conta_normal": 186,
        "bem_duravel": true,
        "conta_imobilizado": 35,
        "observacao": ""
      },
      {
        "categoria": "DURAVEL - MOVEIS/UTENSILIOS",
        "conta_normal": 186,
        "bem_duravel": true,
        "conta_imobilizado": 37,
        "observacao": ""
      },
      {
        "categoria": "REVISAR",
        "conta_normal": null,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Sem regra - escolher outra categoria"
      },
      {
        "categoria": "PENDENTE",
        "conta_normal": null,
        "bem_duravel": false,
        "conta_imobilizado": null,
        "observacao": "Nota sem relatório de produtos"
      }
    ],
    "regras_fornecedor": [
      {
        "texto": "CALAMO",
        "categoria": "CALAMO (nota inteira)"
      },
      {
        "texto": "ANTILHAS",
        "categoria": "ANTILHAS (nota inteira)"
      }
    ],
    "regras_produto": [],
    "regras_ncm": [
      {
        "prefixo": "61",
        "categoria": "UNIFORME"
      },
      {
        "prefixo": "62",
        "categoria": "UNIFORME"
      },
      {
        "prefixo": "64",
        "categoria": "UNIFORME"
      },
      {
        "prefixo": "6309",
        "categoria": "UNIFORME"
      },
      {
        "prefixo": "392321",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "392329",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3401",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3402",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3405",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "2828",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "2827",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3808",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3809",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "4818",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "2207",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "2905",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "2902",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "6307",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "5603",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "4015",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "6805",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "9603",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "5601",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3005",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "3307",
        "categoria": "HIGIENE E LIMPEZA"
      },
      {
        "prefixo": "04",
        "categoria": "ALIMENTACAO"
      },
      {
        "prefixo": "09",
        "categoria": "ALIMENTACAO"
      },
      {
        "prefixo": "17",
        "categoria": "ALIMENTACAO"
      },
      {
        "prefixo": "19",
        "categoria": "ALIMENTACAO"
      },
      {
        "prefixo": "21",
        "categoria": "ALIMENTACAO"
      },
      {
        "prefixo": "22",
        "categoria": "ALIMENTACAO"
      },
      {
        "prefixo": "4819",
        "categoria": "EMBALAGEM"
      },
      {
        "prefixo": "4821",
        "categoria": "EMBALAGEM"
      },
      {
        "prefixo": "5806",
        "categoria": "EMBALAGEM"
      },
      {
        "prefixo": "3920",
        "categoria": "EMBALAGEM"
      },
      {
        "prefixo": "4802",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "9608",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "8305",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4820",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4817",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "8472",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "8470",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "3506",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "3505",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "3502",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4016",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "9017",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "3926",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4811",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4805",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "8505",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "3215",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4202",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4901",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "4902",
        "categoria": "EXPEDIENTE"
      },
      {
        "prefixo": "8471",
        "categoria": "DURAVEL - INFORMATICA"
      },
      {
        "prefixo": "8443",
        "categoria": "DURAVEL - INFORMATICA"
      },
      {
        "prefixo": "85176",
        "categoria": "DURAVEL - INFORMATICA"
      },
      {
        "prefixo": "8517",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8525",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8521",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8531",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8504",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8507",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8518",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "9208",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "8528",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "85176272",
        "categoria": "DURAVEL - ELETRONICO"
      },
      {
        "prefixo": "94",
        "categoria": "DURAVEL - MOVEIS/UTENSILIOS"
      },
      {
        "prefixo": "7323",
        "categoria": "DURAVEL - MOVEIS/UTENSILIOS"
      },
      {
        "prefixo": "9617",
        "categoria": "DURAVEL - MOVEIS/UTENSILIOS"
      },
      {
        "prefixo": "7616",
        "categoria": "DURAVEL - MOVEIS/UTENSILIOS"
      },
      {
        "prefixo": "84",
        "categoria": "DURAVEL - MAQUINA/EQUIPAMENTO"
      },
      {
        "prefixo": "85",
        "categoria": "DURAVEL - MAQUINA/EQUIPAMENTO"
      },
      {
        "prefixo": "9030",
        "categoria": "DURAVEL - MAQUINA/EQUIPAMENTO"
      },
      {
        "prefixo": "8425",
        "categoria": "DURAVEL - MAQUINA/EQUIPAMENTO"
      },
      {
        "prefixo": "8506",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8536",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8537",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8543",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8544",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8546",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8539",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8481",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "84733",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "85365",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "85366",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "85369",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "85319",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8531800",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8504509",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "85044010",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "85299090",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "9018",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "9405",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "9004",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "7003",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "72",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "73",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "74",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "76",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "44",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "82",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "83",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "39",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "3209",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "3214",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "5607",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "8311",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "0206",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "3917",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "3925",
        "categoria": "MANUTENCAO"
      },
      {
        "prefixo": "4911",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "3303",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "3304",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "3305",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "8214",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "9603300",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "3924",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "3923500",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "4823",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "8421",
        "categoria": "CONSUMO GERAL"
      },
      {
        "prefixo": "3919",
        "categoria": "CONSUMO GERAL"
      }
    ]
  };

  const NOMES_CONTAS_PADRAO = {
    186: 'Material de consumo', 32532: 'Material de Embalagem', 51241: 'Material de Higiene e Limpeza',
    884: 'Alimentação', 4172: 'Uniformes', 176: 'Material de expediente', 181: 'Manutenção e Reparos',
    184: 'Bens permanente de valor reduzido', 274: 'Computadores e Periféricos',
    288: 'Equipamentos e Aparelhos Eletrônicos', 35: 'Máquinas e Equipamentos', 37: 'Móveis e Utensílios'
  };
  const TXT_INTEIRA = 'NOTA INTEIRA - NÃO RELACIONA PRODUTO';
  const CAT_COMODATO = 'COMODATO / NÃO É COMPRA';
  const CAT_SEMPROD = 'SEM PRODUTO / SERVIÇO';
  const CFOPS_COMODATO_PADRAO = ['1908', '2908'];

  // Garante que regras salvas antes desta versão tenham o que é novo (sem apagar nada do usuário)
  function migrarRegras(regras) {
    const P = regras.parametros || (regras.parametros = {});
    if (!Array.isArray(P.cfops_comodato)) P.cfops_comodato = CFOPS_COMODATO_PADRAO.slice();
    if (!Array.isArray(regras.regras_produto_texto)) regras.regras_produto_texto = [];
    regras.categorias = regras.categorias || [];
    if (!regras.categorias.some(c => c.categoria === CAT_SEMPROD)) {
      regras.categorias.splice(2, 0, { categoria: CAT_SEMPROD, conta_normal: P.conta_origem, bem_duravel: false, conta_imobilizado: null, observacao: 'Nota do razão sem itens no relatório de produtos (normalmente nota de serviço). O módulo só trata produtos: fica na conta de origem.' });
    }
    if (!regras.categorias.some(c => c.categoria === CAT_COMODATO)) {
      regras.categorias.splice(2, 0, { categoria: CAT_COMODATO, conta_normal: P.conta_origem, bem_duravel: false, conta_imobilizado: null, observacao: 'Bem de terceiro (comodato, CFOP 1908/2908): não é despesa nem imobilizado. Não reclassifica; o lançamento na 186 deve ser estornado com o fiscal.' });
    }
    return regras;
  }
  const TXT_SEMPROD = 'SEM RELATÓRIO DE PRODUTOS';
  const API = '/.netlify/functions/uso-consumo-base';
  const STORAGE_LOCAL = 'portal_alvorar_uso_consumo_regras_v1';

  // ---------------------------------------------------------------
  // 2. FUNÇÕES DE APOIO
  // ---------------------------------------------------------------
  const clonar = o => JSON.parse(JSON.stringify(o));
  const up = s => String(s == null ? '' : s).trim().toUpperCase();
  const r2 = v => Math.round((Number(v) || 0) * 100) / 100;
  const fmt = v => (Number(v) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Lê o arquivo como texto. O TXT do Domínio costuma vir em UTF-8 com acentos quebrados;
  // se não for UTF-8 válido, lê como Windows-1252.
  function lerTexto(buffer) {
    try { return new TextDecoder('utf-8', { fatal: true }).decode(buffer); }
    catch (e) { return new TextDecoder('windows-1252').decode(buffer); }
  }

  // Conserta os acentos quebrados que vêm no TXT (ex.: "N\uFFFD " -> "Nº ")
  function limparTexto(s) {
    s = String(s || '').replace(/ï¿½/g, '\uFFFD');
    return s.replace(/N\uFFFD /g, 'Nº ').replace(/TRANSFER\uFFFDNCIA/g, 'TRANSFERÊNCIA')
      .replace(/GR\uFFFDFICA/g, 'GRÁFICA').replace(/PER\uFFFDODO/g, 'PERÍODO').replace(/\uFFFD/g, '');
  }

  // "4.557,02" -> 4557.02
  function numBR(s) {
    s = String(s == null ? '' : s).trim();
    if (!s) return 0;
    return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
  }

  function ncm8(v) {
    if (v == null || v === '') return '';
    const s = String(v).trim().replace(/\.0+$/, '').replace(/\D/g, '');
    return s ? s.padStart(8, '0') : '';
  }

  // Nome curto do produto para o histórico: tira parênteses e fica com 2 palavras
  function nomeCurto(desc) {
    return String(desc || '').replace(/\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).join(' ');
  }

  // Grupo = empresa do arquivo do razão (matriz + filiais). "RAZÃO MDN.txt" -> "MDN"
  function nomeGrupo(arquivo, nome) {
    let g = String(arquivo || '').replace(/\.[^.]+$/, '').replace(/^.*?RAZ(?:Ã|A|_|\uFFFD|#U00c3)?O[\s_\-]*/i, '').replace(/[^\w\- ]+/g, '').trim();
    if (!g) g = String(nome || 'EMPRESA').split(/[\s-]+/)[0];
    return g.toUpperCase();
  }

  function ultimoDiaDoMes(dataBR) {
    const [d, m, a] = dataBR.split('/').map(Number);
    const ult = new Date(a, m, 0).getDate();
    return String(ult).padStart(2, '0') + '/' + String(m).padStart(2, '0') + '/' + a;
  }

  // ---------------------------------------------------------------
  // 3. LEITURA DOS ARQUIVOS
  // ---------------------------------------------------------------

  // Razão em TXT separado por TAB (export do Domínio). Índices a partir de 0:
  // 0 empresa | 3 conta | 4 tipo (2 = lançamento) | 5 data | 6 lançamento | 11 débito | 17 histórico | 28 nome
  function parseRazao(texto, contaOrigem, nomeArquivo) {
    const lancs = [];
    String(texto).split(/\r?\n/).forEach(linha => {
      const c = linha.split('\t');
      if (c.length < 18) return;
      if (String(c[4]).trim() !== '2' || String(c[3]).trim() !== String(contaOrigem)) return;
      const valor = numBR(c[11]);
      if (!(valor > 0)) return;
      const hist = limparTexto(String(c[17]).trim());
      const m = /\d{3,}/.exec(hist);
      let nf, forn;
      if (m) { nf = m[0]; forn = hist.slice(m.index + m[0].length).trim(); }
      else { nf = 'SEM NF-' + String(c[6]).trim(); forn = hist; }
      forn = forn.replace(/^-\s*/, '').trim();
      lancs.push({
        emp: Number(String(c[0]).trim()), data: String(c[5]).trim(), lanc: String(c[6]).trim(),
        valor, hist, nf, forn, nome: c.length > 28 ? String(c[28]).trim() : '', arquivo: nomeArquivo || ''
      });
    });
    return lancs;
  }

  // "Relação de Notas com Produtos - Completo" (xls). Linhas = matriz de células (sheet_to_json header:1).
  // A Operação | B NF | G CFOP | H Cód | I Produto | N NCM | P Qtd | R Vlr unit | S Vlr produto
  function parseProdutos(linhas, nomeArquivo) {
    const base = String(nomeArquivo || '').replace(/\.[^.]+$/, '');
    const m = /(\d+)\D*$/.exec(base);
    if (!m) return { erro: 'Não achei o código da empresa no nome do arquivo "' + nomeArquivo + '". O nome precisa terminar com o código (ex.: "... MDN 20460.xls").' };
    const emp = Number(m[1]);
    let cnpj = '';
    for (let i = 0; i < Math.min(10, linhas.length); i++) {
      const a = String((linhas[i] || [])[0] || '');
      if (/CNPJ/i.test(a)) { cnpj = a.replace(/CNPJ:?/i, '').trim(); break; }
    }
    const itens = [];
    linhas.forEach(l => {
      if (!l || String(l[0] == null ? '' : l[0]).trim() !== 'Entrada') return;
      itens.push({
        emp, nf: String(l[1] == null ? '' : l[1]).trim().replace(/\.0+$/, ''),
        cfop: String(l[6] == null ? '' : l[6]).trim().replace(/\.0+$/, ''),
        cod: String(l[7] == null ? '' : l[7]).trim(), prod: String(l[8] == null ? '' : l[8]).trim(),
        ncm: ncm8(l[13]), qtd: Number(l[15]) || 0, vunit: Number(l[17]) || 0, vtot: Number(l[18]) || 0
      });
    });
    return { emp, cnpj, itens, arquivo: nomeArquivo };
  }

  // O .xls exportado pelo Domínio vem com o ponteiro da planilha (registro BOUNDSHEET) apontando
  // para a posição errada. O Excel tolera; o SheetJS não acha a planilha. Aqui o ponteiro é
  // corrigido em memória (o arquivo original não é alterado) e o arquivo é lido de novo.
  // Ao ler o .xls do Domínio, a biblioteca registra na memória centenas de formatos de número
  // inválidos (ex.: "5100172946"), que depois iriam para todo Excel gerado e o Excel pediria
  // para "reparar". Por isso a tabela de formatos volta ao padrão logo depois de cada leitura.
  let FORMATOS_PADRAO = null;
  function restaurarFormatos(XL) {
    const t = XL.SSF.get_table();
    if (!FORMATOS_PADRAO) return;
    Object.keys(t).forEach(k => { if (!(k in FORMATOS_PADRAO)) delete t[k]; });
    Object.keys(FORMATOS_PADRAO).forEach(k => { t[k] = FORMATOS_PADRAO[k]; });
  }
  function lerPlanilha(XL, buffer) {
    if (!FORMATOS_PADRAO) FORMATOS_PADRAO = Object.assign({}, XL.SSF.get_table());
    try { return lerPlanilhaBruta(XL, buffer); } finally { restaurarFormatos(XL); }
  }
  function lerPlanilhaBruta(XL, buffer) {
    let wb = XL.read(buffer, { type: 'array' });
    if (wb.SheetNames.length && wb.Sheets[wb.SheetNames[0]]) return wb;
    const cfb = XL.CFB.read(buffer, { type: 'array' });
    const ent = XL.CFB.find(cfb, 'Workbook') || XL.CFB.find(cfb, 'Book');
    if (!ent) return wb;
    const d = ent.content;
    const bofs = [], sheets = [];
    let i = 0;
    while (i + 4 <= d.length) {
      const tipo = d[i] | (d[i + 1] << 8), tam = d[i + 2] | (d[i + 3] << 8);
      if (tipo === 0x0809) bofs.push(i);
      if (tipo === 0x0085) sheets.push(i + 4);
      i += 4 + tam;
    }
    sheets.forEach((p, k) => {
      const pos = bofs[k + 1];
      if (pos == null) return;
      d[p] = pos & 255; d[p + 1] = (pos >>> 8) & 255; d[p + 2] = (pos >>> 16) & 255; d[p + 3] = (pos >>> 24) & 255;
    });
    wb = XL.read(XL.CFB.write(cfb, { type: 'array' }), { type: 'array' });
    return wb;
  }

  // ---------------------------------------------------------------
  // 4. CLASSIFICAÇÃO
  // ---------------------------------------------------------------
  function categoriaPorNCM(ncm, regrasNcm) {
    let melhor = null;
    (regrasNcm || []).forEach(r => {
      const p = String(r.prefixo || '').trim();
      if (p && ncm.startsWith(p) && (!melhor || p.length > melhor.prefixo.length)) melhor = { prefixo: p, categoria: r.categoria };
    });
    return melhor ? melhor.categoria : null;
  }

  // Regra simples criada pela usuária: o texto pode aparecer em qualquer parte
  // da descrição. Quando duas regras combinam, vale a mais comprida/específica.
  function categoriaPorTextoProduto(produto, regrasTexto) {
    const descricao = up(produto);
    let melhor = null;
    (regrasTexto || []).forEach(r => {
      const texto = up(r.texto);
      if (texto && descricao.includes(texto) && (!melhor || texto.length > melhor.texto.length)) melhor = { texto, categoria: r.categoria };
    });
    return melhor ? melhor.categoria : null;
  }

  function assinaturaItemRelatorio(item) {
    return [item.nf, item.cfop, item.cod, item.prod, item.ncm, item.qtd, item.vunit, item.vtot]
      .map(v => String(v == null ? '' : v).trim()).join('|');
  }

  function compararRelatoriosDuplicados(anterior, atual) {
    const contar = itens => {
      const mapa = new Map();
      (itens || []).forEach(item => {
        const chave = assinaturaItemRelatorio(item);
        mapa.set(chave, (mapa.get(chave) || 0) + 1);
      });
      return mapa;
    };
    const a = contar(anterior.itens), b = contar(atual.itens);
    let itensEmComum = 0;
    a.forEach((qtd, chave) => { itensEmComum += Math.min(qtd, b.get(chave) || 0); });
    const notasA = new Set((anterior.itens || []).map(item => String(item.nf)));
    const notasB = new Set((atual.itens || []).map(item => String(item.nf)));
    const notasEmComum = [...notasA].filter(nf => notasB.has(nf));
    return {
      cnpj: atual.cnpj || anterior.cnpj || '',
      emps: [anterior.emp, atual.emp],
      relatorios: [anterior, atual].map(relatorio => ({
        empresa: relatorio.emp,
        arquivo: relatorio.arquivo || '',
        itens: (relatorio.itens || []).length,
        notas: new Set((relatorio.itens || []).map(item => String(item.nf))).size
      })),
      itensEmComum,
      itensSomentePrimeiro: (anterior.itens || []).length - itensEmComum,
      itensSomenteSegundo: (atual.itens || []).length - itensEmComum,
      notasEmComum: notasEmComum.length,
      notasSomentePrimeiro: [...notasA].filter(nf => !notasB.has(nf)),
      notasSomenteSegundo: [...notasB].filter(nf => !notasA.has(nf))
    };
  }

  // Ordem: regra de fornecedor (nota inteira) > sem produto (PENDENTE) > por item: produto > NCM > REVISAR
  function classificar(lancs, arquivosProdutos, regras) {
    migrarRegras(regras);
    const P = regras.parametros;
    const cfopsComodato = new Set((P.cfops_comodato || []).map(String));
    const alertas = [];
    const notas = new Map();
    lancs.forEach(l => {
      const k = l.emp + '|' + l.nf;
      if (!notas.has(k)) notas.set(k, { chave: k, emp: l.emp, nf: l.nf, data: l.data, lancs: [], valor: 0, forn: l.forn, hist: l.hist, nome: l.nome, grupo: nomeGrupo(l.arquivo, l.nome) });
      const n = notas.get(k); n.lancs.push(l.lanc); n.valor += l.valor;
    });

    const idx = new Map();
    const cnpjs = new Map();
    const duplicados = [];
    (arquivosProdutos || []).forEach(a => {
      if (a.cnpj) {
        const anterior = cnpjs.get(a.cnpj);
        if (anterior && anterior.emp !== a.emp) duplicados.push(compararRelatoriosDuplicados(anterior, a));
        else cnpjs.set(a.cnpj, a);
      }
      a.itens.forEach(it => { const k = it.emp + '|' + it.nf; if (!idx.has(k)) idx.set(k, []); idx.get(k).push(it); });
    });

    const regProd = new Map((regras.regras_produto || []).map(r => [up(r.descricao), r.categoria]));
    const cfops = new Set((P.cfops_uso_consumo || []).map(String));
    const itens = [];
    let seq = 0;
    const novo = (n, o) => {
      const it = Object.assign({ id: ++seq, chave: n.chave, emp: n.emp, nf: n.nf, forn: n.forn, lancs: n.lancs.join(', '), data: n.data, vrazao: r2(n.valor), cfop: '', prod: '', ncm: '', qtd: 1, vtot: n.valor, obs: '' }, o);
      it.catSugerida = it.cat; itens.push(it);
    };

    notas.forEach(n => {
      const texto = up(n.forn + ' ' + n.hist);
      const rf = (regras.regras_fornecedor || []).find(r => up(r.texto) && texto.includes(up(r.texto)));
      if (rf) { novo(n, { prod: TXT_INTEIRA, cat: rf.categoria, origem: 'FORNECEDOR' }); return; }
      const todos = idx.get(n.chave) || [];
      if (!todos.length) {
        novo(n, { prod: TXT_SEMPROD, cat: CAT_SEMPROD, origem: 'SEM PRODUTO', obs: 'Sem itens no relatório de produtos: normalmente nota de serviço. Fica na conta ' + P.conta_origem + '.' });
        alertas.push({ tipo: 'NOTA SEM PRODUTOS (provável serviço)', texto: 'Empresa ' + n.emp + ' NF ' + n.nf + ' - ' + n.forn + ' - R$ ' + fmt(n.valor) + ' - fica na ' + P.conta_origem + '.', grave: false });
        return;
      }
      // Comodato (bem de terceiro): não é compra - não reclassifica, avisa para estornar
      const comodato = todos.filter(i => cfopsComodato.has(String(i.cfop)));
      if (comodato.length === todos.length) {
        comodato.forEach(i => novo(n, { cfop: i.cfop, prod: i.prod, ncm: i.ncm, qtd: i.qtd, vtot: i.vtot, cod: i.cod, cat: CAT_COMODATO, origem: 'CFOP', obs: 'CFOP ' + i.cfop + ' = comodato. Estornar o lançamento na conta ' + P.conta_origem + ' com o fiscal.' }));
        alertas.push({ tipo: 'COMODATO - NÃO É COMPRA', texto: 'Empresa ' + n.emp + ' NF ' + n.nf + ' - ' + n.forn + ' - R$ ' + fmt(n.valor) + ' - CFOP ' + [...new Set(comodato.map(i => i.cfop))].join(', ') + '. Bem de terceiro: não reclassificar; o lançamento na ' + P.conta_origem + ' deve ser estornado (acumulador do fiscal integrou como compra).', grave: true });
        return;
      }
      let usar = todos.filter(i => cfops.has(String(i.cfop)));
      let obs = '';
      if (!usar.length) {
        const lista = [...new Set(todos.map(i => i.cfop))].sort().join(', ');
        usar = todos; obs = 'Sem CFOP de uso e consumo (CFOP ' + lista + ') - conferir';
        alertas.push({ tipo: 'CFOP FORA DE USO E CONSUMO', texto: 'Empresa ' + n.emp + ' NF ' + n.nf + ' - ' + n.forn + ' - CFOP ' + lista, grave: false });
      }
      usar.forEach(i => {
        let cat = regProd.get(up(i.prod)), origem = 'PRODUTO';
        if (!cat) { cat = categoriaPorTextoProduto(i.prod, regras.regras_produto_texto); origem = cat ? 'TEXTO PRODUTO' : origem; }
        if (!cat) { cat = categoriaPorNCM(i.ncm, regras.regras_ncm); origem = cat ? 'NCM' : 'SEM REGRA'; cat = cat || 'REVISAR'; }
        novo(n, { cfop: i.cfop, prod: i.prod, ncm: i.ncm, qtd: i.qtd, vtot: i.vtot, cod: i.cod, cat, origem, obs });
      });
    });

    // Relatório duplicado só importa se deixou nota DO RAZÃO sem produto
    duplicados.forEach(d => {
      const afetadas = itens.filter(i => i.prod === TXT_SEMPROD && d.emps.includes(i.emp));
      if (!afetadas.length) return;
      alertas.unshift({ tipo: 'RELATÓRIO DUPLICADO', texto: 'Os relatórios das empresas ' + d.emps.join(' e ') + ' têm o mesmo CNPJ (' + d.cnpj + '): um deles é de outra filial. Isso deixou ' + afetadas.length + ' nota(s) do razão sem produto (' + afetadas.map(i => 'empresa ' + i.emp + ' NF ' + i.nf).join(', ') + '). Se forem produtos, tire de novo o relatório certo; se forem serviço, podem ficar na ' + P.conta_origem + '.', grave: true, comparativo: d });
    });

    // Rateio do valor do razão pelos itens (o razão tem ST/IPI/frete)
    const soma = new Map();
    itens.forEach(i => soma.set(i.chave, (soma.get(i.chave) || 0) + i.vtot));
    itens.forEach(i => {
      const s = soma.get(i.chave);
      i.rat = s ? i.vtot / s * i.vrazao : 0;
      i.unit = i.qtd ? i.rat / i.qtd : i.rat;
    });
    const res = { notas: [...notas.values()], itens, alertas };
    recalcularContas(res, regras);
    return res;
  }

  // Conta destino de cada item a partir da categoria
  function contaDoItem(it, regras) {
    if (it.contaManual) return it.contaManual;
    const P = regras.parametros;
    if ((it.cat === CAT_COMODATO || it.cat === CAT_SEMPROD) && !(regras.categorias || []).some(c => c.categoria === it.cat)) return P.conta_origem;
    const c = (regras.categorias || []).find(x => x.categoria === it.cat);
    if (!c || c.conta_normal == null || c.conta_normal === '') return 'DEFINIR';
    if (c.bem_duravel) {
      if (it.unit > Number(P.limite_2_imobilizado)) return c.conta_imobilizado || 'DEFINIR';
      if (it.unit > Number(P.limite_1_fica_conta_normal)) return P.conta_bem_pequeno_valor;
    }
    return c.conta_normal;
  }

  function recalcularContas(res, regras) {
    res.itens.forEach(i => { i.conta = contaDoItem(i, regras); });
    const origem = String(regras.parametros.conta_origem);
    res.notas.forEach(n => { n.porConta = {}; n.somaRat = 0; });
    const porChave = new Map(res.notas.map(n => [n.chave, n]));
    res.itens.forEach(i => {
      const n = porChave.get(i.chave);
      n.porConta[i.conta] = (n.porConta[i.conta] || 0) + i.rat;
      n.somaRat += i.rat;
    });
    res.notas.forEach(n => {
      n.fica = n.porConta[origem] || 0;
      n.sai = n.valor - n.fica;
      n.diferenca = r2(n.valor - n.somaRat);
    });
    return res;
  }

  // ---------------------------------------------------------------
  // 5. EXPORTAÇÃO (layout da Planilha Modelo / lanctos.txt)
  // ---------------------------------------------------------------
  function sanitizarHistoricoDominio(texto) {
    return String(texto || '')
      .replace(/[;,]+/g, ' - ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 250);
  }

  function gerarLancamentos(res, regras) {
    const P = regras.parametros;
    const origem = String(P.conta_origem);
    const notas = new Map(res.notas.map(n => [n.chave, n]));
    const grupos = new Map();
    res.itens.forEach(i => {
      const conta = String(i.conta);
      if (conta === origem || conta === 'DEFINIR') return;
      const k = i.chave + '|' + conta;
      if (!grupos.has(k)) grupos.set(k, { nota: notas.get(i.chave), conta: i.conta, valor: 0, prods: [], imobilizado: false });
      const g = grupos.get(k);
      g.valor += i.rat;
      const categoria = (regras.categorias || []).find(c => c.categoria === i.cat);
      if (categoria?.bem_duravel && String(categoria.conta_imobilizado) === conta) g.imobilizado = true;
      if (i.prod !== TXT_INTEIRA && i.prod !== TXT_SEMPROD) {
        const nc = nomeCurto(i.prod);
        if (nc && !g.prods.some(p => p.toUpperCase() === nc.toUpperCase())) g.prods.push(nc);
      }
    });
    const linhas = [];
    grupos.forEach(g => {
      const v = r2(g.valor);
      if (!(v > 0.004)) return;
      const destino = g.imobilizado ? 'ATIVO IMOBILIZADO' : (nomeConta(g.conta) || ('CONTA ' + g.conta)).toUpperCase();
      const pref = String(P.prefixo_historico || 'RECLASSIFICACAO').trim().replace(/[\s\-:]+$/, '') || 'RECLASSIFICACAO';
      const titulo = up(pref).includes(up(destino)) ? pref : pref + ' ' + destino;
      let comp = titulo + ' - NF ' + g.nota.nf + (g.nota.forn ? ' - ' + g.nota.forn : '');
      if (g.prods.length) comp += ' (' + g.prods.join(' - ') + ')';
      comp = sanitizarHistoricoDominio(comp);
      const data = String(P.modo_data).toUpperCase() === 'ULTIMO DIA' ? ultimoDiaDoMes(g.nota.data) : g.nota.data;
      linhas.push({ data, debito: g.conta, credito: P.conta_origem, valor: v, codHist: '', complemento: comp, iniciaLote: '', filial: g.nota.emp, ccDeb: '', ccCred: '', nf: g.nota.nf, grupo: g.nota.grupo });
    });
    return linhas;
  }

  // Mesmo formato da macro "GERAR O ARQUIVO TXT" da Planilha Modelo: A..J separados por ";"
  function gerarTxt(linhas) {
    return linhas.map(l => [l.data, l.debito, l.credito, l.valor.toFixed(2).replace('.', ','), l.codHist, sanitizarHistoricoDominio(l.complemento), l.iniciaLote, l.filial, l.ccDeb, l.ccCred].join(';')).join('\r\n') + '\r\n';
  }

  // Planilha no layout da "Planilha Modelo" do Domínio (Plan1, colunas A..J, mesmos cabeçalhos).
  // Data como data de verdade, valor como número. Copie as linhas para a Planilha Modelo e rode
  // a macro "GERAR O ARQUIVO TXT" dela.
  const CAB_DOMINIO = ['Data', 'Cód. Conta Debito', 'Cód. Conta CREDITO', 'Valor', 'Cód. Histórico', 'Complemento Histórico', 'Inicia Lote', 'Código Matriz/Filial', 'Centro de Custo Débito', 'Centro de Custo Crédito'];
  // data como número de série do Excel (não depende de fuso horário)
  function dataSerial(dataBR) { const [d, m, a] = dataBR.split('/').map(Number); return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000); }
  function folhaDominio(XL, linhas) {
    const aoa = [CAB_DOMINIO].concat(linhas.map(l => [dataSerial(l.data), Number(l.debito), Number(l.credito), l.valor, null, sanitizarHistoricoDominio(l.complemento), null, Number(l.filial), null, null]));
    const ws = XL.utils.aoa_to_sheet(aoa);
    for (let r = 1; r <= linhas.length; r++) {
      const a = ws[XL.utils.encode_cell({ r, c: 0 })]; if (a) a.z = 'dd/mm/yyyy';
      const v = ws[XL.utils.encode_cell({ r, c: 3 })]; if (v) v.z = '#,##0.00';
    }
    ws['!cols'] = [{ wch: 11 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 8 }, { wch: 90 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    return ws;
  }

  // Windows-1252 (o Domínio lê ANSI). Caracteres fora da tabela viram "?"
  function codificarAnsi(texto) {
    const extras = { 0x20AC: 0x80, 0x201A: 0x82, 0x192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x2C6: 0x88, 0x2030: 0x89, 0x160: 0x8A, 0x2039: 0x8B, 0x152: 0x8C, 0x17D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x2DC: 0x98, 0x2122: 0x99, 0x161: 0x9A, 0x203A: 0x9B, 0x153: 0x9C, 0x17E: 0x9E, 0x178: 0x9F };
    const out = new Uint8Array(texto.length);
    for (let i = 0; i < texto.length; i++) {
      const c = texto.charCodeAt(i);
      out[i] = (c < 0x80 || (c >= 0xA0 && c <= 0xFF)) ? c : (extras[c] || 0x3F);
    }
    return out;
  }

  const nucleo = { REGRAS_INICIAIS, migrarRegras, folhaDominio, nomeGrupo, lerTexto, lerPlanilha, limparTexto, parseRazao, parseProdutos, classificar, recalcularContas, contaDoItem, gerarLancamentos, gerarTxt, codificarAnsi, nomeCurto, ncm8, categoriaPorTextoProduto, compararRelatoriosDuplicados, sanitizarHistoricoDominio, TXT_INTEIRA, TXT_SEMPROD };
  if (typeof module !== 'undefined' && module.exports) { module.exports = nucleo; return; }

  // =================================================================
  // 6. TELA (só no navegador)
  // =================================================================
  const S = {
    regras: null, fonteRegras: '', lancs: [], arquivosRazao: [], arquivosProdutos: [], erros: [],
    res: null, aba: 'importar', visao: 'notas', sel: new Set(), alterados: new Set(),
    f: { emp: '', cat: '', origem: '', texto: '', pend: false, sai: false }, regrasSujas: false
  };
  let el = null;

  // ---- persistência das regras (store própria, separada do de-para)
  async function carregarRegras() {
    try {
      const r = await fetch(API, { cache: 'no-store' });
      if (r.ok) {
        const d = await r.json();
        if (d && d.regras && d.regras.parametros) { S.regras = d.regras; S.fonteRegras = 'servidor'; return; }
        S.regras = clonar(REGRAS_INICIAIS); S.fonteRegras = 'servidor (ainda vazio - usando regras iniciais)'; return;
      }
    } catch (e) { /* sem servidor: modo local */ }
    try {
      const loc = JSON.parse(localStorage.getItem(STORAGE_LOCAL) || 'null');
      if (loc && loc.parametros) { S.regras = loc; S.fonteRegras = 'local (este navegador)'; return; }
    } catch (e) { /* ignora */ }
    S.regras = clonar(REGRAS_INICIAIS); S.fonteRegras = 'local (regras iniciais)';
  }

  async function salvarRegras() {
    S.regras.atualizadoEm = new Date().toISOString();
    if (S.fonteRegras.startsWith('servidor')) {
      try {
        const r = await fetch(API, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ regras: S.regras }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || ('HTTP ' + r.status));
        S.fonteRegras = 'servidor'; S.regrasSujas = false; aviso('Regras salvas no servidor (backup automático da versão anterior).', 'ok'); return true;
      } catch (e) { aviso('Não consegui salvar no servidor: ' + e.message + '. Nada foi alterado na base.', 'erro'); return false; }
    }
    try { localStorage.setItem(STORAGE_LOCAL, JSON.stringify(S.regras)); } catch (e) { /* ignora */ }
    S.regrasSujas = false; aviso('Regras salvas neste navegador (modo local de teste).', 'ok'); return true;
  }

  // ---- plano de contas do portal (só leitura). Se não existir, usa os nomes padrão.
  function contasDoPlano() {
    try {
      // eslint-disable-next-line no-undef
      if (typeof planoContas !== 'undefined' && planoContas) {
        // eslint-disable-next-line no-undef
        const g = (typeof grupoAtivo !== 'undefined' && grupoAtivo && planoContas[grupoAtivo]) ? grupoAtivo : 'ALVORAR';
        // eslint-disable-next-line no-undef
        return planoContas[g] || [];
      }
    } catch (e) { /* ignora */ }
    return [];
  }
  function nomeConta(cod) {
    if (cod === 'DEFINIR') return 'conta não definida';
    const c = contasDoPlano().find(x => String(x.codigo).trim() === String(cod).trim());
    return c ? c.nome : (NOMES_CONTAS_PADRAO[cod] || '');
  }

  function htmlAviso() { return S.msg ? '<div class="uc-alerta uc-alerta-' + S.msg.tipo + '">' + esc(S.msg.texto) + '</div>' : ''; }

  function abrirComparativoDuplicidade(indice) {
    document.getElementById('uc-modal-comparativo')?.remove();
    const alerta = S.res?.alertas?.[Number(indice)];
    const c = alerta?.comparativo;
    if (!c) return;
    const modal = document.createElement('div');
    modal.id = 'uc-modal-comparativo';
    modal.className = 'uc-modal-fundo';
    const linhas = (c.relatorios || []).map(r => '<tr><td>' + esc(r.empresa) + '</td><td>' + esc(r.arquivo) + '</td><td>' + esc(c.cnpj) + '</td><td class="n">' + r.notas + '</td><td class="n">' + r.itens + '</td></tr>').join('');
    const listaNotas = (titulo, notas) => notas?.length ? '<div><b>' + titulo + ':</b> ' + notas.map(esc).join(', ') + '</div>' : '';
    modal.innerHTML = '<div class="uc-modal-comparativo"><div class="uc-modal-cab"><div><h3>Comparativo dos relatórios duplicados</h3><p>O portal compara CNPJ, notas e as linhas de produto usadas na classificação.</p></div><button class="btn" type="button" data-fechar-comparativo>Fechar</button></div>' +
      '<div class="uc-alerta uc-alerta-aviso"><b>Por que o alerta apareceu?</b> Os dois arquivos informam o mesmo CNPJ. Foram encontradas <b>' + c.itensEmComum + ' linhas de produto iguais</b> e <b>' + c.notasEmComum + ' notas iguais</b>.</div>' +
      '<div class="uc-rolagem uc-rolagem-baixa"><table class="uc-tab"><thead><tr><th>Empresa</th><th>Arquivo</th><th>CNPJ informado</th><th class="n">Notas</th><th class="n">Itens</th></tr></thead><tbody>' + linhas + '</tbody></table></div>' +
      '<div class="uc-comparativo-resumo"><div><span>Itens só no primeiro</span><b>' + c.itensSomentePrimeiro + '</b></div><div><span>Itens só no segundo</span><b>' + c.itensSomenteSegundo + '</b></div><div><span>Notas em comum</span><b>' + c.notasEmComum + '</b></div></div>' +
      '<div class="uc-ajuda">' + listaNotas('Notas somente no primeiro', c.notasSomentePrimeiro) + listaNotas('Notas somente no segundo', c.notasSomenteSegundo) + (!c.notasSomentePrimeiro.length && !c.notasSomenteSegundo.length ? 'As mesmas notas aparecem nos dois relatórios.' : '') + '</div></div>';
    modal.addEventListener('click', event => { if (event.target === modal || event.target.closest('[data-fechar-comparativo]')) modal.remove(); });
    el.appendChild(modal);
  }
  function aviso(texto, tipo) {
    S.msg = { texto, tipo: tipo || 'ok' };
    const a = el && el.querySelector('#uc-aviso');
    if (a) a.innerHTML = htmlAviso();
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => { S.msg = null; const b = el && el.querySelector('#uc-aviso'); if (b) b.innerHTML = ''; }, 7000);
  }

  function baixar(nome, conteudo, tipo) {
    const blob = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipo || 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nome; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---- importação
  async function importarArquivos(files) {
    aviso('Lendo ' + files.length + ' arquivo(s)... os relatórios de produtos podem levar alguns segundos.', 'aviso');
    await new Promise(r => setTimeout(r, 30));
    for (const f of files) {
      const buf = await f.arrayBuffer();
      if (/\.txt$/i.test(f.name)) {
        const l = parseRazao(lerTexto(buf), S.regras.parametros.conta_origem, f.name);
        S.arquivosRazao = S.arquivosRazao.filter(a => a.nome !== f.name);
        S.lancs = S.lancs.filter(x => x.arquivo !== f.name).concat(l);
        S.arquivosRazao.push({ nome: f.name, qtd: l.length, total: l.reduce((s, x) => s + x.valor, 0), empresas: [...new Set(l.map(x => x.emp))].join(', ') });
      } else if (/\.(xls|xlsx|xlsm)$/i.test(f.name)) {
        if (typeof XLSX === 'undefined') { S.erros.push('Biblioteca XLSX não carregada.'); continue; }
        const wb = lerPlanilha(XLSX, new Uint8Array(buf));
        const linhas = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: null, raw: true });
        const p = parseProdutos(linhas, f.name);
        if (p.erro) { S.erros.push(p.erro); continue; }
        S.arquivosProdutos = S.arquivosProdutos.filter(a => a.arquivo !== f.name).concat([p]);
      } else S.erros.push('Arquivo ignorado (formato não reconhecido): ' + f.name);
    }
    S.res = null;
    S.msg = null; render();
    aviso('Arquivos lidos: ' + S.arquivosRazao.length + ' razão(ões) e ' + S.arquivosProdutos.length + ' relatório(s) de produtos.', 'ok');
  }

  function processar() {
    if (!S.lancs.length) { aviso('Importe pelo menos um razão (.txt).', 'erro'); return; }
    S.res = classificar(S.lancs, S.arquivosProdutos, S.regras);
    S.sel.clear(); S.alterados.clear(); S.aba = 'revisar'; render();
  }

  function limparImportacao() {
    S.lancs = []; S.arquivosRazao = []; S.arquivosProdutos = []; S.erros = []; S.res = null; S.sel.clear(); S.alterados.clear(); render();
  }

  // ---- revisão
  function categoriasLista() { return (S.regras.categorias || []).map(c => c.categoria); }

  function trocarCategoria(ids, cat) {
    ids.forEach(id => {
      const it = S.res.itens.find(i => i.id === id);
      if (!it || it.cat === cat) return;
      it.cat = cat; it.contaManual = null; it.origem = 'MANUAL'; S.alterados.add(id);
    });
    recalcularContas(S.res, S.regras); render();
  }

  function salvarCorrecoesComoRegra() {
    let n = 0;
    const hoje = new Date().toLocaleDateString('pt-BR');
    S.alterados.forEach(id => {
      const it = S.res.itens.find(i => i.id === id);
      if (!it || it.prod === TXT_INTEIRA || it.prod === TXT_SEMPROD) return;
      const lista = S.regras.regras_produto || (S.regras.regras_produto = []);
      const ex = lista.find(r => up(r.descricao) === up(it.prod));
      if (ex) { ex.categoria = it.cat; ex.data = hoje; ex.origem = 'MANUAL'; }
      else lista.push({ descricao: it.prod, categoria: it.cat, data: hoje, origem: 'MANUAL' });
      n++;
    });
    if (!n) { aviso('Nenhuma correção de produto para salvar.', 'aviso'); return; }
    // aplica a regra nova também aos outros itens com a mesma descrição (exceto os já corrigidos à mão)
    const reg = new Map((S.regras.regras_produto || []).map(r => [up(r.descricao), r.categoria]));
    let iguais = 0;
    S.res.itens.forEach(i => {
      if (i.origem === 'MANUAL' || i.prod === TXT_INTEIRA || i.prod === TXT_SEMPROD) return;
      const c = reg.get(up(i.prod));
      if (c && c !== i.cat) { i.cat = c; i.origem = 'PRODUTO'; iguais++; }
    });
    recalcularContas(S.res, S.regras);
    S.alterados.clear();
    salvarRegras().then(ok => { render(); if (ok) aviso(n + ' regra(s) de produto salva(s)' + (iguais ? ' e aplicada(s) a mais ' + iguais + ' item(ns) iguais deste mês' : '') + '. No próximo mês esses produtos já vêm classificados.', 'ok'); });
  }

  function pendencias() {
    if (!S.res) return { definir: [], pendentes: [], diferencas: [], alertas: [] };
    return {
      definir: S.res.itens.filter(i => i.conta === 'DEFINIR'),
      pendentes: S.res.itens.filter(i => i.prod === TXT_SEMPROD),
      diferencas: S.res.notas.filter(n => Math.abs(n.diferenca) > 0.05),
      alertas: S.res.alertas
    };
  }

  // Conferência principal: toda nota do razão que precisa de produto foi achada nos relatórios?
  function statusNotas() {
    const porNota = new Map();
    S.res.itens.forEach(i => { if (!porNota.has(i.chave)) porNota.set(i.chave, i); });
    const lista = [...porNota.values()];
    const inteiras = lista.filter(i => i.origem === 'FORNECEDOR');
    const precisam = lista.filter(i => i.origem !== 'FORNECEDOR');
    const faltando = precisam.filter(i => i.prod === TXT_SEMPROD);
    return { total: lista.length, inteiras: inteiras.length, precisam: precisam.length, achadas: precisam.length - faltando.length, faltando };
  }
  function htmlStatusNotas() {
    const st = statusNotas(), origem = S.regras.parametros.conta_origem;
    const desc = i => 'empresa ' + i.emp + ' NF ' + esc(i.nf) + ' - ' + esc(i.forn) + ' - R$ ' + fmt(i.vrazao) + (i.cat !== CAT_SEMPROD ? ' → ' + esc(i.cat) : '');
    const base = st.achadas + ' de ' + st.precisam + ' notas que precisam de produto achadas nos relatórios; outras ' + st.inteiras + ' vão inteiras pela regra de fornecedor. Total: ' + st.total + ' notas no razão.';
    if (!st.faltando.length) return '<div class="uc-alerta uc-alerta-ok"><b>✔ Todas as notas do razão foram encontradas.</b> ' + base + '</div>';
    return '<div class="uc-alerta uc-alerta-aviso"><b>' + st.faltando.length + ' nota(s) do razão sem itens nos relatórios de produtos</b> - normalmente nota de serviço; o módulo só trata produtos, então ficam na ' + esc(origem) + ': ' + st.faltando.map(desc).join('; ') + '. Se alguma for produto, confira o relatório da empresa. ' + base + '</div>';
  }

  function itensFiltrados() {
    const f = S.f, t = up(f.texto);
    const notasSai = new Set(S.res.notas.filter(n => n.sai > 0.004).map(n => n.chave));
    return S.res.itens.filter(i =>
      (!f.emp || String(i.emp) === f.emp) && (!f.cat || i.cat === f.cat) && (!f.origem || i.origem === f.origem) &&
      (!f.pend || i.cat === 'REVISAR' || i.cat === 'PENDENTE' || i.prod === TXT_SEMPROD || i.conta === 'DEFINIR') &&
      (!f.sai || notasSai.has(i.chave)) &&
      (!t || up(i.prod + ' ' + i.forn + ' ' + i.nf + ' ' + i.ncm).includes(t)));
  }

  // ---- telas
  function render() {
    if (!el) return;
    const abas = [['importar', '1. Importar'], ['revisar', '2. Revisar'], ['exportar', '3. Exportar'], ['regras', 'Configurações das regras']];
    el.innerHTML =
      '<div class="uc-topo"><div class="uc-abas">' + abas.map(([k, t]) => '<button class="uc-aba' + (S.aba === k ? ' ativa' : '') + '" data-aba="' + k + '"' + ((k === 'revisar' || k === 'exportar') && !S.res ? ' disabled' : '') + '>' + t + '</button>').join('') + '</div>' +
      '<span class="uc-fonte">Regras: ' + esc(S.fonteRegras) + (S.regrasSujas ? ' · <b>alterações não salvas</b>' : '') + '</span></div>' +
      '<div id="uc-aviso">' + htmlAviso() + '</div>' +
      (S.aba === 'importar' ? telaImportar() : S.aba === 'revisar' ? telaRevisar() : S.aba === 'exportar' ? telaExportar() : telaRegras());
  }

  function telaImportar() {
    const totRaz = S.lancs.reduce((s, x) => s + x.valor, 0);
    const nNotas = new Set(S.lancs.map(l => l.emp + '|' + l.nf)).size;
    const nItens = S.arquivosProdutos.reduce((s, a) => s + a.itens.length, 0);
    return '<div class="card uc-card">' +
      '<h3>Importar os arquivos do mês</h3>' +
      '<p class="uc-ajuda">Selecione de uma vez: o <b>razão da conta ' + esc(S.regras.parametros.conta_origem) + '</b> de cada empresa (.txt exportado do Domínio) e a <b>Relação de Notas com Produtos</b> de cada filial (.xls). O código da empresa do relatório de produtos vem do número no fim do nome do arquivo (ex.: "... MDN 20460.xls").</p>' +
      '<label class="uc-drop"><input type="file" id="uc-files" multiple accept=".txt,.xls,.xlsx,.xlsm"><span>Clique para escolher ou arraste os arquivos aqui</span></label>' +
      (S.erros.length ? '<div class="uc-alerta uc-alerta-erro">' + S.erros.map(esc).join('<br>') + '</div>' : '') +
      '<div class="uc-grid2">' +
      '<div><h4>Razões (' + S.arquivosRazao.length + ')</h4><table class="uc-tab"><tr><th>Arquivo</th><th>Empresas</th><th class="n">Lançamentos</th><th class="n">Total</th></tr>' +
      S.arquivosRazao.map(a => '<tr><td>' + esc(a.nome) + '</td><td>' + esc(a.empresas) + '</td><td class="n">' + a.qtd + '</td><td class="n">' + fmt(a.total) + '</td></tr>').join('') + '</table></div>' +
      '<div><h4>Relatórios de produtos (' + S.arquivosProdutos.length + ')</h4><table class="uc-tab"><tr><th>Empresa</th><th>CNPJ</th><th class="n">Itens</th></tr>' +
      S.arquivosProdutos.slice().sort((a, b) => a.emp - b.emp).map(a => '<tr><td>' + a.emp + '</td><td>' + esc(a.cnpj) + '</td><td class="n">' + a.itens.length + '</td></tr>').join('') + '</table></div></div>' +
      '<div class="uc-resumo"><div><span>Lançamentos</span><b>' + S.lancs.length + '</b></div><div><span>Notas</span><b>' + nNotas + '</b></div><div><span>Total do razão</span><b>R$ ' + fmt(totRaz) + '</b></div><div><span>Itens de produto</span><b>' + nItens + '</b></div></div>' +
      '<div class="uc-acoes"><button class="btn btn-primary" data-acao="processar"' + (S.lancs.length ? '' : ' disabled') + '>Classificar →</button><button class="btn" data-acao="limpar-import">Limpar arquivos</button></div></div>';
  }

  function telaRevisar() {
    const R = S.res, pd = pendencias();
    const tot = R.notas.reduce((s, n) => s + n.valor, 0), fica = R.notas.reduce((s, n) => s + n.fica, 0);
    const emps = [...new Set(R.itens.map(i => i.emp))].sort((a, b) => a - b);
    const origens = [...new Set(R.itens.map(i => i.origem))].sort();
    const cats = categoriasLista();
    const opt = (lista, v, todos) => '<option value="">' + todos + '</option>' + lista.map(x => '<option' + (String(x) === String(v) ? ' selected' : '') + '>' + esc(x) + '</option>').join('');
    let h = '<div class="uc-resumo">' +
      '<div><span>Total do razão</span><b>R$ ' + fmt(tot) + '</b></div>' +
      '<div><span>Fica na ' + esc(S.regras.parametros.conta_origem) + '</span><b>R$ ' + fmt(fica) + '</b></div>' +
      '<div><span>Sai (reclassificar)</span><b>R$ ' + fmt(tot - fica) + '</b></div>' +
      (function () { const st = statusNotas(); return '<div class="' + (st.faltando.length ? 'uc-atencao' : 'uc-bom') + '"><span>Notas encontradas</span><b>' + st.achadas + ' de ' + st.precisam + '</b></div>'; })() +
      '<div class="' + (pd.definir.length ? 'uc-ruim' : 'uc-bom') + '"><span>Itens sem conta</span><b>' + pd.definir.length + '</b></div>' +
      '<div class="' + (pd.diferencas.length ? 'uc-ruim' : 'uc-bom') + '"><span>Notas com diferença</span><b>' + pd.diferencas.length + '</b></div></div>';
    h += htmlStatusNotas();
    if (pd.alertas.length) h += '<details class="card uc-card uc-pend"' + (pd.alertas.some(a => a.grave) ? ' open' : '') + '><summary>Pendências e alertas (' + pd.alertas.length + ')</summary><ul>' + pd.alertas.map((a, indice) => '<li class="' + (a.comparativo ? 'uc-alerta-duplicado' : '') + '"><b>' + esc(a.tipo) + ':</b> ' + esc(a.texto) + (a.comparativo ? ' <button class="btn btn-sm" data-acao="comparar-duplicidade" data-alerta="' + indice + '">Ver comparativo</button>' : '') + '</li>').join('') + '</ul></details>';
    h += '<div class="card uc-card"><div class="uc-filtros">' +
      '<div class="uc-seg"><button data-visao="notas" class="' + (S.visao === 'notas' ? 'ativa' : '') + '">Por nota</button><button data-visao="itens" class="' + (S.visao === 'itens' ? 'ativa' : '') + '">Por item</button></div>' +
      '<select data-f="emp">' + opt(emps, S.f.emp, 'Todas as empresas') + '</select>' +
      '<select data-f="cat">' + opt(cats, S.f.cat, 'Todas as categorias') + '</select>' +
      '<select data-f="origem">' + opt(origens, S.f.origem, 'Toda origem de regra') + '</select>' +
      '<input type="search" data-f="texto" placeholder="Produto, fornecedor, NF, NCM..." value="' + esc(S.f.texto) + '">' +
      '<label><input type="checkbox" data-f="pend"' + (S.f.pend ? ' checked' : '') + '> Só REVISAR / sem produto / sem conta</label>' +
      '<label><input type="checkbox" data-f="sai"' + (S.f.sai ? ' checked' : '') + '> Só notas que saem da ' + esc(S.regras.parametros.conta_origem) + '</label></div>';
    h += S.visao === 'notas' ? tabelaNotas() : tabelaItens(cats);
    h += '</div>';
    return h;
  }

  function tabelaNotas() {
    const f = S.f, t = up(f.texto);
    const ids = new Set(itensFiltrados().map(i => i.chave));
    const notas = S.res.notas.filter(n => ids.has(n.chave) && (!f.sai || n.sai > 0.004));
    const origem = String(S.regras.parametros.conta_origem);
    const linhas = notas.map(n => {
      const destinos = Object.entries(n.porConta).filter(([c]) => c !== origem).map(([c, v]) => '<span class="uc-chip' + (c === 'DEFINIR' ? ' uc-chip-ruim' : '') + '" title="' + esc(nomeConta(c)) + '">' + esc(c) + ': ' + fmt(v) + '</span>').join(' ');
      return '<tr class="' + (Math.abs(n.diferenca) > 0.05 ? 'uc-linha-ruim' : '') + '"><td>' + n.emp + '</td><td>' + esc(n.nf) + '</td><td>' + esc(n.forn) + '</td><td>' + esc(n.data) + '</td><td class="n">' + fmt(n.valor) + '</td><td class="n">' + fmt(n.fica) + '</td><td class="n"><b>' + fmt(n.sai) + '</b></td><td>' + destinos + '</td></tr>';
    });
    return '<p class="uc-ajuda">' + notas.length + ' nota(s). Clique em "Por item" para corrigir categorias.</p><div class="uc-rolagem"><table class="uc-tab"><thead><tr><th>Empresa</th><th>NF</th><th>Fornecedor</th><th>Data</th><th class="n">Valor razão</th><th class="n">Fica</th><th class="n">Sai</th><th>Vai para (conta: valor)</th></tr></thead><tbody>' + linhas.join('') + '</tbody></table></div>';
  }

  function tabelaItens(cats) {
    const lista = itensFiltrados();
    const LIM = 1500;
    const opts = cats.map(c => '<option>' + esc(c) + '</option>').join('');
    const linhas = lista.slice(0, LIM).map(i =>
      '<tr class="' + (i.conta === 'DEFINIR' || i.cat === 'REVISAR' ? 'uc-linha-ruim' : S.alterados.has(i.id) ? 'uc-linha-alterada' : '') + '">' +
      '<td><input type="checkbox" data-sel="' + i.id + '"' + (S.sel.has(i.id) ? ' checked' : '') + '></td>' +
      '<td>' + i.emp + '</td><td>' + esc(i.nf) + '</td><td class="uc-trunc" title="' + esc(i.forn) + '">' + esc(i.forn) + '</td>' +
      '<td class="uc-trunc" title="' + esc(i.prod) + '">' + esc(i.prod) + '</td><td>' + esc(i.ncm) + '</td><td>' + esc(i.cfop) + '</td>' +
      '<td class="n">' + fmt(i.qtd) + '</td><td class="n">' + fmt(i.rat) + '</td><td class="n">' + fmt(i.unit) + '</td>' +
      '<td><select data-cat="' + i.id + '">' + opts.replace('<option>' + esc(i.cat) + '</option>', '<option selected>' + esc(i.cat) + '</option>') + '</select></td>' +
      '<td><span class="uc-origem uc-origem-' + esc(i.origem).replace(/\s/g, '') + '">' + esc(i.origem) + '</span></td>' +
      '<td><b>' + esc(i.conta) + '</b></td><td class="uc-trunc">' + esc(nomeConta(i.conta)) + '</td></tr>').join('');
    return '<div class="uc-lote"><span>' + S.sel.size + ' selecionado(s)</span><button class="btn btn-sm" data-acao="sel-filtrados">Selecionar filtrados</button><button class="btn btn-sm" data-acao="limpar-sel">Limpar seleção</button>' +
      '<select id="uc-lote-cat">' + opts + '</select><button class="btn btn-sm btn-primary" data-acao="aplicar-lote"' + (S.sel.size ? '' : ' disabled') + '>Aplicar categoria</button>' +
      '<button class="btn btn-sm" data-acao="salvar-correcoes"' + (S.alterados.size ? '' : ' disabled') + '>Salvar ' + S.alterados.size + ' correção(ões) como regra</button></div>' +
      '<p class="uc-ajuda">' + lista.length + ' item(ns)' + (lista.length > LIM ? ' - mostrando os ' + LIM + ' primeiros, use os filtros' : '') + '. Trocar a categoria recalcula a conta na hora. "Salvar como regra" grava a descrição do produto para os próximos meses.</p>' +
      '<div class="uc-rolagem"><table class="uc-tab"><thead><tr><th></th><th>Empresa</th><th>NF</th><th>Fornecedor</th><th>Produto</th><th>NCM</th><th>CFOP</th><th class="n">Qtd</th><th class="n">Valor rateado</th><th class="n">Unit. rateado</th><th>Categoria</th><th>Origem</th><th>Conta</th><th>Nome da conta</th></tr></thead><tbody>' + linhas + '</tbody></table></div>';
  }

  function telaExportar() {
    const pd = pendencias();
    const linhas = gerarLancamentos(S.res, S.regras);
    const total = linhas.reduce((s, l) => s + l.valor, 0);
    const porConta = {}, porEmp = {};
    linhas.forEach(l => { porConta[l.debito] = (porConta[l.debito] || 0) + l.valor; porEmp[l.filial] = (porEmp[l.filial] || 0) + l.valor; });
    const grupos = porGrupo(linhas);
    const vDef = pd.definir.reduce((s, i) => s + i.rat, 0);
    let h = '';
    if (pd.diferencas.length) h += '<div class="uc-alerta uc-alerta-erro"><b>Exportação bloqueada:</b> ' + pd.diferencas.length + ' nota(s) com soma dos itens diferente do valor do razão. Volte em Revisar.</div>';
    if (pd.definir.length) h += '<div class="uc-alerta uc-alerta-aviso">' + pd.definir.length + ' item(ns) sem conta (R$ ' + fmt(vDef) + ') <b>ficam na conta ' + esc(S.regras.parametros.conta_origem) + '</b> e não entram no arquivo. Corrija em Revisar se quiser incluir.</div>';
    if (S.alterados.size) h += '<div class="uc-alerta uc-alerta-aviso">Há ' + S.alterados.size + ' correção(ões) ainda não salvas como regra. O arquivo sai com elas; salve em Revisar para valerem nos próximos meses.</div>';
    h += htmlStatusNotas();
    h += '<div class="uc-resumo"><div><span>Lançamentos</span><b>' + linhas.length + '</b></div><div><span>Total exportado</span><b>R$ ' + fmt(total) + '</b></div><div><span>Data</span><b>' + esc(S.regras.parametros.modo_data) + '</b></div></div>';
    h += '<div class="card uc-card"><div class="uc-acoes"><button class="btn btn-primary" data-acao="baixar-dominio"' + (pd.diferencas.length || !linhas.length ? ' disabled' : '') + '>⬇ Planilhas do Domínio por grupo/matriz (.zip)</button><button class="btn" data-acao="baixar-xlsx"' + (linhas.length ? '' : ' disabled') + '>⬇ Excel de conferência</button></div>' +
      '<p class="uc-ajuda"><b>Planilhas do Domínio</b>: um Excel consolidado por grupo/matriz (matriz + filiais) dentro do .zip, no layout da Plan1 da Planilha Modelo (A..J, data como data, valor como número). Importe cada arquivo pela matriz: a coluna H indica a filial de cada linha. <b>Excel de conferência</b>: resumo por nota e itens, com o nome das contas.</p>' +
      '<h4>Arquivos que vão no .zip (um por grupo/matriz)</h4><table class="uc-tab"><tr><th>Arquivo</th><th>Matriz e filiais</th><th class="n">Linhas</th><th class="n">Valor</th></tr>' +
      grupos.map(([g, ls]) => '<tr><td>Importacao_Dominio_' + esc(g) + '_' + competencia() + '.xlsx</td><td>' + [...new Set(ls.map(l => l.filial))].sort().join(', ') + '</td><td class="n">' + ls.length + '</td><td class="n">' + fmt(ls.reduce((s2, l) => s2 + l.valor, 0)) + '</td></tr>').join('') + '</table>' +
      '<div class="uc-grid2"><div><h4>Por conta</h4><table class="uc-tab"><tr><th>Conta</th><th>Nome</th><th class="n">Valor</th></tr>' + Object.entries(porConta).sort((a, b) => b[1] - a[1]).map(([c, v]) => '<tr><td>' + esc(c) + '</td><td>' + esc(nomeConta(c)) + '</td><td class="n">' + fmt(v) + '</td></tr>').join('') + '</table></div>' +
      '<div><h4>Por empresa</h4><table class="uc-tab"><tr><th>Empresa</th><th class="n">Valor</th></tr>' + Object.entries(porEmp).sort((a, b) => a[0] - b[0]).map(([c, v]) => '<tr><td>' + esc(c) + '</td><td class="n">' + fmt(v) + '</td></tr>').join('') + '</table></div></div>' +
      '<h4>Prévia (layout da Planilha Modelo)</h4><div class="uc-rolagem"><table class="uc-tab"><thead><tr><th>Data</th><th>Débito</th><th>Crédito</th><th class="n">Valor</th><th>Complemento</th><th>Filial</th></tr></thead><tbody>' +
      linhas.slice(0, 300).map(l => '<tr><td>' + esc(l.data) + '</td><td>' + esc(l.debito) + '</td><td>' + esc(l.credito) + '</td><td class="n">' + fmt(l.valor) + '</td><td class="uc-trunc" title="' + esc(l.complemento) + '">' + esc(l.complemento) + '</td><td>' + esc(l.filial) + '</td></tr>').join('') + '</tbody></table></div></div>';
    return h;
  }

  function competencia() { const d = (S.res.notas[0] || {}).data || ''; return d ? d.slice(3, 5) + '-' + d.slice(6, 10) : ''; }

  function baixarXlsx() {
    restaurarFormatos(XLSX);
    const wb = XLSX.utils.book_new();
    const origem = String(S.regras.parametros.conta_origem);
    const contas = [...new Set(S.res.itens.map(i => String(i.conta)))].sort((a, b) => (a === origem ? -1 : b === origem ? 1 : 0));
    const cabContas = contas.map(c => c + ' - ' + (c === 'DEFINIR' ? 'SEM CONTA' : nomeConta(c)));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Grupo', 'Empresa', 'Nome', 'NF', 'Fornecedor', 'Lançamentos', 'Data', 'Valor razão', 'Soma itens', 'Fica na ' + origem, 'Sai (reclassificar)'].concat(cabContas)].concat(
      S.res.notas.map(n => [n.grupo, n.emp, n.nome, n.nf, n.forn, n.lancs.join(', '), n.data, r2(n.valor), r2(n.somaRat), r2(n.fica), r2(n.sai)].concat(contas.map(c => r2(n.porConta[c] || 0)))))), 'Resumo por nota');
    const grupoDe = new Map(S.res.notas.map(n => [n.chave, n.grupo]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Grupo', 'Empresa', 'NF', 'Fornecedor', 'Data', 'CFOP', 'Produto', 'NCM', 'Qtd', 'Vlr produto', 'Valor razão nota', 'Valor rateado', 'Unit. rateado', 'Categoria', 'Origem', 'Conta', 'Nome conta', 'Obs']].concat(
      S.res.itens.map(i => [grupoDe.get(i.chave) || '', i.emp, i.nf, i.forn, i.data, i.cfop, i.prod, i.ncm, i.qtd, r2(i.vtot), i.vrazao, r2(i.rat), r2(i.unit), i.cat, i.origem, i.conta, nomeConta(i.conta), i.obs]))), 'Itens');
    XLSX.writeFile(wb, 'Conferencia_Uso_Consumo_' + competencia() + '.xlsx');
  }

  // Um Excel por grupo (matriz + filiais), todos dentro de um .zip. Importa-se pela matriz:
  // a coluna H (Código Matriz/Filial) diz em qual filial cada linha cai.
  function porGrupo(linhas) {
    const g = new Map();
    linhas.forEach(l => { if (!g.has(l.grupo)) g.set(l.grupo, []); g.get(l.grupo).push(l); });
    return [...g.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }
  function baixarPlanilhasDominio() {
    restaurarFormatos(XLSX);
    const grupos = porGrupo(gerarLancamentos(S.res, S.regras));
    const zip = XLSX.CFB.utils.cfb_new();
    grupos.forEach(([grupo, ls]) => {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, folhaDominio(XLSX, ls), 'Plan1');
      XLSX.CFB.utils.cfb_add(zip, 'Importacao_Dominio_' + grupo + '_' + competencia() + '.xlsx', new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })));
    });
    baixar('Importacao_Dominio_' + competencia() + '.zip', new Uint8Array(XLSX.CFB.write(zip, { type: 'array', fileType: 'zip' })), 'application/zip');
  }

  // ---- tela de regras
  function telaRegras() {
    const R = S.regras, P = R.parametros;
    const inp = (k, v, tipo) => '<input data-par="' + k + '" type="' + (tipo || 'text') + '" value="' + esc(v) + '">';
    const cats = categoriasLista();
    const optsCat = v => cats.map(c => '<option' + (c === v ? ' selected' : '') + '>' + esc(c) + '</option>').join('');
    const contas = contasDoPlano().filter(c => /^(1\.2|3\.)/.test(String(c.classificacao || '')));
    const catPorNome = nome => R.categorias.find(c => up(c.categoria) === up(nome));
    let h = '<datalist id="uc-contas">' + contas.map(c => '<option value="' + esc(c.codigo) + '">' + esc(c.codigo + ' - ' + c.nome) + '</option>').join('') + '</datalist>' +
      '<datalist id="uc-categorias">' + cats.map(c => '<option value="' + esc(c) + '"></option>').join('') + '</datalist>';
    h += '<div class="uc-acoes"><button class="btn btn-primary" data-acao="salvar-regras">Salvar regras</button><button class="btn" data-acao="backup-regras">Backup JSON</button><label class="btn">Importar JSON<input type="file" id="uc-json" accept=".json" hidden></label><button class="btn btn-danger" data-acao="restaurar-iniciais">Voltar às regras iniciais</button></div>';
    h += '<div class="card uc-card uc-regra-rapida"><div class="uc-regra-rapida-cab"><div><h3>Regra rápida por produto</h3><p class="uc-ajuda">Use quando o nome do produto engana. Exemplo: produto contém <b>BOOK</b>, categoria <b>INTERNET</b>. A regra também reconhecerá variações como “book digital”.</p></div><span class="uc-chip">Fácil de editar</span></div>' +
      '<div class="uc-regra-form"><label>Produto contém<input id="uc-regra-texto" placeholder="Ex.: BOOK ou LIVRO DIGITAL"></label><label>Categoria<input id="uc-regra-cat" list="uc-categorias" placeholder="Ex.: INTERNET"></label><label>Conta da categoria<input id="uc-regra-conta" list="uc-contas" placeholder="Obrigatória se a categoria for nova"></label><button class="btn btn-primary" data-acao="adicionar-regra-texto">Adicionar regra</button></div>' +
      '<p class="uc-ajuda">Se a categoria já existir, basta escolhê-la e deixar a conta vazia. Se informar outra conta para uma categoria existente, a conta dessa categoria será atualizada.</p>' +
      '<div class="uc-rolagem uc-rolagem-baixa"><table class="uc-tab"><tr><th>Produto contém</th><th>Categoria</th><th>Conta</th><th></th></tr>' +
      (R.regras_produto_texto || []).map((r, i) => { const c = catPorNome(r.categoria); return '<tr><td><input data-lista="regras_produto_texto" data-i="' + i + '" data-campo="texto" value="' + esc(r.texto) + '"></td><td><select data-lista="regras_produto_texto" data-i="' + i + '" data-campo="categoria">' + optsCat(r.categoria) + '</select></td><td>' + esc(c && c.conta_normal != null ? c.conta_normal + ' - ' + nomeConta(c.conta_normal) : 'DEFINIR') + '</td><td><button class="btn btn-sm" data-del="regras_produto_texto" data-i="' + i + '">×</button></td></tr>'; }).join('') +
      '</table></div>' + (!(R.regras_produto_texto || []).length ? '<p class="uc-vazio">Nenhuma regra por texto cadastrada ainda.</p>' : '') + '</div>';
    h += '<div class="card uc-card"><h3>Produtos já memorizados - ' + (R.regras_produto || []).length + '</h3><p class="uc-ajuda">Aqui também dá para corrigir diretamente uma descrição exata que já foi salva anteriormente.</p><div class="uc-rolagem uc-rolagem-baixa"><table class="uc-tab"><tr><th>Descrição exata</th><th>Categoria</th><th>Data</th><th></th></tr>' +
      (R.regras_produto || []).map((r, i) => '<tr><td><input data-lista="regras_produto" data-i="' + i + '" data-campo="descricao" value="' + esc(r.descricao) + '"></td><td><select data-lista="regras_produto" data-i="' + i + '" data-campo="categoria">' + optsCat(r.categoria) + '</select></td><td>' + esc(r.data || '') + '</td><td><button class="btn btn-sm" data-del="regras_produto" data-i="' + i + '">×</button></td></tr>').join('') + '</table></div></div>';
    h += '<details class="card uc-card uc-avancado"><summary>Configurações avançadas: categorias, contas, fornecedores, NCM e parâmetros</summary><div class="uc-avancado-conteudo">';
    h += '<div class="card uc-card"><h3>Parâmetros</h3><div class="uc-param">' +
      '<label>Conta de origem ' + inp('conta_origem', P.conta_origem) + '</label>' +
      '<label>Limite 1 - bem durável até este valor unitário fica na conta normal ' + inp('limite_1_fica_conta_normal', P.limite_1_fica_conta_normal, 'number') + '</label>' +
      '<label>Limite 2 - acima deste valor unitário vai para o imobilizado ' + inp('limite_2_imobilizado', P.limite_2_imobilizado, 'number') + '</label>' +
      '<label>Conta do bem de pequeno valor (entre os limites) ' + inp('conta_bem_pequeno_valor', P.conta_bem_pequeno_valor) + '</label>' +
      '<label>CFOPs de uso e consumo (separados por ;) ' + inp('cfops_uso_consumo', (P.cfops_uso_consumo || []).join(';')) + '</label>' +
      '<label>CFOPs de comodato - não reclassifica (separados por ;) ' + inp('cfops_comodato', (P.cfops_comodato || []).join(';')) + '</label>' +
      '<label>Data dos lançamentos <select data-par="modo_data"><option' + (P.modo_data === 'ORIGINAL' ? ' selected' : '') + '>ORIGINAL</option><option' + (P.modo_data === 'ULTIMO DIA' ? ' selected' : '') + '>ULTIMO DIA</option></select></label>' +
      '<label>Prefixo do histórico ' + inp('prefixo_historico', P.prefixo_historico) + '</label></div></div>';
    h += '<div class="card uc-card"><h3>Categorias e contas</h3><table class="uc-tab"><tr><th>Categoria</th><th>Conta normal</th><th>Nome</th><th>Bem durável?</th><th>Conta imobilizado</th><th>Observação</th><th></th></tr>' +
      R.categorias.map((c, i) => '<tr><td><input data-cat-i="' + i + '" data-campo="categoria" value="' + esc(c.categoria) + '"></td><td><input list="uc-contas" data-cat-i="' + i + '" data-campo="conta_normal" value="' + esc(c.conta_normal == null ? '' : c.conta_normal) + '" class="uc-curto"></td><td>' + esc(c.conta_normal ? nomeConta(c.conta_normal) : 'DEFINIR') + '</td><td><input type="checkbox" data-cat-i="' + i + '" data-campo="bem_duravel"' + (c.bem_duravel ? ' checked' : '') + '></td><td><input list="uc-contas" data-cat-i="' + i + '" data-campo="conta_imobilizado" value="' + esc(c.conta_imobilizado == null ? '' : c.conta_imobilizado) + '" class="uc-curto"></td><td><input data-cat-i="' + i + '" data-campo="observacao" value="' + esc(c.observacao || '') + '"></td><td><button class="btn btn-sm" data-del="categorias" data-i="' + i + '">×</button></td></tr>').join('') +
      '</table><button class="btn btn-sm" data-add="categorias">+ Categoria</button></div>';
    h += '<div class="card uc-card"><h3>Regras de fornecedor (nota inteira, sem olhar produto)</h3><table class="uc-tab"><tr><th>Texto no fornecedor/histórico</th><th>Categoria</th><th></th></tr>' +
      R.regras_fornecedor.map((r, i) => '<tr><td><input data-lista="regras_fornecedor" data-i="' + i + '" data-campo="texto" value="' + esc(r.texto) + '"></td><td><select data-lista="regras_fornecedor" data-i="' + i + '" data-campo="categoria">' + optsCat(r.categoria) + '</select></td><td><button class="btn btn-sm" data-del="regras_fornecedor" data-i="' + i + '">×</button></td></tr>').join('') +
      '</table><button class="btn btn-sm" data-add="regras_fornecedor">+ Regra</button></div>';
    h += '<div class="card uc-card"><h3>Regras de NCM (vale o prefixo mais comprido) - ' + R.regras_ncm.length + '</h3><div class="uc-rolagem uc-rolagem-baixa"><table class="uc-tab"><tr><th>Começo do NCM</th><th>Categoria</th><th></th></tr>' +
      R.regras_ncm.map((r, i) => '<tr><td><input data-lista="regras_ncm" data-i="' + i + '" data-campo="prefixo" value="' + esc(r.prefixo) + '" class="uc-curto"></td><td><select data-lista="regras_ncm" data-i="' + i + '" data-campo="categoria">' + optsCat(r.categoria) + '</select></td><td><button class="btn btn-sm" data-del="regras_ncm" data-i="' + i + '">×</button></td></tr>').join('') +
      '</table></div><button class="btn btn-sm" data-add="regras_ncm">+ Regra de NCM</button></div></div></details>';
    return h;
  }

  function editarRegra(t) {
    const R = S.regras;
    const valor = t.type === 'checkbox' ? t.checked : t.value;
    if (t.dataset.par) {
      const k = t.dataset.par;
      R.parametros[k] = (k === 'cfops_uso_consumo' || k === 'cfops_comodato') ? String(valor).split(';').map(s => s.trim()).filter(Boolean)
        : (['limite_1_fica_conta_normal', 'limite_2_imobilizado'].includes(k) ? Number(valor) : (/^conta_/.test(k) && /^\d+$/.test(valor) ? Number(valor) : valor));
    } else if (t.dataset.catI != null) {
      const c = R.categorias[Number(t.dataset.catI)], campo = t.dataset.campo;
      if (campo === 'categoria') {
        const antigo = c.categoria;
        c.categoria = valor;
        ['regras_fornecedor', 'regras_produto', 'regras_produto_texto', 'regras_ncm'].forEach(l => (R[l] || []).forEach(r => { if (r.categoria === antigo) r.categoria = valor; }));
      } else if (campo === 'conta_normal' || campo === 'conta_imobilizado') c[campo] = valor === '' ? null : (/^\d+$/.test(valor) ? Number(valor) : valor);
      else c[campo] = valor;
    } else if (t.dataset.lista) {
      R[t.dataset.lista][Number(t.dataset.i)][t.dataset.campo] = valor;
    } else return false;
    S.regrasSujas = true;
    if (S.res) recalcularContas(S.res, R);
    return true;
  }

  // ---- eventos (delegação)
  function ligarEventos() {
    el.addEventListener('click', ev => {
      const t = ev.target.closest('button, [data-aba]');
      if (!t || t.disabled) return;
      if (t.dataset.aba) { S.aba = t.dataset.aba; render(); return; }
      if (t.dataset.visao) { S.visao = t.dataset.visao; render(); return; }
      if (t.dataset.add) {
        const novo = { categorias: { categoria: 'NOVA CATEGORIA', conta_normal: null, bem_duravel: false, conta_imobilizado: null, observacao: '' }, regras_fornecedor: { texto: '', categoria: categoriasLista()[0] }, regras_ncm: { prefixo: '', categoria: categoriasLista()[0] } }[t.dataset.add];
        S.regras[t.dataset.add].push(novo); S.regrasSujas = true; render(); return;
      }
      if (t.dataset.del) {
        if (!confirm('Excluir esta linha?')) return;
        S.regras[t.dataset.del].splice(Number(t.dataset.i), 1); S.regrasSujas = true; if (S.res) recalcularContas(S.res, S.regras); render(); return;
      }
      const a = t.dataset.acao;
      if (a === 'processar') processar();
      else if (a === 'limpar-import') limparImportacao();
      else if (a === 'sel-filtrados') { itensFiltrados().forEach(i => S.sel.add(i.id)); render(); }
      else if (a === 'limpar-sel') { S.sel.clear(); render(); }
      else if (a === 'aplicar-lote') { trocarCategoria([...S.sel], el.querySelector('#uc-lote-cat').value); S.sel.clear(); render(); }
      else if (a === 'salvar-correcoes') salvarCorrecoesComoRegra();
      else if (a === 'comparar-duplicidade') abrirComparativoDuplicidade(t.dataset.alerta);
      else if (a === 'adicionar-regra-texto') {
        const texto = el.querySelector('#uc-regra-texto').value.trim();
        const categoriaDigitada = el.querySelector('#uc-regra-cat').value.trim();
        const contaDigitada = el.querySelector('#uc-regra-conta').value.trim();
        if (!texto || !categoriaDigitada) { aviso('Preencha “Produto contém” e “Categoria”.', 'erro'); return; }
        let categoria = S.regras.categorias.find(c => up(c.categoria) === up(categoriaDigitada));
        if (!categoria) {
          if (!contaDigitada) { aviso('Como a categoria é nova, informe também a conta contábil.', 'erro'); return; }
          categoria = { categoria: categoriaDigitada.toUpperCase(), conta_normal: /^\d+$/.test(contaDigitada) ? Number(contaDigitada) : contaDigitada, bem_duravel: false, conta_imobilizado: null, observacao: 'Categoria criada pela regra rápida de produto.' };
          S.regras.categorias.push(categoria);
        } else if (contaDigitada) {
          categoria.conta_normal = /^\d+$/.test(contaDigitada) ? Number(contaDigitada) : contaDigitada;
        }
        const lista = S.regras.regras_produto_texto || (S.regras.regras_produto_texto = []);
        const existente = lista.find(r => up(r.texto) === up(texto));
        if (existente) existente.categoria = categoria.categoria;
        else lista.push({ texto: texto.toUpperCase(), categoria: categoria.categoria, data: new Date().toISOString().slice(0, 10) });
        S.regrasSujas = true;
        if (S.res) {
          S.res = classificar(S.lancs, S.arquivosProdutos, S.regras);
          S.sel.clear();
          S.alterados.clear();
        }
        render(); aviso('Regra adicionada. Clique em “Salvar regras” para valer nos próximos meses.', 'ok');
      }
      else if (a === 'baixar-xlsx') baixarXlsx();
      else if (a === 'baixar-dominio') baixarPlanilhasDominio();
      else if (a === 'salvar-regras') { const m = S.msg; salvarRegras().then(() => { const m2 = S.msg; render(); if (m2 && m2 !== m) aviso(m2.texto, m2.tipo); }); }
      else if (a === 'backup-regras') baixar('regras_uso_consumo_' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify(S.regras, null, 2), 'application/json');
      else if (a === 'restaurar-iniciais') { if (confirm('Substituir as regras deste módulo pelas regras iniciais? (as regras de produto salvas serão perdidas se você salvar depois)')) { S.regras = clonar(REGRAS_INICIAIS); S.regrasSujas = true; if (S.res) recalcularContas(S.res, S.regras); render(); } }
    });
    el.addEventListener('change', ev => {
      const t = ev.target;
      if (t.id === 'uc-files') { importarArquivos([...t.files]); t.value = ''; return; }
      if (t.id === 'uc-json') {
        const f = t.files[0]; if (!f) return;
        f.text().then(txt => { const d = JSON.parse(txt); if (!d.parametros || !Array.isArray(d.categorias)) throw new Error('JSON sem parametros/categorias'); S.regras = d; S.regrasSujas = true; if (S.res) recalcularContas(S.res, S.regras); render(); aviso('Regras carregadas do arquivo. Clique em "Salvar regras" para gravar.', 'aviso'); })
          .catch(e => aviso('JSON inválido: ' + e.message, 'erro'));
        return;
      }
      if (t.dataset.sel) { const id = Number(t.dataset.sel); t.checked ? S.sel.add(id) : S.sel.delete(id); render(); return; }
      if (t.dataset.cat) { trocarCategoria([Number(t.dataset.cat)], t.value); return; }
      if (t.dataset.f && t.dataset.f !== 'texto') { S.f[t.dataset.f] = t.type === 'checkbox' ? t.checked : t.value; render(); return; }
      if (editarRegra(t)) render();
    });
    el.addEventListener('input', ev => {
      const t = ev.target;
      if (t.dataset.f === 'texto') { S.f.texto = t.value; clearTimeout(ligarEventos.t); ligarEventos.t = setTimeout(() => { render(); const i = el.querySelector('[data-f="texto"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 350); }
    });
    el.addEventListener('dragover', ev => { if (ev.target.closest('.uc-drop')) ev.preventDefault(); });
    el.addEventListener('drop', ev => { if (ev.target.closest('.uc-drop')) { ev.preventDefault(); importarArquivos([...ev.dataTransfer.files]); } });
  }

  async function iniciar() {
    el = document.getElementById('uc-app');
    if (!el) return;
    el.innerHTML = '<div class="card uc-card">Carregando regras do módulo...</div>';
    await carregarRegras();
    migrarRegras(S.regras);
    ligarEventos();
    render();
  }

  raiz.UsoConsumo = Object.assign({ iniciar, estado: S }, nucleo);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})(typeof window !== 'undefined' ? window : globalThis);
