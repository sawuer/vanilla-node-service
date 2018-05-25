const store = require('../store_engine');
const hash = require('../utils/hash');
const gen_salt = require('../utils/gen_salt');
const empty_fields = require('../utils/empty_fields');

module.exports = ({ query, method, body: { data } }, res) => {

  switch (method) {

    case 'POST':
      if (empty_fields(data)) return res.status(402).send('You need fill all fields');
      if (typeof data.agreed !== 'boolean') return res.status(402).send('Agreed field must be boolean');
      if (!data.agreed) return res.status(402).send('You must be agree');
      const salt = gen_salt(100);

      return store.create(['users_salt', data.phone], { salt }).then(out => {
        data.password = hash(data.password, salt);
        return store.create(['users', data.phone], data).then(out => {
          res.send(out);
        }, err => {
          res.status(404).send(err);
        });
      }, err => {
        res.status(404).send(err);
      });


    case 'GET':
      return store.read(['users', query.userid]).then(out => {
        res.send(out);
      }, err => {
        res.status(404).send(err);
      });


    case 'PUT':
      if (empty_fields(data)) return res.status(402).send('You need fill all fields');
      if (typeof data.agreed !== 'boolean') return res.status(402).send('Agreed field must be boolean');
      if (!data.agreed) return res.status(402).send('You must be agree');

      return store.read(['users_salt', data.phone]).then(({ salt }) => {
        data.password = hash(data.password, salt);
        return store.update(['users', data.phone], data).then(out => {
          res.send(out);
        }, err => {
          res.status(404).send(err);
        });
      })


    case 'DELETE':
      return store.delete(['users', query.userid]).then(out => {
        return store.delete(['users_salt', query.userid]).then(out => {
          res.send(out);
        }, err => {
          res.status(404).send(err);
        });
      }, err => {
        res.status(404).send(err);
      });

  }
};
