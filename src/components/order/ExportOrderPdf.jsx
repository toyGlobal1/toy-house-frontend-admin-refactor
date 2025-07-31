import { Button } from "@heroui/react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";

const COMPANY_DETAILS = {
  name: "Toy House",
  email: "kuswarkhan2018@gmail.com",
  phone_number: "01626809609",
  address: "Toy House, Level-1, A1, 37C",
};

export function ExportOrderPdf({ order }) {
  const deliveryFee = order.delivery_options === "INSIDE_DHAKA" ? 60 : 120;
  const handleExportPdf = () => {
    const orderItems = order.order_items || [];
    if (!orderItems.length) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "No order details available!",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const doc = new jsPDF();

    // Set title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Order Invoice", 80, 20);

    // Order ID and Total Price (Order ID at top, Total Price below it)
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order.order_id}`, 14, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Company Name: ${COMPANY_DETAILS.name}`, 130, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Email: ${COMPANY_DETAILS.email}`, 130, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Phone: ${COMPANY_DETAILS.phone_number}`, 130, 56);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Address: ${COMPANY_DETAILS.address}`, 130, 64);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Customer Name: ${order?.name}`, 15, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Email: ${order?.email}`, 15, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Phone: ${order?.phone_number}`, 15, 56);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Address: ${order?.address || "N/A"}`, 15, 64);

    // Table header and data
    const tableHead = [["#", "Product Name", "SKU", "Color", "Qty", "Price", "Total"]];

    const tableBody = orderItems.map((item, index) => [
      index + 1,
      item.product_name,
      item.sku,
      item.color_name || "N/A",
      item.quantity,
      `${item.selling_price.toFixed(2)} BDT`,
      `${(item.selling_price * item.quantity).toFixed(2)} BDT`,
    ]);

    // Apply table using autoTable
    autoTable(doc, {
      startY: 80, // Starting Y position for table
      head: tableHead,
      body: tableBody,
      theme: "striped",
      styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
      headStyles: {
        fillColor: [117, 117, 117], // bg-[#757575]
        textColor: 255,
        fontSize: 12,
        fontStyle: "normal",
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Index column
        1: { cellWidth: "auto" },
        2: { cellWidth: 30 },
        3: { cellWidth: "auto" },
        4: { cellWidth: 15 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    const itemsTotal = orderItems.reduce(
      (total, item) => total + item.selling_price * item.quantity,
      0
    );
    // Total Price
    doc.setFont("helvetica", "bold");
    doc.text("Total Price:", 14, finalY);
    doc.text(`${itemsTotal.toFixed(2)} BDT`, 180, finalY, { align: "right" });

    doc.text("Delivery Fee:", 14, finalY + 10);
    doc.text(`${deliveryFee.toFixed(2)} BDT`, 180, finalY + 10, {
      align: "right",
    });

    doc.text("Grand Total:", 14, finalY + 20);
    doc.text(`${(itemsTotal + deliveryFee).toFixed(2)} BDT`, 180, finalY + 20, {
      align: "right",
    });

    // Open in a new tab with the generated PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <Button size="sm" onPress={handleExportPdf}>
      <FaFilePdf className="size-3.5 fill-red-700" /> Export PDF
    </Button>
  );
}
