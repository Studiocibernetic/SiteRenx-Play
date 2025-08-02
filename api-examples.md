# Renx-Play API Examples

Este documento contém exemplos de como usar a API do Renx-Play.

## Base URL
```
http://localhost/api
```

## Endpoints

### 1. Listar Jogos

**GET** `/games`

**Parâmetros:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Jogos por página (padrão: 12)
- `search` (opcional): Termo de busca

**Exemplo:**
```bash
curl "http://localhost/api/games?page=1&limit=6&search=visual"
```

**Resposta:**
```json
{
  "games": [
    {
      "id": "game1",
      "title": "Sample Visual Novel",
      "description": "A beautiful visual novel...",
      "image_url": "https://via.placeholder.com/400x600/4f46e5/ffffff?text=Game+1",
      "developer": "Sample Studio",
      "version": "v1.0",
      "engine": "REN'PY",
      "language": "English",
      "rating": "4.50",
      "tags": "Visual Novel,Adult,Romance",
      "download_url": "https://example.com/download1",
      "download_url_windows": null,
      "download_url_android": null,
      "download_url_linux": null,
      "download_url_mac": null,
      "censored": "0",
      "installation": "Extract and run",
      "changelog": "Initial release",
      "dev_notes": null,
      "release_date": "2024-01-01 00:00:00",
      "os_windows": "1",
      "os_android": "1",
      "os_linux": "0",
      "os_mac": "0",
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-01 00:00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 3,
    "totalPages": 1
  }
}
```

### 2. Obter Detalhes de um Jogo

**GET** `/games/{id}`

**Exemplo:**
```bash
curl "http://localhost/api/games/game1"
```

**Resposta:**
```json
{
  "id": "game1",
  "title": "Sample Visual Novel",
  "description": "A beautiful visual novel...",
  "image_url": "https://via.placeholder.com/400x600/4f46e5/ffffff?text=Game+1",
  "developer": "Sample Studio",
  "version": "v1.0",
  "engine": "REN'PY",
  "language": "English",
  "rating": "4.50",
  "tags": "Visual Novel,Adult,Romance",
  "download_url": "https://example.com/download1",
  "download_url_windows": null,
  "download_url_android": null,
  "download_url_linux": null,
  "download_url_mac": null,
  "censored": "0",
  "installation": "Extract and run",
  "changelog": "Initial release",
  "dev_notes": null,
  "release_date": "2024-01-01 00:00:00",
  "os_windows": "1",
  "os_android": "1",
  "os_linux": "0",
  "os_mac": "0",
  "created_at": "2024-01-01 00:00:00",
  "updated_at": "2024-01-01 00:00:00",
  "images": [
    {
      "id": "img1",
      "game_id": "game1",
      "image_url": "https://via.placeholder.com/400x300/4f46e5/ffffff?text=Screenshot+1",
      "created_at": "2024-01-01 00:00:00"
    }
  ],
  "isFavorited": false
}
```

### 3. Verificar Status de Admin

**GET** `/admin/status`

**Exemplo:**
```bash
curl "http://localhost/api/admin/status"
```

**Resposta:**
```json
{
  "isAdmin": true
}
```

### 4. Listar Todos os Jogos (Admin)

**GET** `/admin/games`

**Exemplo:**
```bash
curl "http://localhost/api/admin/games"
```

**Resposta:**
```json
[
  {
    "id": "game1",
    "title": "Sample Visual Novel",
    "description": "A beautiful visual novel...",
    "image_url": "https://via.placeholder.com/400x600/4f46e5/ffffff?text=Game+1",
    "developer": "Sample Studio",
    "version": "v1.0",
    "engine": "REN'PY",
    "language": "English",
    "rating": "4.50",
    "tags": "Visual Novel,Adult,Romance",
    "download_url": "https://example.com/download1",
    "download_url_windows": null,
    "download_url_android": null,
    "download_url_linux": null,
    "download_url_mac": null,
    "censored": "0",
    "installation": "Extract and run",
    "changelog": "Initial release",
    "dev_notes": null,
    "release_date": "2024-01-01 00:00:00",
    "os_windows": "1",
    "os_android": "1",
    "os_linux": "0",
    "os_mac": "0",
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
]
```

### 5. Criar Novo Jogo (Admin)

**POST** `/admin/games`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "New Game",
  "description": "A new exciting game",
  "imageUrl": "https://example.com/image.jpg",
  "developer": "New Studio",
  "version": "v1.0",
  "engine": "Unity",
  "language": "English",
  "rating": 4.5,
  "tags": "Action,Adventure",
  "downloadUrl": "https://example.com/download",
  "downloadUrlWindows": "https://example.com/download-windows",
  "downloadUrlAndroid": "https://example.com/download-android",
  "downloadUrlLinux": "https://example.com/download-linux",
  "downloadUrlMac": "https://example.com/download-mac",
  "censored": false,
  "installation": "Extract and run",
  "changelog": "Initial release",
  "devNotes": "Developer notes here",
  "osWindows": true,
  "osAndroid": false,
  "osLinux": true,
  "osMac": false
}
```

**Exemplo:**
```bash
curl -X POST "http://localhost/api/admin/games" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Game",
    "description": "A new exciting game",
    "imageUrl": "https://example.com/image.jpg",
    "developer": "New Studio",
    "version": "v1.0",
    "engine": "Unity",
    "language": "English",
    "rating": 4.5,
    "tags": "Action,Adventure",
    "downloadUrl": "https://example.com/download",
    "osWindows": true,
    "osLinux": true
  }'
```

**Resposta:**
```json
{
  "id": "new_game_id"
}
```

### 6. Atualizar Jogo (Admin)

**PUT** `/admin/games/{id}`

**Headers:**
```
Content-Type: application/json
```

**Body:** (mesmo formato do POST)

**Exemplo:**
```bash
curl -X PUT "http://localhost/api/admin/games/game1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Game Title",
    "description": "Updated description",
    "imageUrl": "https://example.com/new-image.jpg",
    "developer": "Updated Studio",
    "rating": 4.8
  }'
```

**Resposta:**
```json
{
  "success": true
}
```

### 7. Excluir Jogo (Admin)

**DELETE** `/admin/games/{id}`

**Exemplo:**
```bash
curl -X DELETE "http://localhost/api/admin/games/game1"
```

**Resposta:**
```json
{
  "success": true
}
```

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `400 Bad Request` - Dados inválidos
- `403 Forbidden` - Acesso negado (admin required)
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Autenticação

Atualmente, a autenticação é simulada. Para implementar autenticação real:

1. Adicione sistema de sessões ou JWT
2. Modifique `api/auth.php` para verificar tokens/sessões
3. Implemente login/logout endpoints
4. Adicione middleware de autenticação

## Exemplos em JavaScript

### Usando fetch()

```javascript
// Listar jogos
async function getGames(page = 1, limit = 12, search = '') {
  const params = new URLSearchParams({ page, limit, search });
  const response = await fetch(`/api/games?${params}`);
  return await response.json();
}

// Obter detalhes de um jogo
async function getGame(id) {
  const response = await fetch(`/api/games/${id}`);
  return await response.json();
}

// Criar novo jogo (admin)
async function createGame(gameData) {
  const response = await fetch('/api/admin/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameData)
  });
  return await response.json();
}

// Atualizar jogo (admin)
async function updateGame(id, gameData) {
  const response = await fetch(`/api/admin/games/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameData)
  });
  return await response.json();
}

// Excluir jogo (admin)
async function deleteGame(id) {
  const response = await fetch(`/api/admin/games/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
}
```

### Usando axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Listar jogos
const getGames = (page = 1, limit = 12, search = '') => {
  return api.get('/games', { params: { page, limit, search } });
};

// Obter detalhes de um jogo
const getGame = (id) => {
  return api.get(`/games/${id}`);
};

// Criar novo jogo (admin)
const createGame = (gameData) => {
  return api.post('/admin/games', gameData);
};

// Atualizar jogo (admin)
const updateGame = (id, gameData) => {
  return api.put(`/admin/games/${id}`, gameData);
};

// Excluir jogo (admin)
const deleteGame = (id) => {
  return api.delete(`/admin/games/${id}`);
};
```

## Testando a API

### Usando curl

```bash
# Listar jogos
curl "http://localhost/api/games"

# Buscar jogos
curl "http://localhost/api/games?search=visual"

# Obter detalhes de um jogo
curl "http://localhost/api/games/game1"

# Verificar status de admin
curl "http://localhost/api/admin/status"

# Listar todos os jogos (admin)
curl "http://localhost/api/admin/games"
```

### Usando Postman

1. Importe a coleção de exemplos
2. Configure a base URL como `http://localhost/api`
3. Teste os endpoints conforme necessário

## Notas Importantes

1. **CORS**: A API está configurada para aceitar requisições de qualquer origem (`*`)
2. **Validação**: Implemente validação adequada para produção
3. **Segurança**: Adicione autenticação real para produção
4. **Rate Limiting**: Considere implementar rate limiting para APIs públicas
5. **Logs**: Implemente logging adequado para debugging