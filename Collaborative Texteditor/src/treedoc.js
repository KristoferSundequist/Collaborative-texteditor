(

function(exports){ //Hack for allowing shared code between server and client


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////  DIRECTION ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * @constructor Direction
     * @param _dir {int} - left/right/null 
     * @param _disambiguator {Disambiguator} - null/disambiguator
     */ 
    exports.Direction = function(_dir, _disambiguator) {
	this.dir = _dir;
	this.disambiguator = _disambiguator;
    }

    /**
     * @function directionEquals
     * @memberof Direction
     * @param firstD {Disambiguator} - first
     * @param otherD {Disambiguator} - other
     * @returns {bool} - True if first == other, else false
     */
    exports.directionEquals = function(firstD, otherD){
	if(firstD.dir == otherD.dir){
	    if(firstD.disambiguator == null && otherD.disambiguator == null){
		return true;
	    }
	    if(firstD.disambiguator != null && otherD.disambiguator != null){
		if(exports.disambigEquals(firstD.disambiguator, otherD.disambiguator)){
		    return true;
		}
	    }
	}
	return false;
    }

    /**
     * @function directionToString
     * @memberof Direction
     * @param direction {Direction} - a direction
     * @returns {String} - A string representation of direction
     */
    exports.directionToString = function(direction) {
        if (direction.disambiguator != null) {
	    return "(" + direction.dir + ", " + direction.disambiguator.toString() + ")";
        } else {
	    return "(" + direction.dir + ", " + null + ")";
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////  MajorNode ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * @constructor MajorNode
     */ 
    exports.MajorNode = function() {
	this.minorNodes = new Array();

	//type: MajorNode
	this.leftChild = null;
	//type: MajorNode
	this.rightChild = null;
    }

    //returns minorNode with disambig d
    /**
     * @function majornodeGetMinorNode
     * @memberof MajorNode
     */
    exports.majornodeGetMinorNode = function(m,d) {

        //no ambiguity
        if (d == null && m.minorNodes.length == 1) {
	    return m.minorNodes[0];
        }

        //ambiguity
        for (var i = 0; i < m.minorNodes.length; i++) {
	    if (exports.disambigEquals(m.minorNodes[i].disambiguator, d)) {
                return m.minorNodes[i];
	    }

	}


	console.log("error: minorNode not found");
	return null;

    }


    /**
     * @function majornodeInsertMinor
     * @memberof MajorNode
     * @description Inserts a minor node into the correct position based on the disambiguator
     * @param m {Major} node to inset in
     * @param node {MinorNode} node to insert	
     * @returns void
     *
     */
    exports.majornodeInsertMinor = function(m, node) {
     if (m.minorNodes.length == 0) {
	 m.minorNodes.push(node);
	 return;
     }

     for (var i = 0; i < m.minorNodes.length; i++) {
	 if (exports.disambigSmallerThan(node.disambiguator, m.minorNodes[i].disambiguator)) {
	     m.minorNodes.splice(i, 0, node);
	     return;
	 }

	 //if node with same disambig exists -> just replace value
	 if (exports.disambigEquals(node.disambiguator, m.minorNodes[i].disambiguator)) {
	     m.minorNodes[i].data = node.data;
	     return;
	 }
	 //insert last if biggest disambig
	 m.minorNodes.push(node);
     }	
 }
    /** 
     * @function majornodeRemoveMinor
     * @memberof MajorNode
     * @description Removes the minornode with disambiguator d OR sets its value to null if it has children
     * @param d {majorNode} majornode to remove from
     * @param d {disambiguator} disambig of minorNode to remove/null
     * @returns {bool} true if succesful, false if minor not there
     *
     */
    exports.majornodeRemoveMinor = function(m,d) {
	for(var i = 0; i < m.minorNodes.length; i++){
	    if(exports.disambigEquals(m.minorNodes[i].disambiguator, d)){
		//if no children -> remove mininode
		if(m.minorNodes[i].leftChild == null && m.minorNodes[i].rightChild == null){
		    m.minorNodes.splice(i, 1);
		}
		
		//has chilren -> just set data to null
		else{
		    console.log("setting minorNodes data to null(it has children)");
		    m.minorNodes[i].data = null;			
		}
		return true;
	    }
	}
	return false;
    }

    /**
     * @function majornodeIsLeaf
     * @memberof MajorNode
     * @description Checks if this majorNode is a leaf(has no children)
     * @param m {majorNode} node to check if leaf
     * @returns {bool} true if has no children/minorNodes, else false
     */
    exports.majornodeIsLeaf = function(m){
	if(m.leftChild == null && m.rightChild == null && m.minorNodes.length == 0){
	    console.log("--------------IS LEAF ----------------- " + m.leftChild + m.rightChild + m.minorNodes.length); 
	    return true;
	}
	console.log("--------------IS NOT LEAF ----------------- " + m.leftChild + m.rightChild + m.minorNodes.length); 
	return false;
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////  DISAMBIGUATOR ////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////


    //Disambiguator class
    /**
     * @constructor Disambiguator
     */ 
    exports.Disambiguator = function(_counter, _siteID) {
	this.counter = _counter;
	this.siteID = _siteID;
    }


    /**
     * @function disambigEquals
     * @memberof Disambiguator
     */
    exports.disambigEquals = function(disambigA, disambigB) {

	if (disambigA.siteID == disambigB.siteID && disambigA.counter == disambigB.counter) {
	    return true;
	}
	return false;

    }

    /**
     * @function disambigSmallerThan
     * @memberof Disambiguator
     */
    exports.disambigSmallerThan = function(disambigA, disambigB) {

	if (disambigA.counter < disambigB.counter) {
	    return true;
	} else if (disambigA.counter == disambigB.counter && this.siteID < disambigB.siteID) {
	    return true;
	}
	return false;
    }

    /**
     * @function disambigToString
     * @memberof Disambiguator
     */
    exports.disambigToString = function(disambig) {
	return "(" + disambig.counter + ", " + disambig.siteID + ")";
    }


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////  MinorNode ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * @constructor MinorNode
     */
    exports.MinorNode = function(_disambiguator, _data) {
	this.disambiguator = _disambiguator;
	this.data = _data;

	//Majors nodes
	this.leftChild = null;
	this.rightChild = null;
    }

    /**
     * @function minorNodeIsDeadLeaf
     * @memberof MinorNode
     * @description tells if dead mininode
     * @param m {minornode} minor to check
     * @returns {bool} true if dead/else false
     */
    exports.minornodeIsDeadLeaf = function(m){
	if(m.leftChild == null && m.rightChild == null && m.data == null){
	    return true;
	}

	return false;
    }


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////  Treedoc //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * @constructor Treedoc
     */
    exports.Treedoc = function(){
	this.root = new exports.MajorNode();
	this.removeOps = new Array();
    }

    /**
     * @function treedocCheckRemoveOps
     * @memberof Treedoc
     * @description checks if a posId is in removeOps and deletes it if is
     * @param pid {posID} pid to check for
     * @return {bool} true if is in it, else false
     * @side-effect removes element with posID pid in removeOps
     */
    exports.treedocCheckRemoveOps = function(t,pid){
	for(var i = 0; i < t.removeOps.length; i++){
	    if(exports.pathEquals(t.removeOps[i], pid)){
		t.removeOps.slice(i, 1);
		return true;
	    }
	}

	return false;
    }

    /*
     * @function indexToPosID
     * @memberof Treedoc
     * @description Translates an index to a posID in the tree 
     * @param t {Treedoc} tree to check
     * @param {int} index i Index of desitred PosID(inorder)
     * @returns {[Direction]} The posID of index (finns ingen posID klass)
     *
     * @example 
     * Tree:
     *      (miniB, miniD)
     *    /      \        \
     * (miniA)   (miniC)   (miniE, miniF)
     *                                   \
     *                                    (miniG)
     *
     * direction = (dir, disambiguator);
     * PosID(ALLTSÅ PATH) = [direction];
     *
     * miniA:
     * indexToPosId(0) -> [(null,null), (0,A)]
     *
     * miniB:
     * indexToPosId(1) -> [(null, B)]
     *
     * miniC:
     * indexToPosId(2) -> [(null, B), (1, C)]
     *
     * miniD:
     * indexToPosId(3) -> [(null, D)]
     *
     * miniE:
     * indexToPosId(4) -> [(null, null), (1, E)]
     *
     * miniF:
     * indexToPosId(5) -> [(null, null), (1, F)]
     *
     * miniG:
     * indexToPosId(6) -> [(null, nul), (1,null), (1, G)]
     *
     * indexToPosId(-1) -> null
     * indexToPosId(7) -> null
     */
    exports.indexToPosID = function(t,index) {
	console.log("--indexToPosID--");
	console.log("indexToPosID: " + index);

	if (index < 0) {
	    console.log("Returning: null(index < 0)");
	    return null;
	}

	//counts to index
	var counter = 0;

	//[Direction]
	var stack = new Array(); //builds up posID
	stack.push(new exports.Direction(null, null)); //start with root

	var PosID = stack.slice(); //help var to return correct posID	

	//Handles a minornode
	function inorderMinor(minorNode) {
	    if (minorNode.leftChild != null) {
		stack.push(new exports.Direction(0, null));
		inorderMajor(minorNode.leftChild);
		stack.pop();
	    }

	    //we found it
	    if (counter == index) {
		//copy stack to posID(pass by reference bs)
		PosID = stack.slice();
		for(var i = 0; i < PosID.length; i++){
		    PosID[i] = clone(stack[i]);
		}
	    }

	    counter++;

	    if (minorNode.rightChild != null) {
		stack.push(new exports.Direction(1,null));
		inorderMajor(minorNode.rightChild);
		stack.pop();
	    }
	}

	//Handles a majornode
	function inorderMajor(majorNode) {
	    //if root ?
	    if (majorNode == null) {
		return;
	    }
	    if (majorNode.leftChild != null) {
		stack.push(new exports.Direction(0, null));
		inorderMajor(majorNode.leftChild);
		stack.pop();
	    }
	    for (var i = 0; i < majorNode.minorNodes.length; i++) {
		//add correct disambiguator to last direction in stack
		stack[stack.length - 1].disambiguator = majorNode.minorNodes[i].disambiguator;
		inorderMinor(majorNode.minorNodes[i]);
	    }
	    stack[stack.length - 1].disambiguator = null; //reset disambig(no minor node chosen)

	    if (majorNode.rightChild != null) {
		stack.push(new exports.Direction(1, null));
		inorderMajor(majorNode.rightChild);
		stack.pop();
	    }
	}

	inorderMajor(t.root);

	//index out of bounds
	if (index != 0 && counter < index + 1) {
	    console.log("Returning: null(index out of bounds)");
	    return null;
	}

	console.log("Returning: " + posIDtoString(PosID));
	return PosID;

    }

    /**
     * @function posIDToIndex
     * @memberof Treedoc
     * @description Translates a posID to an index
     * @param t {Treedoc} - tree to convert in
     * @param pid {PosID} posID of a minorNode to translate
     * @returns {int} index of pid OR null if pid doesnt exist in tree
     */
    exports.posIDToIndex = function(t,pid){
	var counter = 0;
	var result = null;

	//[Direction]
	var stack = new Array(); //keeps track of current posID
	stack.push(new exports.Direction(null, null)); //start with root

	//Handles a minornode
	function inorderMinor(minorNode) {
	    if (minorNode.leftChild != null) {
		stack.push(new exports.Direction(0, null));
		inorderMajor(minorNode.leftChild);
		stack.pop();
	    }

	    //we found it
	    if (exports.pathEquals(pid, stack)) {
		//copy stack to posID(pass by reference bs)
		result = counter;
	    }

	    counter++;
	    
	    if (minorNode.rightChild != null) {
		stack.push(new exports.Direction(1,null));
		inorderMajor(minorNode.rightChild);
		stack.pop();
	    }
	}
	
	//Handles a majornode
	function inorderMajor(majorNode) {
	    //if root ?
	    if (majorNode == null) {
		return;
	    }
	    if (majorNode.leftChild != null) {
		stack.push(new exports.Direction(0, null));
		inorderMajor(majorNode.leftChild);
		stack.pop();
	    }
	    for (var i = 0; i < majorNode.minorNodes.length; i++) {
		//add correct disambiguator to last direction in stack
		stack[stack.length - 1].disambiguator = majorNode.minorNodes[i].disambiguator;
		inorderMinor(majorNode.minorNodes[i]);
	    }
	    stack[stack.length - 1].disambiguator = null; //reset disambig(no minor node chosen)

	    if (majorNode.rightChild != null) {
		stack.push(new exports.Direction(1, null));
		inorderMajor(majorNode.rightChild);
		stack.pop();
	    }
	}

	inorderMajor(t.root);

	return result;

    }


    /**
     * @function newPosID
     * @memberof Treedoc
     * @description Generates a PosID between posIDp and posIDf
     * @param pida {PosID} pida first
     * @param pidb {PosID} pidb second
     * @param d {Disambiguator} The disambiguator of the new posID
     * @returns {PosID} PosID between posida and posidb with disambig d
     */
    exports.newPosID = function(t,PosIDp, PosIDf, d) {

	console.log("--newPosID--");
	console.log("P: " + posIDtoString(PosIDp));
	console.log("F: " + posIDtoString(PosIDf));

	//2.5: hemkok

	//root
	//kan förmodligen göras bättre
	if (PosIDp == null && PosIDf.length == 1 && t.root.minorNodes.length == 0) {
	    console.log("newPosID: rootcase");
	    var pid = new Array();
	    pid.push(new exports.Direction(null, d));
	    return pid;
	}
	//first
	else if (PosIDp == null) {
	    console.log("newPosID: firstcase");
	    PosIDf[PosIDf.length - 1].disambiguator = null;
	    PosIDf.push(new exports.Direction(0, d));
	    return PosIDf;
	}
	//last
	else if (PosIDf == null) {
	    console.log("newPosID: lastcase");
	    PosIDp[PosIDp.length - 1].disambiguator = null;
	    PosIDp.push(new exports.Direction(1, d));
	    return PosIDp;
	}

	//3: Require: PosIDp < PosIDf AND !∃ atom x such that PosIDp < PosIDx < PosIDf
	// VET EJ OM BEHYÖVS MEN SKRIV ÄNDÅ SEN
	//tbi

	//4: if PosIDp/+PosIDf then Let PosIDf = c1 . . . (pn : un); return c1 . . . pn (0 : d)
	if (ancestor(PosIDp, PosIDf)) {
	    console.log("newPosID: p/+f case");
	    PosIDf[PosIDf.length - 1].disambiguator = null;
	    PosIDf.push(new exports.Direction(0, d));
	    return PosIDf;
	}

	//5: else if PosIDf/+PosIDp then Let PosIDp = c1 . . . (pn : un); return c1 . . . pn (1 : d)
	else if (ancestor(PosIDf, PosIDp)) {
	    console.log("newPosID: f/+p case");
	    PosIDp[PosIDp.length - 1].disambiguator = null;
	    PosIDp.push(new exports.Direction(1, d));
	    return PosIDp;
	}

	//6: else if MiniSibling(PosIDp, PosIDf) ∨ ∃PosIDm > PosIDp : MiniSibling(PosIDp, PosIDm) ∧ PosIDm/
	//+PosIDf then return PosIDp (1 : d)
	//OBS: ADD STUFF TO IF
	else if (miniSiblings(PosIDp, PosIDf)) {
	    console.log("newPosID: minisiblins case");
	    PosIDp.push(new exports.Direction(1, d));
	    return PosIDp;
	}

	//7: else Let PosIDp = c1 . . . (pn : un); return c1 . . . pn (1 : d)
	else {
	    console.log("newPosID: other case");
	    PosIDp[PosIDp.length - 1].disambiguator = null;
	    PosIDp.push(new exports.Direction(1, d));
	    return PosIDp;
	}
    }

    /**
     * @function insert
     * @memberof Treedoc
     * @description Inserts a node into the tree at pid, with char data
     * @param {Treedoc} t
     * @param {PosID} pid PosID of inseration
     * @param {char} data Char to insert
     *
     * @example
     * create tree
     * var t = new tree(); 
     * t: ( )
     * 
     * Insert at root
     * t.insert([(null,dA)],'a');
     * t: ( ('a',dA) )
     * 
     * (NO INSERT IF SAME DISAMBIGUATOR IN SAME NODE)
     * t.insert([(null,dA)],'a');
     * t: ( ('a',dA) )
     *
     * Insert to left of root
     * t.insert([(null,null), (0,dA)], 'b');
     * t:         ( ('a',dA) )
     *           /
     * (('b', dA))
     * 
     * Insert in majornode that already exists(and has other majornodes)(CHECK DISAMBIGUATOR ORDER)
     * t.insert([(null,null), (0,dB)],'c')
     * t:                     ( ('a',dA) )
     *                       /
     * ( ('c', dB), ('b', dA))
     * 
     * Insert at to right of majornode that has lots of minornodes
     * t.insert([(null,null), (0,null), (1,dA)], 'd');
     *  t:                     ( ('a',dA) )
     *                       /
     * (('c', dB), ('b', dA))
     *                       \
     *                        (('d', dA))
     * 
     * Insert at place where you hafto create path on the road
     * t.insert([(null,null), (1,null), (1,dC)], 'e');
     *  t:                     ( ('a',dA) )
     *                       /              \
     * (('c', dB), ('b', dA))                (  )
     *                        \                  \
     *                          (('d', dA))       (('e', dC))
     * 
     * Insert in existsing empty majorNode
     * t.insert([(null,null), (1,dB)], 'f');
     *  t:                     ( ('a',dA) )
     *                       /              \
     * (('c', dB), ('b', dA))                ( (f, (dA) )
     *                        \                          \
     *                          (('d', dA))               (('e', dC))
     * 
     * Insert in minor node
     * t.insert([(null,null), (0,dB), (1,dA)], 'g');
     *  t:                     ( ('a',dA) )
     *                       /              \
     * (('c', dB), ('b', dA))                ( (f, (dA) )
     *      \                \                            \
     *       (('g',dA))       (('d', dA))                  (('e', dC))
     *
     * Creates MinorNode on the way if it doesnt exist
     * t.insert([(null,null),(1,dB),(1,dA)],'h');
     *  t:                     ( ('a',dA) )
     *                       /              \
     * (('c', dB), ('b', dA))                ((null,dB), ('f', dA))
     *      \                \                     \               \
     *       (('g',dA))       (('d', dA))           (('h',dA))     (('e', dC))
     *
     */
    exports.insert = function(t,PosID, Data) {
	if(exports.treedocCheckRemoveOps(t,PosID)){
	    return;
	}
	
	console.log("--insert--");
	console.log("Insert at posID: " + posIDtoString(PosID));

	var last = PosID[PosID.length - 1];
	var newMinor = new exports.MinorNode(last.disambiguator, Data);

	//add in root
	if (PosID.length == 1) {
	    //root.insertMinor(newMinor);
	    exports.majornodeInsertMinor(t.root, newMinor);
	    return;
	}

	//fetches node to insert into
	//	creates empty-nodes as path if they dont exist(concurrent deletes etc)
	//var parentToInsert = this.getNodeAtPosID(PosID.slice(0, PosID.length - 1));
	var parentToInsert = exports.treedocGetNodeAtPosID(t, PosID.slice(0, PosID.length - 1));

	//add left
	if (last.dir == 0) {
	    if (parentToInsert.leftChild == null) {
		var newMajor = new exports.MajorNode();
		//newMajor.insertMinor(newMinor);
		exports.majornodeInsertMinor(newMajor,newMinor);
		parentToInsert.leftChild = newMajor;
	    }

	    //concurrent add
	    else {
		//insert minor into existing major
		//parentToInsert.leftChild.insertMinor(newMinor);
		exports.majornodeInsertMinor(parentToInsert.leftChild, newMinor);
	    }
	}

	//add right
	//(Almost identical to 'add left' refactor)
	else {
	    var newMinor = new exports.MinorNode(last.disambiguator, Data);
	    if (parentToInsert.rightChild == null) {
		var newMajor = new exports.MajorNode();
		//newMajor.insertMinor(newMinor);
		exports.majornodeInsertMinor(newMajor,newMinor);
		parentToInsert.rightChild = newMajor;
	    }

	    //concurrent add
	    else {
		//insert minor into existing major(concurrent add)
		//parentToInsert.rightChild.insertMinor(newMinor);
		exports.majornodeInsertMinor(parentToInsert.rightChild, newMinor);
	    }

	}

    }

    /*
     * @function remove
     * @memberof Treedoc
     * @description Removes a node from a tree
     * @param t {Treedoc} tree to remove from
     * @param p {posID} posID of node to remove
     */
    exports.remove = function(t,p) {

	if(exports.treedocCheckRemoveOps(t,p)){
	    t.removeOps.push(p);
	    return;
	}

	var PosId = p.slice(); //reference bs

	var current_direction = PosId.shift();
	
	function goThroughMinor(node){
	    
	    current_direction = PosId.shift();
	    
	    //go left
	    if(current_direction.dir == 0){
		if(node.leftChild != null){
		    console.log("--going left--");
		    removeMajor(node.leftChild);
		    if(exports.majornodeIsLeaf(node.leftChild)){
			node.leftChild = null;
		    }
		}

		//not in tree
		else{
		    t.removeOps.push(p);
		    return;
		}
	    }

	    //right
	    else{

		if(node.rightChild != null){
		    console.log("--going right--");
		    removeMajor(node.rightChild);
		    if(exports.majornodeIsLeaf(node.rightChild)){
			node.rightChild = null;
		    }
		}

		//not in tree
		else{
		    t.removeOps.push(p);
		    return;
		}
	    }
	}

	function removeMajor(node){
	    console.log("At major-----------------"  + node);
	    //last posID(found it)
	    if(PosId.length == 0){
		console.log("--found it-- atdirection: " + current_direction);

		//remove OR add to remove-queue if doesnt exist
		//if(!node.removeMinor(current_direction.disambiguator)){
		if(!exports.majornodeRemoveMinor(node, current_direction.disambiguator)){
		    t.removeOps.push(p);
		}
	    }
	    
	    //keep traversing
	    else{
		//goto Major
		if(current_direction.disambiguator == null){
		    current_direction = PosId.shift();
		    
		    if(current_direction.dir == 0){
			if(node.leftChild != null){
			    console.log("--going left--");
			    removeMajor(node.leftChild);
			    if(exports.majornodeIsLeaf(node.leftChild)){			
				node.leftChild = null;
			    }
			}
			
			//node not in tree
			else{
			    t.removeOps.push(p);
			    return;
			}
			
		    }else{
			if(node.rightChild != null){
			    console.log("--going right--");
			    removeMajor(node.rightChild);
			    if(exports.majornodeIsLeaf(node.rightChild)){
				node.rightChild = null;
			    }
			}

			//node not in tre
			else{
			    t.removeOps.push(p);
			    return;
			}
		    }
		}

		//goto minor
		else{
		    var dis = current_direction.disambiguator;
		    //var minor = node.getMinorNode(dis);
		    var minor = exports.majornodeGetMinorNode(node,dis);

		    //not in tree
		    if(minor == null){
			t.removeOps.push(p);
			return;
		    }
		    
		    console.log("--going to Minor--");
		    goThroughMinor(minor);
		    //if(minor.isDeadLeaf()){			    
		    if(exports.minornodeIsDeadLeaf(minor)){
			//node.removeMinor(dis);
			exports.majornodeRemoveMinor(node,dis);
		    }
		    
		}
	    }
	}
	removeMajor(t.root);
    }

    /**
     * @function treedocGetNodeAtPosID
     * @memberof Treedoc 
     * @description Returns the node of a given PosID --- Also creates the path if it doesnt exist(for concurrent stuff)
     * @param PosID {[Direction]} PosID of node to return
     * @returns A node {minorNode/majorNode}
     *
     * 
     * @example
     * t = ( );
     * getNodeAtPosID([(null,null),(1,null),(0,dA),(1,dA)]);
     * SIDEEFFECT: CHANGES TREE TO THIS
     * t = ( )
     *       \
     *       ( )
     *      /
     * ((null,dA))
     *     \
     *      ((null,dA)) <- AND RETURNS THIS
     *
     */
    exports.treedocGetNodeAtPosID = function(t,PosID) {

	console.log("--getNodeAtPosID-");
	var current = t.root;
	for (var i = 0; i < PosID.length; i++) {

	    //if root
	    if (PosID[i].dir == null) {
		//root -> do nothing
	    }

	    //go left
	    else if (PosID[i].dir == 0) {
		//create node(concurrent deletes/network stuff)
		if (current.leftChild == null) {
		    current.leftChild = new exports.MajorNode();
		}
		current = current.leftChild;
	    }

	    //go right
	    else {

		//create node
		if (current.rightChild == null) {
		    current.rightChild = new exports.MajorNode();
		}

		current = current.rightChild;
	    }

	    //if disambig == null then return majorNode
	    //else return correct minorNode
	    if (PosID[i].disambiguator != null) {

		//CREATE MINOR NODE IF IT DOESNT EXIST
		//if (current.getMinorNode(PosID[i].disambiguator) == null) {
		if (exports.majornodeGetMinorNode(current,PosID[i].disambiguator) == null) {
		    //current.insertMinor(new exports.MinorNode(PosID[i].disambiguator, null));
		    exports.majornodeInsertMinor(current, new exports.MinorNode(PosID[i].disambiguator, null));
		}

		//current = current.getMinorNode(PosID[i].disambiguator);
		current = exports.majornodeGetMinorNode(current, PosID[i].disambiguator);
	    }
	}


	return current;

    }


    /**
     * @function treeToString
     * @memberof Treedoc
     * @returns {String} The tree as a string(inorder traversal)
     */
    exports.treeToString = function(t) {
	var str = "";

	if (t.root == null) {
	    return "null";
	}

	function inorderMinor(minorNode) {
	    if (minorNode.leftChild != null) {
		inorderMajor(minorNode.leftChild);
	    }

	    if (minorNode.data != null) {
		str += minorNode.data; //adds char to string
	    }

	    if (minorNode.rightChild != null) {
		inorderMajor(minorNode.rightChild);
	    }
	}

	function inorderMajor(majorNode) {
	    if (majorNode.leftChild != null) {
		inorderMajor(majorNode.leftChild);
	    }
	    for (var i = 0; i < majorNode.minorNodes.length; i++) {
		inorderMinor(majorNode.minorNodes[i]);
	    }
	    if (majorNode.rightChild != null) {
		inorderMajor(majorNode.rightChild);
	    }
	}

	inorderMajor(t.root);

	return str;

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////// HELP FUNCTIONS (should probably be somewhere else) /////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * @function miniSiblings
     * @description Checks if two posID are in minorNodes in the same MajorNode
     * @param PosIDp {[Direction]} first pid
     * @param PosIDf {[Direction]} second pid
     * @returns True/false {Boolean} True if siblings else false
     *
     */
    function miniSiblings(PosIDp, PosIDf) {

	console.log("--miniSiblings-");

	if (PosIDp.length != PosIDf.length) {
	    return false;
	}

	//check if go same direction&choose same mininodes everytime(except last(where they can choose different mininodes))
	for (var i = 0; i < PosIDp.length - 1; i++) {
	    if (PosIDp[i].dir != PosIDf[i].dir) {
		return false;
	    }


	    if ((PosIDp[i].disambiguator == null && PosIDf[i].disambiguator != null) ||
		(PosIDp[i].disambiguator != null && PosIDf[i].disambiguator == null)) {
		return false;
	    }



	    if (PosIDp[i].disambiguator != null && PosIDf[i].disambiguator != null) {
		if (!PosIDp[i].disambiguator.equals(PosIDf[i].disambiguator)) {
		    return false;
		}
	    }
	}

	//last
	//check same majornode
	if (PosIDp[i].dir != PosIDf[i].dir) {
	    return false;
	}

	return true;

    }

    /**
     * @function pathEquals
     * @description Checks if p1 equals p2
     * @param p1 {[Direction]}
     * @param p2 {[Direction]} 
     * @returns true if every Direction in p1 == every Direction in p2, else false
     */
    exports.pathEquals = function(p1,p2){
	if(p1.length != p2.length){
	    return false;
	}
	
	for(var i = 0; i < p1.length; i++){
	    if(!exports.directionEquals(p1[i], p2[i])){
		return false;
	    }
	}

	return true;
    }
    
    /**
     * @function ancestor
     * @description checks if p is ancestor to f
     * @param PosIDp {[Direction]} first pid
     * @param PosIDf {[Direction]} second pid
     * @returns True/False {bool} True if p is ancestor to f, else false
     */
    function ancestor(PosIDp, PosIDf) {

	if (PosIDp.length >= PosIDf.length) {
	    return false;
	}
	for (var i = 0; i < PosIDp; i++) {
	    if (PosIDp[i].dir != PosIDf[i].dir) {
		return false;
	    }
	    if (!PosIDp[i].disambiguator.equals(PosIDp[i].disambiguator)) {
		return false;
	    }
	}
	return true;
    }

    /** @function posIDtoString */
    function posIDtoString(p) {
	var str = "";
	if (p != null) {
	    for (var i = 0; i < p.length; i++) {
		str += p[i].toString();
	    }
	} else {
	    return "null";
	}
	return str;
    }

    //copies an object so we can pass by value instead of reference
    function clone(obj) {
	if (obj == null || typeof(obj) != 'object')
	    return obj;

	var temp = new obj.constructor();
	for (var key in obj)
	    temp[key] = clone(obj[key]);

	return temp;
    }
    exports.test = function(){
        return 'hello world'
    };
})(typeof exports === 'undefined'? this.treedoc = {}: exports);

