# Sistema de Holerites - Web

Aplicação web pura (HTML5, CSS, JS) para simulação e geração de holerites brasileiros.

## Funcionalidades
- Cadastro de funcionários
- Cálculo automático de holerite (salário proporcional, horas extras, DSR, INSS, IRRF, FGTS, VT, VR etc.)
- Modo manual
- Férias, 13º salário, Rescisão
- Tabelas INSS/IRRF por ano (editáveis)
- Exportação PDF e Excel
- Tema claro/escuro

## Como usar
1. Abra o arquivo `index.html` em um navegador moderno.
2. Navegue entre as seções pelo menu.
3. Os dados são salvos automaticamente no localStorage do navegador.

## Estrutura
- `index.html`: shell da SPA
- `css/style.css`: estilos com variáveis para tema escuro
- `js/app.js`: roteador e inicialização
- `js/store.js`: gerenciamento de dados (localStorage)
- `js/components/`: navbar, sidebar, modal
- `js/pages/`: páginas (dashboard, funcionários, holerite, férias, etc.)
- `js/services/`: cálculos (INSS, IRRF, FGTS, etc.)
- `js/utils/`: utilitários
- `data/defaultTables.json`: tabelas padrão de INSS/IRRF

## Tabelas de exemplo
As tabelas de 2023 e 2024 já estão incluídas. Para outros anos, edite na seção Configurações ou edite o arquivo JSON.

Desenvolvido com ❤️ e CLT.
