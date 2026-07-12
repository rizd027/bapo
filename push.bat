@echo off
chcp 65001 > nul
echo.
echo ==========================================
echo   BA'PO Greenetix - GitHub Push Tool
echo ==========================================
echo.

cd /d "%~dp0"

:: Cek apakah ada perubahan
git status --porcelain > nul 2>&1
git status --short > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

git status --short | findstr /r "." > nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Tidak ada perubahan yang perlu di-push.
    echo.
    pause
    exit /b 0
)

:: Tampilkan file yang berubah
echo [INFO] File yang berubah:
git status --short
echo.

:: Minta pesan commit
set /p COMMIT_MSG="Masukkan pesan commit (tekan Enter untuk pesan default): "

if "%COMMIT_MSG%"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /format:list') do set DT=%%I
    set COMMIT_MSG=update: pembaruan %date% %time:~0,5%
)

echo.
echo [STEP 1/3] Menambahkan semua file...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menjalankan git add.
    pause
    exit /b 1
)

echo [STEP 2/3] Membuat commit: %COMMIT_MSG%
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo [ERROR] Gagal membuat commit.
    pause
    exit /b 1
)

echo [STEP 3/3] Mendorong ke GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] Gagal push ke GitHub. Pastikan koneksi internet aktif dan Anda sudah login.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   BERHASIL! Kode berhasil di-push ke:
echo   https://github.com/rizd027/bapo
echo ==========================================
echo.
pause
