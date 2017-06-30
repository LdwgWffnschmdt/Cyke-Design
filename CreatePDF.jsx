
/* SCRIPT FOR ILLUSTRATOR
 * Save all artboards to a selected folder in widths needed by the Universal Windows Platform Apps.
 *
*/

var win =  new Window("palette", "SnpCreateProgressBar", [150, 150, 600, 260]);
win.pnl = win.add("panel", [10, 10, 440, 100], "Create PDF");
win.pnl.progBar = win.pnl.add("progressbar", [20, 35, 410, 60], 0, 100);  
win.pnl.progBarLabel =  win.pnl.add("statictext", [20, 20, 320, 35], "0%");

win.show();

var folder = Folder.selectDialog();
var document = app.activeDocument;

if (document && folder) {
    var i, artboard, file, options;
    
    var seiten = [];

    for (i = 0; i < document.artboards.length; i++) {
        document.artboards.setActiveArtboardIndex(i);
        artboard = document.artboards[i];

        win.pnl.progBar.value = (i / document.artboards.length) * 100;
        win.update();
        
        if (artboard.name.indexOf("Seite") == 0) {
            seiten[seiten.length] = i + 1;
        }
    }

    win.pnl.progBarLabel.text = "Design.pdf";
    win.update();

    file = new File(folder.fsName + "/Design.pdf");

    options = new PDFSaveOptions();
    options.artboardRange = seiten.join(",");
    options.optimization = true;
    document.saveAs(file, options);
}

alert('Done!');

win.close();