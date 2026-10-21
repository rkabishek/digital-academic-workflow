const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const INPUT_HTML = path.join(__dirname, 'AcadFlow_Final_Project_Report.html');
const OUTPUT_PDF = path.join(__dirname, 'AcadFlow_Final_Project_Report.pdf');

(async () => {
  try {
    if (!fs.existsSync(INPUT_HTML)) {
      throw new Error(`Input HTML file not found: ${INPUT_HTML}`);
    }

    console.log('[1/2] Launching Microsoft Edge via puppeteer-core...');
    const browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    const htmlUrl = 'file:///' + INPUT_HTML.replace(/\\/g, '/');
    console.log(`[1/2] Loading document from: ${htmlUrl}`);
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

    console.log('[2/2] Printing high-resolution PDF report with 1-inch margins and Times New Roman...');
    await page.pdf({
      path: OUTPUT_PDF,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1in',
        bottom: '1in',
        left: '1in',
        right: '1in'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Times New Roman', serif; font-size: 8pt; width: 100%; padding: 0 1in; display: flex; justify-content: space-between; color: #555555; border-bottom: 0.5pt solid #cccccc; padding-bottom: 2px;">
          <span>AcadFlow: Digital Academic Document Workflow &amp; Management System</span>
          <span>Department of Computer Science &amp; Engineering</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-family: 'Times New Roman', serif; font-size: 9pt; width: 100%; padding: 0 1in; display: flex; justify-content: space-between; color: #444444; border-top: 0.5pt solid #cccccc; padding-top: 3px;">
          <span>Easwari Engineering College (Autonomous), Chennai</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `
    });

    await browser.close();

    const stats = fs.statSync(OUTPUT_PDF);
    console.log(`\n======================================================`);
    console.log(`SUCCESS! Project documentation PDF created:`);
    console.log(`File: ${OUTPUT_PDF}`);
    console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('Error rendering PDF:', err);
    process.exit(1);
  }
})();
