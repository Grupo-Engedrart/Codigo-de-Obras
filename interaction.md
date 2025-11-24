# Interação do App - Consulta de Códigos de Obra

## Fluxo Principal do Usuário

### 1. Acesso Inicial
- Usuário recebe link via WhatsApp
- Clica no link → abre PWA no navegador
- App carrega lista inicial de obras
- Interface mostra campo de busca e lista de cards

### 2. Busca e Filtragem
- Usuário digita no campo de busca
- Busca em tempo real filtra resultados
- Filtros funcionam em todos os campos:
  - Código da obra
  - Nome da empresa
  - Número AF
  - Descrição da obra
- Resultados atualizam dinamicamente

### 3. Visualização de Detalhes
- Usuário clica em card de obra
- Transição suave para tela de detalhes
- Mostra todos os 4 campos organizados
- Botão "Voltar" para retornar à lista

### 4. Atualização de Dados
- App verifica atualizações ao abrir
- Dados sincronizados com Google Sheets
- Indicador visual de atualização
- Cache para funcionamento offline

## Interações Específicas

### Campo de Busca
- **Input**: Texto livre
- **Comportamento**: Busca instantânea
- **Filtros**: Case-insensitive
- **Limpar**: Botão X para limpar busca

### Cards de Obra
- **Clique**: Abre detalhes
- **Visual**: Hover sutil (se suportado)
- **Estados**: Normal, loading, erro

### Tela de Detalhes
- **Navegação**: Swipe para voltar (opcional)
- **Botão Voltar**: Retorna à lista mantendo busca
- **Scroll**: Vertical se conteúdo exceder tela

### Estados do App
- **Loading**: Skeleton animado
- **Vazio**: Mensagem "Nenhuma obra encontrada"
- **Erro**: Mensagem de erro com retry
- **Offline**: Indicador visual discreto

## Comportamentos Técnicos

### Performance
- Lazy loading da lista
- Virtual scroll para grandes listas
- Cache de imagens e dados
- Compressão de assets

### Acessibilidade
- Navegação por tab
- Leitores de tela
- Contraste adequado
- Fontes ajustáveis

### Offline
- Service Worker para cache
- Dados sincronizados quando online
- Indicador de status de conexão
- Funcionalidade limitada offline

## Feedback ao Usuário

### Ações Visuais
- Highlight de item clicado
- Loading states em botões
- Progress indicators
- Toast notifications

### Mensagens
- "Buscando obras..."
- "Atualizando dados..."
- "Sem conexão - mostrando dados offline"
- "Erro ao carregar dados"

## Integração com Google Sheets

### Sincronização
- Leitura da planilha via API
- Atualização automática a cada 5 minutos
- Botão manual "Atualizar" disponível
- Verificação de mudanças incrementais

### Formato dos Dados
```javascript
{
  codigo: "OB-456",
  empresa: "Construtora X", 
  af: "AF123",
  descricao: "Instalação hidráulica bloco A"
}
```

## Segurança e Acesso

### Compartilhamento
- Link único público
- Sem autenticação necessária
- Acesso direto via URL
- Compatível com WhatsApp

### Limitações
- Apenas leitura dos dados
- Sem modificações via app
- Cache limitado por dispositivo
- Dependência de conexão para atualizações

## Experiência Mobile

### Touch
- Touch targets grandes (48px+)
- Scroll suave
- Pull-to-refresh
- Swipe gestures

### Tela
- Otimizado para retrato
- Fontes grandes para fácil leitura
- Alto contraste para uso externo
- Layout adaptativo

### Performance
- Carregamento rápido
- Animações fluidas
- Uso mínimo de memória
- Bateria otimizada