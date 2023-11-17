class gSpreadsheet {
    constructor (spreadsheetId) {
        this.id = spreadsheetId
    }

    getSpreadsheet() {
        if (!this.id) return null
        let url = `https://docs.google.com/spreadsheets/d/${this.id}/gviz/tq`

        return fetch(url)
            .then((r) => r && r.ok && r.text ? r.text() : null)
            .catch((_) => null)
    }

    async parse(spreadsheetId, sheetInfo) {
        const spreadsheetResponse = await this.getSpreadsheet()
        if (spreadsheetResponse === null) return []
        return JSON.parse(spreadsheetResponse.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''))
    }
}

module.exports = gSpreadsheet