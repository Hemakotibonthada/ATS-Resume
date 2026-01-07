import { Resume } from '@/types';
import { generateGhostTextLayer } from './ghostTextLayer';

/**
 * Export resume as PDF using browser print functionality
 * Includes invisible ghost text layer for ATS parsing
 */
export async function exportToPDF(resume: Resume): Promise<void> {
  // Create a new window with the resume content
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Failed to open print window. Please allow popups.');
  }

  // Get the preview HTML content
  const previewElement = document.querySelector('.a4-page');
  if (!previewElement) {
    throw new Error('Preview not found');
  }

  // Get computed styles
  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  // Generate ghost text layer for ATS parsing
  const ghostText = generateGhostTextLayer(resume);

  // Create print HTML
  const printHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${resume.metadata.title} - Resume</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @page {
            size: ${resume.settings.layout.pageSize === 'A4' ? 'A4' : 'Letter'};
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: ${resume.settings.theme.fontPair.body}, sans-serif;
            color: ${resume.settings.theme.textColor};
            background: white;
          }
          
          .a4-page {
            width: ${resume.settings.layout.pageSize === 'A4' ? '210mm' : '8.5in'};
            min-height: ${resume.settings.layout.pageSize === 'A4' ? '297mm' : '11in'};
            background: white;
            margin: 0;
            padding: ${resume.settings.layout.margins.top}mm ${resume.settings.layout.margins.right}mm ${resume.settings.layout.margins.bottom}mm ${resume.settings.layout.margins.left}mm;
          }
          
          ${styles}
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            .a4-page {
              box-shadow: none;
              margin: 0;
            }
            
            /* Hide ghost text layer from visual rendering */
            .ghost-text-layer {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${previewElement.outerHTML}
        
        <!-- Ghost Text Layer for ATS Parsing -->
        <!-- This invisible layer ensures proper hierarchical parsing -->
        <div class="ghost-text-layer" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;">
          <pre style="white-space: pre-wrap; font-family: monospace;">${ghostText}</pre>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(printHTML);
  printWindow.document.close();

  // Wait for content to load
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      
      // Close after print dialog is dismissed
      setTimeout(() => {
        printWindow.close();
      }, 100);
    }, 500);
  };
}

/**
 * Download resume as PNG/JPG (alternative export method)
 */
export async function exportAsImage(format: 'png' | 'jpeg' = 'png'): Promise<void> {
  const previewElement = document.querySelector('.a4-page') as HTMLElement;
  
  if (!previewElement) {
    throw new Error('Preview not found');
  }

  try {
    // Dynamic import to reduce bundle size
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(previewElement, {
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    } as any);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to create image');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, `image/${format}`);
  } catch (error) {
    console.error('Failed to export as image:', error);
    throw new Error('Image export failed. Try PDF export instead.');
  }
}
