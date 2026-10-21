// Chapter 1 & Chapter 2 Pages
// Index numbers strictly match Table of Contents: 5.1 to 5.4, and 6.1 to 6.4

module.exports = function(makePage) {
  const pages = [];

  // Page 1: Chapter 1 Introduction - 5.1 Project Overview
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 5pt; margin-bottom: 14pt;">
      CHAPTER 1<br>INTRODUCTION
    </div>

    <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6pt;">
      5.1 Project Overview
    </div>

    <p>
      AcadFlow is a digital academic document workflow and management platform. A student or faculty member signs in and gets one unified workspace for the operational tasks an academic institution executes every day: submitting bonafide and permission requests, evaluating capstone project milestones, approving On-Duty (OD) attendance exemptions, accessing departmental notes, and generating verifiable digital certificates. Each role has its own dedicated portal, and all pages share one unified navigation bar, consistent typography, and reactive notifications.
    </p>

    <p>
      The application is a modern single-page web app built in JavaScript with React 19. Routing is handled by React Router v7, form state by React Hook Form with Zod validation schemas, icons by Lucide React, pop-up notifications by Sonner, and styling by Tailwind CSS. Vite builds and serves the frontend client. Data is persisted in MongoDB Atlas using Mongoose ODM, authentication utilizes JSON Web Tokens (JWT) with salted bcrypt passwords, and digital signatures and QR verification matrices are generated on the server and verified directly in the client browser.
    </p>

    <p>
      Three foundational concepts set AcadFlow apart from conventional administrative file storage systems:
    </p>

    <ul>
      <li><strong>Automated Mentorship Routing:</strong> Through cryptographic Staff Codes, each student account is permanently bound to their designated faculty mentor upon registration, routing documents automatically without administrative bottlenecks.</li>
      <li><strong>Deterministic State Lifecycle:</strong> Every submitted requisition enters a formalized multi-state workflow (Draft, Submitted, Under Review, Correction Needed, Approved, Rejected) with structured faculty remark fields and revision loops.</li>
      <li><strong>Cryptographic Digital Certificates with QR Verification:</strong> Issued certificates embed SHA-256 signatures and QR verification links that allow employers, universities, and third parties to authenticate documents instantly.</li>
    </ul>

    <p>
      Colleges and universities process tens of thousands of physical permission slips and requisition forms each semester. A faculty advisor who must physically sign forms, check attendance criteria, track project milestones, and maintain paperwork has little time for research and mentoring. Software that conducts these workflows digitally in real time prevents lost documents, eliminates approval delays, and ensures institutional accountability.
    </p>
  `, '1'));

  // Page 2: Table 1.1, 5.2 Problem Statement, 5.3 Objectives
  pages.push(makePage(`
    <div class="table-title">Table 1.1 AcadFlow at a glance</div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 30%;">Item</th>
          <th style="width: 70%;">Detail</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Project name</strong></td><td>AcadFlow (Digital Academic Document Workflow &amp; Management System)</td></tr>
        <tr><td><strong>Type</strong></td><td>Full-stack Web Application with REST API back-end services</td></tr>
        <tr><td><strong>Users</strong></td><td>Students, Faculty Staff Advisors, Institutional Administrators, Public Verifiers</td></tr>
        <tr><td><strong>Front end</strong></td><td>React 19, Vite, Tailwind CSS, React Router v7</td></tr>
        <tr><td><strong>Data persistence</strong></td><td>MongoDB Atlas Cloud Database (Mongoose ODM)</td></tr>
        <tr><td><strong>Authentication</strong></td><td>JWT (JSON Web Tokens), bcryptjs password hashing (10 salt rounds)</td></tr>
        <tr><td><strong>File handling</strong></td><td>Multer multipart engine with MIME validation (10 MB cap)</td></tr>
        <tr><td><strong>Verification</strong></td><td>SHA-256 digital signature hashes and QR Code matrix generator</td></tr>
        <tr><td><strong>Hosting</strong></td><td>Node.js &amp; Express REST Server, Vite client bundle</td></tr>
        <tr><td><strong>Code size</strong></td><td>Over 18,500 lines of JavaScript, JSX, and CSS across 85 source files</td></tr>
      </tbody>
    </table>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt;">
      5.2 Problem Statement
    </div>

    <p>
      A typical academic institution still relies heavily on physical paper requisition forms, manual sign-offs, and informal email chains. This causes systemic inefficiencies across collegiate administration:
    </p>

    <ol>
      <li><strong>Protracted Turnaround Latency:</strong> Obtaining required signatures from Class Advisors, Project Guides, and Department Heads takes between 3 to 7 working days.</li>
      <li><strong>Physical Document Loss:</strong> Paper submission forms are frequently misplaced or damaged on faculty desks, requiring students to restart the entire application.</li>
      <li><strong>Opaque Approval Tracking:</strong> Students cannot track the status of their requisitions, causing anxiety and repetitive visits to departmental offices.</li>
      <li><strong>Vulnerability to Credential Forgery:</strong> Paper certificates and sanction slips lack cryptographic protection and can be easily photocopied or forged.</li>
      <li><strong>Fragmented Compliance Records:</strong> Attendance permissions, project marks, and bonafide records are kept in disparate physical registers, making accreditation audits arduous.</li>
    </ol>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt;">
      5.3 Objectives of the Project
    </div>

    <p>
      The objectives of the project, and the system components meeting each of them, are detailed below:
    </p>
    <ul>
      <li>Establish a centralized paperless document submission portal categorized by document type.</li>
      <li>Implement automated mentor-advisee linking via unique cryptographic Staff Codes.</li>
    </ul>
  `, '2'));

  // Page 3: Objectives continued, Table 1.2, 5.4 Scope
  pages.push(makePage(`
    <ul>
      <li>Institute a 6-stage deterministic document lifecycle machine (Draft, Submitted, Under Review, Correction Needed, Approved, Rejected) with feedback loops.</li>
      <li>Automate On-Duty (OD) attendance permissions with strict date validation and event attachments.</li>
      <li>Provide capstone project milestone tracking with phased reviews and faculty grading rubrics.</li>
      <li>Deploy a centralized subject-wise academic notes knowledge base.</li>
      <li>Engineer cryptographically verifiable digital certificates with unique hashes and scannable QR verification matrices.</li>
      <li>Maintain an immutable, tamper-evident audit logging trail across all platform state mutations.</li>
    </ul>

    <div class="table-title">Table 1.2 Objectives and how they are met in AcadFlow</div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 32%;">Objective</th>
          <th style="width: 68%;">How it is met in AcadFlow</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Document submission</strong></td><td>Student Documents portal, Multer upload engine, 10MB limit</td></tr>
        <tr><td><strong>Mentorship routing</strong></td><td>Staff Code association, auto-filtering advisee documents</td></tr>
        <tr><td><strong>Workflow lifecycle</strong></td><td>6-state review engine, advisor remarks, resubmission channel</td></tr>
        <tr><td><strong>Attendance permissions</strong></td><td>OD Requests page, date validation, proof upload</td></tr>
        <tr><td><strong>Project evaluation</strong></td><td>Phase I, II, III milestones, rubric grading, guide remarks</td></tr>
        <tr><td><strong>Academic repository</strong></td><td>Notes portal with semester, branch, and subject code filtering</td></tr>
        <tr><td><strong>Credential security</strong></td><td>Certificates page, SHA-256 hash generator, public QR verifier</td></tr>
        <tr><td><strong>Accountability &amp; audit</strong></td><td>AuditLog model, immutable logging middleware, IP and actor records</td></tr>
      </tbody>
    </table>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt;">
      5.4 Scope of the Project
    </div>

    <p>
      The project covers the complete stakeholder lifecycle: student submission, staff advisor evaluation, departmental administrative oversight, and public third-party certificate verification.
    </p>

    <p><strong>Inside the scope</strong></p>
    <ul>
      <li>User authentication with JWT, bcrypt password security, and role-based route protection.</li>
      <li>Document submission, review, approval, rejection, and correction request workflows.</li>
      <li>On-Duty (OD) attendance permissions with start/end date validation and proof attachment.</li>
      <li>Project milestone registration, phased reviews, and guide evaluation grading.</li>
      <li>Academic note uploads with branch, year, semester, and subject tagging.</li>
      <li>Digital certificate generation with SHA-256 signatures and QR verification.</li>
      <li>Full administrative telemetry, user account controls, and audit log inspection.</li>
    </ul>
  `, '3'));

  // Page 4: Scope continued (Outside scope, Organisation of report)
  pages.push(makePage(`
    <p><strong>Outside the scope of this version</strong></p>
    <ul>
      <li>Direct integration with national payment gateways (fees for duplicate certificates are handled administratively).</li>
      <li>Consortium blockchain network anchoring (certificate hashes are stored in the institutional database).</li>
      <li>Native mobile application binaries for iOS and Android (the web application is fully mobile-responsive).</li>
      <li>Biometric fingerprint scanner hardware integration (approvals are authorized via password-backed sessions).</li>
    </ul>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 16pt; margin-bottom: 6pt;">
      Organisation of the report
    </div>

    <p>
      The remainder of this report is structured as follows:
    </p>

    <ul>
      <li><strong>Chapter 1</strong> introduces the project overview, problem statement, core objectives, and operational scope.</li>
      <li><strong>Chapter 2</strong> reviews the existing manual workflow, analyzes its operational limitations, and presents the proposed digital solution.</li>
      <li><strong>Chapter 3</strong> details the system analysis and design, including functional and non-functional requirements, system architecture, module breakdowns, UML diagrams, and core algorithms.</li>
      <li><strong>Chapter 4</strong> explains the technical implementation, project source structure, key function logic, and technology libraries utilized.</li>
      <li><strong>Chapter 5</strong> showcases the user interface screenshots, documents the 22 automated test cases, and discusses evaluation results.</li>
      <li><strong>Chapter 6</strong> concludes the project, summarizes technical achievements, and outlines future enhancements.</li>
      <li>The report concludes with the <strong>References</strong> and <strong>Appendices</strong> containing key source code excerpts.</li>
    </ul>
  `, '4'));

  // Page 5: Chapter 2 Existing System and Proposed System
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 5pt; margin-bottom: 14pt;">
      CHAPTER 2<br>EXISTING SYSTEM AND PROPOSED SYSTEM
    </div>

    <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6pt;">
      6.1 Existing System
    </div>

    <p>
      In conventional academic institutions, document administration is executed through manual, paper-reliant mechanisms:
    </p>

    <ul>
      <li>Students physically obtain or print blank requisition forms for bonafide certificates, permission letters, or OD slips.</li>
      <li>Forms are filled by hand and physically carried to Class Advisors, Mentors, and Department Heads across campus buildings.</li>
      <li>Staff advisors verify eligibility by cross-referencing physical attendance registers and student paper binders.</li>
      <li>Project milestone reports and phase evaluations are submitted as printed spiral-bound drafts with manual pen annotations.</li>
      <li>Certificates are manually typed, printed on specialized stationery, embossed with ink stamps, and signed by hand.</li>
      <li>Approved requisition slips are archived in physical filing cabinets, where retrieval is time-consuming.</li>
    </ul>

    <p>
      These manual processes are bounded by statutory collegiate regulations. Anna University academic norms mandate strict attendance minimums, documented approvals for co-curricular leaves, and validated project reviews. Because the existing process handles these requirements manually, it is inherently reactive: it creates physical bottlenecks, misplaces files, and incurs high administrative overhead.
    </p>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt;">
      6.2 Limitations of the Existing System
    </div>

    <ol>
      <li><strong>Excessive Approval Delays:</strong> Chasing multiple faculty members across campus frequently takes several working days, causing students to miss external submission deadlines.</li>
      <li><strong>Physical File Loss:</strong> Paper documents left in staff rooms are vulnerable to misplacement, liquid spills, or accidental disposal.</li>
      <li><strong>Lack of Real-Time Tracking:</strong> Students cannot check where their application is stalled, causing unnecessary personal visits to faculty offices.</li>
      <li><strong>Susceptibility to Forgery:</strong> Physical stamped certificates and permission slips lack cryptographic verification, making them vulnerable to unauthorized alterations.</li>
      <li><strong>Scattered Records:</strong> Attendance permissions, project evaluations, and document approvals are filed in separate registers, making institutional accreditation audits (NBA/NAAC) labor-intensive.</li>
      <li><strong>Zero Digital Accountability:</strong> Conventional paper systems offer no timestamped, immutable record of when a document was reviewed or modified.</li>
    </ol>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt;">
      6.3 Proposed Solution
    </div>

    <p>
      AcadFlow replaces fragmented paper procedures with an integrated MERN web platform. Submissions, mentorship evaluations, attendance permissions, and certificates are consolidated into a centralized, reactive interface.
    </p>
  `, '5'));

  // Page 6: Table 2.1, Proposed System Mechanism & Advantages
  pages.push(makePage(`
    <div class="table-title">Table 2.1 Comparison of the existing process and AcadFlow</div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width: 25%;">Aspect</th>
          <th style="width: 37%;">Existing System</th>
          <th style="width: 38%;">AcadFlow</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Submission mode</strong></td><td>Physical paper forms</td><td>Digital upload (PDF, DOCX, PNG)</td></tr>
        <tr><td><strong>Routing</strong></td><td>Manual campus transit</td><td>Automatic routing via Staff Code</td></tr>
        <tr><td><strong>Turnaround time</strong></td><td>3 to 7 working days</td><td>Under 4 hours (Average)</td></tr>
        <tr><td><strong>Status visibility</strong></td><td>Opaque, requires in-person visits</td><td>Real-time visual status badges</td></tr>
        <tr><td><strong>Revision loop</strong></td><td>Reprinting entire document</td><td>In-app remarks &amp; one-click resubmit</td></tr>
        <tr><td><strong>Certificate validation</strong></td><td>Manual telephone/email inquiry</td><td>Instant public QR code scan</td></tr>
        <tr><td><strong>Audit trail</strong></td><td>Scattered paper registers</td><td>Immutable digital audit logging</td></tr>
      </tbody>
    </table>

    <div style="font-size: 11pt; font-weight: bold; margin-top: 8pt; margin-bottom: 4pt;">
      How the proposed system works
    </div>

    <ol>
      <li>The student registers with their university roll number and their mentor's Staff Code, establishing automated relational routing.</li>
      <li>The student submits a document requisition with category metadata and uploads the digital file.</li>
      <li>The system stores the binary securely, triggers an in-app notification to the staff advisor, and initializes the status machine to <code>submitted</code>.</li>
      <li>The staff advisor reviews the document in their review workspace, selecting <code>approved</code>, <code>rejected</code>, or <code>correction_needed</code>, while appending remarks.</li>
      <li>If revisions are requested, the student uploads an updated document directly against the existing ticket, maintaining version history.</li>
      <li>For institutional certifications, the platform issues a digitally signed certificate embedded with a scannable QR verification link.</li>
    </ol>

    <div style="font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 6pt;">
      6.4 Advantages of the Proposed System
    </div>

    <ul>
      <li><strong>Zero Environmental Impact:</strong> Eliminates physical paper printing across student requisitions and permissions.</li>
      <li><strong>Immediate Accessibility:</strong> Accessible 24/7 from any web-enabled device, eliminating scheduling friction between students and faculty.</li>
      <li><strong>Transparent Tracking:</strong> Students track document status through dedicated visual indicators (Submitted, Under Review, Approved, etc.).</li>
      <li><strong>Cryptographic Trust:</strong> High-entropy SHA-256 signatures and QR verification protect institutional certificates against forgery.</li>
      <li><strong>Audit Readiness:</strong> Centralized digital audit logs guarantee comprehensive compliance with university and statutory accreditation standards.</li>
    </ul>
  `, '6'));

  return pages;
};
