const fs = require('fs');
const path = require('path');

module.exports = {

  base_dir: path.join(__dirname, './.store/'),

  create (data_path, data) {
    return new Promise((resolve, reject) => {
      return fs.open(this.base_dir + data_path.join('/') + '.json', 'wx', (err, file_desc) => {
        if (!err && file_desc) {
          return fs.writeFile(file_desc, JSON.stringify(data, null, 2), err => {
            if (!err) {
              return fs.close(file_desc, err => {
                if (!err) {
                  resolve('Created: ' + data_path.join('/') + '.json');
                }
                reject('Error closing new file');
              });
            }
            reject('Error writing to new file');
          });
        }
        reject({
          title: 'Already created',
          actions: err.syscall,
          path: err.path,
        });
      });
    });
  },

  read (data_path) {
    return new Promise((resolve, reject) => {
      return fs.readFile(this.base_dir + data_path.join('/') + '.json', 'utf8', (err, out) => {
        if (err) {
          return reject({
            title: 'Not exists',
            actions: err.syscall,
            path: err.path,
          });
        }
        resolve(JSON.parse(out));
      });
    });
  },

  delete (data_path) {
    return new Promise((resolve, reject) => {
      fs.unlink(this.base_dir + data_path.join('/') + '.json', (err) => {
        if (err) {
          return reject({
            title: 'Not exists',
            actions: err.syscall,
            path: err.path,
          });
        }
        resolve('Deleted: ' + data_path);
      });
    });
  },

  update (data_path, data) {
    return new Promise((resolve, reject) => {
      fs.open(this.base_dir + data_path.join('/') + '.json', 'r+', (err, file_desc) => {
        if (!err && file_desc) {
          return fs.ftruncate(file_desc, err => {
            if (!err) {
              return fs.writeFile(file_desc, JSON.stringify(data, null, 2), err => {
                if (!err) {
                  return fs.close(file_desc, err => {
                    if (!err) {
                      resolve('Updated: ' + data_path.join('/') + '.json');
                    } 
                    reject('Error closing new file');
                  });
                }
                reject('Error writing to new file');
              });
            }
            reject('Error truncating file');
          });
        }
        reject({
          title: 'Could not open file for updatting, it may not exist yet',
          actions: err.syscall,
          path: err.path,
        });
      });
    });
  }

};
