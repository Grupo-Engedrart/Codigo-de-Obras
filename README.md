# 📱 Consulta de Obras - PWA

Aplicativo mobile para consulta rápida de códigos de obras, projetado para encarregados de obra usarem em campo com dispositivos Android.

## ✨ Características Principais

- **📱 PWA (Progressive Web App)** - Funciona como app nativo
- **🔍 Busca Inteligente** - Busca em tempo real por código, empresa, AF ou descrição
- **📊 Integração Google Sheets** - Dados atualizados automaticamente
- **📶 Funciona Offline** - Cache para uso sem internet
- **👷 Interface Industrial** - Fontes grandes, botões fáceis de clicar
- **🔗 Acesso Direto** - Sem login, acesso via link único

## 🚀 Como Usar

### Para Encarregados (Usuários Finais)

1. **Receber o Link**
   - Receba o link do aplicativo via WhatsApp
   - Clique no link para abrir o app

2. **Primeiro Uso**
   - O app solicitará para "Adicionar à Tela inicial"
   - Aceite para ter o app instalado como PWA

3. **Buscar Obras**
   - Use o campo de busca para encontrar obras
   - Digite qualquer parte do código, empresa, AF ou descrição
   - Clique no card da obra para ver detalhes

4. **Atualizar Dados**
   - Use o botão "Atualizar" no topo para buscar novos dados
   - O app atualiza automaticamente quando online

### Para Administradores (Quem Gerencia os Dados)

#### Configuração Inicial do Google Sheets

1. **Preparar a Planilha**
   ```
   Coluna A: Código
   Coluna B: Empresa  
   Coluna C: AF
   Coluna D: Descrição
   ```

2. **Tornar a Planilha Pública**
   - Abra sua planilha Google Sheets
   - Clique em "Compartilhar" → "Alterar para qualquer pessoa com o link"
   - Copie o ID da planilha (entre `/d/` e `/edit` na URL)

3. **Configurar no App**
   - Abra o arquivo `app.js`
   - Substitua `SUA_PLANILHA_ID_AQUI` pelo ID da sua planilha
   - Salve e faça upload dos arquivos

#### Atualizando os Dados

1. **Método 1: Edição Direta**
   - Edite diretamente na planilha Google Sheets
   - As mudanças aparecem no app em até 5 minutos
   - Usuários podem forçar atualização com botão "Atualizar"

2. **Método 2: Substituição de Arquivo**
   - Substitua o arquivo Excel local
   - Converta para Google Sheets
   - Mantenha o mesmo ID da planilha

## 📋 Instalação e Deploy

### Opção 1: Hospedagem Gratuita (Recomendado)

1. **GitHub Pages**
   - Crie um repositório no GitHub
   - Faça upload dos arquivos
   - Ative GitHub Pages nas configurações
   - Use a URL gerada para compartilhar

2. **Netlify/Vercel**
   - Faça upload dos arquivos
   - Obtenha URL pública
   - Compartilhe com os encarregados

### Opção 2: Servidor Próprio

1. Faça upload dos arquivos para seu servidor web
2. Certifique-se de que todos os arquivos estão acessíveis
3. Use HTTPS (obrigatório para PWA)

### Opção 3: Teste Local

1. Abra `index.html` em um servidor local
2. Use `python -m http.server 8000`
3. Acesse `http://localhost:8000`

## 🔧 Arquivos do Projeto

```
├── index.html          # Página principal do app
├── app.js             # Lógica JavaScript
├── sw.js              # Service Worker (offline)
├── manifest.json      # Configurações PWA
├── icon-192.png       # Ícone do app (192px)
├── icon-512.png       # Ícone do app (512px)
└── README.md          # Esta documentação
```

## 🎨 Personalização

### Cores e Estilo
- Edite as classes Tailwind CSS no `index.html`
- Modifique cores no arquivo `design.md`

### Informações do App
- Edite `manifest.json` para nome, descrição, cores
- Substitua ícones por seus próprios designs

### Comportamento
- Ajuste tempos de atualização no `app.js`
- Modifique lógica de busca conforme necessário

## 📱 Compatibilidade

- **Android**: Chrome, Firefox, Samsung Internet
- **iOS**: Safari (algumas limitações de PWA)
- **Desktop**: Chrome, Firefox, Edge

## 🔒 Segurança e Acesso

- **Link Público**: Qualquer pessoa com o link pode acessar
- **Apenas Leitura**: Não há modificação de dados via app
- **Cache Local**: Dados são cacheados no dispositivo
- **HTTPS Obrigatório**: Para funcionamento do PWA

## 🐛 Solução de Problemas

### App não carrega
- Verifique conexão com internet
- Certifique-se de usar HTTPS
- Limpe cache do navegador

### Dados não atualizam
- Verifique se planilha está pública
- Confira ID da planilha no código
- Teste acesso direto à planilha

### Ícone não aparece
- Verifique formato dos arquivos PNG
- Confira caminhos no manifest.json
- Teste em dispositivo Android

## 📞 Suporte

Para problemas técnicos:
1. Verifique esta documentação
2. Teste em diferentes navegadores
3. Verifique console do navegador (F12)
4. Consulte logs do Service Worker

## 📄 Licença

Este projeto é open source. Sinta-se livre para modificar e distribuir conforme necessário.

---

**Última atualização**: Novembro 2024
**Versão**: 1.0.0