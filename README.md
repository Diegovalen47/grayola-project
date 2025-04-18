# Grayola
## _Dashboard proyectos de diseño_
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn--UI-000000?style=for-the-badge&logo=shadcn&logoColor=white)](https://ui.shadcn.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)




## Ejecutar localmente

> Nota: Utilizar version 22 LTS de Node.js

Teniendo en cuenta el archivo `.env.example`, crear un archivo `.env` y rellenar los campos necesarios.

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<YOUR_SUPABASE_PROJECT_URL>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<YOUR_SUPABASE_ANON_KEY>"
NEXT_PULIC_SUPABASE_BUCKET_URL= "https://<YOUR_SUPABASE_PROJECT_URL>.supabase.co/storage/v1/object/public/files/projects"
```

Instalar las dependencias y ejecutar el proyecto (el proyecto utiliza pnpm como gestor de paquetes, de todas forma se puede usar npm o yarn):

```bash
pnpm install
pnpm dev
```

Esto abrirá el proyecto en [http://localhost:3000](http://localhost:3000)

La ruta inicial es `/login` para atenticarse o crear una cuenta y poder accesder al dashboard

## Explicación técnica solución

El proyecto se basa en Next.js, Tailwind CSS, Shadcn UI, Supabase y Vercel.

### Autenticación y autorización: 
El cliente @supabase/ssr se encarga de la sesión del usuario, mientras que nexts se encarga de la proteccion de rutas mediante la validación de la sesión y el rol del usuario. tambien las acciones dentro de la app dependen del rol del usuario.
 - client: puede crear proyectos y ver los que ha creado
 - designer: puede ver los proyectos asigandos
 - manager: puede ver todos los proyectos, asignar diseñadores, editar datos de los proyectos y eliminarlos

### Manejo de archivos:
Por medio del id del proyecto, en un bucket previamente creado en supabase, se almacenan los archivos a una carpeta con el id del proyecto., luego estos se obtienen consultado el bucket y la carpeta con el id del proyecto.

### Base de datos:
Ademas de la tabla de auth.usuarios, hay otras tablas para el modelo de la solucion:
  - project
  - asignation
  - profile

Con estas tablas se manejan las asociaciones entre usuarios, proyectos y asignaciones.

En supabase, a nivel de base de datos, se manejan:
  - Funciones y triggers: para eventos especificos en la base de datos y efectos en otras tablas.
  - RLS: (Row Level Security) para controlar el acceso a las tablas segun el rol del usuario, por medio de politicas. (Por ejemplo, un manager puede ver todos los proyectos, pero un designer solo puede ver los suyos)



  

