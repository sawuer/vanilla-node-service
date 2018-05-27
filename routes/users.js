const store = require('../store_engine');
const hash = require('../utils/hash');
const gen_random_str = require('../utils/gen_random_str');
const empty_fields = require('../utils/empty_fields');

module.exports = ({ query, method, body }, res) => {

  switch (method) {

    case 'POST':
      if (empty_fields(body)) return res.status(402).send('Error: you need fill out all fields');
      if (typeof body.agreed !== 'boolean') return res.status(402).send('Error: agreed must be boolean');
      if (!body.agreed) return res.status(402).send('Error: agreed must be true');
      const salt = gen_random_str(100);
      return store.create(['users_salt', body.phone], salt).then(() => {
          body.password = hash(body.password, salt);
        }, err => {
          res.status(404).send('Error: user already created');
        }).then(() => {
          store.create(['users', body.phone], body).then(out => {
            res.send({ newuser: body });
          }, err => {
            res.status(404).send(err);
          });
        });


    case 'GET':
      if (query.userid == '' || query.userid == undefined) {
        return res.status(404).send('Error: query.userid not defined')
      }
      return store.read(['users', query.userid]).then(out => {
        res.send(out);
      }, err => {
        res.status(404).send(err);
      });


    case 'PUT':
      if (empty_fields(body)) return res.status(402).send('You need fill all fields');
      if (typeof body.agreed !== 'boolean') return res.status(402).send('Agreed field must be boolean');
      if (!body.agreed) return res.status(402).send('You must be agree');
      return store.read(['users_salt', body.phone])
        .then(salt => {
          body.password = hash(body.password, salt);
        }, err => {
          res.status(404).send(err);
        })
        .then(() => {
          store.update(['users', body.phone], body).then(out => {
            res.send(out);
          }, err => {
            res.status(404).send(err);
          });
        });

        
    case 'DELETE':
      return store.delete(['users', query.userid])
        .then(() => store.delete(['users_salt', query.userid]))
        .then(() => {
          store.delete(['tokens', query.userid]).then(() => {
            res.send('Success: user deleted with token')
          }, err => {
            res.send('Success: user deleted and token already not exists')
          });
        })
        .catch(err => res.send(err));
  }
};
