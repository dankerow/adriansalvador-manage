export function useDataExporter() {
  const data = shallowRef<any[]>([])

  const setData = (newData: any[]) => {
    data.value = newData
  }

  const downloadExcel = async () => {
    const { utils, writeFile } = await import('xlsx')
    const worksheet = utils.json_to_sheet(data.value)
    const workbook = utils.book_new()

    utils.book_append_sheet(workbook, worksheet, 'Data')
    writeFile(workbook, 'data.xlsx')
  }

  const downloadCSV = async () => {
    const Papa = await import('papaparse')
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

  const downloadPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

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
