// testTree.js

// Chai assert API: http://chaijs.com/api/assert/
// Call these functions as you would any function i.e:
//   assert.equal(3, 3, '3 is equal to 3, who knew');
assert = require('chai').assert;
td = require('./treedoc.js');
//Remove '.skip' after 'it' in function call to enable a test

describe("Tree module", function () {
    
    
    /* tree class test suite */
    describe("Tree class", function(){
	it("create new tree", function () {
	    tree = new td.Treedoc();
	});

	describe('indexToPosID()', function () {
	    
	    /*
	     * Translates an index to a posID in the tree 
	     * @param {int} index i Index of desitred PosID(inorder)
	     * @returns {[Direction]} The posID of index (finns ingen posID klass)
	     *
	     * EXAMPLE: 
	     * Tree:
	     *      (miniB, miniD)
	     *    /      \        \
	     * (miniA)   (miniC)   (miniE, miniF)
	     *                         \          \
	     *                          (miniX)    (miniG)
	     *
	     *
	     * indexToPosId(-1) -> null
	     * indexToPosId(7) -> null
	     */

	    it("smoke-test", function (){
		//Antar bara att insert funkar här
		var tree = new td.Treedoc();
		
		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, new td.Disambiguator(0,1)));
		
		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(0,new td.Disambiguator(1,0)))
		
		var p4 = new Array();
		p4.push(new td.Direction(null, new td.Disambiguator(0,0)));
		p4.push(new td.Direction(1,new td.Disambiguator(2,0)));
		
		var p5 = new Array();
		p5.push(new td.Direction(null, null));
		p5.push(new td.Direction(1,new td.Disambiguator(3,0)))
		
		var p6 = new Array();
		p6.push(new td.Direction(null, null));
		p6.push(new td.Direction(1,new td.Disambiguator(1,1)))
		
		var p7 = new Array();
		p7.push(new td.Direction(null, null));
		p7.push(new td.Direction(1,null));
		p7.push(new td.Direction(1,new td.Disambiguator(4,0)));
		
		var p8 = new Array();
		p8.push(new td.Direction(null, null));
		p8.push(new td.Direction(1,new td.Disambiguator(1,1)));
		p8.push(new td.Direction(1,new td.Disambiguator(9,0)));	
		

		td.insert(tree, p1, 'B');
		td.insert(tree,p2,'D');
		td.insert(tree,p3,'A');
		td.insert(tree,p4,'C');
		td.insert(tree,p5, 'F');
		td.insert(tree,p6, 'E');
		td.insert(tree,p7, 'G');
		td.insert(tree,p8, 'X');
		
		assert(td.pathEquals(td.indexToPosID(tree,0), p3));
		assert(td.pathEquals(td.indexToPosID(tree,1), p1));		
		assert(td.pathEquals(td.indexToPosID(tree,2), p4));
		assert(td.pathEquals(td.indexToPosID(tree,3), p2));
		assert(td.pathEquals(td.indexToPosID(tree,4), p6));
		assert(td.pathEquals(td.indexToPosID(tree,5), p8));
		assert(td.pathEquals(td.indexToPosID(tree,6), p5));
		assert(td.pathEquals(td.indexToPosID(tree,7), p7));
		
		assert.equal(td.indexToPosID(tree, -1), null);
		assert.equal(td.indexToPosID(tree,8), null);
		
	    });
	    
	    it("index < 0", function () {
		var tree = new td.Treedoc();
		
		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		td.insert(tree,p1, 'A');
		
		assert.equal(td.indexToPosID(tree,-1), null);
		
	    });

	    it.skip("index > tree length", function () {
		//should return null
		/*TODO*/
	    });

	    it.skip("index 0, empty tree", function () {
		/*TODO*/
	    });

	    it.skip("deep index, empty tree", function () {
		/*TODO*/
	    });

	    it.skip("index 0, non-empty tree", function () {
		/*TODO*/
	    });

	    it.skip("deep index, non-empty tree", function () {
		/*TODO*/
	    });
	});

	describe('posIDToIndex()', function () {
	    it("basic-test", function(){
		var tree = new td.Treedoc();

		//PATHS
		var p1 = new Array();
		p1.push(new td.Direction(null,new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null,null));
		p2.push(new td.Direction(0,new td.Disambiguator(1,0)));
		
		//INSERT
		td.insert(tree,p1, "a");
		td.insert(tree,p2,"b");		

		assert.equal(td.posIDToIndex(tree,p1), 1);
		assert.equal(td.posIDToIndex(tree,p2), 0);
		assert.equal(td.posIDToIndex(tree,[]), null);
	    });
	    
	    it("empty tree", function(){
		var tree = new td.Treedoc();
		
		var nonsense = new Array();
		nonsense.push(new td.Direction(null,null));
		nonsense.push(new td.Direction(0,new td.Disambiguator(1,0)));

		assert.equal(td.posIDToIndex(tree,nonsense), null);
	    });

	    it("same moajornode, diff minors", function(){
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(0,new td.Disambiguator(0,1)))
		
		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(0,new td.Disambiguator(1,0)))

		td.insert(tree,p1, "C");
		td.insert(tree,p2, "A");
		td.insert(tree,p3, "B");

		assert.equal(td.posIDToIndex(tree,p1), 2);
		assert.equal(td.posIDToIndex(tree,p2), 0);
		assert.equal(td.posIDToIndex(tree,p3), 1);
	    });

	    it("non-existing posIDs", function(){
		var tree = new td.Treedoc();
		
		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, new td.Disambiguator(0,1)));
		
		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(0,new td.Disambiguator(1,0)))
		
		var p4 = new Array();
		p4.push(new td.Direction(null, new td.Disambiguator(0,0)));
		p4.push(new td.Direction(1,new td.Disambiguator(2,0)));
		
		var p5 = new Array();
		p5.push(new td.Direction(null, null));
		p5.push(new td.Direction(1,new td.Disambiguator(3,0)))
		
		var p6 = new Array();
		p6.push(new td.Direction(null, null));
		p6.push(new td.Direction(1,new td.Disambiguator(1,1)))
		
		var p7 = new Array();
		p7.push(new td.Direction(null, null));
		p7.push(new td.Direction(1,null));
		p7.push(new td.Direction(1,new td.Disambiguator(4,0)));
		
		var p8 = new Array();
		p8.push(new td.Direction(null, null));
		p8.push(new td.Direction(1,new td.Disambiguator(1,1)));
		p8.push(new td.Direction(1,new td.Disambiguator(9,0)));	
		
		
		td.insert(tree,p1, 'B');
		td.insert(tree,p2,'D');
		//td.insert(tree,p3,'A');
		td.insert(tree,p4,'C');
		//td.insert(tree,p5, 'F');
		td.insert(tree,p6, 'E');
		td.insert(tree,p7, 'G');
		//td.insert(tree,p8, 'X');		

		assert.equal(td.posIDToIndex(tree,p3), null);	
		assert.equal(td.posIDToIndex(tree,p1), 0);
		assert.equal(td.posIDToIndex(tree,p4), 1);
		assert.equal(td.posIDToIndex(tree,p2), 2);
		assert.equal(td.posIDToIndex(tree,p6), 3);
		assert.equal(td.posIDToIndex(tree,p8), null);
		assert.equal(td.posIDToIndex(tree,p5), null);
		assert.equal(td.posIDToIndex(tree,p7), 4);

	    });

	    it("continue through empty major", function(){
		var tree = new td.Treedoc();

		var p2 = new Array();
		p2.push(new td.Direction(null, new td.Disambiguator(0,1)));
		
		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(1,null));

		var p4 = new Array();
		p4.push(new td.Direction(null, null));
		p4.push(new td.Direction(1,null));
		p4.push(new td.Direction(1,new td.Disambiguator(1,1)));
		
		td.insert(tree,p2, 'A');
		td.insert(tree,p4, 'B');

		assert.equal(td.posIDToIndex(tree,p2), 0);
		assert.equal(td.posIDToIndex(tree,p4), 1);
		
		assert.equal(td.posIDToIndex(tree,p3), null); //exists, but is majornode
		
	    });

	    it("smoke-test(same as indexToPosID)", function(){
	    	//Antar bara att insert funkar här
		var tree = new td.Treedoc();
		
		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, new td.Disambiguator(0,1)));
		
		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(0,new td.Disambiguator(1,0)))
		
		var p4 = new Array();
		p4.push(new td.Direction(null, new td.Disambiguator(0,0)));
		p4.push(new td.Direction(1,new td.Disambiguator(2,0)));
		
		var p5 = new Array();
		p5.push(new td.Direction(null, null));
		p5.push(new td.Direction(1,new td.Disambiguator(3,0)))
		
		var p6 = new Array();
		p6.push(new td.Direction(null, null));
		p6.push(new td.Direction(1,new td.Disambiguator(1,1)))
		
		var p7 = new Array();
		p7.push(new td.Direction(null, null));
		p7.push(new td.Direction(1,null));
		p7.push(new td.Direction(1,new td.Disambiguator(4,0)));
		
		var p8 = new Array();
		p8.push(new td.Direction(null, null));
		p8.push(new td.Direction(1,new td.Disambiguator(1,1)));
		p8.push(new td.Direction(1,new td.Disambiguator(9,0)));	
		
		
		td.insert(tree,p1, 'B');
		td.insert(tree,p2,'D');
		td.insert(tree,p3,'A');
		td.insert(tree,p4,'C');
		td.insert(tree,p5, 'F');
		td.insert(tree,p6, 'E');
		td.insert(tree,p7, 'G');
		td.insert(tree,p8, 'X');

		assert.equal(td.posIDToIndex(tree,p3), 0);	
		assert.equal(td.posIDToIndex(tree,p1), 1);
		assert.equal(td.posIDToIndex(tree,p4), 2);
		assert.equal(td.posIDToIndex(tree,p2), 3);
		assert.equal(td.posIDToIndex(tree,p6), 4);
		assert.equal(td.posIDToIndex(tree,p8), 5);
		assert.equal(td.posIDToIndex(tree,p5), 6);
		assert.equal(td.posIDToIndex(tree,p7), 7);
	    });
	});

	describe('newPosID()', function () {
	    it.skip("in empty tree", function () {
		/*TODO*/
	    });
            it.skip("between two minisiblings", function () {
		/*TODO*/
	    });
            it.skip("after last node in tree", function () {
		/*TODO*/
	    });
	    it.skip("before first node in tree", function () {
		/*TODO*/
	    });
	    it.skip("between major nodes in tree", function () {
		/*TODO*/
	    });
	});


	describe('insert()', function () {
	    it("smoke-test", function(){
		var tree = new td.Treedoc();
		
		//CREATE PATHS
		
		var p1 = new Array();
		p1.push(new td.Direction(null,new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null,null));
		p2.push(new td.Direction(0,new td.Disambiguator(1,0)));
		
		var p3 = new Array();
		p3.push(new td.Direction(null,null));
		p3.push(new td.Direction(0,new td.Disambiguator(0,1)));
		
		var p4 = new Array();
		p4.push(new td.Direction(null,null));
		p4.push(new td.Direction(0,null)); 
		p4.push(new td.Direction(1,new td.Disambiguator(2,0))); 
		
		var p5 = new Array();
		p5.push(new td.Direction(null,null));
		p5.push(new td.Direction(1,null));
		p5.push(new td.Direction(1,new td.Disambiguator(0,2)));
		
		var p6 = new Array();
		p6.push(new td.Direction(null,null));
		p6.push(new td.Direction(1,new td.Disambiguator(1,1)));
		
		var p7 = new Array();
		p7.push(new td.Direction(null,null));
		p7.push(new td.Direction(0,null));
		p7.push(new td.Direction(0,new td.Disambiguator(3,0)));
		
		var p8 = new Array();
		p8.push(new td.Direction(null,null));
		p8.push(new td.Direction(0,new td.Disambiguator(0,1)));
		p8.push(new td.Direction(1,new td.Disambiguator(0,6))); //1 instead of null in direction(newPosID will always return a 1 in this case)
		
		var p9 = new Array();
		p9.push(new td.Direction(null,null));
		p9.push(new td.Direction(1,new td.Disambiguator(0,9)));
		p9.push(new td.Direction(1,new td.Disambiguator(0,10)));
		
		
		//INSERT IN TREE (Should work regardless of order)
		td.insert(tree,p1, "a");
		td.insert(tree,p2,"b");
		td.insert(tree,p3, "c");
		td.insert(tree,p4, "d");	
		td.insert(tree,p5, "e");
		td.insert(tree,p6,"f");
		td.insert(tree,p7,"g");
		td.insert(tree,p8, "h");
		td.insert(tree,p9, "i");

		assert.equal(td.treeToString(tree), "gchbdaife");
		
	    });
	    
	    it("insert into empty tree", function () {
		var tree = new td.Treedoc();
		
		var path = new Array();
		path.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		td.insert(tree,path, 'a');
		
		assert.equal(td.treeToString(tree), 'a');
	    });

	    it("insert into tree between two nodes", function () {
		var tree = new td.Treedoc();
		
		var path1 = new Array();
		path1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var path2 = new Array();
		path2.push(new td.Direction(null, null));
		path2.push(new td.Direction(1,new td.Disambiguator(1,0)));
		
		var path3 = new Array();
		path3.push(new td.Direction(null, null));
		path3.push(new td.Direction(1,null));
		path3.push(new td.Direction(0,new td.Disambiguator(2,0)));
		
		td.insert(tree,path1, 'a');
		td.insert(tree,path2, 'c');
		td.insert(tree,path3, 'b');
		
		assert.equal(td.treeToString(tree), "abc");
	    });

	    it("insert into same major node", function () {
		var tree = new td.Treedoc();
		
		var path1 = new Array();
		path1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var path2 = new Array();
		path2.push(new td.Direction(null, new td.Disambiguator(0,1)));
		
		
		
		td.insert(tree,path1, 'a');
		td.insert(tree,path2, 'b');
		
		assert.equal(td.treeToString(tree), "ab");
	    });

	    it("insert into same path twice", function () {
		var tree = new td.Treedoc();
		
		var path1 = new Array();
		path1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		
		td.insert(tree,path1, 'a');
		td.insert(tree,path1, 'b');
		
		//Borde kanske inte funka såhär
		assert.equal(td.treeToString(tree), 'b');
	    });	
	    
	    it("insert where path doesnt exist yet", function (){
		var tree = new td.Treedoc();
		
		var path1 = new Array();
		path1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var path2 = new Array();
		path2.push(new td.Direction(null, null));
		path2.push(new td.Direction(1, null));	
		path2.push(new td.Direction(0, new td.Disambiguator(0,1)));
		path2.push(new td.Direction(1, null));
		path2.push(new td.Direction(0, new td.Disambiguator(0,2)));			
		
		
		td.insert(tree,path1, 'a');
		td.insert(tree,path2, 'b');
		
		assert.equal(td.treeToString(tree), "ab");
	    });
	});

	describe('remove()', function () {
	    it("remove last node from tree", function () {
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));

		td.insert(tree,p1, 'A');

		assert.equal(td.treeToString(tree), 'A');

		td.remove(tree,p1);
		
		assert.equal(td.treeToString(tree), "");
		
		
	    });

	    it("remove mininode from majornode with two mininodes", function () {
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(1, new td.Disambiguator(1,0)));	

		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(1, new td.Disambiguator(0,1)));

		td.insert(tree,p1, 'A');
		td.insert(tree,p3, 'B');
		td.insert(tree,p2, 'C');

		assert.equal(td.treeToString(tree), "ABC");
		
		td.remove(tree,p3);

		assert.equal(td.treeToString(tree), "AC");
	    }); 

	    it("remove node with ancestor and two children", function () {
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(1, new td.Disambiguator(1,0)));

		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(1, null));
		p3.push(new td.Direction(1, new td.Disambiguator(2,0)));

		var p4 = new Array();
		p4.push(new td.Direction(null, null));
		p4.push(new td.Direction(1, null));
		p4.push(new td.Direction(0, new td.Disambiguator(3,0)));
		
		
		td.insert(tree,p1,'A');
		td.insert(tree,p4,'B');
		td.insert(tree,p2,'C');
		td.insert(tree,p3,'D');

		assert.equal(td.treeToString(tree), "ABCD");
		
		td.remove(tree,p2);
		
		assert.equal(td.treeToString(tree), "ABD");
	    }); 

	    it("remove node with ancestor and one child", function () {
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(1, new td.Disambiguator(1,0)));

		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(1, null));
		p3.push(new td.Direction(1, new td.Disambiguator(2,0)));
		
		
		td.insert(tree,p1,'A');
		td.insert(tree,p2,'B');
		td.insert(tree,p3,'C');

		assert.equal(td.treeToString(tree), "ABC");

		td.remove(tree,p2);
		assert.equal(td.treeToString(tree), "AC");
	    }); 

	    it("remove node with ancestor", function () {
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(1, new td.Disambiguator(1,0)));
		
		td.insert(tree,p1,'A');
		td.insert(tree,p2,'B');

		assert.equal(td.treeToString(tree), "AB");

		td.remove(tree,p2);
		assert.equal(td.treeToString(tree), "A");
	    }); 

	    it("remove mininode with ancestor and one child", function () {
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(1, new td.Disambiguator(1,0)));

		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(1, new td.Disambiguator(0,1)));

		var p4 = new Array();
		p4.push(new td.Direction(null, null));
		p4.push(new td.Direction(1, new td.Disambiguator(0,1)));		
		p4.push(new td.Direction(1, new td.Disambiguator(2,0)));
		
		
		td.insert(tree,p1,'A');
		td.insert(tree,p3,'B');
		td.insert(tree,p4,'C');
		td.insert(tree,p2,'D');


		assert.equal(td.treeToString(tree), "ABCD");

		td.remove(tree,p3);
		assert.equal(td.treeToString(tree), "ACD");
	    }); 

	    it("idempotence", function(){
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(1, new td.Disambiguator(1,0)));

		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(1, null));
		p3.push(new td.Direction(1, new td.Disambiguator(2,0)));
		
		
		td.insert(tree,p1,'A');
		td.insert(tree,p2,'B');
		td.insert(tree,p3,'C');

		assert.equal(td.treeToString(tree), "ABC");

		//idempotence
		td.remove(tree,p2);
		td.remove(tree,p2);
		td.remove(tree,p2);

		assert.equal(td.treeToString(tree), "AC");		
	    });

	    it("happend-before order", function(){
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		td.remove(tree,p1);
		td.insert(tree,p1, 'A');

		assert.equal(td.treeToString(tree), "");
		
	    });


	    it("happend-before order 2", function(){
		var tree = new td.Treedoc();

		var p1 = new Array();
		p1.push(new td.Direction(null, new td.Disambiguator(0,0)));
		
		var p2 = new Array();
		p2.push(new td.Direction(null, null));
		p2.push(new td.Direction(0, new td.Disambiguator(1,0)));

		var p3 = new Array();
		p3.push(new td.Direction(null, null));
		p3.push(new td.Direction(0, new td.Disambiguator(0,1)));

		var p4 = new Array();
		p4.push(new td.Direction(null, null));
		p4.push(new td.Direction(0, new td.Disambiguator(0,1)));
		p4.push(new td.Direction(1, new td.Disambiguator(0,2)));
		
		td.insert(tree,p1, 'D');
		td.insert(tree,p2, 'C');
		td.remove(tree,p3); //
		td.insert(tree,p4, 'B');
		td.insert(tree,p3, 'A'); //shouldnt be added

		assert.equal(td.treeToString(tree), "BCD");
		
	    });
	});

	describe('getNodeAtPosId()', function () {
	    it.skip("non-existing node in tree", function() {
		/*TODO*/
	    });

	    it.skip("existing node in tree", function () {
		/*TODO*/
	    });
	});

	describe('toString()', function() {
	    it.skip("empty tree", function () {
		/*TODO*/
	    });

	    it.skip("non empty tree", function() {
		/*TODO*/
	    });
	});

    });
    
    /* posId class test suite */
    describe("PosId class", function() {
	
	describe("miniSiblings()", function() {
	    it.skip("is minisibling", function() {
		/*TODO*/
	    });
	    it.skip("is not minisibling", function() {
		/*TODO*/
	    });
	});
	
	describe("ancestor()", function() {
	    it.skip("is ancestor", function() {
		/*TODO*/
	    });
	    it.skip("is not ancestor", function() {
		/*TODO*/
	    });

	});

	describe("toString()", function() {
	    /*TODO*/
	});

    });

});

describe("direction class", function() {
    describe("equals", function(){
	it("same disambig different dirs", function(){
	    var d1 = new td.Direction(0 ,new td.Disambiguator(0,0));
	    var d2 = new td.Direction(1 ,new td.Disambiguator(0,0));	

	    assert(!td.directionEquals(d1, d2));
	});

	it("diff disambig same dirs", function(){
	    var d1 = new td.Direction(0 ,new td.Disambiguator(0,1));
	    var d2 = new td.Direction(0 ,new td.Disambiguator(0,0));	

	    assert(!td.directionEquals(d1, d2));
	});

	it("same", function(){
	    var d1 = new td.Direction(0 ,new td.Disambiguator(0,0));
	    var d2 = new td.Direction(0 ,new td.Disambiguator(0,0));	

	    var d3 = new td.Direction(1 ,new td.Disambiguator(0,1));
	    var d4 = new td.Direction(1 ,new td.Disambiguator(0,1));	

	    td.directionEquals(d1, d2)
	    td.directionEquals(d3, d4)
	});
    });

    describe("toString()", function() {
	/*TODO*/
    });

    
});

describe("majorNode class", function() {

    describe("insertMinor()", function(){
	it("basic insert", function(){
	    var m = new td.MajorNode();
	    var d = new td.Disambiguator(0,0);
	    var minor = new td.MinorNode(d, 'a');
	    
	    td.majornodeInsertMinor(m,minor);

	    assert.equal(m.minorNodes[0].data, 'a');	    
	});

	it("concurrent insert", function(){
	    var m = new td.MajorNode();

	    var d = new td.Disambiguator(5,0);
	    var minor = new td.MinorNode(d, 'a');
	    
	    var d2 = new td.Disambiguator(0,1);
	    var minor2 = new td.MinorNode(d2, 'b');

	    var d3 = new td.Disambiguator(5,2);
	    var minor3 = new td.MinorNode(d3, 'c');

	    td.majornodeInsertMinor(m,minor);
	    td.majornodeInsertMinor(m,minor2);
	    td.majornodeInsertMinor(m,minor3);

	    //check correct order
	    assert.equal(m.minorNodes[0].data, 'b');
	    assert.equal(m.minorNodes[1].data, 'a');	    
	    assert.equal(m.minorNodes[2].data, 'c');	    
	});	

	it("disambig already exists", function(){
	    var m = new td.MajorNode();

	    var d = new td.Disambiguator(5,0);
	    var minor = new td.MinorNode(d, 'a');
	    
	    var d2 = new td.Disambiguator(0,1);
	    var minor2 = new td.MinorNode(d2, 'b');

	    var d3 = new td.Disambiguator(5,0);
	    var minor3 = new td.MinorNode(d3, 'c');

	    td.majornodeInsertMinor(m,minor);
	    td.majornodeInsertMinor(m,minor2);
	    td.majornodeInsertMinor(m,minor3); //same disambig as 'a', so we replace value with 'c'

	    //check correct order
	    assert.equal(m.minorNodes[0].data, 'b');
	    assert.equal(m.minorNodes[1].data, 'c');	    
	    //assert.equal(m.minorNodes[2].data, 'c'); //doesnt get inserted
	});	
    }); 

    describe("getMinorNode()", function(){
	it("when not existing", function() {
	    var m = new td.MajorNode();
	    var d = new td.Disambiguator(1,1);
	    assert.equal(td.majornodeGetMinorNode(m,d), null);
	});

	it("when existing, no ambiguity", function() {
	    var m = new td.MajorNode();
	    var d = new td.Disambiguator(1,1);

	    var minor = new td.MinorNode(d, 'a');
	    td.majornodeInsertMinor(m,minor);


	    assert(td.disambigEquals(td.majornodeGetMinorNode(m,d).disambiguator, d));
	    assert.equal(td.majornodeGetMinorNode(m,d).data, 'a');
	    
	});

	it("when existing, ambiguity", function() {
	    var m = new td.MajorNode();


	    var d = new td.Disambiguator(1,1);
	    var minor = new td.MinorNode(d, 'a');

	    var d2 = new td.Disambiguator(0,0);
	    var minor2 = new td.MinorNode(d2, 'b');

	    var d3 = new td.Disambiguator(7,3);
	    var minor3 = new td.MinorNode(d3, 'c');

	    td.majornodeInsertMinor(m,minor);
	    td.majornodeInsertMinor(m,minor2);
	    td.majornodeInsertMinor(m,minor3);

	    assert(td.disambigEquals(td.majornodeGetMinorNode(m,d).disambiguator, d));
	    assert(td.disambigEquals(td.majornodeGetMinorNode(m,d2).disambiguator, d2));
	    assert(td.disambigEquals(td.majornodeGetMinorNode(m,d3).disambiguator, d3));

	    assert.equal(td.majornodeGetMinorNode(m,d).data, 'a');
	    assert.equal(td.majornodeGetMinorNode(m,d2).data, 'b');
	    assert.equal(td.majornodeGetMinorNode(m,d3).data, 'c');
	});
    });

    describe("toString()", function() {
	/*TODO*/
    });
});

describe("minorNode class", function() {
    describe("toString()", function() {
	/*TODO*/
    });
});

describe("disambiguator class", function() {
    it.skip("create new disambiguator", function () {
	/*TODO*/
    });
    describe("equals()", function() {
	it("not equals, diff counts same ID", function(){
	    var d1 = new td.Disambiguator(0,0);
	    var d2 = new td.Disambiguator(1,0);

	    assert(!td.disambigEquals(d1, d2));
	});

	it("not equals, same counts diff ID", function(){
	    var d1 = new td.Disambiguator(0,0);
	    var d2 = new td.Disambiguator(0,1);

	    assert(!td.disambigEquals(d1, d2));
	});

	it("not equals, diff counts diff ID", function(){
	    var d1 = new td.Disambiguator(0,0);
	    var d2 = new td.Disambiguator(1,1);

	    assert(!td.disambigEquals(d1, d2));
	});
	it("equals", function(){
	    var d1 = new td.Disambiguator(0,0);
	    var d2 = new td.Disambiguator(0,0);

	    assert(td.disambigEquals(d1, d2));
	});

    });
    describe("smallerThan()", function() {
	it("smaller count, bigger ID", function(){
	    var d1 = new td.Disambiguator(0,5);
	    var d2 = new td.Disambiguator(1,2);
	    
	    assert(td.disambigSmallerThan(d1, d2));
	});

	it("smaller count, smaller ID", function(){
	    var d1 = new td.Disambiguator(0,1);
	    var d2 = new td.Disambiguator(1,2);
	    
	    assert(td.disambigSmallerThan(d1, d2));
	});

	it("same count, smaller ID", function(){
	    var d1 = new td.Disambiguator(0,5);
	    var d2 = new td.Disambiguator(0,7);
	    
	    assert(!td.disambigSmallerThan(d1, d2));
	});

	it("bigger count, smaller ID", function(){
	    var d1 = new td.Disambiguator(2,1);
	    var d2 = new td.Disambiguator(1,2);
	    
	    assert(!td.disambigSmallerThan(d1, d2));
	});

	it("bigger count, bigger ID", function(){
	    var d1 = new td.Disambiguator(2,5);
	    var d2 = new td.Disambiguator(1,2);
	    
	    assert(!td.disambigSmallerThan(d1, d2));
	});

	it("same count, bigger ID", function(){
	    var d1 = new td.Disambiguator(0,8);
	    var d2 = new td.Disambiguator(0,7);
	    
	    assert(!td.disambigSmallerThan(d1, d2));
	});
    });
    describe("toString()", function() {
	/*TODO*/
    });
});
