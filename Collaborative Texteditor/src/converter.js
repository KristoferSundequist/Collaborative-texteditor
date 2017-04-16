var fs = require('fs');
var treedoc = require('./treedoc.js');
var docs = require('./docType.js');


/**
 * writes the document to .txt file
 * @param tree {object} tree document to convert
 */
function treeToTxt(docname, tree) {

    var treeString = treedoc.treeToString(tree);
    fs.writeFile('saves/' + docname + '.txt', treeString, function (err) {
        if (err) return console.log(err);
    }); 

}


/**
 * converts and writes tree to .json file
 * @param tree {tree} tree document to convert
 */
function treeToJson(docname, tree) {
    
    var treeAsJson = JSON.stringify(tree);
    fs.writeFile('saves/' + docname + '.json', treeAsJson, function (err) {
        if (err) return console.log(err);
    });

}

/**
 * Restores all previously saved documents. 
 * Loads all previously saved json files from disk. Creates a new document object for each
 * file and pushes it to the active document list.
 *
 * @param {object} docList     - List of document objects
 * 
 * @side-effect creates a folder named saves at root if no such folder is found
 * and creates (and overwrites) a savefile.json in the saves folder.
 */
exports.loadDocuments = function(docList){
    var saves = './saves';
    if (!fs.existsSync(saves)){
        fs.mkdirSync(saves);
    }

    var jsonFiles = getFiles('./saves', 'json');
    
    var i; 
    for(i = 0; i < jsonFiles.length; i++) {
        
        var data = fs.readFileSync('./saves/' + jsonFiles[i] + '.json' ,"utf8", function (err,data) {
            if (err) {
                return console.log(err);
            }
        });

        var doc = new docs.Document(jsonFiles[i]);
        var tree = JSON.parse(data); 
        doc.tree = tree;
        docList.active.push(doc); //push doc to active list

        console.log("File found. Document " + jsonFiles[i] + " restored.");
    }

}



/**
 *  Saves all currently active documents to disk.
 *
 *  @param {docList}     - List of all document objecs.
 *
 *  @side-effect creates a folder named saves at root if no such folder is found
 *  and creates (and overwrites) a savefile.json in the saves folder.
 */
exports.saveDocuments = function(docList){
    
    var saves = './saves';
    if (!fs.existsSync(saves)){
        fs.mkdirSync(saves);
    }

    var i;
    for(i = 0; i < docList.active.length; i++) {
        var docName = docList.active[i].name; 
        var tree = docList.active[i].tree;
        treeToJson(docName, tree);
        treeToTxt(docName, tree);
    }

}


/**
 * Returns a list of all files in dir ending with extension extToFind.
 * Files found is added to the list without the file extension. 
 * 
 * @param {string} dir         - directory to search
 * @param {string} extToFind   - file extension to search for
 * 
 */
function getFiles(dir, extToFind){
    fileList = [];
    
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var file = files[i];
        var filename = files[i].substr(0, files[i].length - extToFind.length - 1);
        var ext = files[i].substr(files[i].lastIndexOf('.')+1);
        
        if (!fs.statSync(dir + '/' + file).isDirectory()){
            if (ext == extToFind) {
                fileList.push(filename);
            }
        }
    }
    return fileList;
}


