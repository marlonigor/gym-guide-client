# Gym Guide Client

Uma aplicação mobile moderna e premium para guiar seus treinos, focada em visualização de exercícios e grupos musculares com uma experiência de usuário excepcional.

## 🚀 Tecnologias

Este projeto utiliza o que há de mais moderno no ecossistema mobile:

- **[Expo (SDK 54)](https://expo.dev/)**: Framework de última geração para desenvolvimento React Native.
- **[React 19](https://react.dev/)**: Utilizando as versões mais recentes das bibliotecas principais.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM de alta performance e type-safe para interações com o SQLite.
- **[Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)**: Banco de dados relacional performante executado localmente.
- **[Supabase](https://supabase.com/)**: Infraestrutura de backend (preparada para sincronização).
- **[React Navigation](https://reactnavigation.org/)**: Navegação fluida e nativa.

## 💎 Design System

A aplicação utiliza um sistema de design proprietário com estética **Glassmorphism** e **Dark Mode** refinado:
- **Cores**: Paleta baseada em tons de roxo profundo (`#6C5CE7`) e superfícies escuras elegantes (`#0F0F1A`).
- **Tipografia**: Hierarquia clara para facilitar a leitura durante o treino.
- **Componentes**: Interfaces modulares com cantos arredondados e feedbacks visuais suaves.

## 🛠️ Estrutura do Projeto

```text
src/
├── components/   # UI Kit (Botões, Cards, Badges)
├── contexts/     # State management (SetupContext, etc.)
├── database/     # Camada de persistência (Drizzle Schema & Seed)
├── features/     # Domínios de negócio
│   ├── exercises/# Fluxo de exploração de treinos
│   ├── muscles/  # Dashboard principal por grupos musculares
│   └── setup/    # Motor de sincronização e primeiro acesso
├── services/     # Consumo de APIs e serviços externos
└── theme/        # Tokens de design (Cores, Espaçamento, Tipografia)
```

## 🔄 Fluxo de Dados & Sincronização

A aplicação possui um **módulo de Setup** (`src/features/setup`) que garante que o usuário sempre tenha a versão mais recente dos exercícios:
1. No primeiro acesso, o `SetupScreen` é disparado.
2. O banco de dados local (SQLite) é inicializado via Drizzle.
3. O script de `seed.js` popula as tabelas com a estrutura necessária.
4. O estado é persistido via `AsyncStorage` para liberar o acesso às funcionalidades principais.

## 🏁 Como Iniciar

### Pré-requisitos
- Node.js & npm/yarn
- Expo Go (disponível na App Store/Google Play)

### Instalação e Execução
1. **Instalar dependências**: `npm install`
2. **Iniciar projeto**: `npx expo start`
3. **Escaneie o QR Code** com a câmera (iOS) ou app Expo Go (Android).

## 📄 Licença
Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo LICENSE.

