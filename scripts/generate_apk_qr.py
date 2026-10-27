#!/usr/bin/env python3
"""Genera un QR PNG del enlace HTTPS público del APK, sin servicios externos.

Instalación: python3 -m pip install -r scripts/requirements-qr.txt
Uso: python3 scripts/generate_apk_qr.py --url URL_APK --output qr-apk.png
"""
import argparse
from pathlib import Path
from urllib.parse import urlparse

import qrcode


def generate(url: str, output: Path) -> None:
    parsed = urlparse(url)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Usa un enlace público HTTPS sin credenciales.')
    if output.suffix.lower() != '.png':
        raise ValueError('La salida debe ser un archivo PNG.')
    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M,
                       box_size=20, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    image = qr.make_image(fill_color='black', back_color='white').get_image().convert('RGB')
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, format='PNG', dpi=(300, 300))
    print(f'QR generado: {output.resolve()} ({image.width} x {image.height} px)')
    print(f'Destino: {url}')


def main() -> None:
    parser = argparse.ArgumentParser(description='Generar el QR de descarga del APK de MUSEUM X.')
    parser.add_argument('--url', required=True, help='URL HTTPS real del APK publicado.')
    parser.add_argument('--output', type=Path, default=Path('qr-apk.png'))
    args = parser.parse_args()
    generate(args.url, args.output)


if __name__ == '__main__':
    main()
