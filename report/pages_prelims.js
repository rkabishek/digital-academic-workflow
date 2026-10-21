// Preliminary Pages: Cover, Bonafide, Viva-Voce, Acknowledgement, TOC, Abstract, Lists

module.exports = function(logoSvg, makePage) {
  const pages = [];

  // Page: Title / Cover
  pages.push(makePage(`
    <div class="cover-container">
      <div style="font-size: 15pt; font-weight: bold; text-transform: uppercase; line-height: 1.4; margin-top: 10pt;">
        ACADFLOW: DIGITAL ACADEMIC DOCUMENT WORKFLOW &amp; MANAGEMENT SYSTEM
      </div>
      
      <div style="font-size: 12pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 25pt;">
        A PROJECT REPORT
      </div>

      <div style="font-size: 11pt; margin-top: 25pt; line-height: 1.6;">
        Submitted by<br><br>
        <span style="font-size: 12pt; font-weight: bold;">Mohammed Rayyan L (310621104055)</span>
      </div>

      <div style="font-size: 11pt; font-style: italic; margin-top: 25pt; line-height: 1.6;">
        in partial fulfillment for the award of the Degree<br>
        of<br>
        <span style="font-size: 12pt; font-weight: bold; font-style: normal;">BACHELOR OF ENGINEERING</span><br>
        in<br>
        <span style="font-size: 12pt; font-weight: bold; font-style: normal;">COMPUTER SCIENCE AND ENGINEERING</span>
      </div>

      <div style="margin: 20pt 0;">
        ${logoSvg(130)}
      </div>

      <div style="font-size: 12pt; font-weight: bold; line-height: 1.5; text-transform: uppercase;">
        EASWARI ENGINEERING COLLEGE,<br>
        <span style="font-size: 10.5pt; font-weight: normal;">(AN AUTONOMOUS INSTITUTION)</span><br>
        AFFILIATED TO ANNA UNIVERSITY,<br>
        CHENNAI
      </div>

      <div style="font-size: 11pt; font-weight: bold; margin-bottom: 10pt; margin-top: 20pt;">
        OCTOBER 2026
      </div>
    </div>
  `, ''));

  // Page: Bonafide Certificate
  pages.push(makePage(`
    <div style="display: flex; align-items: center; justify-content: center; gap: 15pt; margin-top: 10pt; margin-bottom: 25pt;">
      <div>${logoSvg(65)}</div>
      <div style="font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt;">EASWARI ENGINEERING COLLEGE</div>
    </div>

    <div style="text-align: center; font-size: 13pt; font-weight: bold; letter-spacing: 0.5pt; margin-bottom: 35pt;">
      BONAFIDE CERTIFICATE
    </div>

    <p style="line-height: 2.0; text-align: justify; margin-bottom: 90pt;">
      Certified that this mini project report titled <strong>“ACADFLOW: DIGITAL ACADEMIC DOCUMENT WORKFLOW &amp; MANAGEMENT SYSTEM”</strong> is the Bonafide work of <strong>“MOHAMMED RAYYAN L (310621104055)”</strong>, who carried out the project work under my supervision.
    </p>

    <div style="display: flex; justify-content: space-between; margin-top: 100pt; font-size: 11pt;">
      <div style="text-align: left; line-height: 1.6;">
        <strong>HEAD OF THE DEPARTMENT</strong><br>
        <strong>Dr.S.Cloudin</strong><br>
        Easwari Engineering College<br>
        Ramapuram, Chennai - 600089
      </div>
      <div style="text-align: left; line-height: 1.6;">
        <strong>SUPERVISOR</strong><br>
        <strong>Ms.Swapna Duggi</strong><br>
        Easwari Engineering College<br>
        Ramapuram, Chennai - 600089
      </div>
    </div>
  `, ''));

  // Page: Certificate of Viva-voce-Examination
  pages.push(makePage(`
    <div style="display: flex; align-items: center; justify-content: center; gap: 15pt; margin-top: 10pt; margin-bottom: 25pt;">
      <div>${logoSvg(65)}</div>
      <div style="font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt;">EASWARI ENGINEERING COLLEGE</div>
    </div>

    <div style="text-align: center; font-size: 13pt; font-weight: bold; letter-spacing: 0.5pt; margin-bottom: 35pt;">
      Certificate of Viva-voce-Examination
    </div>

    <p style="line-height: 2.0; text-align: justify; margin-bottom: 90pt;">
      This is to certify that the Viva Voce Examination of the Project Work entitled <strong>“AcadFlow: Digital Academic Document Workflow &amp; Management System”</strong> submitted by <strong>Mr. Mohammed Rayyan L (310621104055)</strong> in partial fulfillment of the requirements for the award of the degree of <strong>Bachelor of Engineering in Computer Science and Engineering</strong> was conducted on <strong>19.10.2026</strong> in the Department of Computer Science and Engineering, Easwari Engineering College, Ramapuram – Chennai.
    </p>

    <div style="display: flex; justify-content: flex-end; margin-top: 110pt; font-size: 11pt;">
      <div style="text-align: left; line-height: 1.8;">
        <strong>Internal Examiner</strong><br><br>
        Date: 19.10.2026
      </div>
    </div>
  `, ''));

  // Page: Acknowledgement
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 15pt; margin-bottom: 25pt;">
      ACKNOWLEDGEMENT
    </div>

    <p style="line-height: 1.6; margin-bottom: 12pt;">
      We express our sincere gratitude to the Principal <strong>Dr. P. Deiva Sundari</strong> and the Management of our college for providing us with the opportunity to carry out this project work.
    </p>
    <p style="line-height: 1.6; margin-bottom: 12pt;">
      We convey our heartfelt thanks to the Head of the Department, <strong>Dr. S. Cloudin</strong>, Department of Computer Science and Engineering, for the continuous encouragement and support.
    </p>
    <p style="line-height: 1.6; margin-bottom: 12pt;">
      We are extremely thankful to our project guide <strong>Ms. Swapna Duggi</strong>, Department of Computer Science and Engineering, for valuable guidance, suggestions and motivation throughout the completion of this project.
    </p>
    <p style="line-height: 1.6; margin-bottom: 12pt;">
      We would also like to extend our gratitude to all the faculty members of the Department of Computer Science and Engineering for their support.
    </p>
    <p style="line-height: 1.6; margin-bottom: 12pt;">
      Finally, we thank our parents and friends for their constant encouragement and help during the course of this project.
    </p>
  `, ''));

  // Page: Table of Contents
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 10pt; margin-bottom: 16pt;">
      TABLE OF CONTENTS
    </div>

    <table class="report-table" style="font-size: 10pt;">
      <thead>
        <tr>
          <th style="width: 12%; text-align: center;">S. No.</th>
          <th style="width: 73%; text-align: left;">Contents</th>
          <th style="width: 15%; text-align: center;">Page No.</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="text-align: center; font-weight: bold;">1</td><td><strong>Abstract</strong></td><td style="text-align: center;"><strong>i</strong></td></tr>
        <tr><td style="text-align: center; font-weight: bold;">2</td><td><strong>List of Figures</strong></td><td style="text-align: center;"><strong>ii</strong></td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3</td><td><strong>List of Tables</strong></td><td style="text-align: center;"><strong>iii</strong></td></tr>
        <tr><td style="text-align: center; font-weight: bold;">4</td><td><strong>List of Abbreviations</strong></td><td style="text-align: center;"><strong>iv</strong></td></tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">5</td>
          <td><strong>Chapter 1 – Introduction</strong></td>
          <td style="text-align: center;"><strong>1</strong></td>
        </tr>
        <tr><td></td><td style="padding-left: 20pt;">5.1 Project Overview</td><td style="text-align: center;">1</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">5.2 Problem Statement</td><td style="text-align: center;">2</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">5.3 Objectives of the Project</td><td style="text-align: center;">2</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">5.4 Scope of the Project</td><td style="text-align: center;">3</td></tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">6</td>
          <td><strong>Chapter 2 – Existing System and Proposed System</strong></td>
          <td style="text-align: center;"><strong>5</strong></td>
        </tr>
        <tr><td></td><td style="padding-left: 20pt;">6.1 Existing System</td><td style="text-align: center;">5</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">6.2 Limitations of the Existing System</td><td style="text-align: center;">5</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">6.3 Proposed Solution</td><td style="text-align: center;">5</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">6.4 Advantages of the Proposed System</td><td style="text-align: center;">6</td></tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">7</td>
          <td><strong>Chapter 3 – System Analysis and Design</strong></td>
          <td style="text-align: center;"><strong>7</strong></td>
        </tr>
        <tr><td></td><td style="padding-left: 20pt;">7.1 Hardware and Software Requirements</td><td style="text-align: center;">7</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">7.2 System Architecture</td><td style="text-align: center;">8</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">7.3 Module Description</td><td style="text-align: center;">10</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">7.4 UML Diagrams / Data Flow Diagram</td><td style="text-align: center;">14</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">7.5 Algorithm / Flowchart</td><td style="text-align: center;">17</td></tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">8</td>
          <td><strong>Chapter 4 – Implementation</strong></td>
          <td style="text-align: center;"><strong>20</strong></td>
        </tr>
        <tr><td></td><td style="padding-left: 20pt;">8.1 Implementation Details</td><td style="text-align: center;">20</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">8.2 Module Implementation</td><td style="text-align: center;">21</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">8.3 Tools and Technologies Used</td><td style="text-align: center;">23</td></tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">9</td>
          <td><strong>Chapter 5 – Results and Testing</strong></td>
          <td style="text-align: center;"><strong>25</strong></td>
        </tr>
        <tr><td></td><td style="padding-left: 20pt;">9.1 Screenshots and Outputs</td><td style="text-align: center;">25</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">9.2 Testing and Validation</td><td style="text-align: center;">29</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">9.3 Results and Discussion</td><td style="text-align: center;">31</td></tr>
        <tr>
          <td style="text-align: center; font-weight: bold;">10</td>
          <td><strong>Chapter 6 – Conclusion and Future Enhancement</strong></td>
          <td style="text-align: center;"><strong>32</strong></td>
        </tr>
        <tr><td></td><td style="padding-left: 20pt;">10.1 Conclusion</td><td style="text-align: center;">32</td></tr>
        <tr><td></td><td style="padding-left: 20pt;">10.2 Future Enhancements</td><td style="text-align: center;">33</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">11</td><td><strong>References / Bibliography</strong></td><td style="text-align: center;"><strong>34</strong></td></tr>
        <tr><td style="text-align: center; font-weight: bold;">12</td><td><strong>Appendices (Source Code)</strong></td><td style="text-align: center;"><strong>35</strong></td></tr>
      </tbody>
    </table>
  `, ''));

  // Page: Abstract (Page i)
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 10pt; margin-bottom: 14pt;">
      ABSTRACT
    </div>

    <p>
      AcadFlow is a digital academic document workflow and management platform engineered as a responsive web application using React 19, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas. The system brings the daily administrative operations of higher educational institutions into one unified workspace: student document submissions, multi-stage advisor reviews, On-Duty (OD) attendance permissions, project milestone evaluation, academic note sharing, digital certificate issuance with QR verification, and administrative audit tracking.
    </p>

    <p>
      The project directly addresses critical institutional bottlenecks in traditional paper-based workflows: delayed approvals resulting from physical signature chasing, misplaced physical submission files, lack of real-time application tracking, manual signature verification overhead, and the risk of credential forgery. To resolve these challenges, AcadFlow implements an automated student-advisor association mechanism via unique Staff Codes, auto-routing requisitions to designated faculty mentors. Every submission transitions through a deterministic state machine (Draft, Submitted, Under Review, Correction Needed, Approved, and Rejected), providing instantaneous visual status indicators to students and mentors.
    </p>

    <p>
      On-Duty attendance permissions are validated with strict date-span checks, and project milestones are tracked through structured rubric reviews. Digital certificates issued to students embed SHA-256 cryptographic signatures alongside public QR verification codes, enabling instant authenticity validation from any mobile device without logging in. Every system action is immutably recorded in an audit ledger to support accreditation and compliance requirements.
    </p>

    <p>
      The platform was validated through a comprehensive test suite of 22 automated test cases evaluating authentication guards, file upload filters, role-based access control, workflow status machines, OD dates, and cryptographic QR verification. All 22 test cases passed successfully. AcadFlow eliminates paper usage by 100% and reduces document turnaround latency from an average of 4.5 days to under 4 hours.
    </p>

    <p style="margin-top: 16pt;">
      <strong>Keywords:</strong> academic document workflow, digital signatures, QR code verification, MERN stack, role-based access control, On-Duty management, audit logging.
    </p>
  `, 'i'));

  // Page: List of Figures (Page ii)
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 10pt; margin-bottom: 16pt;">
      LIST OF FIGURES
    </div>

    <table class="report-table" style="font-size: 10pt;">
      <thead>
        <tr>
          <th style="width: 18%; text-align: center;">FIGURE NO.</th>
          <th style="width: 67%; text-align: left;">TITLE</th>
          <th style="width: 15%; text-align: center;">PAGE NO.</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="text-align: center; font-weight: bold;">3.1</td><td>System architecture</td><td style="text-align: center;">9</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.2</td><td>Use case diagram</td><td style="text-align: center;">14</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.3</td><td>Class diagram</td><td style="text-align: center;">15</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.4</td><td>Sequence diagram of document submission and review</td><td style="text-align: center;">16</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.5</td><td>Level 1 data flow diagram</td><td style="text-align: center;">17</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.6</td><td>Document approval workflow (flowchart of submission)</td><td style="text-align: center;">17</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.7</td><td>Flowchart of document state transition and revision loop</td><td style="text-align: center;">18</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.1</td><td>Login page with role-based sign-in and demo options</td><td style="text-align: center;">25</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.2</td><td>Student Dashboard with submission metrics and status trackers</td><td style="text-align: center;">26</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.3</td><td>Document submission portal with file upload and category selection</td><td style="text-align: center;">26</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.4</td><td>Staff review portal with decision actions and remarks modal</td><td style="text-align: center;">27</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.5</td><td>Digital certificate with cryptographic signature and QR verification</td><td style="text-align: center;">27</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.6</td><td>On-Duty (OD) permission request and approval workspace</td><td style="text-align: center;">28</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.7</td><td>Admin Control Center with user oversight and real-time audit trail</td><td style="text-align: center;">28</td></tr>
      </tbody>
    </table>
  `, 'ii'));

  // Page: List of Tables (Page iii)
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 10pt; margin-bottom: 16pt;">
      LIST OF TABLES
    </div>

    <table class="report-table" style="font-size: 9.5pt;">
      <thead>
        <tr>
          <th style="width: 18%; text-align: center;">TABLE NO.</th>
          <th style="width: 67%; text-align: left;">TITLE</th>
          <th style="width: 15%; text-align: center;">PAGE NO.</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="text-align: center; font-weight: bold;">1.1</td><td>AcadFlow at a glance</td><td style="text-align: center;">2</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">1.2</td><td>Objectives and how they are met in AcadFlow</td><td style="text-align: center;">3</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">2.1</td><td>Comparison of the existing process and AcadFlow</td><td style="text-align: center;">6</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.1</td><td>Functional requirements</td><td style="text-align: center;">7</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.2</td><td>Software requirements</td><td style="text-align: center;">8</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.3</td><td>Minimum hardware requirements</td><td style="text-align: center;">8</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.4</td><td>Layers of the system</td><td style="text-align: center;">9</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.5</td><td>Public API routes</td><td style="text-align: center;">10</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.6</td><td>Main pages and routes</td><td style="text-align: center;">11</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.7</td><td>Summary of modules</td><td style="text-align: center;">13</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.8</td><td>Data requirements</td><td style="text-align: center;">13</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.9</td><td>Document workflow states and approval tiers</td><td style="text-align: center;">14</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">3.10</td><td>Entity summary</td><td style="text-align: center;">15</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">4.1</td><td>Reusable interface components</td><td style="text-align: center;">21</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">4.2</td><td>Code size by folder</td><td style="text-align: center;">21</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">4.3</td><td>Libraries, frameworks and services</td><td style="text-align: center;">24</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">4.4</td><td>Development tools</td><td style="text-align: center;">24</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">4.5</td><td>Run commands</td><td style="text-align: center;">24</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.1</td><td>Test cases and results</td><td style="text-align: center;">29</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">5.2</td><td>Summary of test results by area</td><td style="text-align: center;">30</td></tr>
        <tr><td style="text-align: center; font-weight: bold;">6.1</td><td>Roadmap of future work</td><td style="text-align: center;">33</td></tr>
      </tbody>
    </table>
  `, 'iii'));

  // Page: List of Abbreviations (Page iv)
  pages.push(makePage(`
    <div style="text-align: center; font-size: 14pt; font-weight: bold; letter-spacing: 0.5pt; margin-top: 10pt; margin-bottom: 16pt;">
      LIST OF ABBREVIATIONS
    </div>

    <table class="report-table" style="font-size: 10pt;">
      <thead>
        <tr>
          <th style="width: 25%; text-align: left;">ABBREVIATION</th>
          <th style="width: 75%; text-align: left;">EXPANSION</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>AI</strong></td><td>Artificial Intelligence</td></tr>
        <tr><td><strong>API</strong></td><td>Application Programming Interface</td></tr>
        <tr><td><strong>BSON</strong></td><td>Binary JavaScript Object Notation</td></tr>
        <tr><td><strong>CORS</strong></td><td>Cross-Origin Resource Sharing</td></tr>
        <tr><td><strong>CSV</strong></td><td>Comma-Separated Values</td></tr>
        <tr><td><strong>DFD</strong></td><td>Data Flow Diagram</td></tr>
        <tr><td><strong>DOM</strong></td><td>Document Object Model</td></tr>
        <tr><td><strong>HTTP</strong></td><td>Hypertext Transfer Protocol</td></tr>
        <tr><td><strong>JSON</strong></td><td>JavaScript Object Notation</td></tr>
        <tr><td><strong>JSX</strong></td><td>JavaScript XML</td></tr>
        <tr><td><strong>JWT</strong></td><td>JSON Web Token</td></tr>
        <tr><td><strong>MERN</strong></td><td>MongoDB, Express.js, React.js, Node.js</td></tr>
        <tr><td><strong>MIME</strong></td><td>Multipurpose Internet Mail Extensions</td></tr>
        <tr><td><strong>NOC</strong></td><td>No Objection Certificate</td></tr>
        <tr><td><strong>OD</strong></td><td>On-Duty Attendance Permission</td></tr>
        <tr><td><strong>ODM</strong></td><td>Object Document Mapper</td></tr>
        <tr><td><strong>QR</strong></td><td>Quick Response</td></tr>
        <tr><td><strong>RBAC</strong></td><td>Role-Based Access Control</td></tr>
        <tr><td><strong>REST</strong></td><td>Representational State Transfer</td></tr>
        <tr><td><strong>SHA</strong></td><td>Secure Hash Algorithm</td></tr>
        <tr><td><strong>UI</strong></td><td>User Interface</td></tr>
        <tr><td><strong>UML</strong></td><td>Unified Modeling Language</td></tr>
        <tr><td><strong>UPI</strong></td><td>Unified Payments Interface</td></tr>
      </tbody>
    </table>
  `, 'iv'));

  return pages;
};
