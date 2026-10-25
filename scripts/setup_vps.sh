#!/bin/bash
set -e

# ==============================================================================
# ULASKAMI — SCRIPT OTOMATISASI SETUP VPS UBUNTU (DOCKER & DOCKER COMPOSE)
# ==============================================================================

echo "============================================================"
echo "    ULASKAMI — SETUP DEPLOYMENT VPS UBUNTU & DOCKER         "
echo "============================================================"
echo ""

# 1. Pastikan script dijalankan pada OS Linux Ubuntu/Debian
if ! command -v apt-get &> /dev/null; then
    echo "⚠️  Peringatan: Script ini dioptimalkan untuk sistem berbasis Debian/Ubuntu."
fi

# 2. Periksa & Pasang Docker jika belum terinstall
if ! command -v docker &> /dev/null; then
    echo "📦 [1/4] Docker belum terpasang. Memasang Docker Engine resmi..."
    sudo apt-get update -y
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER" 2>/dev/null || true
    echo "✓ Docker berhasil dipasang."
else
    echo "✓ [1/4] Docker sudah terpasang: $(docker --version)"
fi

# 3. Periksa Docker Compose
if ! docker compose version &> /dev/null; then
    echo "📦 [2/4] Memasang plugin Docker Compose..."
    sudo apt-get update -y && sudo apt-get install -y docker-compose-plugin
fi
echo "✓ [2/4] Docker Compose siap: $(docker compose version)"

# 4. Siapkan file .env jika belum ada
if [ ! -f .env ]; then
    echo "⚙️  [3/4] Menyiapkan file konfigurasi .env baru..."
    cp .env.example .env
    
    # Generate random session secret & db password
    RANDOM_SECRET=$(openssl rand -hex 24 2>/dev/null || date +%s%N | sha256sum | head -c 48)
    RANDOM_DB_PASS=$(openssl rand -hex 12 2>/dev/null || date +%s%N | sha256sum | head -c 24)
    
    sed -i "s/ganti_dengan_string_acak_rahasia_minimal_32_karakter_produksi/${RANDOM_SECRET}/g" .env
    sed -i "s/ganti_dengan_password_db_vps_yang_sangat_kuat/${RANDOM_DB_PASS}/g" .env
    echo "✓ File .env berhasil dibuat dengan kata kunci rahasia acak."
else
    echo "✓ [3/4] File .env sudah ada."
fi

# 5. Konfigurasi Firewall UFW
echo "🛡️  [4/4] Memeriksa status firewall UFW..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp >/dev/null 2>&1 || true
    sudo ufw allow 80/tcp >/dev/null 2>&1 || true
    sudo ufw allow 443/tcp >/dev/null 2>&1 || true
    sudo ufw allow 3000/tcp >/dev/null 2>&1 || true
    echo "✓ Port 22, 80, 443, dan 3000 telah diizinkan di firewall."
fi

echo ""
echo "============================================================"
echo "✓ SETUP SELESAI & LINGKUNGAN VPS TELAH SIAP!                 "
echo "============================================================"
echo "Jalankan perintah berikut untuk memulai kontainer:"
echo ""
echo "  1. Mode Port 3000 (Aplikasi + DB):"
echo "     docker compose up -d --build"
echo ""
echo "  2. Mode Otomatis HTTPS (Port 80/443 dengan domain Anda):"
echo "     docker compose --profile ssl up -d --build"
echo "============================================================"
