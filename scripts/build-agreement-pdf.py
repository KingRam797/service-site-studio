"""Snapshot the built terms page into the versioned agreement PDF."""
from pathlib import Path
from html import escape
from bs4 import BeautifulSoup
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root = Path(__file__).resolve().parents[1]
soup = BeautifulSoup((root / '.next/server/app/terms.html').read_text(), 'html.parser')
main = soup.find('main')
styles = getSampleStyleSheet()
pdfmetrics.registerFont(TTFont('AgreementSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
for style in styles.byName.values():
    style.fontName = 'AgreementSans'
styles['Heading2'].keepWithNext = True
styles['BodyText'].fontSize = 10
styles['BodyText'].leading = 15
styles['BodyText'].spaceAfter = 8
styles['Heading2'].textColor = HexColor('#124451')
story = [Paragraph('push2Start / Build Agreement', styles['Title']), Paragraph('Version 2026-09-20 | PainOrPane Professionals', styles['BodyText']), Spacer(1, 12)]
for node in main.find_all(['h2', 'p', 'li']):
    text = node.get_text(' ', strip=True)
    if not text or 'Download this build agreement' in text or text == 'Terms of service':
        continue
    text = text.replace('\u2013', '-').replace('\u2014', '-').replace('\u2260', 'is not')
    story.append(Paragraph(escape(('- ' if node.name == 'li' else '') + text), styles['Heading2' if node.name == 'h2' else 'BodyText']))
out = root / 'public/documents/push2start-agreement-2026-09-20.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
def footer(canvas, doc):
    canvas.setFont('Helvetica', 9)
    canvas.drawString(48, 30, 'push2startstudio.com | Agreement 2026-09-20')
    canvas.drawRightString(564, 30, str(doc.page))
SimpleDocTemplate(str(out), rightMargin=48, leftMargin=48, topMargin=48, bottomMargin=50).build(story, onFirstPage=footer, onLaterPages=footer)
print(out)
