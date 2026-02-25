# Guía de Despliegue Final: Vercel + Supabase + GitHub

Para que tu aplicación funcione correctamente en producción (`ai-real-estate-studio.vercel.app`), debes seguir estos pasos finales para conectar todas las piezas.

## 1. Configurar Variables de Envío en Vercel
Entra a tu panel de Vercel, ve a **Settings > Environment Variables** y añade las siguientes llaves (copia los valores de tu archivo `.env` local):

| Nombre de la Variable | Valor Sugerido |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://ahkkkmfbnpcuwhtkordt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(Tu llave anon pública de Supabase)* |
| `GEMINI_API_KEY` | *(Tu API Key de Google Gemini)* |

> [!IMPORTANT]
> Asegúrate de que las variables empiecen con `VITE_` para que Vite las pueda leer en el navegador.

## 2. Configurar Google Auth (Opcional pero Recomendado)
Si recibes el error `"Unsupported provider: provider is not enabled"`, es porque necesitas activar Google en tu proyecto de Supabase:

1.  **Google Cloud Console**:
    - Ve a [Google Cloud Console](https://console.cloud.google.com/).
    - Crea un nuevo proyecto o selecciona uno existente.
    - Ve a **APIs & Services > OAuth consent screen** y configúralo (User Type: External).
    - Ve a **Credentials > Create Credentials > OAuth client ID**.
    - Selecciona **Web application**.
    - En **Authorized redirect URIs**, añade la URL que aparece en Supabase bajo `Authentication > Providers > Google` (ej: `https://ahkkkmfbnpcuwhtkordt.supabase.co/auth/v1/callback`).
    - Copia el **Client ID** y el **Client Secret**.

2.  **Dashboard de Supabase**:
    - Ve a **Authentication > Providers**.
    - Busca **Google** y actívalo.
    - Pega el **Client ID** y el **Client Secret**.
    - Haz clic en **Save**.

## 3. Configurar Redirect URLs en Supabase
Para que el login y la confirmación de correo funcionen:
1.  Ve a **Authentication > URL Configuration**.
2.  En **Redirect URLs**, añade:
    - `https://ai-real-estate-studio.vercel.app`
    - `http://localhost:3000` (para pruebas locales)
3.  En **Site URL**, usa tu dominio principal: `https://ai-real-estate-studio.vercel.app`.

## 4. Conexión GitHub
He subido los últimos cambios a tu rama `main`. Vercel debería detectar el cambio y empezar a construir la nueva versión automáticamente. 

---

### Cambios realizados en el código:
- **Seguridad RLS**: Ahora los datos están protegidos. Cada usuario solo ve sus propios proyectos.
- **Persistencia Inteligente**: Solo se guardan datos en la nube si el usuario ha iniciado sesión.
- **Landing Page**: Activada como puerta de entrada para todos los visitantes.
- **Render Fix**: Lógica de respaldo (fallback) integrada para evitar fallos visuales.

![Deployment Success](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026)
