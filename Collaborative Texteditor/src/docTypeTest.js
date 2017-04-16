assert = require('chai').assert;
require('ponyfill-array');

docs = require('./docType.js');
describe("Documents module", function () {
    describe("Document tests", function() {
	it("create new document", function() {
	    var testDoc = new docs.Document("testDoc");
	    assert.isOk(testDoc);
	    assert.equal(testDoc.name, "testDoc");	    
	});

	it("compare name is true", function() {
	    var testDoc = new docs.Document("testDoc");
	    var testDoc2 = new docs.Document("testDoc");
	    assert(testDoc.compareName(testDoc2));
	});	

	it("compare name is not true", function() {
	    var testDoc = new docs.Document("testDoc");
	    var testDoc2 = new docs.Document("testDoc2");
	    assert(!testDoc.compareName(testDoc2));
	});	
	
    });

    describe("DocList tests", function() {
	it("Create DocList", function() {
	    var testList = new docs.DocList();	    
	    assert.isOk(testList);
	});
	
	it("insert into active", function() {
	    var testList = new docs.DocList();
	    var testDoc = new docs.Document("testdoc"); 
	    testList.active.push(testDoc);
	    assert(testList.active[0] == testDoc);
	});
	it("insert into passive", function() {
	    var testList = new docs.DocList();
	    var testDoc = new docs.Document("testdoc"); 
	    testList.passive.push(testDoc);
	    assert(testList.passive[0] == testDoc);
	});
	it("make passive doc active", function() {
	    var testList = new docs.DocList();
	    var testDoc = new docs.Document("testdoc"); 
	    testList.passive.push(testDoc);
	    testList.makeActive(0);
	    assert(testList.passive.length == 0);
	    assert(testList.active[0] == testDoc);
	});

	it("get next siteId", function() {
	    var testDoc = new docs.Document("testDoc");
	    for(i = 0; i < 10; ++i) {
		assert(testDoc.nextSiteID() == i);
	    }
	});

	it("is active", function() {
	    var testDoc = new docs.Document("testDoc");
	    var testDoc2 = new docs.Document("testDoc2");
	    var testDocList = new docs.DocList();

	    testDocList.active.push(testDoc);
	    assert.equal(0, testDocList.isActive("testDoc"));
	    testDocList.active.push(testDoc2);
	    assert.equal(1, testDocList.isActive("testDoc2"));
	});
	it("is not active", function() {
	    var testDocList = new docs.DocList();
	    assert.equal(-1, testDocList.isActive("testDoc"));
	});

	it("is passive", function() {
	    var testDoc = new docs.Document("testDoc");
	    var testDoc2 = new docs.Document("testDoc2");
	    var testDocList = new docs.DocList();

	    testDocList.passive.push(testDoc);
	    assert.equal(0, testDocList.isPassive("testDoc"));
	    testDocList.passive.push(testDoc2);
	    assert.equal(1, testDocList.isPassive("testDoc2"));
	});

	it("is not passive", function() {
	    var testDocList = new docs.DocList();
	    assert.equal(-1, testDocList.isPassive("testDoc"));
	});
    });
    
});
