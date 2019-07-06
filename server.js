const http = require('http');
const fs = require('fs');

const users = {};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      // 홈페이지
      return fs.readFile('./index.html', (err, data) => {
        if (err) throw err;
        res.end(data);
      });
    } else if (req.url === '/about') {
      // about 페이지
      return fs.readFile('./about.html', (err, data) => {
        if (err) throw err;
        res.end(data);
      });
    } else if (req.url === '/users') {
      // 사용자 목록 요청
      return res.end(JSON.stringify(users));
    }
    return fs.readFile(`.${req.url}`, (err, data) => {
      // 기타 URL 요청 동적 대응
      if (err) {
        res.writeHead(404, 'NOT FOUND');
        return res.end('NOT FOUND');
      }
      return res.end(data);
    });

  } else if (req.method === 'POST') {
    if (req.url === '/users') {
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      return req.on('end', () => {
        console.log('POST 본문(Body):', body);
        const { name } = JSON.parse(body);
        const id = new Date().toISOString();
        users[id] = name;
        res.writeHead(201);
        res.end(`${name}(${id}) 등록 성공`);
      });
    }

  } else if (req.method === 'PUT') {
    if (req.url.startsWith('/users/')) {
      const key = req.url.split('/')[2];
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      return req.on('end', () => {
        console.log('PUT 본문(Body):', body);
        users[key] = JSON.parse(body).name;
        res.end(JSON.stringify(users));
      });
    }

  } else if (req.method === 'DELETE') {
    if (req.url.startsWith('/users/')) {
      const key = req.url.split('/')[2];
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      return req.on('end', () => {
        console.log('DELETE 본문(Body):', body);
        delete users[key];
        res.end(JSON.stringify(users));
      });
    }
  }
  res.writeHead(404, 'NOT FOUND');
  res.end('NOT FOUND');
});

server.listen(8888, () => {
  console.log('RESTServer is waiting on 8888.');
});