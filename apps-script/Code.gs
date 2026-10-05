function doPost(e) {
  var p = e.parameter;
  SpreadsheetApp.getActiveSheet().appendRow([new Date(), p.nombre, p.personas, p.asistencia, p.mensaje]);
  return ContentService.createTextOutput('ok');
}
