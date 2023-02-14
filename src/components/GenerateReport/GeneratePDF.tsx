import jsPDF from "jspdf";
import { DATE } from "../../utils/functions";
import Logo from "../../utils/mineduc.png";
require("jspdf-autotable");

export const addFooters = (doc: any) => {
  const pageCount = doc.internal.getNumberOfPages();

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      "Page " + String(i) + " of " + String(pageCount),
      doc.internal.pageSize.width / 2,
      297,
      {
        align: "center",
      }
    );
  }
};

export type reportSettingsInterface = {
  doneBy: string;
  title: string;
  subjectTitle: string;
  subject: string;
  institute: string;
  period: string;
  footer: string;
  orientation?: "p" | "l";
};

export const generatePDF = async (
  reportSettings: reportSettingsInterface,
  table: HTMLElement,
  callBack: (status: boolean) => void
) => {
  callBack(true);
  const orientation: "p" | "l" = reportSettings.orientation
    ? reportSettings.orientation
    : "p";
  var lMargin: number = 20; //left margin in mm
  var rMargin: number = 20; //right margin in mm
  var pdfInMM: number = 185; // width of A4 in mm

  //   var doc = new jsPDF("p", "mm", "a4");
  var doc: any = new jsPDF(orientation, "mm", "a4");

  doc.setTextColor(95, 95, 95);
  doc.setFontSize(28);
  // doc.text(
  //   this.props.reportTitle,
  //   doc.internal.pageSize.getWidth() / 2,
  //   30,
  //   undefined,
  //   "center"
  // );
  doc.addImage(Logo, "png", 20, 20, 10, 10);
  doc.text("MINEDUC", 32, 28.5, undefined, "left");
  //   doc.setTextColor(19, 90, 152);
  doc.setFontSize(26);
  doc.text(
    reportSettings.title,
    doc.internal.pageSize.getWidth() / 2,
    42.7,
    undefined,
    "center"
  );

  doc.setFontSize(20);
  doc.text(
    reportSettings.institute,
    doc.internal.pageSize.getWidth() / 2,
    53.7,
    undefined,
    "center"
  );

  var lines;
  lines = doc.splitTextToSize(
    reportSettings.subject,
    pdfInMM - lMargin - rMargin
  );
  // if (reportSettings.position) {
  // } else if (reportSettings.subject) {
  //   lines = doc.splitTextToSize(
  //     reportSettings.subject,
  //     pdfInMM - lMargin - rMargin
  //   );
  // }

  //   doc.setTextColor(0, 123, 255);
  doc.setFontSize(16);
  //   doc.text(lines, doc.internal.pageSize.getWidth() / 2, 45, {
  //     maxWidth: 85,
  //     align: "center",
  //   });

  var y = 63,
    width;
  doc.setTextColor(95, 95, 95);
  doc.text(`${reportSettings.subjectTitle}: `, lMargin, y);
  width = doc.getTextWidth(`${reportSettings.subjectTitle}: `);
  // if (reportSettings.position) {
  // } else if (reportSettings.position) {
  //   doc.text(`Subject: `, lMargin, y);
  //   width = doc.getTextWidth("Subject: ");
  // }
  // doc.setFontType("bold");
  doc.setTextColor(38, 38, 38);
  for (var i = 0; i < lines.length; i++) {
    if (y > 280) {
      y = 10;
      doc.addPage();
    }
    // doc.text(15, y, lines[i]);
    doc.text(lines[i], lMargin + width, y);
    y = y + 7;
  }
  doc.setTextColor(95, 95, 95);
  doc.text("Period: ", lMargin, y + 3);
  width = doc.getTextWidth("Period: ");
  doc.setTextColor(38, 38, 38);
  doc.text(reportSettings.period, lMargin + width, y + 3);

  doc.autoTable({
    html: table,
    startY: 85,
    margin: { horizontal: 20 },
    cellPadding: 3, // Horizontal cell padding
    // fontSize: 12,
    rowHeight: 20,
    // styles: { overflow: "linebreak" },
    bodyStyles: { valign: "top" },
    columnStyles: { email: { cellWidth: "wrap" } },
    theme: "striped",
    tableWidth: true,
  });

  doc.setFontSize(12);
  let finalY = doc.lastAutoTable.finalY; // The y position on the page
  doc.text(`Reported by: ${reportSettings.doneBy}`, lMargin, finalY + 15);
  doc.text(
    "Report downloaded on " + DATE(new Date().toString()),
    lMargin,
    finalY + 23
  );

  addFooters(doc);
  await doc
    .save(
      `${
        reportSettings.title +
        ": " +
        reportSettings.subject +
        ": " +
        reportSettings.period
      }.pdf`,
      { returnPromise: true }
    )
    .then(callBack(false));
};
