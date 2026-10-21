/**
 * AcadFlow Final Project Documentation Report Generator
 * Formatted strictly following the Easwari Engineering College Demo Document
 * (Double border frame, exact TOC section numbering: 5.1, 5.2, 6.1, 7.1..., College Logo,
 *  Times New Roman 12pt, 1-inch margins, justified text, code boxes, UML diagrams, test cases)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_HTML = path.join(__dirname, 'AcadFlow_Reference_Compliant_Report.html');
const OUTPUT_PDF = path.join(__dirname, 'AcadFlow_Reference_Compliant_Report.pdf');

// Official Easwari Engineering College Crest SVG
const collegeLogoSvg = (size = 115) => `
<svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="txtArcTop" d="M 24,100 A 76,76 0 0,1 176,100" fill="none" />
    <path id="txtArcSub" d="M 38,100 A 62,62 0 0,1 162,100" fill="none" />
    <path id="txtArcBot" d="M 166,105 A 73,73 0 0,1 34,105" fill="none" />
    <linearGradient id="shieldGradRef" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0060a8" />
      <stop offset="50%" stop-color="#007acc" />
      <stop offset="100%" stop-color="#004d80" />
    </linearGradient>
    <linearGradient id="goldGradRef" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd700" />
      <stop offset="100%" stop-color="#daa520" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="96" fill="#ffffff" stroke="#1b5e20" stroke-width="5.5" />
  <circle cx="100" cy="100" r="90" fill="none" stroke="#ffd700" stroke-width="2" />
  <circle cx="100" cy="100" r="70" fill="#f4fbf5" stroke="#1b5e20" stroke-width="2.5" />
  <text font-family="'Times New Roman', serif" font-size="11.5" font-weight="bold" fill="#1b5e20" letter-spacing="1.2">
    <textPath href="#txtArcTop" startOffset="50%" text-anchor="middle">EASWARI ENGINEERING COLLEGE</textPath>
  </text>
  <text font-family="'Times New Roman', serif" font-size="8.5" font-weight="bold" fill="#d32f2f" letter-spacing="1.8">
    <textPath href="#txtArcSub" startOffset="50%" text-anchor="middle">EDUCATE AND EXCEL</textPath>
  </text>
  <text font-family="'Times New Roman', serif" font-size="10.5" font-weight="bold" fill="#1b5e20" letter-spacing="2.5">
    <textPath href="#txtArcBot" startOffset="50%" text-anchor="middle">AUTONOMOUS</textPath>
  </text>
  <polygon points="26,105 28,100 33,100 29,97 31,92 26,95 21,92 23,97 19,100 24,100" fill="#ffd700" />
  <polygon points="174,105 176,100 181,100 177,97 179,92 174,95 169,92 171,97 167,100 172,100" fill="#ffd700" />
  <g transform="translate(62, 54) scale(0.76)">
    <path d="M 50 0 L 95 15 C 95 65 50 95 50 95 C 50 95 5 65 5 15 Z" fill="url(#shieldGradRef)" stroke="#1b5e20" stroke-width="3" />
    <rect x="18" y="22" width="64" height="22" rx="3" fill="url(#goldGradRef)" stroke="#b8860b" stroke-width="1.5" />
    <text x="50" y="38" font-family="'Arial', sans-serif" font-size="14" font-weight="900" fill="#1a237e" text-anchor="middle" letter-spacing="1">SRM</text>
    <path d="M 28 58 Q 50 52 50 64 Q 50 52 72 58 L 72 72 Q 50 66 50 78 Q 50 66 28 72 Z" fill="#ffffff" stroke="#ffd700" stroke-width="1.5" />
    <path d="M 50 46 C 45 42 46 38 50 35 C 54 38 55 42 50 46 Z" fill="#ff5722" />
  </g>
</svg>
`;

const makePage = (content, pageNum = '') => `
  <div class="page">
    <div class="page-content">
      ${content}
    </div>
    ${pageNum ? `<div class="page-num">${pageNum}</div>` : ''}
  </div>
`;

// Helper for CSS styles
const styles = `
  <style>
    @page {
      size: A4;
      margin: 0.55in;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #000000;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    p {
      text-align: justify;
      text-justify: inter-word;
      margin-top: 0;
      margin-bottom: 8pt;
    }
    .page {
      page-break-after: always;
      break-after: page;
      box-sizing: border-box;
      width: 100%;
      min-height: 10.45in;
      border: 1px solid #111;
      outline: 2px solid #111;
      outline-offset: 3.5px;
      padding: 22px 26px;
      position: relative;
      background: #ffffff;
    }
    .page-num {
      position: absolute;
      bottom: 12px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 10pt;
      font-family: 'Times New Roman', serif;
    }
    h1 {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      margin-top: 10pt;
      margin-bottom: 12pt;
      letter-spacing: 0.5pt;
    }
    h2 {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    h3 {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      font-weight: bold;
      margin-top: 8pt;
      margin-bottom: 4pt;
    }
    table.report-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0 12pt 0;
      font-size: 9.5pt;
    }
    table.report-table th, table.report-table td {
      border: 1px solid #000;
      padding: 4.5pt 6pt;
      text-align: left;
    }
    table.report-table th {
      background: #f4f6f8;
      font-weight: bold;
      text-align: center;
    }
    .table-title {
      font-weight: bold;
      text-align: center;
      font-size: 10.5pt;
      margin-bottom: 4pt;
    }
    .fig-container {
      text-align: center;
      margin: 8pt 0;
    }
    .fig-caption {
      font-weight: bold;
      text-align: center;
      font-size: 10pt;
      margin-top: 4pt;
    }
    .code-box {
      border: 1px solid #333;
      background: #fdfdfd;
      padding: 6pt 8pt;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8pt;
      line-height: 1.3;
      white-space: pre-wrap;
      word-wrap: break-word;
      border-radius: 2pt;
      margin: 6pt 0 10pt 0;
      color: #111;
    }
    ul, ol {
      margin-top: 2pt;
      margin-bottom: 8pt;
      padding-left: 20pt;
      text-align: justify;
    }
    li {
      margin-bottom: 3pt;
      line-height: 1.4;
    }
    .cover-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      min-height: 9.9in;
      box-sizing: border-box;
      padding-top: 10pt;
      padding-bottom: 10pt;
    }
  </style>
`;
