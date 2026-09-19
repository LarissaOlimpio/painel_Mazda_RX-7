# RX-7 FD3S — Painel de Dados

Projeto de estudo para praticar Bootstrap 3, Highcharts, DataTables,
closures/IIFE e recursos modernos do JavaScript (ES6+), usando dados
**fictícios** sobre o Mazda RX-7 FD3S como pretexto.
<img width="1514" height="948" alt="painel_car" src="https://github.com/user-attachments/assets/59ac2948-2faf-4f07-8d46-e8ac0f5ab2f1" />

## Estrutura

```
rx7-dashboard/
├── index.html        → estrutura da página (Bootstrap 3, navbar, seções)
├── css/
│   └── style.css      → tema visual (painel de telemetria)
└── js/
    ├── data.js         → dados fictícios + "API" simulada (Promise/JSON)
    └── script.js        → lógica: IIFE, closures, Highcharts, DataTables
```

## Como rodar

Como os scripts não usam `fetch()` de arquivo externo (evitamos isso de
propósito, pois `file://` bloqueia esse tipo de requisição por CORS),
dá pra abrir o `index.html` direto no navegador com duplo clique.

Para uma experiência mais próxima de um projeto real, recomendo usar a
extensão **Live Server** no VS Code (clique direito no `index.html` →
"Open with Live Server").

## Conceitos praticados

- **Closures e IIFE** — `js/script.js` inteiro é uma função auto-executável
  que encapsula estado privado (`searchCount`, `cache` do memoizador).
- **JSON e AJAX** — `js/data.js` simula uma chamada assíncrona de API
  devolvendo uma `Promise`, igual um `fetch()` real.
- Nomes de variáveis, funções, `id`s e chaves de objeto estão em inglês
  (padrão de mercado); os textos visíveis na página ficam em português.
- **ECMAScript (funções avançadas)** — arrow functions, desestruturação,
  spread (`...`), template literals e `map`/`reduce` espalhados pelo
  `script.js`.
- **Highcharts** — gráfico de linha (potência x torque por RPM) e gráfico
  de colunas (potência por versão/ano).
- **Bootstrap 3** — grid, navbar e tabela responsiva.
- **DataTables** — busca e ordenação na tabela de versões.

## Aviso

Todos os números técnicos (potência, torque, peso, preços) são
inventados para fins didáticos e não representam o veículo real.
