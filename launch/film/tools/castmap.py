"""Save the Veil lab cast-map canvas for each sample as a transparent PNG. Usage: python tools/castmap.py (dev server on :3210)."""
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parents[1] / "assets" / "app"
with sync_playwright() as p:
    page = p.chromium.launch().new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3210/lab")
    for i, sample in enumerate(["elder", "portrait", "market", "freckles"]):
        page.get_by_role("button", name=f"Sample {i + 1}").click()
        page.wait_for_timeout(2500)
        page.get_by_role("button", name="Cast map").click()
        page.wait_for_timeout(1500)
        url = page.evaluate("document.querySelector('figure').querySelectorAll('canvas')[1].toDataURL()")
        (OUT / f"{sample}-castmap.png").write_bytes(base64.b64decode(url.split(",")[1]))
        print(sample)
