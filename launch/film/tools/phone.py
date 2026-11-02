"""Capture the live camera flow on a phone viewport with a fake camera feed of sample 1.

Usage: python tools/phone.py <feed.y4m>   (dev server on :3210, mock YouCam on :4010). Writes assets/app/phone-*.png.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parents[1] / "assets" / "app"
feed = sys.argv[1]
with sync_playwright() as p:
    browser = p.chromium.launch(args=["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", f"--use-file-for-fake-video-capture={feed}"])
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True, permissions=["camera"])
    page = ctx.new_page()
    page.add_init_script("addEventListener('DOMContentLoaded', () => document.head.append(Object.assign(document.createElement('style'), {textContent: 'nextjs-portal{display:none!important}'})))")
    page.goto("http://localhost:3210/lab/live")
    page.wait_for_timeout(3000)
    page.screenshot(path=OUT / "phone-bare.png")
    page.get_by_role("button", name="Take the bare photo").click()
    page.wait_for_timeout(1600)
    page.screenshot(path=OUT / "phone-centre.png")
    page.wait_for_timeout(2600)
    page.screenshot(path=OUT / "phone-ready.png")
    page.get_by_role("button", name="Take the photo").click()
    page.wait_for_timeout(9000)
    page.screenshot(path=OUT / "phone-swipe.png")
    browser.close()
print("ok")
