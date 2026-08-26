# Guía de Despliegue - Centralita Inmobiliaria

Aquí tienes los pasos exactos para preparar tu servidor en Oracle Cloud y lanzar todo el sistema.

## Paso 1: Conectarte al servidor (Desde Windows PowerShell)

1. Abre **PowerShell** en tu computadora.
2. Navega hasta la carpeta donde guardaste la llave `.key` o `.pem` que te dio Oracle.
3. Cambia los permisos de la llave (Windows requiere que la llave sea privada):
   ```powershell
   icacls tu-llave.key /inheritance:r
   icacls tu-llave.key /grant:r "$($env:USERNAME):(R)"
   ```
4. Conéctate al servidor:
   ```powershell
   ssh -i tu-llave.key ubuntu@<IP_PUBLICA_DE_ORACLE>
   ```

## Paso 2: Preparar el Servidor e instalar Docker

Una vez dentro de la terminal de tu servidor Oracle (verás algo como `ubuntu@instance-xyz`), ejecuta:

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker y Docker Compose
sudo apt install docker.io docker-compose -y

# Permitir que tu usuario ejecute Docker sin usar 'sudo' cada vez
sudo usermod -aG docker ubuntu
```
*(Es posible que debas salir del servidor escribiendo `exit` y volver a entrar para que el cambio de permisos de Docker surta efecto).*

## Paso 3: Levantar la Infraestructura

1. Crea una carpeta para tu proyecto en el servidor y entra en ella:
   ```bash
   mkdir pbx-inmobiliaria
   cd pbx-inmobiliaria
   ```
2. Crea el archivo `.env` para la contraseña de Redis:
   ```bash
   echo "REDIS_PASSWORD=redis_strong_password" > .env
   ```
3. Ahora necesitas subir el archivo `docker-compose.yml` que te preparé a esta carpeta. Puedes copiar el texto del archivo que está en tu proyecto, y en el servidor escribir:
   ```bash
   nano docker-compose.yml
   ```
   *Pega el contenido, presiona `Ctrl+X`, luego `Y` y `Enter` para guardar.*

4. **IMPORTANTE:** Edita el archivo `docker-compose.yml` para cambiar `app.tuinmobiliaria.com` y `api.tuinmobiliaria.com` por tus dominios reales.
5. Inicia todos los servicios en segundo plano:
   ```bash
   docker-compose up -d
   ```
6. Inicializa la base de datos de Chatwoot (solo se corre la primera vez):
   ```bash
   docker-compose exec chatwoot_web bundle exec rails db:chatwoot_prepare
   ```

## Paso 4: Proxy Inverso (HTTPS) con Nginx Proxy Manager

Para no pelear con la consola para los certificados SSL, instalaremos una interfaz gráfica para manejar los dominios.

1. Regresa al directorio raíz de tu usuario y crea otra carpeta:
   ```bash
   cd ~
   mkdir nginx-proxy
   cd nginx-proxy
   ```
2. Crea este docker-compose para Nginx Proxy Manager:
   ```bash
   nano docker-compose.yml
   ```
   Y pega esto:
   ```yaml
   version: '3.8'
   services:
     app:
       image: 'jc21/nginx-proxy-manager:latest'
       restart: unless-stopped
       ports:
         - '80:80'
         - '81:81'
         - '443:443'
       volumes:
         - ./data:/data
         - ./letsencrypt:/etc/letsencrypt
   ```
3. Levántalo:
   ```bash
   docker-compose up -d
   ```

Ahora, desde tu navegador, entra a `http://<IP_PUBLICA_DE_ORACLE>:81`. 
* **Email por defecto:** `admin@example.com`
* **Contraseña por defecto:** `changeme`

Desde ese panel, podrás rutear gráficamente:
- `app.tudominio.com` -> IP_DEL_SERVIDOR, Puerto 3000 (Chatwoot)
- `api.tudominio.com` -> IP_DEL_SERVIDOR, Puerto 8080 (Evolution API)
¡Y con un clic solicitar el certificado SSL de Let's Encrypt para que queden seguros!
