class Item {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setName() {
        this.name = name;
    }
}

module.exports = new Item('item1');