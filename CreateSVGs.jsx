
/* SCRIPT FOR ILLUSTRATOR
 * Save all artboards to a selected folder in widths needed by the Universal Windows Platform Apps.
 *
*/

#target Illustrator 
#targetengine main

var exportFolder,
    sourceDoc,
    exportDoc,
    svgOptions,
    win,
    bracketsRegEx;

try {
    if (app.documents.length > 0) {
        svgOptions = new ExportOptionsSVG();
        svgOptions.embedRasterImages = false;
        //svgOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
        //svgOptions.fontSubsetting = SVGFontSubsetting.None;
        svgOptions.documentEncoding = SVGDocumentEncoding.UTF8;
        svgOptions.coordinatePrecision = 3;

        svgOptions.preserveEditability = false;
        //svgOptions.embedRasterImages = true;
        svgOptions.embedAllFonts = false;
        svgOptions.fontType = SVGFontType.OUTLINEFONT;
        svgOptions.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
        svgOptions.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
        
        sourceDoc = app.activeDocument;
        exportFolder = Folder.selectDialog('Select Folder to Save Files');

        if (!exportFolder) throw new Error("No folder selected");

        exportDoc = documents.add(DocumentColorSpace.RGB);

        win = new Window("palette", "SnpCreateProgressBar", [150, 150, 600, 600]);
        win.pnl = win.add("panel", [10, 10, 440, 500], "Create SVGs");
        win.pnl.progBar = win.pnl.add("progressbar", [20, 35, 410, 60], 0, 100);
        win.pnl.progBarLabel = win.pnl.add("statictext", [20, 20, 320, 35], "0%");
        win.pnl.commandText = win.pnl.add('edittext', [20, 100, 410, 400], "", { multiline: true, scrolling: true });

        win.show();

        bracketsRegEx = /\((.+)\)/;

        main();

        exportDoc.close(SaveOptions.DONOTSAVECHANGES);

        alert('Done!');
    }
    else {
        throw new Error('There are no documents open. Open a document and try again.');
    }
}
catch (e) {
    alert(e.message, "Script Alert", true);
}

function main() {
    var item;
    app.activeDocument = sourceDoc;
    itemsToExport = getNamedItems(sourceDoc);

    for (var i = 0, len = itemsToExport.length; i < len; i++) {

        win.pnl.progBar.value = (i / itemsToExport.length) * 100;
        win.update();
        
        item = itemsToExport[i];
        
        exportArtboard(item);

        // Empty export document
        exportDoc.pageItems.removeAll();
    }

}

function getNamedItems(doc) {
    var item,
        items;

    items = [];

    // Check all artboards for name match
    for (var i = 0, len = doc.artboards.length; i < len; i++) {
        item = doc.artboards[i];
        if (bracketsRegEx.test(item.name)) {
            items.push(item);
        }
    }
    
    return items;
}

function exportArtboard(artboard) {

    var item,
        name,
        doc,
        prettyName,
        rect,
        bracket,
        bbox;

    app.activeDocument = sourceDoc;
    rect = artboard.artboardRect;
    
    bbox = sourceDoc.pathItems.rectangle(rect[1], rect[0], rect[2] - rect[0], rect[1] - rect[3]);
    bbox.stroked = false;
    bbox.name = '__ILSVGEX__BOUNDING_BOX';
    
    name = artboard.name;
    bracket = bracketsRegEx.exec(artboard.name);
    prettyName = artboard.name.replace(bracket[0], "");

    win.pnl.progBarLabel.text = prettyName;
    win.update();

    app.activeDocument = exportDoc;

    for (var ii = 0, len = sourceDoc.pageItems.length; ii < len; ii++) {
        item = sourceDoc.pageItems[ii];

        if (hitTest(item, bbox) && !item.locked && !anyParentLocked(item)) {
            item.duplicate(exportDoc, ElementPlacement.PLACEATEND);
        }
    }
    
    app.activeDocument = exportDoc;
    exportDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();

    // Check if artboard is blank, clean up and exit
    if (!exportDoc.pageItems.length) {
        sourceDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();
        
        return;
    }

    for (iii = 0, len = exportDoc.pageItems.length; iii < len; iii++) {
        item = exportDoc.pageItems[iii];

        /*
         * For the moment, all pageItems are made visible and exported
         * unless they are locked. This may not make sense, but it'll
         * work for now.
         */
        item.hidden = false;
    }
    
    exportDoc.layers[0].name = prettyName;
    
    exportSVG(exportDoc, prettyName, bbox.visibleBounds, svgOptions);

    sourceDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();

}

function exportSVG(doc, name, bounds, exportOptions) {

    doc.artboards[0].artboardRect = bounds;

    var file = new File(exportFolder.fsName + '/' + name);
    doc.exportFile(file, ExportType.SVG, exportOptions);

    win.pnl.commandText.text += "svgo " + exportFolder.fsName.replace("/", "\\") + '\\' + name.replace("/", "\\") + '.svg\n';
    win.update();
}

function anyParentLocked(item) {
    while (item.parent) {
        if (item.parent.locked) {
            return true;
        }
        item = item.parent;
    }

    return false;
}

/* Code derived from John Wundes ( john@wundes.com ) www.wundes.com
 * Copyright (c) 2005 wundes.com
 * All rights reserved.
 *
 * This code is derived from software contributed to or originating on wundes.com
 */

function hitTest(a, b) {
    if (!hitTestX(a, b)) {
        return false;
    }
    if (!hitTestY(a, b)) {
        return false;
    }
    return true;
}

function hitTestX(a, b) {
    var p1 = a.visibleBounds[0];
    var p2 = b.visibleBounds[0];
    if ((p2 <= p1 && p1 <= p2 + b.width) || (p1 <= p2 && p2 <= p1 + a.width)) {
        return true;
    }
    return false;
}

function hitTestY(a, b) {
    var p3 = a.visibleBounds[1];
    var p4 = b.visibleBounds[1];
    if ((p3 >= p4 && p4 >= (p3 - a.height)) || (p4 >= p3 && p3 >= (p4 - b.height))) {
        return true;
    }
    return false;
}