# Guía de Despliegue Final: Vercel + Supabase + GitHub

Para que tu aplicación funcione correctamente en producción (`z6m.vercel.app`), debes seguir estos pasos finales para conectar todas las piezas.

## 1. Configurar Variables de Envío en Vercel
Entra a tu panel de Vercel, ve a **Settings > Environment Variables** y añade las siguientes llaves (copia los valores de tu archivo `.env` local):

| Nombre de la Variable | Valor Sugerido |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://ahkkkmfbnpcuwhtkordt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(Tu llave anon pública de Supabase)* |
| `GEMINI_API_KEY` | *(Tu API Key de Google Gemini)* |

> [!IMPORTANT]
> Asegúrate de que las variables empiecen con `VITE_` para que Vite las pueda leer en el navegador.

## 2. Configurar Redirect URLs en Supabase
Para que el login con **Google** o el enlace de confirmación de correo funcionen, debes autorizar el dominio de Vercel:

1.  Entra al panel de **Supabase**.
2.  Ve a **Authentication > URL Configuration**.
3.  En **Redirect URLs**, añade: `https://z6m.vercel.app`
4.  En **Site URL**, asegúrate de que esté tu dominio de producción o `https://z6m.vercel.app`.

## 3. Conexión GitHub
He subido los últimos cambios a tu rama `main`. Vercel debería detectar el cambio y empezar a construir la nueva versión automáticamente. 

---

### Cambios realizados en el código:
- **Seguridad RLS**: Ahora los datos están protegidos. Cada usuario solo ve sus propios proyectos.
- **Persistencia Inteligente**: Solo se guardan datos en la nube si el usuario ha iniciado sesión.
- **Landing Page**: Activada como puerta de entrada para todos los visitantes.
- **Render Fix**: Lógica de respaldo (fallback) integrada para evitar fallos visuales.

![Deployment Success](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026)
