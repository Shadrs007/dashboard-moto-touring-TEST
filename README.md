# MOTO ROAM Landing Page - Coolify Deployment Guide

## Berkas Proyek
- `index.html`: Landing page utama
- `styles.css`: Gaya dan animasi CSS
- `script.js`: Logika interaktif JavaScript
- `Dockerfile`: Image Nginx Alpine ringan untuk Coolify / Docker
- `docker-compose.yml`: Konfigurasi container service

## Cara Deploy ke Coolify (Homelab)

### Opsi 1: Lewat Git Repository (GitHub / Gitea) - Paling Disarankan
1. Buat repository baru di GitHub / Gitea (misal: `moto-landing`).
2. Upload semua file dalam folder ini ke repository tersebut.
3. Buka Dashboard **Coolify** Anda:
   - Klik **Projects** -> Pilih Project / Environment.
   - Klik **+ New Resource** -> **Application**.
   - Pilih **Public Repository** (atau Private jika sudah connect GitHub App).
   - Masukkan URL repo Anda (contoh: `https://github.com/username/moto-landing`).
   - Pilih **Build Pack**: **Dockerfile** (otomatis terdeteksi).
   - Masukkan **FQDN / Domain** (contoh: `https://moto.homelab.local` atau domain publik Anda).
   - Port: `80`.
   - Klik **Deploy**!

### Opsi 2: Langsung via Docker Compose di Coolify
1. Buka Dashboard **Coolify**.
2. Klik **+ New Resource** -> **Docker Compose**.
3. Paste isi `docker-compose.yml` atau gunakan static web image.
4. Set domain dan klik **Deploy**.
