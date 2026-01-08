import { Resume } from '@/types';
import { generateGhostTextLayer } from './ghostTextLayer';

/**
 * Export resume as PDF using browser print functionality
 * Includes invisible ghost text layer for ATS parsing
 */
export async function exportToPDF(resume: Resume): Promise<void> {
  try {
    // Wait a moment for any rendering to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get the preview HTML content - look for the visible one
    const previewElements = document.querySelectorAll('.a4-page');
    console.log('Found preview elements:', previewElements.length);
    
    let previewElement: Element | null = null;
    
    // Find the visible preview element
    for (let i = 0; i < previewElements.length; i++) {
      const el = previewElements[i] as HTMLElement;
      console.log(`Element ${i}:`, {
        offsetParent: el.offsetParent,
        offsetWidth: el.offsetWidth,
        offsetHeight: el.offsetHeight,
        className: el.className
      });
      if (el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0) { // Check if visible and rendered
        previewElement = el;
        console.log('Selected visible element:', i);
        break;
      }
    }
    
    if (!previewElement && previewElements.length > 0) {
      // Fallback: try to find any element with content
      for (let i = 0; i < previewElements.length; i++) {
        const el = previewElements[i] as HTMLElement;
        if (el.innerHTML.trim().length > 100) { // Has content
          previewElement = el;
          console.log('Selected element with content:', i);
          break;
        }
      }
    }
    
    if (!previewElement) {
      previewElement = previewElements[0]; // Fallback to first one
      console.log('Using first element as fallback');
    }
    
    if (!previewElement) {
      console.error('No .a4-page elements found in DOM');
      alert('Cannot find resume preview. Please make sure the resume is displayed.');
      throw new Error('Preview not found');
    }

    // Create a new window with the resume content
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to export PDF. Check your browser settings.');
      throw new Error('Failed to open print window. Please allow popups.');
    }

  // Get computed styles
  let styles = '';
  try {
    styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          // Skip external stylesheets that might cause CORS issues
          if (styleSheet.href && !styleSheet.href.startsWith(window.location.origin)) {
            return '';
          }
          return Array.from(styleSheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          console.warn('Could not access stylesheet:', e);
          return '';
        }
      })
      .join('\n');
  } catch (e) {
    console.warn('Error collecting styles:', e);
  }

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
      try {
        printWindow.print();
        
        // Close after print dialog is dismissed
        setTimeout(() => {
          printWindow.close();
        }, 100);
      } catch (err) {
        console.error('Print error:', err);
        alert('Print dialog failed. Your PDF may still be ready.');
      }
    }, 500);
  };
  
  // Fallback if onload doesn't fire
  setTimeout(() => {
    if (printWindow && !printWindow.closed) {
      try {
        printWindow.print();
      } catch (err) {
        console.error('Fallback print error:', err);
      }
    }
  }, 2000);
  
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
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
