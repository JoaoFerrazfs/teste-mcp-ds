# Projeto em construção

Projeto mínimo em JavaScript: página estática e servidor MCP stateless para Cloudflare Pages.

## Rodar localmente

```sh
npm install
npm run dev
```

- Página: `http://localhost:8788`
- MCP: `http://localhost:8788/mcp`

Execute `npm test` para verificar o fluxo MCP.

## Servidor MCP

O endpoint usa Streamable HTTP e expõe uma ferramenta, `boas_vindas`, que responde somente: `O projeto está em construção.`

## Cloudflare Pages

O comando `npm run build` copia os arquivos estáticos para `dist`. No projeto Pages, use `npm run build` como build command e `dist` como diretório de saída. `wrangler.jsonc` ativa `nodejs_compat`, e `functions/mcp.js` será publicada em `/mcp`.

Para deploy manual, rode `npm run build && npm run deploy:pages` (projeto `teste-mcp-ds`). Se o painel exigir Deploy command com `npx wrangler deploy`, ele está configurando um Worker; Pages usa `wrangler pages deploy`.
