class GoogleSheets {
  constructor(spreadsheetId) {
    this.id = spreadsheetId;
  }

  fetchSheet() {
    if (!this.id) return null;
    const url = `https://docs.google.com/spreadsheets/d/${this.id}/gviz/tq`;

    return fetch(url)
      .then((r) => (r && r.ok && r.text ? r.text() : null))
      .catch(() => null);
  }

  async parse() {
    const spreadsheetResponse = await this.fetchSheet();
    if (spreadsheetResponse === null) return [];
    return JSON.parse(spreadsheetResponse.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, ''));
  }
}

export default GoogleSheets;
