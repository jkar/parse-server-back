const itemRouter = require('express').Router();


//get all items
itemRouter.get('/', async (req, res) => {
  try {
    const Items = Parse.Object.extend("Items");
    const query = new Parse.Query(Items);
    // query.equalTo("playerName", "Dan Stemkoski");
    const results = await query.find();
    return res.send(results);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

//get items based on user id (objectId)
itemRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const Items = Parse.Object.extend("Items");
        const query = new Parse.Query(Items);
        query.equalTo("userId", id);
        const results = await query.find();
        return res.send(results);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

//add a new item
itemRouter.post('/', async (req, res) => {
    try {
        const Item = Parse.Object.extend("Items");
        const item = new Item();
        console.log('u', Parse.User.current())
        const resultPost = await item.save({
            name: req.body.name,
            user: Parse.User.current()
        });

        return res.status(200).send(resultPost);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});


//edit an item based on its objectId
itemRouter.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const Items = Parse.Object.extend("Items");
        const query = new Parse.Query(Items);
        query.equalTo("objectId", id);
        const resultItem = await query.first();
        const updatedItem = await resultItem.save({
            name: req.body.name
        });
        return res.send(updatedItem);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

//delete an item based on its objetId
itemRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const Items = Parse.Object.extend("Items");
        const query = new Parse.Query(Items);
        query.equalTo("objectId", id);
        const resultItem = await query.first();
        const resultDeletion = await resultItem.destroy();
        return res.send(resultDeletion);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

module.exports = itemRouter;
