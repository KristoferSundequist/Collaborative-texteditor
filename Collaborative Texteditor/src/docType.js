/** @module docType */

//TODO:
//update documentation to use treedoc types and not plain object (need treedoc type from treedoc.js first)

treedoc = require('./treedoc.js');

/**
 * Represents a list of documents
 * 
 * @property {Array.<Document>} active - List of active documents 
 * @property {Array.<Document>} active - List of passive documents 
 *
 * @constructor DocList
 */
function DocList() {

    this.active = [];
    this.passive = [];

    /**
     * Move document at index in passive list to the active list 
     * @param index Index of document to make active
     * @method 
     */
    this.makeActive = function(index) {
	var docToSwap = this.active.splice(index,1)[0];
	this.active.push(docToSwap);
    }

    /**
     * Move document at index in active list to the passive list 
     * @param index Index of document to make passive
     * @method
     */
    this.makePassive = function(index) {
	var docToSwap = this.active.splice(index,1)[0];
	this.passive.push(docToSwap);
    }
  
    /**
     * Checks if a document in this.active has a name equal to arg name
     * @param name - Name of document to look for
     * @returns Index in active, f document with name exists in active. -1 if no document was found
     * @method
     */
    this.isActive = function(name) {
	return findByName(name, this.active);
    }
    /**
     * Checks if a document in this.passive has a name equal to arg name
     * @param name - Name of document to look for
     * @returns Index in passive, f document with name exists in passive. -1 if no document was found
     * @method
     */
    this.isPassive = function(name) {
	return findByName(name, this.passive);
    }

    //Help function for isActive and isPassive
    var findByName = function(name, array) {
	var isName = function(doc) {
	    return doc.name == name;
	}
	return array.findIndex(isName);
    }
}

/**
 * Represents a document
 * @param {string} name      - Name of the document
 * @param {object} [tree = new Treedoc()] tree - The document's treedoc
 * 
 * @property {string} name   - The name of the document
 * @property {object} tree   - The document's treedoc
 * @property {number} siteId - The document's site id count
 * 
 * @constructor Document
 */
Document = function(name, tree) {

    this.name = name;

    var siteId = 0;

    this.tree;
    if (tree === undefined) {
	this.tree = new treedoc.Treedoc();
    } else {
	this.tree = tree;
    }
    /**
     * Returns the next siteID of the document
     * @method
     */
    this.nextSiteID = function() {
	return siteId++;
    }
}





exports.Document = Document;
exports.DocList = DocList;
