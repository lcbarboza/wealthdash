import { createAsset } from '../services/asset-service.js';
import { listAssets } from '../services/asset-service.js';
import { runMigrations } from './migrate.js';

// Ensure migrations are up-to-date before seeding
runMigrations();

const ASSETS_TO_SEED = [
  {
    name: 'Prio ON',
    ticker: 'PRIO3',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Oil & Gas',
    notes:
      'Prio (formerly PetroRio) is an independent Brazilian oil and gas company focused on acquiring and revitalizing mature offshore oil fields. One of the largest independent O&G producers in Brazil.',
  },
  {
    name: 'ISA Energia PN',
    ticker: 'ISAE4',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Electric Utilities',
    notes:
      'ISA Energia Brasil (formerly ISA CTEEP) is a major electric power transmission company in Brazil, operating the largest transmission network in the state of São Paulo. Subsidiary of ISA (Colombia).',
  },
  {
    name: 'Itaú Unibanco PN',
    ticker: 'ITUB4',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Banking',
    notes:
      'Itaú Unibanco is the largest private bank in Brazil and one of the largest in Latin America by total assets. Provides retail and wholesale banking, insurance, asset management, and investment banking services.',
  },
  {
    name: 'Vale ON',
    ticker: 'VALE3',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Mining',
    notes:
      "Vale S.A. is one of the world's largest mining companies, and the largest producer of iron ore and nickel. Headquartered in Rio de Janeiro, it also produces manganese, ferroalloys, copper, and coal.",
  },
  {
    name: 'Telefônica Brasil ON',
    ticker: 'VIVT3',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Telecommunications',
    notes:
      'Telefônica Brasil (Vivo) is the largest telecommunications company in Brazil, providing mobile, fixed-line, broadband, and pay TV services. Subsidiary of the Spanish Telefónica group.',
  },
  {
    name: 'Vibra ON',
    ticker: 'VBBR3',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Oil & Gas Distribution',
    notes:
      'Vibra Energia (formerly BR Distribuidora) is the largest fuel distributor in Brazil, operating the BR brand gas station network. Spun off from Petrobras, it distributes gasoline, diesel, ethanol, lubricants, and aviation fuel.',
  },
  {
    name: 'BTG Pactual Unit',
    ticker: 'BPAC11',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Investment Banking',
    notes:
      'BTG Pactual is the largest investment bank in Latin America. Operates in investment banking, wealth management, asset management, corporate lending, and sales & trading. BPAC11 is a unit (1 common + 2 preferred shares).',
  },
  {
    name: 'BB Seguridade ON',
    ticker: 'BBSE3',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Insurance',
    notes:
      "BB Seguridade is the insurance, pension, and capitalization arm of Banco do Brasil. One of the largest insurance groups in Brazil, leveraging BB's extensive branch network for distribution.",
  },
  {
    name: 'Caixa Seguridade ON',
    ticker: 'CXSE3',
    asset_type: 'STOCK' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Insurance',
    notes:
      "Caixa Seguridade is the insurance and pension holding company of Caixa Econômica Federal. Distributes insurance, pension plans, and capitalization products through Caixa's vast branch and digital network across Brazil.",
  },

  // --- Funds ---
  {
    name: 'BTG Black Tesouro Selic Simples FIRF RL',
    ticker: null,
    asset_type: 'FUND' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Fixed Income',
    notes:
      'Fundo de renda fixa simples do BTG Pactual Black que investe majoritariamente em títulos Tesouro Selic (LFT). Liquidez D+0. Indicado para reserva de emergência e alocação conservadora.',
  },
  {
    name: 'BTG Digital Tesouro Selic Simples FIRF',
    ticker: null,
    asset_type: 'FUND' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Fixed Income',
    notes:
      'Fundo de renda fixa simples do BTG Pactual Digital que investe majoritariamente em títulos Tesouro Selic (LFT). Liquidez D+0. Indicado para reserva de emergência e alocação conservadora.',
  },
  {
    name: 'BTG Reference Ouro FIM',
    ticker: null,
    asset_type: 'FUND' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Commodities',
    notes:
      'Fundo multimercado do BTG Pactual que busca acompanhar a variação do preço do ouro. Exposição a commodity via derivativos e contratos futuros. Alternativa para diversificação e proteção de carteira.',
  },

  // --- CDB ---
  {
    name: 'CDB Banco BTG Pactual IPCA+',
    ticker: null,
    asset_type: 'CDB' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Banking',
    maturity_date: '2026-05-27',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 8.81,
    notes:
      'CDB emitido pelo Banco BTG Pactual S.A. Taxa IPCA + 8,81% a.a. Vencimento 27/05/2026. Coberto pelo FGC.',
  },

  // --- LCA ---
  {
    name: 'LCA Banco BTG Pactual',
    ticker: null,
    asset_type: 'LCA' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Agribusiness',
    maturity_date: '2026-08-05',
    rate_type: 'POST' as const,
    indexer: 'CDI' as const,
    rate_value: 93.0,
    notes:
      'Letra de Crédito do Agronegócio emitida pelo Banco BTG Pactual S.A. Taxa 93,00% do CDI. Vencimento 05/08/2026. Isenta de IR para pessoa física. Coberta pelo FGC.',
  },

  // --- CRI ---
  {
    name: 'CRI MRV IV',
    ticker: null,
    asset_type: 'CRI' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Real Estate',
    maturity_date: '2029-02-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 6.6,
    notes:
      'Certificado de Recebíveis Imobiliários lastreado em créditos da MRV Engenharia. Taxa IPCA + 6,60% a.a. Vencimento 15/02/2029. Isento de IR para pessoa física. Não coberto pelo FGC.',
  },
  {
    name: "CRI Rede D'Or",
    ticker: null,
    asset_type: 'CRI' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Healthcare',
    maturity_date: '2033-08-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 6.17,
    notes:
      "Certificado de Recebíveis Imobiliários lastreado em créditos da Rede D'Or São Luiz. Taxa IPCA + 6,17% a.a. Vencimento 15/08/2033. Isento de IR para pessoa física. Não coberto pelo FGC.",
  },

  // --- CRA ---
  {
    name: 'CRA Caramuru Alimentos II',
    ticker: null,
    asset_type: 'CRA' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Agribusiness',
    maturity_date: '2027-09-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 7.22,
    notes:
      'Certificado de Recebíveis do Agronegócio lastreado em créditos da Caramuru Alimentos. Taxa IPCA + 7,22% a.a. Vencimento 15/09/2027. Isento de IR para pessoa física. Não coberto pelo FGC.',
  },
  {
    name: 'CRA Minerva',
    ticker: null,
    asset_type: 'CRA' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Food & Beverage',
    maturity_date: '2029-07-16',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 6.06,
    notes:
      'Certificado de Recebíveis do Agronegócio lastreado em créditos da Minerva Foods, uma das maiores exportadoras de carne bovina da América do Sul. Taxa IPCA + 6,06% a.a. Vencimento 16/07/2029. Isento de IR para pessoa física.',
  },
  {
    name: 'CRA BRF',
    ticker: null,
    asset_type: 'CRA' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Food & Beverage',
    maturity_date: '2032-07-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 8.0,
    notes:
      'Certificado de Recebíveis do Agronegócio lastreado em créditos da BRF S.A. (Sadia/Perdigão). Taxa IPCA + 8,00% a.a. Vencimento 15/07/2032. Isento de IR para pessoa física.',
  },
  {
    name: 'CRA Klabin',
    ticker: null,
    asset_type: 'CRA' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Pulp & Paper',
    maturity_date: '2034-05-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 6.92,
    notes:
      'Certificado de Recebíveis do Agronegócio lastreado em créditos da Klabin, maior produtora e exportadora de papéis para embalagens do Brasil. Taxa IPCA + 6,92% a.a. Vencimento 15/05/2034. Isento de IR para pessoa física.',
  },

  // --- Tesouro Direto ---
  {
    name: 'Tesouro IPCA+ 2029',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2029-05-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 0,
    notes:
      'Tesouro IPCA+ 2029 (NTN-B Principal). Título público federal indexado à inflação (IPCA) sem pagamento de cupons semestrais. Vencimento 15/05/2029.',
  },
  {
    name: 'Tesouro Prefixado 2031',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2031-01-01',
    rate_type: 'PRE' as const,
    indexer: 'NONE' as const,
    rate_value: 0,
    notes:
      'Tesouro Prefixado 2031 (LTN). Título público federal com rentabilidade definida no momento da compra. Vencimento 01/01/2031.',
  },
  {
    name: 'Tesouro IPCA+ 2040',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2040-08-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 0,
    notes:
      'Tesouro IPCA+ 2040 (NTN-B Principal). Título público federal indexado à inflação (IPCA) sem pagamento de cupons semestrais. Vencimento 15/08/2040.',
  },
  {
    name: 'Tesouro Renda+ Aposentadoria Extra 2084',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2084-12-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 0,
    notes:
      'Tesouro Renda+ Aposentadoria Extra 2084 (NTN-B1). Título público federal voltado para aposentadoria complementar. Indexado ao IPCA, com pagamento de renda mensal por 20 anos a partir do vencimento. Data de conversão 15/12/2084.',
  },
  {
    name: 'Tesouro Prefixado 2032',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2032-01-01',
    rate_type: 'PRE' as const,
    indexer: 'NONE' as const,
    rate_value: 0,
    notes:
      'Tesouro Prefixado 2032 (LTN). Título público federal com rentabilidade definida no momento da compra. Vencimento 01/01/2032.',
  },
  {
    name: 'Tesouro Renda+ Aposentadoria Extra 2079',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2079-12-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 0,
    notes:
      'Tesouro Renda+ Aposentadoria Extra 2079 (NTN-B1). Título público federal voltado para aposentadoria complementar. Indexado ao IPCA, com pagamento de renda mensal por 20 anos a partir do vencimento. Data de conversão 15/12/2079.',
  },
  {
    name: 'Tesouro Prefixado 2027',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2027-01-01',
    rate_type: 'PRE' as const,
    indexer: 'NONE' as const,
    rate_value: 0,
    notes:
      'Tesouro Prefixado 2027 (LTN). Título público federal com rentabilidade definida no momento da compra. Vencimento 01/01/2027.',
  },
  {
    name: 'Tesouro IPCA+ 2035',
    ticker: null,
    asset_type: 'TESOURO' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Government Bonds',
    maturity_date: '2035-05-15',
    rate_type: 'HYBRID' as const,
    indexer: 'IPCA' as const,
    rate_value: 0,
    notes:
      'Tesouro IPCA+ 2035 (NTN-B Principal). Título público federal indexado à inflação (IPCA) sem pagamento de cupons semestrais. Vencimento 15/05/2035.',
  },

  // --- Previdência ---
  {
    name: 'BTG IMA-B Prev FICFIRF',
    ticker: null,
    asset_type: 'PREVIDENCIA' as const,
    asset_class: 'FIXED_INCOME' as const,
    currency: 'BRL' as const,
    sector: 'Fixed Income',
    notes:
      'Fundo de previdência de renda fixa do BTG Pactual que busca acompanhar o índice IMA-B (cesta de NTN-Bs). Exposição a títulos públicos indexados ao IPCA de diversos vencimentos. Indicado para acumulação de longo prazo com proteção inflacionária.',
  },
  {
    name: 'Kinea Prev Atlas BP FIF MM RL',
    ticker: null,
    asset_type: 'PREVIDENCIA' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Multimercado',
    notes:
      'Fundo de previdência multimercado da Kinea Investimentos (grupo Itaú). Estratégia macro global com alocação em juros, câmbio, renda variável e crédito. Gestão ativa com foco em retorno absoluto de longo prazo.',
  },
  {
    name: 'Absolute Vertex Prev FIM Access',
    ticker: null,
    asset_type: 'PREVIDENCIA' as const,
    asset_class: 'EQUITY' as const,
    currency: 'BRL' as const,
    sector: 'Multimercado',
    notes:
      'Fundo de previdência multimercado da Absolute Investimentos. Estratégia quantitativa e sistemática com alocação diversificada em múltiplos mercados. Gestão ativa buscando retorno consistente acima do CDI no longo prazo.',
  },
];

async function seed() {
  // Check for already existing assets to avoid duplicates
  const existing = await listAssets();
  const existingTickers = new Set(existing.map((a) => a.ticker).filter(Boolean));
  const existingNames = new Set(existing.map((a) => a.name));

  let created = 0;
  let skipped = 0;

  for (const asset of ASSETS_TO_SEED) {
    // Deduplicate by ticker (for stocks) or by name (for funds without ticker)
    const isDuplicate = asset.ticker
      ? existingTickers.has(asset.ticker)
      : existingNames.has(asset.name);

    if (isDuplicate) {
      const label = asset.ticker ?? asset.name;
      console.log(`  Skipped: ${label} - already exists`);
      skipped++;
      continue;
    }

    try {
      const result = await createAsset(asset);
      const label = result.ticker ?? result.name;
      console.log(`  Created: ${label} (${result.name}) [${result.sector}]`);
      created++;
    } catch (error) {
      const label = asset.ticker ?? asset.name;
      console.error(`  Failed: ${label} (${asset.name}) -`, error);
    }
  }

  console.log(`\nSeed complete: ${created} created, ${skipped} skipped`);
}

seed();
