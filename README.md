# Projeto em construção

Projeto mínimo em JavaScript: página estática e servidor MCP stateless para Cloudflare Pages.

## Build e testes

```sh
npm install
npm run build
npm test
```

O build gera os arquivos estáticos em `dist/`.

## Servidor MCP

O endpoint usa Streamable HTTP e expõe uma ferramenta, `boas_vindas`, que responde somente: `O projeto está em construção.`

## Cloudflare Pages

Use um projeto Cloudflare Pages, não Workers Builds, e configure:

- Root directory: `/`
- Build command: `npm run build`
- Build output directory: `dist`

Em **Settings > Functions**, ative a compatibility flag `nodejs_compat` e configure uma compatibility date atual. A flag é necessária pelo SDK MCP usado pelo endpoint. O arquivo `functions/mcp.js` será publicado em `/mcp`.

Não configure Deploy command; Pages publica o conteúdo de `dist` automaticamente.
