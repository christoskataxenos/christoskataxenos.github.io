import re
import os
import subprocess
import yaml
import ast
import tempfile
import shutil

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(EDGE_PATH):
    EDGE_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def parse_mdx(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    frontmatter = {}
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = yaml.safe_load(parts[1])
            body = parts[2]

    return frontmatter, body

def md_snippet_to_html(md_text):
    proc = subprocess.run(
        ["pandoc", "-f", "markdown+raw_html", "-t", "html"],
        input=md_text.strip(),
        capture_output=True,
        text=True,
        encoding="utf-8"
    )
    return proc.stdout.strip()

def transform_stats(match):
    attrs = match.group(1)
    panic = re.search(r'panicLevel=\{?(\d+)\}?', attrs)
    freddos = re.search(r'freddos=\{?(\d+)\}?', attrs)
    redbulls = re.search(r'redbulls=\{?(\d+)\}?', attrs)
    hours = re.search(r'hoursSpent=\{?(\d+)\}?', attrs)

    panic_val = panic.group(1) if panic else "95"
    freddo_val = freddos.group(1) if freddos else "18"
    redbull_val = redbulls.group(1) if redbulls else "5"
    hours_val = hours.group(1) if hours else "38"

    return f"""
<div class="stats-grid">
  <div class="stat-card panic">
    <div class="stat-header">Panic Level</div>
    <div class="stat-num">{panic_val}%</div>
    <div class="stat-bar"><div class="stat-fill" style="width: {panic_val}%"></div></div>
  </div>
  <div class="stat-card">
    <div class="stat-header">Freddo Espressos</div>
    <div class="stat-num">{freddo_val} <span class="stat-unit">cups</span></div>
    <div class="stat-sub">High-octane fuel</div>
  </div>
  <div class="stat-card">
    <div class="stat-header">Red Bulls</div>
    <div class="stat-num">{redbull_val} <span class="stat-unit">cans</span></div>
    <div class="stat-sub">Late-night survival</div>
  </div>
  <div class="stat-card">
    <div class="stat-header">Investigation Time</div>
    <div class="stat-num">{hours_val} <span class="stat-unit">hours</span></div>
    <div class="stat-sub">Total triage dwell</div>
  </div>
</div>
"""

def transform_callout(match):
    c_type = match.group(1) or "info"
    title = match.group(2) or ""
    body = match.group(3) or ""

    icons = {
        "danger": "🚨",
        "warning": "⚠️",
        "info": "ℹ️",
        "success": "🎯"
    }
    icon = icons.get(c_type, "📌")
    body_html = md_snippet_to_html(body)

    return f"""
<div class="callout callout-{c_type}">
  <div class="callout-header">
    <span class="callout-icon">{icon}</span>
    <span class="callout-title">{title}</span>
  </div>
  <div class="callout-body">
    {body_html}
  </div>
</div>
"""

def transform_terminal(match):
    title = match.group(1) or "Terminal Investigation"
    code_content = match.group(2) or ""
    code_clean = re.sub(r'^(powershell|bash|sh|cmd)\n', '', code_content.strip())
    code_clean = code_clean.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    return f"""
<div class="terminal-box">
  <div class="terminal-bar">
    <div class="terminal-dots">
      <span class="t-dot red"></span>
      <span class="t-dot yellow"></span>
      <span class="t-dot green"></span>
    </div>
    <div class="terminal-title">{title}</div>
  </div>
  <pre class="terminal-pre"><code>{code_clean}</code></pre>
</div>
"""

def transform_comparison_table(match):
    h_str = match.group(1).strip()
    r_str = match.group(2).strip()

    try:
        headers = ast.literal_eval(h_str)
        rows = ast.literal_eval(r_str)
    except Exception as e:
        print("Error parsing comparison table:", e)
        return ""

    th_html = "".join(f"<th>{h}</th>" for h in headers)
    tr_html = ""
    for r in rows:
        td_html = "".join(f"<td>{c}</td>" for c in r)
        tr_html += f"<tr>{td_html}</tr>\n"

    return f"""
<div class="table-container">
  <table class="report-table comparison-table">
    <thead>
      <tr>{th_html}</tr>
    </thead>
    <tbody>
      {tr_html}
    </tbody>
  </table>
</div>
"""

def mdx_to_html(mdx_path, lang="el"):
    fm, body = parse_mdx(mdx_path)

    # 1. Transform Stats
    body = re.sub(r'<Stats\s+([^>]+)/>', transform_stats, body)

    # 2. Transform ComparisonTable
    body = re.sub(
        r'<ComparisonTable\s+headers=\{([^}]+)\}\s+rows=\{([^}]+\]\s*\])\}\s*/>',
        transform_comparison_table,
        body,
        flags=re.DOTALL
    )

    # 3. Transform Terminal
    body = re.sub(
        r'<Terminal\s+title="([^"]*)">\s*```[a-zA-Z]*\n(.*?)\n```\s*</Terminal>',
        transform_terminal,
        body,
        flags=re.DOTALL
    )

    # 4. Transform Callouts
    body = re.sub(
        r'<Callout\s+type="([^"]*)"\s+title="([^"]*)">\s*(.*?)\s*</Callout>',
        transform_callout,
        body,
        flags=re.DOTALL
    )

    # Run pandoc to convert remaining markdown to HTML
    proc = subprocess.Popen(
        ["pandoc", "-f", "markdown+raw_html+pipe_tables", "-t", "html"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8"
    )
    html_content, err = proc.communicate(input=body)
    if proc.returncode != 0:
        raise RuntimeError(f"Pandoc error: {err}")

    # Build master template
    title = fm.get("title", "Incident Response Report")
    date = fm.get("date", "2026-10-31")
    description = fm.get("description", "")
    tags = fm.get("tags", [])
    tag_badges = "".join(f'<span class="tag-badge">#{t}</span>' for t in tags)

    doc_type = "FORENSIC INCIDENT REPORT & POST-MORTEM" if lang == "en" else "ΕΚΘΕΣΗ ΑΝΑΛΥΣΗΣ ΠΕΡΙΣΤΑΤΙΚΟΥ (POST-MORTEM)"
    author_label = "Author & Lead Investigator" if lang == "en" else "Συντάκτης & Ερευνητής"
    date_label = "Incident Close Date" if lang == "en" else "Ημερομηνία Ολοκλήρωσης Ελέγχου"
    status_label = "Classification: PUBLIC / TLP:CLEAR" if lang == "en" else "Διαβάθμιση: ΔΗΜΟΣΙΑ / TLP:CLEAR"

    header_watermark = "CHRISTOS KATAXENOS | INCIDENT RESPONSE: ROGUE BROWSER EXTENSION" if lang == "en" else "ΧΡΗΣΤΟΣ ΚΑΤΑΞΕΝΟΣ | INCIDENT RESPONSE: ROGUE BROWSER EXTENSION"
    footer_text = "https://christoskataxenos.com | TECHNICAL POST-MORTEM ARCHIVE" if lang == "en" else "https://christoskataxenos.com | ΤΕΧΝΙΚΟ ΑΡΧΕΙΟ POST-MORTEM"

    full_html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  @page {{
    size: A4;
    margin: 20mm 16mm 22mm 16mm;
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.6;
    font-size: 13.5px;
    margin: 0;
    padding: 0;
  }}

  /* Fixed Running Header and Footer for Print */
  .running-header {{
    position: fixed;
    top: -14mm;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    font-size: 8.5px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 3px;
    font-family: ui-monospace, monospace;
  }}

  .running-footer {{
    position: fixed;
    bottom: -15mm;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    font-size: 8.5px;
    font-weight: 600;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
    font-family: ui-monospace, monospace;
  }}

  /* Executive Header */
  .report-header {{
    border-bottom: 2px solid #0f172a;
    padding-bottom: 18px;
    margin-bottom: 22px;
  }}

  .report-badge {{
    display: inline-block;
    background: #0f172a;
    color: #f8fafc;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
  }}

  .report-status {{
    float: right;
    font-size: 10px;
    font-weight: 600;
    color: #059669;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    padding: 3px 8px;
    border-radius: 4px;
  }}

  h1.report-title {{
    font-size: 23px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.28;
    margin: 8px 0 12px 0;
  }}

  .report-meta-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 11px;
    margin-bottom: 12px;
  }}

  .meta-item .meta-label {{
    color: #64748b;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 9.5px;
    letter-spacing: 0.5px;
  }}

  .meta-item .meta-value {{
    color: #0f172a;
    font-weight: 600;
    margin-top: 2px;
  }}

  .report-summary {{
    background: #f1f5f9;
    border-left: 3px solid #3b82f6;
    padding: 10px 14px;
    border-radius: 0 4px 4px 0;
    font-size: 12px;
    color: #334155;
    margin-bottom: 12px;
    font-style: italic;
  }}

  .tag-container {{
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }}

  .tag-badge {{
    background: #e2e8f0;
    color: #475569;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 3px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }}

  /* Typography */
  h2 {{
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 5px;
    margin-top: 24px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }}

  h3 {{
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 16px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }}

  p {{
    margin-top: 0;
    margin-bottom: 10px;
    text-align: justify;
  }}

  ul, ol {{
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  strong {{
    color: #0f172a;
    font-weight: 600;
  }}

  blockquote {{
    margin: 12px 0;
    padding: 8px 14px;
    background: #f8fafc;
    border-left: 3px solid #94a1b2;
    color: #475569;
    font-style: italic;
    page-break-inside: avoid;
  }}

  hr {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
  }}

  a {{
    color: #2563eb;
    text-decoration: none;
  }}

  code {{
    font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
    font-size: 11.5px;
    background: #f1f5f9;
    color: #0f172a;
    padding: 1px 4px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
  }}

  pre {{
    font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
    font-size: 11px;
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-x: auto;
    line-height: 1.45;
    margin: 12px 0;
    page-break-inside: avoid;
  }}

  pre code {{
    background: transparent;
    color: inherit;
    border: none;
    padding: 0;
    font-size: inherit;
  }}

  /* Stats Cards */
  .stats-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 16px 0 20px 0;
    page-break-inside: avoid;
  }}

  .stat-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
  }}

  .stat-card.panic {{
    border-color: #fca5a5;
    background: #fef2f2;
  }}

  .stat-card .stat-header {{
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}

  .stat-card.panic .stat-header {{
    color: #b91c1c;
  }}

  .stat-card .stat-num {{
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 4px;
    line-height: 1.1;
  }}

  .stat-card.panic .stat-num {{
    color: #dc2626;
  }}

  .stat-card .stat-unit {{
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
  }}

  .stat-card .stat-sub {{
    font-size: 10px;
    color: #64748b;
    margin-top: 3px;
  }}

  .stat-bar {{
    width: 100%;
    height: 6px;
    background: #fee2e2;
    border-radius: 3px;
    margin-top: 6px;
    overflow: hidden;
  }}

  .stat-fill {{
    height: 100%;
    background: #ef4444;
    border-radius: 3px;
  }}

  /* Callout Component */
  .callout {{
    margin: 14px 0;
    border-radius: 6px;
    padding: 12px 14px;
    page-break-inside: avoid;
    border: 1px solid transparent;
  }}

  .callout-danger {{
    background: #fef2f2;
    border-color: #fecaca;
    border-left: 4px solid #ef4444;
  }}

  .callout-warning {{
    background: #fffbeb;
    border-color: #fde68a;
    border-left: 4px solid #f59e0b;
  }}

  .callout-info {{
    background: #f0f9ff;
    border-color: #bae6fd;
    border-left: 4px solid #0284c7;
  }}

  .callout-success {{
    background: #f0fdf4;
    border-color: #bbf7d0;
    border-left: 4px solid #10b981;
  }}

  .callout-header {{
    font-weight: 700;
    font-size: 12.5px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}

  .callout-danger .callout-header {{ color: #991b1b; }}
  .callout-warning .callout-header {{ color: #92400e; }}
  .callout-info .callout-header {{ color: #075985; }}
  .callout-success .callout-header {{ color: #065f46; }}

  .callout-body {{
    font-size: 12px;
    color: #334155;
    line-height: 1.5;
  }}

  .callout-body p:last-child {{
    margin-bottom: 0;
  }}

  /* Terminal Mockup */
  .terminal-box {{
    background: #0f172a;
    border-radius: 6px;
    margin: 14px 0;
    overflow: hidden;
    page-break-inside: avoid;
    border: 1px solid #1e293b;
  }}

  .terminal-bar {{
    background: #1e293b;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}

  .terminal-dots {{
    display: flex;
    gap: 5px;
  }}

  .t-dot {{
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
  }}

  .t-dot.red {{ background: #ef4444; }}
  .t-dot.yellow {{ background: #f59e0b; }}
  .t-dot.green {{ background: #10b981; }}

  .terminal-title {{
    color: #94a3b8;
    font-size: 10.5px;
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-weight: 600;
  }}

  .terminal-pre {{
    margin: 0;
    padding: 10px 12px;
    background: transparent;
    font-size: 10.5px;
    color: #e2e8f0;
    line-height: 1.4;
  }}

  /* Tables */
  .table-container {{
    margin: 14px 0;
    overflow-x: auto;
    page-break-inside: avoid;
  }}

  table, .report-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
    border: 1px solid #cbd5e1;
    margin: 12px 0;
    page-break-inside: avoid;
  }}

  th {{
    background: #0f172a;
    color: #f8fafc;
    font-weight: 600;
    padding: 7px 10px;
    text-align: left;
    border: 1px solid #334155;
  }}

  td {{
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    color: #334155;
  }}

  tr:nth-child(even) td {{
    background: #f8fafc;
  }}

  /* Print specific */
  @media print {{
    body {{
      font-size: 12.5px;
    }}
    .stats-grid {{
      margin: 12px 0 16px 0;
    }}
    h1.report-title {{
      font-size: 20px;
    }}
    h2 {{
      font-size: 15px;
      margin-top: 20px;
    }}
  }}
</style>
</head>
<body>

<div class="running-header">
  <span>{header_watermark}</span>
  <span>TLP:CLEAR / INCIDENT REPORT</span>
</div>

<div class="running-footer">
  <span>{footer_text}</span>
  <span>CHRISTOS KATAXENOS</span>
</div>

<header class="report-header">
  <div class="report-status">{status_label}</div>
  <div class="report-badge">{doc_type}</div>
  <h1 class="report-title">{title}</h1>

  <div class="report-meta-grid">
    <div class="meta-item">
      <div class="meta-label">{author_label}</div>
      <div class="meta-value">Christos Kataxenos (christoskataxenos.com)</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">{date_label}</div>
      <div class="meta-value">{date}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">System / Architecture</div>
      <div class="meta-value">Chromium / Windows 11 / Debian / Android</div>
    </div>
  </div>

  <div class="report-summary">
    <strong>Executive Summary:</strong> {description}
  </div>

  <div class="tag-container">
    {tag_badges}
  </div>
</header>

<main class="report-content">
  {html_content}
</main>

</body>
</html>"""

    return full_html

def convert_html_to_pdf(html_str, output_pdf_path):
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as temp_html:
        temp_html.write(html_str)
        temp_html_path = temp_html.name

    temp_pdf = os.path.join(tempfile.gettempdir(), f"render_{os.getpid()}.pdf")

    try:
        file_url = "file:///" + temp_html_path.replace("\\", "/")
        cmd = [
            EDGE_PATH,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={temp_pdf}",
            file_url
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        if os.path.exists(temp_pdf):
            shutil.copy2(temp_pdf, output_pdf_path)
            print(f"Generated PDF successfully: {output_pdf_path} ({os.path.getsize(output_pdf_path)} bytes)")
        else:
            raise RuntimeError(f"Output PDF not created. Stderr: {res.stderr}")
    finally:
        if os.path.exists(temp_html_path):
            os.remove(temp_html_path)
        if os.path.exists(temp_pdf):
            os.remove(temp_pdf)

def main():
    greek_mdx = os.path.join(BASE_DIR, "content", "posts", "rogue-browser-extension-incident-response.mdx")
    greek_pdf = os.path.join(BASE_DIR, "rogue-browser-extension-incident-response.pdf")

    print("Building Greek PDF report...")
    greek_html = mdx_to_html(greek_mdx, lang="el")
    convert_html_to_pdf(greek_html, greek_pdf)

    english_mdx = os.path.join(BASE_DIR, "content", "posts", "en", "rogue-browser-extension-incident-response.mdx")
    english_pdf = os.path.join(BASE_DIR, "rogue-browser-extension-incident-response-en.pdf")
    if os.path.exists(english_mdx):
        print("Building English PDF report...")
        english_html = mdx_to_html(english_mdx, lang="en")
        convert_html_to_pdf(english_html, english_pdf)

if __name__ == "__main__":
    main()
