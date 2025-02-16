import jsPDF from "jspdf";

export function registerOpenSans(doc: jsPDF) {
  doc.addFileToVFS("OpenSans.ttf", "<base64>");
  doc.addFont("OpenSans.ttf", "OpenSans", "normal");
}
