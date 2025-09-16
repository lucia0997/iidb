@echo off
setlocal enabledelayedexpansion

set "PACKAGES_DIR=packages"
set "TARBALLS_DIR=builds"
set "LOG_FILE=builds\build.log"

REM Create log and traball folder 
if not exist "%TARBALLS_DIR%" mkdir "%TARBALLS_DIR%"
if not exist "%TARBALLS_DIR%" echo "Hola"
if not exist "%LOG_FILE%" type nul > "%LOG_FILE%"

for /d %%P in (%PACKAGES_DIR%\*) do (
    if exist "%%P\package.json" (

        REM Obtener nombre y versión
        set "PACKAGE_PATH=%%P"
        set "PACKAGE_PATH=!PACKAGE_PATH:\=/!"
        for /f "delims=" %%N in ('node -p "require(require('path').resolve('!PACKAGE_PATH!/package.json')).name"') do set NAME=%%N
        for /f "delims=" %%V in ('node -p "require(require('path').resolve('!PACKAGE_PATH!/package.json')).version"') do set VERSION=%%V

        REM Normalizar nombre (quitar @ y /)
        set "NAME=!NAME:@=!"
        set "NAME=!NAME:/=-!"

        set "DEST_DIR=%TARBALLS_DIR%\!NAME!"
        set "TARBALL_NAME=!NAME!-!VERSION!.tgz"
        set "TARBALL_PATH=!DEST_DIR!\!TARBALL_NAME!"

        if not exist "!DEST_DIR!" mkdir "!DEST_DIR!"

        if exist "!TARBALL_PATH!" (
            echo !TARBALL_NAME! already exists. Skipping...
        ) else (
            echo Building !NAME!@!VERSION!...
            pushd "%%P" > nul
            call npm pack --pack-destination "..\..\!TARBALLS_DIR!\!NAME!" > nul
            popd > nul

            if exist "!TARBALL_PATH!" (
                echo Saved to !TARBALL_PATH!
                echo "[%DATE% %TIME%] | !NAME!@!VERSION! | !TARBALL_PATH!" >> "!LOG_FILE!"
            ) else (
                echo Failed to build !NAME!@!VERSION!
            )
        )
    )
)
