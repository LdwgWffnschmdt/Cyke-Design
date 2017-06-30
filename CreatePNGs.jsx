
/* SCRIPT FOR ILLUSTRATOR
 * Save all artboards to a selected folder in widths needed by the Universal Windows Platform Apps.
 *
*/

var win =  new Window("palette", "SnpCreateProgressBar", [150, 150, 600, 260]);
win.pnl = win.add("panel", [10, 10, 440, 100], "Create PNGs");
win.pnl.progBar = win.pnl.add("progressbar", [20, 35, 410, 60], 0, 100);  
win.pnl.progBarLabel =  win.pnl.add("statictext", [20, 20, 320, 35], "0%");

win.show();

var bracketsRegEx = /\((.+)\)/;
var noBackgroundRegEx = /NoBackground/;

var folder = Folder.selectDialog();
var document = app.activeDocument;

if (document && folder) {
    var i, artboard, file, options;

    var background = document.layers.getByName("Background");
    
    for (i = 0; i < document.artboards.length; i++) {
        document.artboards.setActiveArtboardIndex(i);
        artboard = document.artboards[i];

        win.pnl.progBar.value = (i / document.artboards.length) * 100;
        win.update();
        
        var bracket = bracketsRegEx.exec(artboard.name);
        if (bracket) {
            
            var cleanArtboardName = artboard.name.replace(bracket[0], "");
            
            var width;

            if (noBackgroundRegEx.test(bracket[0])) {
                background.visible = false;
            }
            
            var widthsRegEx = /(?:\d*\.)?\d+/g;

            do {
                width = widthsRegEx.exec(bracket[0]);
                if (width) {

                    var width = Number(width[0]);

                    var artboardWidth = Math.abs(artboard.artboardRect[0] - artboard.artboardRect[2]);
                    var artboardHeight = Math.abs(artboard.artboardRect[1] - artboard.artboardRect[3]);
                    
                    var scale = width / artboardWidth;

                    var fileName = cleanArtboardName + "_" + (width) + "x" + (scale * artboardHeight);

                    win.pnl.progBarLabel.text = fileName;
                    win.update();

                    file = new File(folder.fsName + "/" + fileName + ".png");
                    
                    options = new ExportOptionsPNG24();
                    options.verticalScale = scale * 100;
                    options.horizontalScale = scale * 100;
                    options.artBoardClipping = true;
                    options.antiAliasing = true;
                    options.transparency = true;

                    document.exportFile(file, ExportType.PNG24, options);
                }
            } while (width);

            if (noBackgroundRegEx.test(bracket[0])) {
                background.visible = true;
            }
        }
    }
}

alert('Done!');

win.close();