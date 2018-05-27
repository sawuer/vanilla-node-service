const store = require('../store_engine');
const hash = require('../utils/hash');
const gen_random_str = require('../utils/gen_random_str');
const empty_fields = require('../utils/empty_fields');

module.exports = ({ query, method, body }, res) => {

  switch (method) {
    // and put here
    
    case 'POST':

      return store.read(['users', body.userid]).then(({ password }) => {
        store.read(['users_salt', body.userid]).then(salt => {
          if (hash(body.password, salt) == password) {
            const token = gen_random_str(10);
            const interval = Date.now() + 1000 * 60 * 60;
            store.create(['tokens', body.userid], { token, interval }).then(() => {
              res.send(token);
            }, err => {
              console.log(err);
              store.delete(['tokens', body.userid]).then(() => {
                store.create(['tokens', body.userid], { token, interval }).then(() => {
                  console.log('replace new token')
                  res.send(token);
                });
              });
            });
          } else {
            res.status(404).send('Error: passwords are not equal');
          }
        }, err => {
          res.status(404).send(err);
        });
      }, err => {
        res.status(404).send(err);
      });


    case 'GET':

      return store.read(['tokens', query.userid]).then(({ token, interval }) => {
        if (token == query.token) {
          if (interval > Date.now()) {
            res.send('tokens are equal and valid');
          } else {
            res.status(404).send('Error: old token');
          }
        } else {
          res.status(404).send('Error: tokens are not equal');
        }
      }, err => {
        res.status(404).send(err);
      });


    case 'DELETE':

      return store.read(['tokens', query.userid]).then(({ token, interval }) => {
        if (token == query.token) {
          store.delete(['tokens', query.userid]).then(out => {
            res.send(out);
          }, err => {
            res.status(404).send(err);
          });
        } else {
          res.status(404).send('Error: tokens are not equal');
        }
      }, err => {
        res.status(404).send(err);
      });

  }
};
