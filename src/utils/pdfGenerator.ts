import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const generatePayslipPDF = (payslip: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const doc = new jsPDF();
    const employee = payslip.employeeId;
    const monthName = format(new Date(payslip.year, payslip.month - 1), 'MMMM yyyy');

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('COMPANY NAME', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.text('Payslip for ' + monthName, 105, 30, { align: 'center' });

    // Employee Details
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);

    const leftX = 15;
    const rightX = 110;
    let y = 45;

    doc.text(`Employee ID: ${employee.employeeId}`, leftX, y);
    doc.text(`Name: ${employee.firstName} ${employee.lastName}`, rightX, y);
    y += 10;
    doc.text(`Department: ${employee.department}`, leftX, y);
    doc.text(`Position: ${employee.position}`, rightX, y);
    y += 10;
    doc.text(`Date of Joining: ${employee.joiningDate ? format(new Date(employee.joiningDate), 'dd MMM yyyy') : 'N/A'}`, leftX, y);
    doc.text(`Payslip ID: ${payslip._id.toString().slice(-6).toUpperCase()}`, rightX, y);

    // Earnings Table
    y += 15;

    const basic = payslip.basicSalary || 0;
    const hra = payslip.allowances?.hra || 0;
    const transport = payslip.allowances?.transport || 0;
    const medical = payslip.allowances?.medical || 0;
    const otherAllowances = payslip.allowances?.other || 0;
    // const totalAllowances = hra + transport + medical + otherAllowances;

    const tax = payslip.deductions?.tax || 0;
    const pf = payslip.deductions?.providentFund || 0;
    const otherDeductions = payslip.deductions?.other || 0;
    const totalDeductions = tax + pf + otherDeductions;

    autoTable(doc, {
        startY: y,
        head: [['Earnings', 'Amount', 'Deductions', 'Amount']],
        body: [
            ['Basic Salary', basic.toFixed(2), 'Tax', tax.toFixed(2)],
            ['HRA', hra.toFixed(2), 'Provident Fund', pf.toFixed(2)],
            ['Transport', transport.toFixed(2), 'Other Deductions', otherDeductions.toFixed(2)],
            ['Medical', medical.toFixed(2), '', ''],
            ['Other Allowances', otherAllowances.toFixed(2), '', ''],
            ['', '', '', ''],
            ['Total Earnings', payslip.grossSalary.toFixed(2), 'Total Deductions', totalDeductions.toFixed(2)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        styles: { fontSize: 10, cellPadding: 5 },
    });

    // Net Pay
    const finalY = (doc as any).lastAutoTable.finalY + 20; // eslint-disable-line @typescript-eslint/no-explicit-any
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Net Salary: ${payslip.netSalary.toFixed(2)}`, 15, finalY);

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated document and does not require a signature.', 105, 280, { align: 'center' });

    doc.save(`Payslip_${employee.firstName}_${monthName}.pdf`);
};
