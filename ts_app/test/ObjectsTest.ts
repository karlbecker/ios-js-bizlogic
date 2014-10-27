
describe('Objects', () => {
    var objects: controllers.Objects;
    
    beforeEach(() =>{
        var bridge:base.Bridge = window['bridge'];
        window.localStorage.clear();
    });

    function addShelf(caseIndex:number, shelfTitle:string, ...items:{title:string;imageUrl:string;journalId:string}[]) {
        var bookcase = myBookshelf.caseAtIndex(caseIndex);
        var shelf = bookcase.shelves[0];
        shelf.title = shelfTitle;
        items.forEach((itemDesc, i) => {
            var item = new models.ShelfItem();
            item.title = itemDesc.title;
            item.journalId = itemDesc.journalId;
            item.imageUrl = itemDesc.imageUrl;
            shelf.items[i] = item;
        });
        myBookshelf.saveCase(bookcase, caseIndex);
    }

    it('should always add a new objectan empty bookcase', () => {
        var emptyCase = myBookshelf.caseAtIndex(1);
        console.log(JSON.stringify(emptyCase));
        assert.deepEqual(emptyCase, {id:"1", shelves:[{items:[null,null,null,null]},
                                                      {items:[null,null,null,null]},
                                                      {items:[null,null,null,null]},
                                                      {items:[null,null,null,null]}
                                                     ]});
    });

    it('should save a shelf', () => {
        addShelf(0, "Shelf 1",
            {title: 'Item 1', journalId: 'BZAJ00004', imageUrl:'http://example.com/item1.jpg'}
        );

        var savedCase = myBookshelf.caseAtIndex(0);
        assert.deepEqual(savedCase.shelves[0], {
            title: "Shelf 1",
            items:[
                {title:"Item 1", imageUrl:"http://example.com/item1.jpg",journalId:"BZAJ00004", unreadCount:0},
                null,
                null,
                null
            ]
        });
    });
    
    it('should show whether a journal is contained on any shelf', () => {
        addShelf(0, "Shelf 1",
            {title: 'Item 1', journalId: 'BZAJ00004', imageUrl:'http://example.com/item1.jpg'}
        );

        assert(myBookshelf.containsJournalId("BZAJ00004"));
        assert(!myBookshelf.containsJournalId("BZAJ00005"));
    });
    
    it('should unread count of all journals on all shelves', () => {
        addShelf(0, "Shelf 1",
            {title: 'Item 1', journalId: 'BZAJ00004', imageUrl:'http://example.com/item1.jpg'},
            {title: 'Item 2', journalId: 'BZAJ00005', imageUrl:'http://example.com/item2.jpg'},
            {title: 'Item 3', journalId: 'BZAJ00006', imageUrl:'http://example.com/item3.jpg'}
        );

        var a1 = new models.Article();
        a1.id = "BZAA00001";
        a1.issueId = "BZAI00001";
        a1.journalId = "BZAJ00004";
        libraryData.save(models.Article, a1);
        
        var a2 = new models.Article();
        a2.id = "BZAA00002";
        a2.issueId = "BZAI00002";
        a2.journalId = "BZAJ00005";
        libraryData.save(models.Article, a2);

        var shelf = myBookshelf.caseAtIndex(0).shelves[0];
        
        assert.equal(1, shelf.items[0].unreadCount);
        assert.equal(1, shelf.items[1].unreadCount);
        assert.equal(0, shelf.items[2].unreadCount);
        
        assert.equal(2, myBookshelf.totalUnreadCount())
    });

    it('should count the total number of journals on all shelves', () => {
        addShelf(0, "Shelf 1",
            {title: 'Item 1', journalId: 'BZAJ00004', imageUrl:'http://example.com/item1.jpg'},
            {title: 'Item 2', journalId: 'BZAJ00005', imageUrl:'http://example.com/item2.jpg'},
            {title: 'Item 3', journalId: 'BZAJ00006', imageUrl:'http://example.com/item3.jpg'}
        );
        addShelf(1, "Shelf 2",
            {title: 'Item 4', journalId: 'BZAJ00010', imageUrl:'http://example.com/item4.jpg'}
        );

        assert.equal(4, myBookshelf.journalCountForAllBookcases())

        addShelf(3, "Shelf 3",
            {title: 'Item 5', journalId: 'BZAJ00011', imageUrl:'http://example.com/item5.jpg'}
        );

        assert.equal(5, myBookshelf.journalCountForAllBookcases())

        addShelf(2, "Shelf 3",
            {title: 'Item 6', journalId: 'BZAJ00012', imageUrl:'http://example.com/item6.jpg'}
        );
        assert.equal(6, myBookshelf.journalCountForAllBookcases())
    });
});