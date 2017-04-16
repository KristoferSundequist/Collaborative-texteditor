var socket = io();
joinDocument();
/**
  * On-site counter to use for new disambiguators.
  * TODO: Make it a local variable to function newDisambiguator by using closures.
  * @var
 */
var counter = 0;
/**
  * Site identifier to use for new disambiguators 
  * @var
 */
var siteID = 0;
/**
  * Document represented by a treedoc structure
  * @var
 */
var tree = new treedoc.Treedoc();
/**
  * Jquery ID selector for the element that displays the document
  * @var
 */
var displayElement = '#textarea';

/**
  * Routes a keypress to the appropriate handler.
  * @function
  */
function keyPressRouter(e){
    console.log("Key pressed:" + e.keyCode);    

    var validChar = function(e) {
	return (e.charCode && !e.ctrlKey || e.keyCode == 13);
    } 

    //Printable char case
    if(validChar(e)) {
	var charToInsert = String.fromCharCode(e.which);
	insertChar(charToInsert);	
    }
    /*
    //Backspace case
    else if (e.keyCode == 8) {
	removeChar();
    }
    */
}

function keyDownRouter(e){
    if(e.keyCode == 8){
	removeChar();
    }
}

/**
  * Insert a character into the tree and send instructions to server.
  * @function
  */
function insertChar(charToInsert){        
    selection = $(displayElement)[0].selectionStart;
    var disambig = newDisambiguator(counter, siteID);
    var posID_A = treedoc.indexToPosID(tree, selection - 1)
    var posID_B = treedoc.indexToPosID(tree, selection)
    var posID_new = treedoc.newPosID(tree, posID_A, posID_B, disambig);

    treedoc.insert(tree, posID_new, charToInsert);
    socket.emit('add', {posID : posID_new, atom : charToInsert});
}

/**
  * remove a character from the tree and send instructions to server.
  * @function
  */
function removeChar(){
    selection = $(displayElement)[0].selectionStart;
    index = selection - 1;
    
    if (index == -1) {
	//If index -1, do nothing!
	return;
    }
    var posID = treedoc.indexToPosID(tree, index);
    treedoc.remove(tree, posID);
    socket.emit('remove', posID);
}

/** 
  * Renders the document into a display element
  * @function
  */
function renderDocument(){
    $(displayElement).val(treedoc.treeToString(tree));
}

/** 
  * Creates a new disambiguator and increases on-site counter
  * @function
  */
function newDisambiguator() {
    var disambig = new treedoc.Disambiguator(counter, siteID);
    ++counter;
    return disambig;
}

/** 
  * Checks if given keycode is an arrow key code
  * @function
  * @param keyCode
  */
function isArrowKey(keyCode) {
        if (keyCode >= 37 && keyCode <= 40) {
	return true;
	}
    return false;
}

// This function was borrowed from user @ stackoverflow
// http://stackoverflow.com/a/841121
$.fn.selectRange = function(start, end) {
    if(end === undefined) {
        end = start;
    }
    return this.each(function() {
        if('selectionStart' in this) {
            this.selectionStart = start;
            this.selectionEnd = end;
        } else if(this.setSelectionRange) {
            this.setSelectionRange(start, end);
        } else if(this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};


//Join document
function joinDocument() {
    var docName = window.location.href.split('/').slice(3);
    socket.emit('joinDoc', {name : docName});
}

//Socket handlers
socket.on('init', function(init) {
    tree = init.tree;
    siteID = init.siteID;
    renderDocument();
});

socket.on('add', function(addObj) {
    selection = $(displayElement)[0].selectionStart;
    treedoc.insert(tree, addObj.posID, addObj.atom);
    insertIndex = treedoc.posIDToIndex(tree, addObj.posID);
    newCursorIndex = insertIndex < selection ? selection+1 : selection;
    renderDocument();
    $(displayElement).selectRange(newCursorIndex);
});


socket.on('remove', function(posID) {
    selection = $(displayElement)[0].selectionStart;
    removeIndex = treedoc.posIDToIndex(tree, posID);
    newCursorIndex = removeIndex < selection ? selection-1 : selection;  
    treedoc.remove(tree, posID);
    renderDocument();
    $(displayElement).selectRange(newCursorIndex);
});
