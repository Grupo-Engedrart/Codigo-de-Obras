# Design Mobile App - Consulta de Códigos de Obra

## Objetivo do Design
Criar uma interface mobile simples, funcional e otimizada para uso em ambientes de construção civil, com foco em usabilidade para trabalhadores usando luvas e dispositivos móveis.

## Princípios de Design
- **Mobile-First**: Interface otimizada para smartphones Android
- **Acessibilidade**: Fontes grandes e botões fáceis de clicar
- **Simplicidade**: Design limpo sem elementos desnecessários
- **Funcionalidade**: Busca rápida e navegação intuitiva
- **Industrial**: Visual profissional adequado para ambientes de obra

## Paleta de Cores
- **Primária**: Cinza escuro (#2D3748) - para headers e elementos principais
- **Secundária**: Cinza claro (#F7FAFC) - para fundo e áreas neutras
- **Acento**: Azul industrial (#3182CE) - para botões e links
- **Texto**: Preto (#1A202C) - para máxima legibilidade
- **Sucesso**: Verde (#38A169) - para status ativo
- **Borda**: Cinza médio (#E2E8F0) - para separadores

## Tipografia
- **Fonte Principal**: Inter (sans-serif) - alta legibilidade
- **Títulos**: 24px, bold
- **Subtítulos**: 18px, medium
- **Corpo**: 16px, regular
- **Detalhes**: 14px, regular
- **Botões**: 18px, medium

## Elementos de Interface

### Header
- Barra superior fixa com título do app
- Altura: 60px
- Cor de fundo: Cinza escuro
- Texto branco para contraste

### Campo de Busca
- Input grande e destacado
- Altura mínima: 50px
- Fonte: 18px
- Placeholder claro: "Buscar por código, empresa, AF ou descrição"

### Cards de Obra
- Estrutura em lista vertical
- Altura: 120px por card
- Sombra suave para destacar
- Informações hierárquicas:
  - Código da obra (18px, bold)
  - Empresa (16px, medium)
  - AF (16px, regular)
  - Descrição (14px, regular, truncada)

### Tela de Detalhes
- Layout em coluna única
- Espaçamento generoso entre elementos
- Fontes grandes para fácil leitura
- Botão voltar destacado

### Botões
- Altura mínima: 48px (padrão de acessibilidade)
- Bordas arredondadas: 8px
- Espaçamento interno: 16px
- Sombras suaves para feedback visual

## Layout Responsivo
- Largura máxima: 100% do viewport
- Margens laterais: 16px
- Espaçamento entre elementos: 20px
- Scroll vertical fluido

## Estados de Interação
- **Normal**: Cores base
- **Hover**: Leve escurecimento (para desktop)
- **Active**: Sombra interna
- **Focus**: Borda azul para acessibilidade
- **Loading**: Skeleton animado
- **Empty**: Ilustração e mensagem amigável

## Ícones e Imagens
- Ícones minimalistas (Heroicons)
- Sem imagens decorativas para manter simplicidade
- Foco em elementos funcionais

## Animações
- Transições suaves entre telas
- Feedback visual ao clicar
- Carregamento com skeleton
- Scroll suave

## Considerações Especiais
- Contraste mínimo 4.5:1 para acessibilidade
- Touch targets mínimos de 44px
- Compatível com modo retrato
- Funcionalidade offline com cache
- Atualização automática de dados