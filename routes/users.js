const store = require('../store_engine');

module.exports = ({ query, method, body: { data_path, data } }, res) => {

  switch (method) {

    case 'POST':
      valid_empty_fields(data)
      return store.create(data_path, data).then(out => {
        res.status(200).send(out);
      }, err => {
        res.status(404).send(err);
      });

    case 'GET':
      return store.read(query.data_path).then(out => {
        res.status(200).send(out);
      }, err => {
        res.status(404).send(err);
      });

    case 'DELETE':
      return store.delete(data_path).then(out => {
        res.status(200).send(out);
      }, err => {
        res.status(404).send(err);
      });

    case 'PUT':
      return store.update(data_path, data).then(out => {
        res.status(200).send(out);
      }, err => {
        res.status(404).send(err);
      });

  }
};

function valid_empty_fields (obj) {

}