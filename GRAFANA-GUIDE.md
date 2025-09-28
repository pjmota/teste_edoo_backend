# 📊 Guia Grafana para Iniciantes

Este guia vai te ensinar como usar o Grafana para monitorar sua aplicação NestJS, mesmo se você nunca usou antes!

## 🎯 O que é Grafana?

**Grafana** é uma ferramenta de visualização que cria dashboards (painéis) bonitos com gráficos e métricas da sua aplicação. É como ter um "painel de controle" para ver como sua aplicação está funcionando.

**Prometheus** coleta as métricas da sua aplicação e o **Grafana** mostra essas métricas em gráficos fáceis de entender.

## 🚀 Como Iniciar

### 1. Subir os Serviços

```bash
# No terminal, dentro da pasta do projeto:
docker-compose -f deployment/docker-compose.monitoring.yml up -d
```

Isso vai iniciar:
- **Sua aplicação NestJS** (porta 3000)
- **Prometheus** (porta 9090) 
- **Grafana** (porta 3001)

### 2. Acessar o Grafana

1. Abra seu navegador
2. Vá para: `http://localhost:3001`
3. Faça login com:
   - **Usuário**: `admin`
   - **Senha**: `admin123`

## 📈 Entendendo o Dashboard

Quando você entrar no Grafana, já terá um dashboard pronto chamado **"NestJS Application Monitoring"** com:

### 🔢 Métricas Principais

1. **HTTP Requests per Second**
   - Mostra quantas requisições sua API está recebendo por segundo
   - Útil para ver se há picos de tráfego

2. **Memory Usage** 
   - Mostra quanto de memória sua aplicação está usando
   - Se subir muito, pode indicar vazamento de memória

3. **CPU Usage**
   - Mostra o uso do processador
   - Ajuda a identificar se a aplicação está sobrecarregada

4. **HTTP Response Times**
   - Mostra quanto tempo suas APIs levam para responder
   - Importante para performance do usuário

## 🎮 Como Usar o Grafana

### Navegação Básica

- **Sidebar esquerda**: Menu principal
- **Dashboards**: Onde ficam seus painéis
- **Explore**: Para fazer consultas manuais
- **Alerting**: Para criar alertas automáticos

### Interagindo com Gráficos

- **Zoom**: Clique e arraste em um gráfico
- **Período**: Use o seletor no canto superior direito (ex: "Last 1 hour")
- **Refresh**: Configure atualização automática (ex: "5s")
- **Hover**: Passe o mouse sobre os gráficos para ver valores exatos

### Personalizando Dashboards

1. Clique no ícone de **engrenagem** (⚙️) no topo
2. Selecione **"Edit"**
3. Clique em qualquer painel para editá-lo
4. Use **"Add Panel"** para criar novos gráficos

## 🔍 Testando o Monitoramento

Para ver as métricas funcionando:

1. **Faça algumas requisições** para sua API:
   ```bash
   curl http://localhost:3000/benefits
   ```

2. **Veja no Grafana**:
   - O gráfico de "HTTP Requests" deve mostrar atividade
   - Os tempos de resposta aparecerão no gráfico correspondente

## 📊 Métricas Disponíveis

Sua aplicação NestJS expõe automaticamente estas métricas:

- `http_requests_total` - Total de requisições HTTP
- `http_request_duration_ms` - Tempo de resposta das requisições
- `process_cpu_user_seconds_total` - Uso de CPU
- `process_resident_memory_bytes` - Uso de memória
- `nodejs_*` - Métricas específicas do Node.js

## 🚨 Criando Alertas (Opcional)

1. Vá em **Alerting** → **Alert Rules**
2. Clique **"New Rule"**
3. Configure condições (ex: "CPU > 80%")
4. Defina notificações (email, Slack, etc.)

## 🛠️ Comandos Úteis

```bash
# Ver logs do Grafana
docker logs grafana

# Ver logs do Prometheus  
docker logs prometheus

# Parar todos os serviços
docker-compose -f deployment/docker-compose.monitoring.yml down

# Reiniciar apenas o Grafana
docker-compose -f deployment/docker-compose.monitoring.yml restart grafana
```

## 🎯 Dicas para Iniciantes

1. **Comece simples**: Use o dashboard pronto primeiro
2. **Explore**: Clique em tudo para aprender
3. **Documente**: Anote configurações que funcionam
4. **Pratique**: Crie painéis para diferentes cenários
5. **Comunidade**: Use a documentação oficial do Grafana

## 🔗 Links Úteis

- [Documentação Grafana](https://grafana.com/docs/)
- [Prometheus Metrics](http://localhost:9090) (quando rodando)
- [Grafana Dashboard](http://localhost:3001) (quando rodando)

## ❓ Problemas Comuns

**Grafana não carrega?**
- Verifique se o Docker está rodando
- Confirme que a porta 3001 não está em uso

**Não vê métricas?**
- Verifique se sua aplicação está rodando na porta 3000
- Teste o endpoint: `http://localhost:3000/metrics`

**Dashboard vazio?**
- Aguarde alguns minutos para o Prometheus coletar dados
- Faça algumas requisições para sua API

---

🎉 **Parabéns!** Agora você tem um sistema de monitoramento profissional rodando!