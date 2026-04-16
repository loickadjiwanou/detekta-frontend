# detekta-frontend — Deployment Guide

This guide covers production deployment of the **Detekta** frontend. Since this is a React application built with `create-react-app` + `craco`, it should be compiled into static assets and served via a high-performance web server or static hosting provider.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Environment](#build-environment)
- [Deployment Options](#deployment-options)
    - [Option 1: Static Hosting (Netlify/Vercel)](#option-1-static-hosting-netlifyvercel)
    - [Option 2: Linux VPS + Nginx](#option-2-linux-vps--nginx)
    - [Option 3: Dockerized Deployment](#option-3-dockerized-deployment)
- [Production Environment Variables](#production-environment-variables)
- [Verification & Smoke Test](#verification--smoke-test)
- [Optimization & Security](#optimization--security)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Access to the Detekta Backend API URL (HTTPS recommended).

---

## Build Environment

Always create a production build before deploying. This optimizes the bundle size, minifies the code, and generates source maps.

1.  **Environment Setup**: Ensure you have a `.env.production` file or set environment variables in your CI/CD pipeline.
    ```env
    REACT_APP_BACKEND_URL=https://api.yourdomain.com
    REACT_APP_ENV=production
    ```

2.  **Generate the Build**:
    ```bash
    yarn install
    yarn build
    ```
    This generates a `/build` directory with the static assets.

---

## Deployment Options

### Option 1: Static Hosting (Netlify/Vercel)

This is the easiest and most performant way to host the frontend.

1.  **Connect your repository** to Netlify or Vercel.
2.  **Configure build settings**:
    - **Build Command**: `npm run build` or `yarn build`
    - **Publish Directory**: `build`
3.  **Add Environment Variables** in the provider's dashboard:
    - `REACT_APP_BACKEND_URL`
4.  **Important: Configure Redirects** to support client-side routing.
    - **Netlify**: Add a `_redirects` file to the `public/` folder with:
      ```text
      /* /index.html 200
      ```
    - **Vercel**: Add a `vercel.json` with:
      ```json
      {
        "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
      }
      ```

### Option 2: Linux VPS + Nginx

Use this if you are hosting the backend on the same server or want full control.

1.  **Copy the build files** to the server:
    ```bash
    scp -r build/ detekta@your-server-ip:/var/www/detekta-frontend
    ```

2.  **Configure Nginx**:
    ```nginx
    server {
        listen 80;
        server_name app.yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name app.yourdomain.com;

        # SSL Configuration (Certbot automatically fills this)
        ssl_certificate /etc/letsencrypt/live/app.yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/app.yourdomain.com/privkey.pem;

        root /var/www/detekta-frontend;
        index index.html;

        # Gzip compression for performance
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml;

        # Routing: Redirect all requests to index.html (SPA support)
        location / {
            try_files $uri /index.html;
        }

        # Cache static assets for 1 year
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "geolocation=(), midi=(), sync-xhr=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), fullscreen=(self), payment=()" always;
    }
    ```

### Option 3: Dockerized Deployment

Create a `Dockerfile` in the `detekta-frontend/` directory:

```dockerfile
# Stage 1: Build
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Include your nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Production Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `REACT_APP_BACKEND_URL` | **Yes** | Base URL for the Backend API (no trailing slash) | `https://api.yourdomain.com` |
| `REACT_APP_ENV` | No | Build environment label | `production` |
| `REACT_APP_ENABLE_DEEP_SCAN` | No | Show the "Deep" scan depth option in the UI | `false` |
| `REACT_APP_ENABLE_MOBILE_AUDIT` | No | Enable the Mobile audit type | `true` |
| `REACT_APP_SENTRY_DSN` | No | Sentry error reporting DSN | `https://xxx@o0.ingest.sentry.io/0` |
| `REACT_APP_POSTHOG_KEY` | No | PostHog analytics key | `phc_xxxxxx` |

---

## Verification & Smoke Test

1.  **Check Connectivity**: Ensure the browser can reach `<REACT_APP_BACKEND_URL>/health`.
2.  **CORS Validation**: Check for `Access-Control-Allow-Origin` errors in the browser console. The backend `CORS_ORIGINS` setting must include your frontend domain (e.g. `https://app.yourdomain.com`).
3.  **Routing**: Refresh a deep link (e.g., `/audits`). If it returns a 404, the Nginx `try_files` or the hosting provider's redirect rule is not configured correctly.
4.  **WebSocket**: Open an audit detail page and confirm the live terminal connects. WebSocket traffic goes through the same Nginx proxy — ensure `Upgrade` and `Connection` headers are forwarded (see backend deployment guide).

---

## Optimization & Security

- **SSL/TLS**: Always serve the frontend via HTTPS to avoid Mixed Content errors.
- **CSP (Content Security Policy)**: Consider adding a CSP header to prevent XSS.
- **Lazy Loading**: Use `React.lazy()` for code-splitting larger routes to improve initial load time.
