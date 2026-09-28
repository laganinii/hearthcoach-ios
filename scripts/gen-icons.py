#!/usr/bin/env python3
from pathlib import Path
import struct, zlib
RGB = (232, 93, 42)

def png(w, h, rgb):
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")

assets = Path(__file__).resolve().parents[1] / "assets"
assets.mkdir(exist_ok=True)
for name, size in [("icon.png",1024),("splash-icon.png",512),("adaptive-icon.png",1024),("favicon.png",48)]:
    (assets / name).write_bytes(png(size, size, RGB))
print("wrote", assets, RGB)
