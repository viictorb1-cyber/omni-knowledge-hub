# Guia de Deploy - Omni Knowledge Hub

Este guia descreve como subir sua aplicação para um repositório Git e fazer o deploy no servidor de produção.

## 1. Preparação Local (Git)

Se você ainda não inicializou o Git no seu projeto:

```bash
# Na raiz do projeto (omni-knowledge-hub)
git init
```

Adicione os arquivos e faça o commit inicial:

```bash
git add .
git commit -m "Initial commit of backend and frontend"
```

Adicione seu repositório remoto (exemplo GitHub/GitLab):

```bash
git remote add origin https://seu-git-repo-url.git
git push -u origin main
```

## 2. Preparação do Servidor de Produção

No servidor de produção, você precisará ter instalado:
*   **Node.js** (v18+)
*   **PostgreSQL** (já instalado conforme seu script anterior)
*   **PM2** (para gerenciar o processo do Node)
*   **Nginx** (opcional, mas recomendado como proxy reverso)

### Instalar PM2 globalmente
```bash
npm install -g pm2
```

## 3. Deploy da Aplicação no Servidor

1.  **Clone o repositório** no servidor:
    ```bash
    git clone https://seu-git-repo-url.git
    cd omni-knowledge-hub
    ```

2.  **Configurar o Backend**:
    ```bash
    cd server
    
    # Instalar dependências
    npm install
    
    # Criar arquivo .env
    cp .env.example .env
    
    # Editar .env com as credenciais reais de produção
    nano .env
    ```
    
    Certifique-se de que o `.env` contenha:
    ```
    DB_USER=omni_user
    DB_HOST=localhost
    DB_NAME=basededados
    DB_PASSWORD=Omni@pabx2026
    PORT=3001
    ```

3.  **Configurar o Banco de Dados**:
    Execute o script SQL para criar as tabelas corretas:
    ```bash
    psql -h localhost -U omni_user -d basededados -f setup_prod_db.sql
    ```
    (Será solicitada a senha `Omni@pabx2026`)

4.  **Compilar e Iniciar o Servidor**:
    ```bash
    npm run build
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    ```

## 4. Frontend (Opcional se for servir separado)

Se for servir o frontend separadamente ou via Nginx:

```bash
cd ../ # Voltar para a raiz
npm install
npm run build
```

A pasta `dist` conterá os arquivos estáticos do frontend.

## 5. Rotas da API

O backend estará rodando na porta 3001.
Rotas principais:
*   `GET /api/folders`
*   `GET /api/articles`
*   `POST /api/articles` (Criação de artigos com suporte a imagens/vídeos via links ou upload separado)
*   `POST /api/upload` (Upload de arquivos - retorna URL)

## Anotações Adicionais

*   Certifique-se de que a porta 3001 está liberada no firewall se for acessar diretamente, ou configure um Proxy Reverso (Nginx) para redirecionar trafego da porta 80/443 para a 3001.
