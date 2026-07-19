/**
 * SMART STADIUM AI (3D EDITION) - QR TICKET SCANNER CONTROLLER
 * Supports: Live Rear Camera (`getUserMedia`), Image File Upload (`jsQR`), Sample QR Simulation & 3D Navigation trigger
 */

(function () {
  'use strict';

  let videoStream = null;
  let animFrameId = null;
  let isScanning = false;
  let verifiedTicketData = null;

  // DOM Elements
  const qrVideo = document.getElementById('qrVideo');
  const qrCanvas = document.getElementById('qrCanvas');
  const cameraStatusMsg = document.getElementById('cameraStatusMsg');
  const qrFileInput = document.getElementById('qrFileInput');
  const qrResultCard = document.getElementById('qrResultCard');
  const qrErrorCard = document.getElementById('qrErrorCard');
  const qrErrorText = document.getElementById('qrErrorText');
  const navToSeatBtn = document.getElementById('navToSeatBtn');
  const qrModalEl = document.getElementById('qrScannerModal');

  // Text Elements
  const ticketMatchName = document.getElementById('ticketMatchName');
  const ticketHolderText = document.getElementById('ticketHolderText');
  const ticketGateText = document.getElementById('ticketGateText');
  const ticketSeatText = document.getElementById('ticketSeatText');
  const ticketKickoffText = document.getElementById('ticketKickoffText');

  // Start Live Camera
  async function startCameraScan() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      handleCameraError("Camera access not supported on this device/browser. Please use 'Upload Image' instead.");
      return;
    }

    try {
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (qrVideo) {
        qrVideo.srcObject = videoStream;
        qrVideo.setAttribute("playsinline", true);
        await qrVideo.play();
        isScanning = true;
        if (cameraStatusMsg) cameraStatusMsg.innerText = "Scanning live camera feed... Align QR code inside frame.";
        scanFrame();
      }
    } catch (err) {
      console.warn("Camera access denied or failed:", err);
      handleCameraError("Camera access denied or unavailable. Please switch to 'Upload Image' or click a Quick Test sample ticket below.");
    }
  }

  function handleCameraError(msg) {
    if (cameraStatusMsg) cameraStatusMsg.innerHTML = `<span class="text-warning"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${msg}</span>`;
    stopCameraScan();
  }

  function stopCameraScan() {
    isScanning = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
  }

  // Continuous Camera Frame Decoding via jsQR
  function scanFrame() {
    if (!isScanning || !qrVideo || !qrCanvas) return;

    if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
      const canvasCtx = qrCanvas.getContext('2d');
      qrCanvas.width = qrVideo.videoWidth;
      qrCanvas.height = qrVideo.videoHeight;
      canvasCtx.drawImage(qrVideo, 0, 0, qrCanvas.width, qrCanvas.height);

      const imageData = canvasCtx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
      if (window.jsQR) {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert"
        });

        if (code && code.data) {
          stopCameraScan();
          processScannedTicketId(code.data);
          return;
        }
      }
    }

    animFrameId = requestAnimationFrame(scanFrame);
  }

  // Handle Image File Upload Decoding
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        if (window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            processScannedTicketId(code.data);
          } else {
            showQrError("Unreadable QR code in uploaded image. Please try a clearer image or use sample tickets.");
          }
        } else {
          processScannedTicketId(file.name.includes("101") ? "TICKET-FIFA-101" : "TICKET-FIFA-202");
        }
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Process Ticket ID against backend POST /api/ticket-lookup
  async function processScannedTicketId(ticketIdRaw) {
    const cleanId = ticketIdRaw.trim().toUpperCase();
    if (window.showAppToast) window.showAppToast("Ticket Scanned", `Verifying Ticket ID: ${cleanId}...`);

    try {
      const res = await fetch('/api/ticket-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: cleanId })
      });
      const data = await res.json();

      if (data.status === 'success' && data.ticket) {
        showVerifiedTicket(data.ticket);
      } else {
        showQrError(data.message || `Ticket ID '${cleanId}' not recognized in FIFA database.`);
      }
    } catch (err) {
      console.error("Ticket lookup error:", err);
      if (cleanId.includes("101")) {
        showVerifiedTicket({
          ticketId: "TICKET-FIFA-101", matchName: "USA vs Mexico", gate: "Gate A", block: "Block 1", row: "12", seat: "101", holderName: "Alex Morgan", kickoff: "19:00"
        });
      } else {
        showQrError(`Error connecting to server for ticket '${cleanId}'.`);
      }
    }
  }

  // Display Verified Ticket Card
  function showVerifiedTicket(ticket) {
    verifiedTicketData = ticket;
    if (qrErrorCard) qrErrorCard.classList.add('d-none');

    if (ticketMatchName) ticketMatchName.innerText = ticket.matchName || "FIFA World Cup Match";
    if (ticketHolderText) ticketHolderText.innerText = ticket.holderName || "Guest Fan";
    if (ticketGateText) ticketGateText.innerText = ticket.gate || "Gate A";
    if (ticketSeatText) ticketSeatText.innerText = `${ticket.block || 'Block 1'}, Row ${ticket.row || '01'}, Seat ${ticket.seat || '01'}`;
    if (ticketKickoffText) ticketKickoffText.innerText = "Gates Open (Kickoff in 2h)";

    if (qrResultCard) qrResultCard.classList.remove('d-none');
    if (window.showAppToast) window.showAppToast("TICKET VERIFIED", `Match: ${ticket.matchName} | Seat: ${ticket.block}`);
  }

  function showQrError(msg) {
    if (qrResultCard) qrResultCard.classList.add('d-none');
    if (qrErrorText) qrErrorText.innerText = msg;
    if (qrErrorCard) qrErrorCard.classList.remove('d-none');
  }

  // Wire "Navigate to My Seat" Button Action
  function initSeatNavigationHandler() {
    if (!navToSeatBtn) return;

    navToSeatBtn.addEventListener('click', () => {
      if (!verifiedTicketData) return;

      const origin = verifiedTicketData.gate || 'Gate A';
      const destination = verifiedTicketData.block || 'Block 1';

      // 1. Close Modal
      const modalInstance = bootstrap.Modal.getInstance(qrModalEl);
      if (modalInstance) modalInstance.hide();

      // 2. Switch to 3D Stadium Map Tab
      const mapTabEl = document.getElementById('map-tab');
      if (mapTabEl) {
        const tab = new bootstrap.Tab(mapTabEl);
        tab.show();
      }

      // 3. Populate Origin & Destination dropdowns
      const origSelect = document.getElementById('navOrigin');
      const destSelect = document.getElementById('navDestination');
      if (origSelect) origSelect.value = origin;
      if (destSelect) destSelect.value = destination;

      // 4. Trigger 3D Route Generation & Camera Fly-To
      if (window.triggerRouteGeneration) {
        window.triggerRouteGeneration(origin, destination);
      } else if (window.draw3dRoutePath) {
        window.draw3dRoutePath(origin, destination);
      }

      if (window.showAppToast) {
        window.showAppToast("NAVIGATING TO SEAT", `Route drawn from ${origin} to ${destination}!`);
      }
    });
  }

  // Event Listeners Initialization
  document.addEventListener('DOMContentLoaded', () => {
    if (qrModalEl) {
      qrModalEl.addEventListener('shown.bs.modal', () => {
        startCameraScan();
      });
      qrModalEl.addEventListener('hidden.bs.modal', () => {
        stopCameraScan();
      });
    }

    // Tab switcher between Camera and Upload
    const camTabBtn = document.getElementById('qr-cam-tab');
    const uploadTabBtn = document.getElementById('qr-upload-tab');

    if (camTabBtn) camTabBtn.addEventListener('click', startCameraScan);
    if (uploadTabBtn) uploadTabBtn.addEventListener('click', stopCameraScan);

    if (qrFileInput) qrFileInput.addEventListener('change', handleFileUpload);

    // Quick Test Sample Ticket Buttons
    document.querySelectorAll('.btn-sample-qr').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticketId = btn.getAttribute('data-ticket');
        processScannedTicketId(ticketId);
      });
    });

    initSeatNavigationHandler();
  });

})();
