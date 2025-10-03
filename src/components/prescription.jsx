export const getPatientPrescription = (patientData) => {
    const prescriptionWindow = window.open('', '_blank');    
    prescriptionWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${patientData?.Name || 'Patient'}</title>
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              width: 21cm;
              min-height: 29.7cm;
              margin: 0 auto;
              background: white;
            }
            .prescription-container {
              width: 100%;
              min-height: 29.7cm;
              padding: 32px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              position: relative;
            }
            .prescription-header {
              border-bottom: 2px solid #333;
              padding-bottom: 24px;
              margin-bottom: 32px;
            }
            .patient-details {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 24px;
            }
            .detail-item {
              display: flex;
              padding: 8px 0;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
              margin-right: 8px;
            }
            .detail-value {
              color: #333;
            }
            .prescription-footer {
              margin-top: auto;
              padding-top: 32px;
              display: flex;
              justify-content: space-between;
              align-items: end;
            }
            .vertical-line {
              position: absolute;
              left: 40%;
              top: 15%;
              bottom: 15%;
              width: 2px;
              background-color: #2596be;
            }
            .horizontal-line {
              position: absolute;
              left: 5%;
              bottom: 15%;
              right: 5%;
              height: 2px;
              background-color: #2596be;
            }
            .left-section {
              position: absolute;
              left: 32px;
              top: 200px;
              width: 25%;
            }
            .right-section {
              position: absolute;
              left: 45%;
              top: 200px;
              width: 50%;
            }
            .field-group {
              margin-bottom: 24px;
            }
            .right-field-group {
              margin-bottom: 220px;
            }
            .field-label {
              font-size: 14px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
            }
            .field-content {
              height: 120px;
              padding: 8px;
              font-size: 12px;
            }
            @media print {
              body { 
                margin: 0; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="prescription-container">
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
            
            <!-- Header -->
            <div class="prescription-header">
              <div style="display: flex; align-items: center; gap: 32px;">
                <div style="flex-shrink: 0;">
                  <img src="/src/assets/Logo.png" alt="Kinetara Logo" style="height: 80px; width: auto;" />
                </div>
                <div style="flex: 1;">
                  <div class="patient-details" style="grid-template-columns: 1fr 1fr 1fr; gap: 24px; font-size: 14px;">
                    <div class="detail-item">
                      <span class="detail-label">Name: </span>
                      <span class="detail-value">${patientData?.Gender == "Male" ? "Mr." : "Ms."} ${patientData?.Name || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Gender: </span>
                      <span class="detail-value">${patientData?.Gender || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Age: </span>
                      <span class="detail-value">${patientData?.Age ? patientData.Age + ' years' : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Phone: </span>
                      <span class="detail-value">${patientData?.PhoneNumber || 'N/A'}</span>
                    </div>
                    <div class="detail-item" style="grid-column: span 2;">
                      <span class="detail-label">Address: </span>
                      <span class="detail-value">${patientData?.Address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Area -->
            <div style="flex: 1;">
              <!-- Left Section -->
              <div class="left-section">
                <div class="field-group">
                  <div class="field-label">CC:</div>
                  <div class="field-content"></div>
                </div>
                <div class="field-group">
                  <div class="field-label">H/O:</div>
                  <div class="field-content"></div>
                </div>
                <div class="field-group">
                  <div class="field-label">Symptoms:</div>
                  <div class="field-content"></div>
                </div>
                <div class="field-group">
                  <div class="field-label">Conditions:</div>
                  <div class="field-content"></div>
                </div>
              </div>

              <!-- Right Section -->
              <div class="right-section">
                <div class="right-field-group">
                  <div class="field-label">Treatment:</div>
                  <div class="field-content"></div>
                </div>
                <div class="right-field-group">
                  <div class="field-label">Home Advice:</div>
                  <div class="field-content"></div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="prescription-footer">
              <div style="text-align: left; font-size: 12px; color: #666;">
                <p>D-584, LGF, Below Axis Bank, CR Park, New Delhi -110019</p>
                <p>Call us @ 8800974721</p>
              </div>
              <div style="text-align: right;">
                <div style="border-top: 1px solid #333; width: 200px; margin-left: auto; margin-top: 20px; margin-bottom: 8px;"></div>
                <p style="color: #666; font-weight: bold; margin-bottom: 16px;">Signature</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    
    prescriptionWindow.document.close();
    prescriptionWindow.focus();
}