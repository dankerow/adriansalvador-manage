import { ref } from 'vue'
import { utils, writeFile } from 'xlsx'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function useDataExporter() {
  const data = ref<any[]>([])

  const setData = (newData: any[]) => {
    data.value = newData
  }

  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(data.value)
    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet, 'Data')
    writeFile(workbook, 'data.xlsx')
  }

  const downloadCSV = () => {
    const csv = Papa.unparse(data.value)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'data.csv')
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    autoTable(doc, { html: '#my-table' })
    doc.save('data.pdf')
  }

  return {
    data,
    setData,
    downloadExcel,
    downloadCSV,
    downloadPDF
  }
}
